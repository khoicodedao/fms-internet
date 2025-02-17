"use client";
import { Card, Row, Col } from "antd";
import React, { useCallback, useRef } from "react";
import ReactECharts from "echarts-for-react";
import {
  PieChartOutlined,
  DesktopOutlined,
  WifiOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import getFileIcon from "./object-type/object-type";
import Link from "next/link";
import type { AgGridReact as AgGridReactType } from "ag-grid-react";
import { useTranslation } from "react-i18next";
export default function MalOpsManagement() {
  const { t } = useTranslation(); //multi-language support
  const gridRef = useRef<AgGridReactType>(null);
  const pieOptions = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "50%"],
        data: [
          { value: 75, name: t("active"), itemStyle: { color: "#52c41a" } },
          { value: 25, name: t("inactive"), itemStyle: { color: "#f5222d" } },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          show: true,
          formatter: "{b}: {d}%",
        },
      },
    ],
  };

  const connectionPieOptions = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "55%"],
        data: [
          { value: 892, name: t("online"), itemStyle: { color: "#52c41a" } },
          { value: 342, name: t("offline"), itemStyle: { color: "#f5222d" } },
        ],
        label: {
          show: true,
          formatter: "{b}: {d}%",
        },
        labelLine: {
          length: 20,
          length2: 10,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
    graphic: {
      type: "text",
      left: "center",
      top: "center",
    },
  };

  const lineOptions = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [12, 19, 15, 22, 18, 14, 10],
        type: "line",
        smooth: true,
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };

  const cardStyle = {
    paddingTop: "0px",
    paddingBottom: "0px",
    height: "190px",
    width: "100%",
  };

  const columns = [
    { headerName: t("state"), field: "state" },
    {
      headerName: t("object"),
      field: "object",
      cellRenderer: (params: { value: string }) => {
        const objectName = params.value;
        const url = `/malops-management/detail/${objectName}`;
        return (
          <div className="flex items-center">
            <p>{getFileIcon(objectName)}</p>{" "}
            <Link href={url} className="ml-2 text-blue-500 underline">
              {objectName}
            </Link>
          </div>
        );
      },
    },
    { headerName: t("group"), field: "group" },
    {
      headerName: t("affectedMachines"),
      field: "affectedMachines",
      cellRenderer: (params: { value: string }) => {
        return (
          <div className="flex items-center justify-center">
            <p className=" ">{getFileIcon("computer")}</p>
            <span className="ml-2">{params?.value || ""}</span>
          </div>
        );
      },
    },
    {
      headerName: t("affectedUsers"),
      field: "affectedUsers",
      cellRenderer: (params: { value: string }) => {
        return (
          <div className="flex items-center justify-center">
            <p className=" ">{getFileIcon("user")}</p>
            <span className="ml-2">{params?.value}</span>
          </div>
        );
      },
    },
    { headerName: t("detectionDescription"), field: "description" },
    { headerName: t("detectionModules"), field: "modules" },
    { headerName: t("time"), field: "time" },
  ];

  const rowData = [
    {
      state: "Active",
      object: "File",
      group: "Group A",
      affectedMachines: "2",
      affectedUsers: "20",
      description: "Detected unusual activity from file cerber.exe",
      modules: "Module 1",
      time: "2024-11-01 10:00:00",
    },
  ];

  const onExportClick = useCallback(() => {
    // if (gridRef?.current?.api) {
    //   gridRef?.current?.api?.exportDataAsCsv();
    // }
  }, []);

  return (
    <div className="pb-20 gap-16 sm:py-20 font-[family-name:var(--font-geist-sans)]">
      <Row gutter={[16, 16]} className="w-full">
        <Col xs={24} sm={12} lg={6}>
          <Card
            title={
              <span>
                <PieChartOutlined
                  className="mr-2 text-blue-500"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                {t("active_ratio")}
              </span>
            }
            style={cardStyle}
          >
            <div className="flex items-center justify-center h-[calc(100%-32px)]">
              <ReactECharts
                option={pieOptions}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            title={
              <span>
                <DesktopOutlined
                  className="mr-2 text-green-500"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                {t("total_endpoint")}
              </span>
            }
            style={cardStyle}
          >
            <div className="flex flex-col items-center justify-center h-[calc(100%-32px)]">
              <span className="text-4xl font-bold mt-4">1,234</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            title={
              <span>
                <WifiOutlined
                  className="mr-2 text-purple-500"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                {t("connection_status")}
              </span>
            }
            style={cardStyle}
          >
            <div className="flex items-center justify-center h-[calc(100%-32px)]">
              <ReactECharts
                option={connectionPieOptions}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            title={
              <span>
                <AlertOutlined
                  className="text-orange-500"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                {t("weekly_alerts")}
              </span>
            }
            style={cardStyle}
          >
            <div className="flex items-center justify-center h-[calc(100%-32px)]">
              <ReactECharts
                option={lineOptions}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Card className="mt-3 py-6">
        <div style={{ marginBottom: 10, display: "flex", gap: "10px" }}>
          <button
            onClick={onExportClick}
            style={{
              backgroundColor: "#f7c31c",
              color: "black",
              padding: "5px 15px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {t("export_csv")}
          </button>
          <input
            type="text"
            placeholder="Search..."
            onChange={() => {
              if (gridRef.current?.api) {
                // gridRef.current.api.setQuickFilter(e.target.value);
              }
            }}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              flex: "1",
            }}
          />
        </div>

        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columns}
            rowSelection="multiple"
            pagination={true}
            paginationPageSize={5}
            defaultColDef={{
              sortable: true,
              filter: true,
              floatingFilter: true,
              resizable: true,
            }}
          />
        </div>
      </Card>
    </div>
  );
}
