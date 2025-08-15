"use client";
import React from "react";
import type { ColDef } from "ag-grid-community";
// import DataTable from "@/components/DataTableCustom";
import dynamic from "next/dynamic";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
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
  }

  const columns: ColDef<RowData>[] = [
    {
      headerName: t("mac"),
      field: "mac",
    },
    {
      headerName: t("ip"),
      field: "ip",
    },
    { headerName: t("Computer name"), field: "computer_name" },
    { headerName: t("object"), field: "object" },
    { headerName: t("action"), field: "action" },
    { headerName: t("alert_type"), field: "alert_type" },
    { headerName: t("mitre_tatic"), field: "mitre_tatic" },
    { headerName: t("mitre_technique"), field: "mitre_technique" },
  ];
  return (
    <DataTable
      tableHeight=" calc(-273px + 100vh)"
      title={t("alertManagement")}
      dataFieldName="events"
      apiUrl={`${API_URL.EVENTS_MITTRE_PAGE.DEFAULT}`}
      columns={columns}
      customObject={{ tatic: taticParam }}
    />
  );
}
