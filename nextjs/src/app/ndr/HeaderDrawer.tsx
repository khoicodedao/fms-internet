import React, { useState, useEffect } from "react";
import { Button, message, Progress, Switch } from "antd";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import { useTranslation } from "react-i18next";
import { readRoleFromCookieNonSecure } from "@/common/client-role";

const HeaderDrawer = ({ selectedRow }: { selectedRow: any }) => {
  const { t } = useTranslation();
  const [isRemote, setIsRemote] = useState(false);
  const [loading, setLoading] = useState(true);
  const { mutation, contextHolder } = usePostApi(
    API_URL.NDR_PAGE.SOCKET_NDR,
    false
  );
  const role = readRoleFromCookieNonSecure();

  const fetchDeviceData = async () => {
    if (!selectedRow?.mac_address) return;
    setLoading(true);
    try {
      const query = new URLSearchParams({
        mac_address: selectedRow.mac_address,
      }).toString();

      const response = await fetch(`/api/remote_ndrs?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsRemote(data.record.is_remote);
      }
    } catch (error) {
      console.error("Error fetching device data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceData();
  }, [selectedRow?.mac_address]);
  const handleDelete = async () => {
    if (!selectedRow?.mac_address) return;
    try {
      const query = new URLSearchParams({
        mac_address: selectedRow.mac_address,
      }).toString();

      const response = await fetch(`/api/delete_edrs?${query}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        message.success("EDR deleted successfully");
      } else {
        message.error("Failed to delete EDR");
      }
    } catch (error) {
      console.error("Error deleting device:", error);
      message.error("Error deleting device");
    }
  };
  if (loading) return null;

  return (
    <div className="flex justify-between">
      <div
        className="flex gap-2"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Switch
          checked={isRemote}
          checkedChildren={t("Remote")}
          unCheckedChildren={t("Local")}
          onChange={(checked) => {
            mutation.mutate(
              { ...selectedRow, is_remote: checked },
              {
                onSuccess: () => {
                  message.success("Remote NDR updated successfully");
                  fetchDeviceData(); // sync state again
                },
                onError: () => {
                  message.error("Failed to update remote EDR");
                },
              }
            );
          }}
        />
        <Button
          className={role == "user" ? "hidden" : ""}
          danger
          onClick={handleDelete}
          style={{ color: "white", background: "#ff4d4f" }}
        >
          {t("Delete")}
        </Button>
      </div>
      {contextHolder}
    </div>
  );
};

export default HeaderDrawer;
