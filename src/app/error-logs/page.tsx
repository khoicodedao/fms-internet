"use client";
import React from "react";
import type { ColDef } from "ag-grid-community";
// import DataTable from "@/components/DataTableCustom";
import API_URL from "@/common/api-url";
import dynamic from "next/dynamic";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
import { useTranslation } from "next-i18next";

export default function ErrorLogs() {
  const { t } = useTranslation();
  type RowData = {
    mac: string;
    error_message: string;
    computer_name: string;
    source: string;
    alert_level_id: string;
    created_at: string;
    object: string;
    action: string;
  };

  const columns: ColDef<RowData>[] = [
    { headerName: t("mac"), field: "mac" },
    { headerName: "Error message", field: "error_message", width: 900 },
    { headerName: "Source", field: "source" },
    { headerName: "Created Time", field: "created_at" },
  ];

  return (
    <DataTable
      title={"Error Logs"}
      dataFieldName="errors"
      apiUrl={API_URL.LOGS_PAGE.DEFAULT}
      columns={columns}
    />
  );
}
