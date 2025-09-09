"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import API_URL from "@/common/api-url";
import { Card, Tabs } from "antd";
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

// App Router hooks
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Events() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // map tên tab <-> key
  const TAB_KEY_BY_PARAM: Record<string, string> = {
    socket: "1",
    registry: "2",
    file: "3",
    process: "4",
    flow: "5",
    http: "6",
    fileusb: "7",
  };
  const TAB_PARAM_BY_KEY: Record<string, string> = Object.fromEntries(
    Object.entries(TAB_KEY_BY_PARAM).map(([k, v]) => [v, k])
  );

  function flattenObject(obj: any, parentKey = "", res: any = {}) {
    for (let key in obj) {
      const propName = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  }
  function buildColumns(data: any[]) {
    if (!data.length) return [];
    const sample = flattenObject(data[0]);
    const fields = Object.keys(sample);

    // Ưu tiên Time ở đầu
    const orderedFields = ["event_time", "@timestamp"]
      .filter((f) => fields.includes(f))
      .concat(fields.filter((f) => f !== "event_time" && f !== "@timestamp"));

    return orderedFields.map((field) => ({
      headerName: field,
      field,
      resizable: true,
      sortable: true,
      filter: true,
      flex: 1,
    }));
  }

  // Lấy key từ URL (?tab=socket | registry | 1 | 2 ...)
  const initialActiveKey = useMemo(() => {
    const tabParam = (searchParams.get("tab") || "").toLowerCase();
    if (!tabParam) return "1";
    // hỗ trợ cả tên (socket) lẫn số ("1")
    return (
      TAB_KEY_BY_PARAM[tabParam] ??
      (Object.values(TAB_KEY_BY_PARAM).includes(tabParam) ? tabParam : "1")
    );
  }, [searchParams]);

  const [activeKey, setActiveKey] = useState<string>(initialActiveKey);

  // Đồng bộ khi URL thay đổi (VD: user đổi query bằng tay)
  useEffect(() => {
    setActiveKey(initialActiveKey);
  }, [initialActiveKey]);

  // Khi đổi tab -> cập nhật URL (giữ các query khác)
  const onTabChange = (key: string) => {
    setActiveKey(key);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", TAB_PARAM_BY_KEY[key] ?? key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
        return params.value ?? "";
      },
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
    <Tabs
      id="event-page"
      tabPosition="left"
      type="card"
      activeKey={activeKey} // dùng activeKey thay vì defaultActiveKey
      onChange={onTabChange}
    >
      <TabPane
        tab={
          <span>
            <ProfileOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />{" "}
            All
          </span>
        }
        key="0"
      >
        <DataTable
          tableHeight="calc(-282px + 100vh)"
          title=""
          body="" // không filter -> lấy tất cả events
          dataFieldName="events"
          apiUrl={API_URL.EVENT_PAGE.DEFAULT}
          columns={columns.map((col) => ({ ...col, tableTitle: "all" }))}
        />
      </TabPane>

      <TabPane
        tab={
          <span>
            <WifiOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
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
          columns={columns.map((col) => ({ ...col, tableTitle: "socket" }))}
        />
      </TabPane>

      <TabPane
        tab={
          <span>
            <ProfileOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />{" "}
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
          columns={columns.map((col) => ({ ...col, tableTitle: "registry" }))}
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
          columns={columns.map((col) => ({ ...col, tableTitle: "file" }))}
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
          columns={columns.map((col) => ({ ...col, tableTitle: "process" }))}
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
          columns={columns.map((col) => ({ ...col, tableTitle: "file" }))}
        />
      </TabPane>
    </Tabs>
  );
}
