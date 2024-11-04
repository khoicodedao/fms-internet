"use client";
import {
  DesktopOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileOutlined,
  LinkOutlined,
  GlobalOutlined,
  BugOutlined,
} from "@ant-design/icons";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
interface QueryData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  details: string;
  status: "active" | "archived";
}
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import type { ColumnDef } from "@tanstack/react-table";

import React from "react";
export default function Investigation() {
  const columns: ColumnDef<QueryData>[] = [
    {
      header: "Query Title",
      accessorKey: "title",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.status === "active" ? (
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
      title: "Suspicious Process Query",
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
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
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-gray-50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-500"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded"
              >
                Previous
              </button>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
