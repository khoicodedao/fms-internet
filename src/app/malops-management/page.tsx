/* eslint-disable */
"use client";
import React, { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  DesktopOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileOutlined,
  LinkOutlined,
  GlobalOutlined,
  BugOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import API_URL from "@/common/api-url";
import dynamic from "next/dynamic";
import formatDateTime from "@/common/formatDate";

const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
// import DataTable from "@/components/DataTableCustom";

import { usePostApi } from "@/common/usePostApi";
import Link from "next/link";

export default function MalOpsManagement() {
  const [reload, setReload] = React.useState(false);
  const { t } = useTranslation(); //multi-language support
  const { mutation: mutationDelete, contextHolder: contextHolderDelete } =
    usePostApi(API_URL.INVESTIGATION_PAGE.DELETE, true);
  const onDelete = (id: string) => {
    mutationDelete.mutate(
      {
        id: id,
      },
      {
        onSuccess: (response: any) => {
          setReload(!reload);
        },
      }
    );
  };

  const columns = [
    {
      headerName: t("Function"),
      width: 100,
      field: "id",
      cellRenderer: (params: any) => {
        return (
          //@ts-ignore
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => onDelete(params.data.id)}
          />
        );
      },
    },

    {
      headerName: "Description",
      field: "description",
      width: 200,
      cellRenderer: (params: any) => {
        return (
          <Link href={`/malops-management/detail/${params.data.id}`}>
            {params.value}
          </Link>
        );
      },
    },

    { headerName: "Filter", field: "filter", width: 500 },
    { headerName: "Time line", field: "time_line", width: 500 },
    {
      headerName: "Created at",
      field: "created_at",
      valueFormatter: formatDateTime,
      width: "auto",
    },
  ];
  return (
    <div
      style={{ background: "#FCFBFB" }}
      className="flex-1 gap-3 font-[family-name:var(--font-geist-sans)]"
    >
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <section>
            <DataTable
              showDatepicker={false}
              showFilter={false}
              title="Query Flow"
              dataFieldName="filters"
              apiUrl={API_URL.INVESTIGATION_PAGE.DEFAULT}
              // @ts-ignore
              columns={columns}
              reload={reload}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
