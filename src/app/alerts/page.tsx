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
import Link from "next/link";
import ReactJson from "react-json-view";
export default function Alerts() {
  const { t } = useTranslation();
  interface RowData {
    uid: string;
    id: string;
    root_process: string;
    host: string;
    mac: string;
    computer_name: string;
    timestamp: string;
    summary: string;
    techniques: string;
    tatics: string;
    process_root: Object;
  }

  const columns: ColDef<RowData>[] = [
    {
      headerName: t("_id"),
      field: "id",
      width: 150,
      // @ts-ignore
      cellRenderer: (params) => (
        <Link
          href={`/malops-management/detail/${params.data.id}?root_process=${params.data.root_process}&file_name=${params.data.file_name}&tatics=${params.data.tatics}&techniques=${params.data.techniques}&summary=${params.data.summary}&time_stamp=${params.data.timestamp}&uid=${params.data.uid}`}
        >
          {params.value}
        </Link>
      ),
    },
    {
      headerName: t("mac"),
      field: "mac",
    },
    {
      headerName: t("Root Process"),
      field: "process_root.file_info.file_path",
      width: 300,
    },
    {
      headerName: t("Score tatic"),
      field: "process_root.file_info.score_tatic",
    },
    {
      headerName: t("Score level"),
      field: "process_root.file_info.score_level",
    },
    { headerName: t("Computer name"), field: "computer_name" },
    { headerName: t("Time stamp"), field: "timestamp", width: 250 },
    { headerName: t("Summary"), field: "summary", width: 450 },
  ];

  return (
    <DataTable
      tableHeight=" calc(-273px + 100vh)"
      title={t("alertManagement")}
      dataFieldName="alerts"
      apiUrl={`${API_URL.ALERT_PAGE.DEFAULT}`}
      columns={columns}
    />
  );
}
