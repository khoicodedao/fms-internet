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

const { TabPane } = Tabs;

export default function Alerts() {
  const { t } = useTranslation();

  interface RowData {
    uid: string;
    id: string;
    root_process: string;
    host: string;
    mac: string;
    computer_name: string;
    timestamp: string;
    summary: string;
    techniques: string;
    tatics: string;
    process_root: Object;
  }

  const columns: ColDef<RowData>[] = [
    {
      headerName: "",
      field: "id",
      width: 80,
      // @ts-ignore
      cellRenderer: (params) => (
        <div className="flex justify-center items-center">
          <Link
            target="_blank"
            href={`/malops-management/detail/${params.data.id}?root_process=${params.data.root_process}&file_name=${params.data.file_name}&tatics=${params.data.tatics}&techniques=${params.data.techniques}&summary=${params.data.summary}&time_stamp=${params.data.timestamp}&uid=${params.data.uid}`}
          >
            <EyeOutlined
              style={{ fontSize: "18px", color: "#f6bd03" }}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </Link>
        </div>
      ),
    },
    { headerName: t("mac"), field: "mac", width: 200 },
    {
      headerName: t("Root Process"),
      // @ts-ignore
      field: "process_root.file_info.file_path",
      width: 300,
    },
    {
      headerName: t("Score tatic"),
      width: 100,
      // @ts-ignore
      field: "process_root.file_info.score_tatic",
    },
    {
      headerName: t("Score level"),
      // @ts-ignore
      field: "process_root.file_info.score_level",
      width: 100,
    },
    { headerName: t("Computer name"), field: "computer_name" },
    { headerName: t("Time stamp"), field: "timestamp", width: 250 },
    { headerName: t("Summary"), field: "summary", width: 450 },
  ];

  // columns cho bảng thứ 2 (ví dụ demo)
  const columns2: ColDef<any>[] = [
    { headerName: t("mac"), field: "mac", width: 200 },
    { headerName: t("ip"), field: "fields.src_ip", width: 200 },

    { headerName: "Action", field: "action", width: 200 },
    { headerName: "Signature", field: "fields.signature", width: 400 },
    { headerName: t("Created At"), field: "created_at", width: 250 },
    { headerName: t("Severity"), field: "severity", width: 250 },
  ];
  return (
    <Tabs defaultActiveKey="1" type="card" tabPosition="left">
      <TabPane tab={t("EDR")} key="1">
        <DataTable
          tableHeight="calc(-270px + 100vh)"
          title={""}
          dataFieldName="alerts"
          apiUrl={`${API_URL.ALERT_PAGE.DEFAULT}`}
          columns={columns}
        />
      </TabPane>

      <TabPane tab={t("NDR")} key="2">
        <DataTable
          tableHeight="calc(-270px + 100vh)"
          title=""
          dataFieldName="events" // tùy API
          apiUrl={`${API_URL.ALERT_PAGE.NDR}`} // thay API phù hợp
          columns={columns2}
        />
      </TabPane>
    </Tabs>
  );
}
