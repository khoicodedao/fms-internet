"use client";
import React from "react";
import type { ColDef } from "ag-grid-community";
// import DataTable from "@/components/DataTableCustom";
import API_URL from "@/common/api-url";
import { Tabs } from "antd";
import dynamic from "next/dynamic";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
const { TabPane } = Tabs;
import { useTranslation } from "next-i18next";

export default function Events() {
  const { t } = useTranslation();
  type RowData = {
    mac: string;
    ip: string;
    computer_name: string;
    alert_source: string;
    alert_level_id: string;
    event_time: string;
    object: string;
    action: string;
  };

  const columns: ColDef<RowData>[] = [
    { headerName: t("mac"), field: "mac" },
    { headerName: t("ip"), field: "ip" },
    { headerName: t("computerName"), field: "computer_name" },
    { headerName: t("alertSource"), field: "alert_source" },
    { headerName: t("alertLevelId"), field: "alert_level_id" },
    { headerName: t("eventTime"), field: "event_time" },
    { headerName: t("object"), field: "object" },
    { headerName: t("action"), field: "action" },
  ];
  const columnFlow = [
    { headerName: t("Src mac"), field: "src_mac" },
    { headerName: t("Dest mac"), field: "fields.dest_mac" },
    { headerName: t("Dest IP"), field: "fields.dest_ip" },
    { headerName: t("Src IP"), field: "fields.src_ip" },
    { headerName: t("eventTime"), field: "fields.timestamp" },
    { headerName: t("object"), field: "object" },
    { headerName: t("action"), field: "action" },
  ];

  return (
    <Tabs type="card" defaultActiveKey="1">
      <TabPane tab="Socket" key="1">
        <DataTable
          title=""
          body={{ object: "socket" }}
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columns}
        />
      </TabPane>
      <TabPane tab="Registry" key="2">
        <DataTable
          title=""
          body={{ object: "registry" }}
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columns}
        />
      </TabPane>
      <TabPane tab="File" key="3">
        <DataTable
          title=""
          body={{ object: "file" }}
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columns}
        />
      </TabPane>
      <TabPane tab="Flow" key="4">
        <DataTable
          title=""
          body={{ object: "flow" }}
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columnFlow}
        />
      </TabPane>
    </Tabs>
  );
}
