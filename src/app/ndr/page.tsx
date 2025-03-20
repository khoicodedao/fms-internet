"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import type { ColDef } from "ag-grid-community";
// import DataTable from "@/components/DataTableCustom";
import API_URL from "@/common/api-url";
import dynamic from "next/dynamic";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
import formatDateTime from "@/common/formatDate";
import Status from "@/common/status";
export default function Ndr() {
  const { t } = useTranslation();
  type RowData = {
    _id: string;
    ndr_name: string;
    version: string;
    last_updated: string; // Assuming date is in string format
    last_seen: string; // Assuming date is in string format
    ndr_status: string; // Assuming date is in string format
    ip_local: string;
    ip_public: string;
    elastic_storage_used: string;
    mac_address: string;
  };

  const columns: ColDef<RowData>[] = [
    { headerName: t("macAddress"), field: "mac_address" },
    { headerName: t("machineName"), field: "ndr_name" },
    { headerName: t("version"), field: "version" },
    {
      headerName: t("lastUpdate"),
      field: "last_updated",
      valueFormatter: formatDateTime,
    },
    {
      headerName: t("lastSeen"),
      field: "last_seen",
      valueFormatter: formatDateTime,
    },
    {
      headerName: t("ndrStatus"),
      field: "ndr_status",
      cellRenderer: (params: any) => <Status status={params.value} />,
    },
    { headerName: t("internalIp"), field: "ip_local" },
    { headerName: t("externalIp"), field: "ip_public" },
    { headerName: t("storageElasticUse"), field: "elastic_storage_used" },
  ];

  return (
    <div className="flex flex-col gap-1">
      <DataTable
        title={t("ndrManagement")}
        dataFieldName="ndrs"
        apiUrl={API_URL.NDR_PAGE.DEFAULT}
        columns={columns}
      />
    </div>
  );
}
