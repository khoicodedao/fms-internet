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
    { headerName: t("id"), field: "_id", width: 100 },
    { headerName: t("macAddress"), field: "mac_address" },
    { headerName: t("machineName"), field: "machine_name" },
    { headerName: t("version"), field: "version string" },
    { headerName: t("lastUpdate"), field: "last_update" },
    { headerName: t("lastSeen"), field: "last_seen" },
    { headerName: t("os"), field: "os" },
    { headerName: t("internalIp"), field: "internal_ip" },
    { headerName: t("memoryUse"), field: "memory_use" },
    { headerName: t("cpuUse"), field: "cpu_use" },
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
