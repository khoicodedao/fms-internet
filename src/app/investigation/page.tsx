"use client";
import React from "react";
import { AgGridReact } from "ag-grid-react";
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
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import type { ColDef } from "ag-grid-community";
import Link from "next/link";

interface QueryData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  details: string;
  status: "active" | "archived";
}

export default function Investigation() {
  const columns: ColDef[] = [
    {
      headerName: "Query Title",
      field: "title",
      cellRenderer: (params: any) => (
        <Link href={`/malops-management/detail/${params.value}`}>
          {params.value}
        </Link>
      ),
    },
    { headerName: "Description", field: "description" },
    { headerName: "Created At", field: "createdAt" },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          {params.value === "active" ? (
            <>
              <CheckCircleOutlined
                className="text-green-500"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <span className="text-green-500">Active</span>
            </>
          ) : (
            <>
              <StopOutlined
                className="text-red-500"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <span className="text-red-500">Inactive</span>
            </>
          )}
        </div>
      ),
    },
  ];

  const data: QueryData[] = [
    {
      id: "1",
      title: "Cerber.exe",
      description: "Detect unusual process activities",
      createdAt: "2024-01-15",
      details: "Detailed monitoring information",
      status: "active",
    },
    {
      id: "2",
      title: "Network Traffic Analysis",
      description: "Analyze network traffic patterns",
      createdAt: "2024-01-15",
      details: "Detailed monitoring information",
      status: "active",
    },
    {
      id: "3",
      title: "File Integrity Monitoring",
      description: "Monitor file changes and integrity",
      createdAt: "2024-01-15",
      details: "Detailed monitoring information",
      status: "archived",
    },
    // Add more data
  ];

  const items = [
    { icon: DesktopOutlined, label: "Machine" },
    { icon: UserOutlined, label: "User" },
    { icon: AppstoreOutlined, label: "Process" },
    { icon: FileOutlined, label: "File" },
    { icon: LinkOutlined, label: "Connection" },
    { icon: GlobalOutlined, label: "Domain name" },
    { icon: BugOutlined, label: "Malop Process" },
  ];

  return (
    <div className="grid py-4 pb-20 gap-3 sm:pt-20 font-[family-name:var(--font-geist-sans)]">
      <div
        style={{ background: "#FCFBFB" }}
        className="grid p-4 pb-20 gap-3  font-[family-name:var(--font-geist-sans)]"
      >
        <h2 className="text-2xl ml-4 pt-7 font-bold text-gray-800 mb-4">
          Build a query
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
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            My Saved Queries
          </h2>
          <div
            className="ag-theme-alpine"
            style={{ height: 400, width: "100%" }}
          >
            <AgGridReact
              rowData={data}
              columnDefs={columns}
              pagination={true}
              defaultColDef={{
                sortable: true,
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
