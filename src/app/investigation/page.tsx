"use client";
import React from "react";
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
} from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import API_URL from "@/common/api-url";
import dynamic from "next/dynamic";
import formatDateTime from "@/common/formatDate";

const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
import QueryFlowBuilder from "./query-builder/query-flow-builder";
export default function Investigation() {
  const { t } = useTranslation(); //multi-language support
  const columns = [
    { headerName: "filter", field: "filter", width: 500 },
    {
      headerName: "Created at",
      field: "created_at",
      valueFormatter: formatDateTime,
    },
  ];

  const items = [
    { icon: DesktopOutlined, label: t("machine") },
    { icon: UserOutlined, label: t("user") },
    { icon: AppstoreOutlined, label: t("process") },
    { icon: FileOutlined, label: t("file") },
    { icon: LinkOutlined, label: t("connection") },
    { icon: GlobalOutlined, label: t("domain_name") },
    { icon: BugOutlined, label: t("malop_process") },
  ];

  return (
    <div className="grid py-4 pb-20 gap-3 sm:pt-10 font-[family-name:var(--font-geist-sans)]">
      <div
        style={{ background: "#FCFBFB" }}
        className="grid p-4 pb-20 gap-3  font-[family-name:var(--font-geist-sans)]"
      >
        <h2 className="text-2xl ml-4 pt-7 font-bold text-gray-800 mb-4">
          {t("build_query")}
        </h2>
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#F6BD03] flex items-center justify-center">
                {React.createElement(item.icon)}
              </div>
              <span className="text-sm text-center">{item.label}</span>
            </div>
          ))}
        </section>
      </div>

      <div
        style={{ background: "#FCFBFB" }}
        className="grid p-4 pb-20 gap-3 sm:pt-10 font-[family-name:var(--font-geist-sans)]"
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <QueryFlowBuilder />
          </div>
          <div className="flex-1 min-w-[300px]">
            <section>
              <DataTable
                showDatepicker={false}
                showFilter={false}
                title="Query Flow"
                dataFieldName="filters"
                apiUrl={API_URL.INVESTIGATION_PAGE.DEFAULT}
                columns={columns}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
