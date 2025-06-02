import React, { useState, useEffect } from "react";
import { message, Progress, Switch } from "antd";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import { useTranslation } from "react-i18next";

const HeaderDrawer = ({ selectedRow }: { selectedRow: any }) => {
  const { t } = useTranslation();
  const [isRemote, setIsRemote] = useState(false);
  const [loading, setLoading] = useState(true);
  const { mutation, contextHolder } = usePostApi(
    API_URL.EDR_PAGE.SOCKET_EDR,
    false
  );

  const fetchDeviceData = async () => {
    if (!selectedRow?.mac_address) return;
    setLoading(true);
    try {
      const query = new URLSearchParams({
        mac_address: selectedRow.mac_address,
      }).toString();

      const response = await fetch(`/api/remote_edrs?${query}`, {
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

  if (loading) return null;

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Switch
          checked={isRemote}
          checkedChildren={t("Remote")}
          unCheckedChildren={t("Local")}
          onChange={(checked) => {
            mutation.mutate(
              { ...selectedRow, is_remote: checked },
              {
                onSuccess: () => {
                  message.success("Remote EDR updated successfully");
                  fetchDeviceData(); // sync state again
                },
                onError: () => {
                  message.error("Failed to update remote EDR");
                },
              }
            );
          }}
        />
      </div>
      {contextHolder}
    </div>
  );
};

export default HeaderDrawer;
