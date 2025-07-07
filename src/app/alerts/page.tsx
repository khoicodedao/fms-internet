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
    _id: string;
  };

  const columns: ColDef<RowData>[] = [
    {
      headerName: t("mac"),
      field: "mac",
      cellRenderer: (params: any) => {
        return (
          <Link href={`/malops-management/detail/${params.value}`}>
            {params.value}
          </Link>
        );
      },
    },
    { headerName: t("Score level"), field: "score_level" },
    { headerName: t("computerName"), field: "computer_name" },
    { headerName: t("Score tatic"), field: "score_tatic" },
    { headerName: t("Created at"), field: "created_at" },
  ];

  return (
    <DataTable
      title={t("alertManagement")}
      dataFieldName="alert"
      apiUrl={`https://70cf656b-838a-4d1c-8f2e-2b9569df066e.mock.pstmn.io/api/alerts`}
      columns={columns}
    />
  );
}
