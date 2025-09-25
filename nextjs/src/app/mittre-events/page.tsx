"use client";
import React from "react";
import type { ColDef } from "ag-grid-community";
// import DataTable from "@/components/DataTableCustom";
import dynamic from "next/dynamic";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
// import DataTable from "@/components/DataTableCustom";

import API_URL from "@/common/api-url";
import { useTranslation } from "next-i18next";
import { useSearchParams } from "next/navigation";
export default function Alerts() {
  const searchParams = useSearchParams();
  const taticParam = searchParams.get("tatic") || ""; // "Resource Development"
  const { t } = useTranslation();
  interface RowData {
    uid: string;
    id: string;
    root_process: string;
    host: string;
    mac: string;
    computer_name: string;
    alert_time: string;
    ip: string;
    action: string;
    object: string;
    process_root: Object;
    alert_type: string;
    mitre_tatic: string;
    mitre_technique: string;
    alert_level_id: number;
  }

  const columns: ColDef<RowData>[] = [
    {
      headerName: t("mac"),
      field: "mac",
      width: 180,
    },
    {
      headerName: t("ip"),
      field: "ip",
      width: 150,
    },
    { headerName: t("Computer name"), field: "computer_name" },
    { headerName: t("object"), field: "object", width: 100 },
    { headerName: t("action"), field: "action", width: 100 },
    { headerName: t("Alert level"), field: "alert_level_id", width: 100 },
    { headerName: t("alert_type"), field: "alert_type", width: 100 },
    { headerName: t("mitre_tatic"), field: "mitre_tatic", width: 300 },
    { headerName: t("mitre_technique"), field: "mitre_technique", width: 500 },
  ];
  return (
    <DataTable
      tableHeight=" calc(-273px + 100vh)"
      // title={t("alertManagement")}
      dataFieldName="events"
      apiUrl={`${API_URL.EVENTS_MITTRE_PAGE.DEFAULT}`}
      columns={columns}
      customObject={{ tatic: taticParam }}
    />
  );
}
