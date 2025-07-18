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
    mitre_tatic: string;
    mitre_technique: string;
  };

  const columns: ColDef<RowData>[] = [
    { headerName: t("mac"), field: "mac", width: 170 },
    { headerName: t("ip"), field: "ip", width: 150 },
    {
      headerName: t("Description"),
      field: "computer_name",
      width: 500,
      cellRenderer: (params: any) => {
        const tableTitle = params.colDef.tableTitle;
        const fields = params.data?.fields || {};
        const action = params.data?.action || "";
        const alertType = params.data?.alert_type || "";

        if (tableTitle === "socket") {
          const imagePath = fields.image_path || "";
          const remoteAddress = fields.remote_address || "";
          const remotePort = fields.remote_port || "";
          return `${imagePath}  ${remoteAddress}/${remotePort}`;
        } else if (tableTitle === "registry") {
          const imagePath = fields.image_path || "";
          const value = fields.value || "";
          return `${imagePath} - ${alertType} - ${value}`;
        } else if (tableTitle === "file") {
          const processName = fields.process_name || "";
          const fileName = fields.file_name || "";
          return `${processName} - ${action} - ${fileName}`;
        } else if (tableTitle === "process") {
          const filePath = fields.file_path || "";
          const imagePathCreated = fields.image_path_created || "";
          return `${filePath} - ${action} - ${imagePathCreated}`;
        }

        return params.value ?? ""; // fallback
      },
    },

    { headerName: t("computerName"), field: "computer_name" },
    { headerName: t("alertSource"), field: "alert_source", width: 120 },
    {
      headerName: t("alertLevelId"),
      field: "alert_level_id",
      width: 120,
      cellRenderer: (params: any) => <AlertLevel level={params.value} />,
    },
    { headerName: t("mitreTatic"), field: "mitre_tatic", width: 120 },
    { headerName: t("mitreTechnique"), field: "mitre_technique", width: 120 },

    { headerName: t("eventTime"), field: "event_time" },
    {
      headerName: t("action"),
      width: 320,
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
    <Tabs id="event-page" tabPosition="left" type="card" defaultActiveKey="1">
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
