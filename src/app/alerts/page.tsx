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

export default function Alerts() {
  const { t } = useTranslation();
  type RowData = {
    mac: string;
    score_level: string;
    computer_name: string;
    score_tatic: string;
    alert_level_id: string;
    created_at: string;
    object: string;
    action: string;
    version: string;
    _id: string;
  };

  const columns: ColDef<RowData>[] = [
    {
      headerName: t("mac"),
      field: "mac",
    },
    { headerName: t("Score level"), field: "score_level" },
    { headerName: t("computerName"), field: "computer_name" },
    { headerName: t("Score tatic"), field: "score_tatic" },
    { headerName: t("Created at"), field: "created_at", width: 450 },
    { headerName: t("Version"), field: "version", width: 150 },

    { headerName: t("Created at"), field: "created_at", width: 450 },
  ];

  return (
    <DataTable
      tableHeight=" calc(-273px + 100vh)"
      title={t("alertManagement")}
      dataFieldName="alert"
      apiUrl={`https://567c1e7d-7161-45bb-a356-b733e003d043.mock.pstmn.io/api/alerts`}
      columns={columns}
    />
  );
}
