"use client";
import React from "react";
import type { ColDef } from "ag-grid-community";
// import DataTable from "@/components/DataTableCustom";
import API_URL from "@/common/api-url";
import dynamic from "next/dynamic";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
export default function Events() {
  type RowData = {
    mac: string;
    ip: string;
    computer_name: string;
    alert_source: string;
    alert_level_id: string;
    event_time: string;
    object: string;
    action: string;
  };

  const columns: ColDef<RowData>[] = [
    { headerName: "Mac", field: "mac" },
    { headerName: "IP", field: "ip" },
    { headerName: "Computer Name", field: "computer_name" },
    { headerName: "Alert Source", field: "alert_source" },
    { headerName: "Alert Level ID", field: "alert_level_id" },
    { headerName: "Event Time", field: "event_time" },
    { headerName: "Object", field: "object" },
    { headerName: "Action", field: "action" },
  ];

  return (
    <DataTable
      title="Events management"
      dataFieldName="_source"
      apiUrl={API_URL.EVENT_PAGE.DEFAULT}
      columns={columns}
    />
  );
}
