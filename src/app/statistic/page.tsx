"use client";
import React from "react";
import type { ColDef } from "ag-grid-community";
import dynamic from "next/dynamic";
import { Tabs } from "antd";
import API_URL from "@/common/api-url";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { EyeOutlined } from "@ant-design/icons";
// import DataTable from "@/components/DataTableCustom";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});

export default function Statistic() {
  const { t } = useTranslation();

  const columns: ColDef<any>[] = [
    { headerName: t("Unit name"), field: "unit_name", width: 200 },
    { headerName: t("Event"), field: "events_total", width: 200 },
    { headerName: t("Alert"), field: "alerts_total", width: 200 },
    { headerName: t("Edr"), field: "edr_total", width: 200 },
  ];

  return (
    <DataTable
      tableHeight="calc(-270px + 100vh)"
      title={""}
      dataFieldName="rows"
      apiUrl={`${API_URL.STATISTIC_PAGE.DEFAULT}`}
      columns={columns}
    />
  );
}
