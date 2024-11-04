"use client";
import { Card, Row, Col } from "antd";
import React, { useCallback, useState, useRef } from "react";
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
export default function MalOpsManagement() {
  const gridRef = useRef(null);
  const [visibleColumns, setVisibleColumns] = useState({
    state: true,
    subject: true,
    group: true,
    affectedMachines: true,
    affectedUsers: true,
    description: true,
    modules: true,
    time: true,
  });
  const pieOptions = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "50%"], // Thin donut chart
        data: [
          { value: 75, name: "Active", itemStyle: { color: "#52c41a" } },
          { value: 25, name: "Inactive", itemStyle: { color: "#f5222d" } },
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
          { value: 892, name: "Online", itemStyle: { color: "#52c41a" } },
          { value: 342, name: "Offline", itemStyle: { color: "#f5222d" } },
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
    height: "150px",
    width: "100%",
  };
  const columns = [
    { headerName: "State", field: "state" },
    { headerName: "Subject", field: "subject" },
    { headerName: "Group", field: "group" },
    { headerName: "Affected Machines", field: "affectedMachines" },
    { headerName: "Affected Users", field: "affectedUsers" },
    { headerName: "Detection Description", field: "description" },
    { headerName: "Detection Modules", field: "modules" },
    { headerName: "Time", field: "time" },
  ];

  const rowData = [
    {
      state: "Active",
      subject: "Malware",
      group: "Group A",
      affectedMachines: "Machine 1, 2",
      affectedUsers: "User 1, 2",
      description: "Detected unusual activity.",
      modules: "Module 1",
      time: "2024-11-01 10:00:00",
    },
    // Add more rows here
  ];
  const onExportClick = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
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
                Active Ratio
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
                Total Endpoints
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
                Connection Status
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
                Weekly Alerts
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
        {/* Toolbar for search and export */}
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
            Export CSV
          </button>
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => gridRef.current.api.setQuickFilter(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              flex: "1",
            }}
          />
        </div>

        {/* AG Grid Table */}
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={5}
            defaultColDef={{
              sortable: true,
              filter: true,
              floatingFilter: true, // Adds a floating filter box under each column
              resizable: true,
            }}
          />
        </div>
      </Card>
    </div>
  );
}
