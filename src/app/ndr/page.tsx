"use client";
import React from "react";
import type { ColDef } from "ag-grid-community";
import DataTable from "@/components/DataTableCustom";
import API_URL from "@/common/api-url";

export default function Ndr() {
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
    { headerName: "ID", field: "_id", width: 100 },
    { headerName: "Machine Name", field: "machine_name" },
    { headerName: "Version", field: "version" },
    { headerName: "Last Update", field: "last_update" },
    { headerName: "Last Seen", field: "last_seen" },
    { headerName: "First Seen", field: "first_seen" },
    { headerName: "OS", field: "os" },
    { headerName: "OS Version", field: "os_version" },
    { headerName: "Internal IP", field: "internal_ip" },
    { headerName: "External IP", field: "external_ip" },
    { headerName: "Memory Use", field: "memory_use" },
    { headerName: "CPU Use", field: "cpu_use" },
    { headerName: "MAC Address", field: "mac_address" },
  ];

  const defaultData: RowData[] = [
    {
      _id: "1",
      machine_name: "Machine 1",
      version: "1.0.0",
      last_update: "2025-02-10",
      last_seen: "2025-02-11",
      first_seen: "2025-01-01",
      os: "Windows",
      os_version: "10",
      internal_ip: "192.168.1.1",
      external_ip: "203.0.113.1",
      memory_use: "4/8 GB",
      cpu_use: "30%",
      mac_address: "00:1A:2B:3C:4D:5E",
    },
    {
      _id: "2",
      machine_name: "Machine 2",
      version: "1.0.1",
      last_update: "2025-02-09",
      last_seen: "2025-02-10",
      first_seen: "2025-01-02",
      os: "Linux",
      os_version: "Ubuntu 20.04",
      internal_ip: "192.168.1.2",
      external_ip: "203.0.113.2",
      memory_use: "2/4 GB",
      cpu_use: "40%",
      mac_address: "00:1A:2B:3C:4D:5F",
    },
    {
      _id: "3",
      machine_name: "Machine 3",
      version: "1.0.2",
      last_update: "2025-02-08",
      last_seen: "2025-02-09",
      first_seen: "2025-01-03",
      os: "Windows",
      os_version: "7",
      internal_ip: "192.168.1.3",
      external_ip: "203.0.113.3",
      memory_use: "3/8 GB",
      cpu_use: "50%",
      mac_address: "00:1A:2B:3C:4D:60",
    },
    {
      _id: "4",
      machine_name: "Machine 4",
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
      machine_name: "Machine 5",
      version: "1.0.4",
      last_update: "2025-02-06",
      last_seen: "2025-02-07",
      first_seen: "2025-01-05",
      os: "Windows",
      os_version: "8",
      internal_ip: "192.168.1.5",
      external_ip: "203.0.113.5",
      memory_use: "8/16 GB",
      cpu_use: "70%",
      mac_address: "00:1A:2B:3C:4D:62",
    },
  ];

  return (
    <div className="flex flex-col gap-1">
      <DataTable
        defaultData={defaultData}
        title="NDR management"
        dataFieldName="_source"
        apiUrl={API_URL.NDR_PAGE.DEFAULT}
        columns={columns}
      />
    </div>
  );
}
