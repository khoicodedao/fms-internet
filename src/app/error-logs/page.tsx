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
    ip: string;
    computer_name: string;
    alert_source: string;
    alert_level_id: string;
    created_at: string;
    object: string;
    action: string;
  };

  const columns: ColDef<RowData>[] = [
    { headerName: t("mac"), field: "mac" },
    { headerName: t("ip"), field: "ip" },
    { headerName: t("computerName"), field: "computer_name" },
    { headerName: t("alertSource"), field: "alert_source" },
    { headerName: t("alertLevelId"), field: "alert_level_id" },
    // { headerName: t("eventTime"), field: "event_time" },
    { headerName: t("object"), field: "object" },
    { headerName: t("action"), field: "action" },
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
