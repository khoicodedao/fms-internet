/*eslint-disable*/
"use client";
import React, { useEffect } from "react";
// import DataTable from "@/components/DataTableCustom";
import API_URL from "@/common/api-url";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import HeaderDrawer from "./HeaderDrawer";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
import { usePostApi } from "@/common/usePostApi";
import formatDateTime from "@/common/formatDate";
import { message, Progress, Switch } from "antd";
export default function Edr() {
  const { mutation, contextHolder } = usePostApi(
    API_URL.EDR_PAGE.SOCKET_EDR,
    false
  );
  const [reload, setReload] = React.useState(false);
  const { t } = useTranslation();

  const columns = [
    {
      headerName: t("macAddress"),
      field: "mac_address",
      sortable: true, // Enable sorting for this column
      sort: "asc",
    },
    { headerName: t("internalIp"), field: "internal_ip" },
    { headerName: t("machineName"), field: "machine_name" },
    { headerName: t("version"), field: "version string" },
    {
      headerName: t("memoryUse"),
      field: "memory_use",
      cellRenderer: (params: any) => {
        const match = params.value.match(/Total:\s*([\d.]+Gb)/);
        const total = match ? match[1] : "Unknown"; // Extract total or fallback to "Unknown"
        const usageMatch = params.value.match(/(\d+)%/);
        const usage = usageMatch ? parseInt(usageMatch[1], 10) : 0; // Extract usage percentage

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Progress
              type="circle"
              percent={usage}
              width={40}
              strokeColor={usage > 80 ? "red" : "green"}
            />
            <span>Total: {total}</span>
          </div>
        );
      },
    },
    {
      headerName: t("cpuUse"),
      field: "cpu_use",
      cellRenderer: (params: any) => {
        const match = params.value.match(/([\d.]+)%\s*\((.+)\)/);
        const usage = match ? parseFloat(match[1]) : 0; // Extract CPU usage percentage

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Progress
              type="circle"
              percent={usage}
              width={40}
              strokeColor={usage > 80 ? "red" : "green"}
            />
          </div>
        );
      },
    },
    {
      headerName: t("lastUpdate"),
      field: "last_update",
      valueFormatter: formatDateTime,
    },
    {
      headerName: t("lastSeen"),
      field: "last_seen",
      valueFormatter: formatDateTime,
    },
    { headerName: t("os"), field: "os" },
  ];

  return (
    <div className="flex flex-col gap-1">
      {contextHolder}
      <DataTable
        title={t("edrManagement")}
        dataFieldName="edrs"
        apiUrl={API_URL.EDR_PAGE.DEFAULT}
        //@ts-ignore
        columns={columns}
        reload={reload}
        // @ts-ignore
        HeaderDrawer={HeaderDrawer}
      />
    </div>
  );
}
