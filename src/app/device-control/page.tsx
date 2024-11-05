"use client";
import { Card } from "antd";
import React, { useCallback, useRef } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
export default function MalOpsManagement() {
  const gridRef = useRef(null);
  const columns = [
    { headerName: "Vendor Name", field: "vendor_name" },
    { headerName: "Product Name", field: "product_name" },
    { headerName: "User", field: "user" },
    { headerName: "Machine", field: "machine" },
    { headerName: "Status", field: "status" },
    { headerName: "Last Connection", field: "last_connection" },
  ];

  const rowData = [
    {
      vendor_name: "Vendor A",
      product_name: "Product A",
      user: "User 1",
      machine: "Machine 1",
      status: "Active",
      last_connection: "2023-11-01 10:00:00",
    },
    // Add more rows here
  ];
  const onExportClick = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  return (
    <div className="pb-20 gap-16 sm:py-20 font-[family-name:var(--font-geist-sans)]">
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
