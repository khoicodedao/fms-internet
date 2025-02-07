"use client";
import React from "react";
import type { ColDef } from "ag-grid-community";
import DataTable from "@/components/DataTableCustom";
import API_URL from "@/common/api-url";

export default function Alerts() {
  type RowData = {
    mac: string;
    ip: string;
    computer_name: string;
    alert_source: string;
    alert_level_id: string;
    created_at: string;
    object: string;
    action: string;
  };

  const columns: ColDef<RowData>[] = [
    { headerName: "Object", field: "object" },
    { headerName: "Action", field: "action" },
    { headerName: "Mac", field: "mac" },
    { headerName: "IP", field: "ip" },
    { headerName: "Computer Name", field: "computer_name" },
    { headerName: "Alert Source", field: "alert_source" },
    { headerName: "Alert Level ID", field: "alert_level_id" },
    { headerName: "Event Time", field: "created_at" },
  ];

  return (
    <DataTable
      dataFieldName="_source"
      apiUrl={API_URL.ALERT_PAGE.DEFAULT}
      columns={columns}
    />
  );
}
