"use client";
import React from "react";
import type { ColDef } from "ag-grid-community";
// import DataTable from "@/components/DataTableCustom";
import API_URL from "@/common/api-url";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});

import formatDateTime from "@/common/formatDate";
import { Progress } from "antd";
export default function Edr() {
  const { t } = useTranslation();
  type RowData = {
    _id: string;
    machine_name: string;
    "version string": string;
    last_update: string; // Assuming date is in string format
    last_seen: string; // Assuming date is in string format
    first_seen: string; // Assuming date is in string format
    os: string;
    os_version: string;
    internal_ip: string;
    external_ip: string;
    memory_use: string;
    cpu_use: string;
    mac_address: string;
  };

  const columns: ColDef<RowData>[] = [
    { headerName: t("macAddress"), field: "mac_address" },
    { headerName: t("machineName"), field: "machine_name" },
    { headerName: t("version"), field: "version string" },
    {
      headerName: t("memoryUse"),
      field: "memory_use",
      cellRenderer: (params: any) => {
        const [usage, total] =
          params.value.match(/(\d+)%.*?(\d+\.\d+Gb)/) || [];
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Progress
              type="circle"
              percent={parseInt(usage, 10)}
              width={40}
              strokeColor={parseInt(usage, 10) > 80 ? "red" : "green"}
            />
            <span> Total: {total}Gb</span>
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
    { headerName: t("internalIp"), field: "internal_ip" },
  ];

  return (
    <div className="flex flex-col gap-1">
      <DataTable
        title={t("edrManagement")}
        dataFieldName="edrs"
        apiUrl={API_URL.EDR_PAGE.DEFAULT}
        columns={columns}
      />
    </div>
  );
}
