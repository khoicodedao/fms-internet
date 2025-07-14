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
import AlertLevel from "@/common/alertLevel";
import formatDateTime from "@/common/formatDate";
import SocketStatus from "@/common/socketStatus";
import {
  ApiOutlined,
  BranchesOutlined,
  FileOutlined,
  PartitionOutlined,
  ProfileOutlined,
  WifiOutlined,
  UsbOutlined,
} from "@ant-design/icons";
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
    {
      headerName: t("Description"),
      field: "computer_name",
      cellRenderer: (params: any) => {
        const tableTitle = params.colDef.tableTitle; // Lấy tableTitle từ colDef
        if (tableTitle === "socket") {
          return `${params.data.fields.image_path}  ${params.data.fields.remote_address}/${params.data.fields.remote_port}`;
        } else if (tableTitle === "registry") {
          return `${params.data.fields.image_path} - ${params.data.alert_type} - ${params.data.fields.value}`;
        } else if (tableTitle === "file") {
          return `${params.data.fields.process_name} - ${params.data.action} - ${params.data.fields.file_name}`;
        } else if (tableTitle === "process") {
          return `${params.data.fields.file_path} - ${params.data.action} - ${params.data.fields.image_path_created}`;
        }
        return <span>{params.value}</span>;
      },
    },

    { headerName: t("computerName"), field: "computer_name" },
    { headerName: t("alertSource"), field: "alert_source" },
    {
      headerName: t("alertLevelId"),
      field: "alert_level_id",
      cellRenderer: (params: any) => <AlertLevel level={params.value} />,
    },
    { headerName: t("eventTime"), field: "event_time" },
    {
      headerName: t("action"),
      field: "action",
      cellRenderer: (params: any) => <SocketStatus status={params.value} />,
    },
  ];
  const columnFlow = [
    { headerName: t("mac"), field: "mac" },
    { headerName: t("Dest mac"), field: "fields.dest_mac" },
    { headerName: t("Dest IP"), field: "fields.dest_ip" },
    { headerName: t("Src IP"), field: "fields.src_ip" },
    {
      headerName: t("eventTime"),
      field: "fields.timestamp",
      valueFormatter: formatDateTime,
    },
    { headerName: t("action"), field: "action" },
  ];
  return (
    <Tabs tabPosition="left" type="card" defaultActiveKey="1">
      <TabPane
        tab={
          <span>
            <WifiOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              color="red"
            />{" "}
            Socket
          </span>
        }
        key="1"
      >
        <DataTable
          title=""
          body="object = 'socket'"
          dataFieldName="events"
          tableHeight="calc(-282px + 100vh)"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          // columns={columns}
          columns={columns.map((col) => ({
            ...col,
            tableTitle: "socket", // Thêm tableTitle vào từng cột
          }))}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <ProfileOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
            Registry
          </span>
        }
        key="2"
      >
        <DataTable
          title=""
          tableHeight="calc(-282px + 100vh)"
          body="object = 'registry'"
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columns.map((col) => ({
            ...col,
            tableTitle: "registry", // Thêm tableTitle vào từng cột
          }))}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <FileOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />{" "}
            File
          </span>
        }
        key="3"
      >
        <DataTable
          tableHeight="calc(-282px + 100vh)"
          title=""
          body="object = 'file'"
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columns.map((col) => ({
            ...col,
            tableTitle: "file", // Thêm tableTitle vào từng cột
          }))}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <PartitionOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />{" "}
            Process
          </span>
        }
        key="4"
      >
        <DataTable
          tableHeight="calc(-282px + 100vh)"
          title=""
          body="object = 'process'"
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columns.map((col) => ({
            ...col,
            tableTitle: "process", // Thêm tableTitle vào từng cột
          }))}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <BranchesOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />{" "}
            Flow
          </span>
        }
        key="5"
      >
        <DataTable
          tableHeight="calc(-282px + 100vh)"
          title=""
          body="object = 'flow'"
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columnFlow}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <ApiOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />{" "}
            Http
          </span>
        }
        key="6"
      >
        <DataTable
          tableHeight="calc(-282px + 100vh)"
          title=""
          body="object = 'http'"
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columnFlow}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <UsbOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />{" "}
            File Usb
          </span>
        }
        key="7"
      >
        <DataTable
          tableHeight="calc(-282px + 100vh)"
          title=""
          body="object = 'FileUSB'"
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columns.map((col) => ({
            ...col,
            tableTitle: "file", // Thêm tableTitle vào từng cột
          }))}
        />
      </TabPane>
    </Tabs>
  );
}
