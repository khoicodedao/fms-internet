"use client";
import React from "react";
import type { ColDef } from "ag-grid-community";
import API_URL from "@/common/api-url";
import dynamic from "next/dynamic";
import { Tabs } from "antd";
import { useTranslation } from "next-i18next";

const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
// import DataTable from "@/components/DataTableCustom";

export default function ErrorLogs() {
  const { t } = useTranslation();

  type RowData = {
    mac: string;
    error_message: string;
    computer_name: string;
    source: string;
    alert_level_id: string;
    created_at: string;
    object: string;
    action: string;
  };

  const columns: ColDef<RowData>[] = [
    { headerName: t("mac"), field: "mac" },
    { headerName: "Error message", field: "error_message", width: 900 },
    { headerName: "Source", field: "source" },
    { headerName: "Created Time", field: "created_at" },
  ];

  return (
    <Tabs tabPosition="left" style={{ height: "100%" }}>
      <Tabs.TabPane tab="Event" key="1">
        <DataTable
          title={"Event Logs"}
          dataFieldName="events"
          apiUrl={API_URL.LOGS_PAGE.DEFAULT}
          columns={columns}
        />
      </Tabs.TabPane>

      <Tabs.TabPane tab="Alert" key="2">
        <DataTable
          title={"Alert Logs"}
          dataFieldName="alerts"
          apiUrl={API_URL.LOGS_PAGE.DEFAULT}
          columns={columns}
        />
      </Tabs.TabPane>
    </Tabs>
  );
}
