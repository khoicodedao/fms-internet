"use client";
import React, { useEffect, useState } from "react";
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
    version: string;
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
    { headerName: t("machineName"), field: "machine_name" },
    { headerName: t("version"), field: "version" },
    { headerName: t("lastUpdate"), field: "last_update" },
    { headerName: t("lastSeen"), field: "last_seen" },
    { headerName: t("firstSeen"), field: "first_seen" },
    { headerName: t("os"), field: "os" },
    { headerName: t("osVersion"), field: "os_version" },
    { headerName: t("internalIp"), field: "internal_ip" },
    { headerName: t("externalIp"), field: "external_ip" },
    { headerName: t("memoryUse"), field: "memory_use" },
    { headerName: t("cpuUse"), field: "cpu_use" },
    { headerName: t("macAddress"), field: "mac_address" },
  ];

  const [defaultData, setDefaultData] = useState<RowData[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDefaultData([
        {
          _id: "1",
          machine_name: "Alpha-PC",
          version: "1.0.0",
          last_update: "2025-02-10",
          last_seen: "2025-02-11",
          first_seen: "2025-01-01",
          os: "Ubuntu",
          os_version: "10",
          internal_ip: "192.168.1.1",
          external_ip: "203.0.113.1",
          memory_use: "4/8 GB",
          cpu_use: "30%",
          mac_address: "00:1A:2B:3C:4D:5E",
        },
        {
          _id: "2",
          machine_name: "Beta-Server",
          version: "1.0.1",
          last_update: "2025-02-09",
          last_seen: "2025-02-10",
          first_seen: "2025-01-02",
          os: "Ubuntu",
          os_version: "20.04",
          internal_ip: "192.168.1.2",
          external_ip: "203.0.113.2",
          memory_use: "2/4 GB",
          cpu_use: "40%",
          mac_address: "00:1A:2B:3C:4D:5F",
        },
        {
          _id: "3",
          machine_name: "Gamma-Workstation",
          version: "1.0.2",
          last_update: "2025-02-08",
          last_seen: "2025-02-09",
          first_seen: "2025-01-03",
          os: "Ubuntu",
          os_version: "7",
          internal_ip: "192.168.1.3",
          external_ip: "203.0.113.3",
          memory_use: "3/8 GB",
          cpu_use: "50%",
          mac_address: "00:1A:2B:3C:4D:60",
        },
        {
          _id: "4",
          machine_name: "Delta-Laptop",
          version: "1.0.3",
          last_update: "2025-02-07",
          last_seen: "2025-02-08",
          first_seen: "2025-01-04",
          os: "Linux",
          os_version: "CentOS 7",
          internal_ip: "192.168.1.4",
          external_ip: "203.0.113.4",
          memory_use: "6/16 GB",
          cpu_use: "60%",
          mac_address: "00:1A:2B:3C:4D:61",
        },
        {
          _id: "5",
          machine_name: "Echo-Desktop",
          version: "1.0.4",
          last_update: "2025-02-06",
          last_seen: "2025-02-07",
          first_seen: "2025-01-05",
          os: "Linux",
          os_version: "8",
          internal_ip: "192.168.1.5",
          external_ip: "203.0.113.5",
          memory_use: "8/16 GB",
          cpu_use: "70%",
          mac_address: "00:1A:2B:3C:4D:62",
        },
      ]);
    }
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <DataTable
        defaultData={defaultData}
        title={t("edrManagement")}
        dataFieldName="_source"
        apiUrl={API_URL.NDR_PAGE.DEFAULT}
        columns={columns}
      />
    </div>
  );
}
