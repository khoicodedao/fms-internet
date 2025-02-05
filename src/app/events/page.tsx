"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import { Card, Drawer } from "antd"; // Add Drawer import
import ReactJson from "react-json-view";
export default function Events() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const onRowDoubleClicked = (event: any) => {
    setSelectedRow(event.data);
    setIsDrawerOpen(true);
  };

  const { mutation, contextHolder } = usePostApi(
    API_URL.EVENT_PAGE.DEFAULT,
    true
  );
  const [data, setData] = useState([]);
  useEffect(() => {
    mutation.mutate(
      {
        start_date: "2024",
        end_date: "2026",
      },
      {
        onSuccess: (response: any) => {
          setData(response.data.map((item: any) => item._source)); //test response data from API
        },
      }
    );
  }, []);
  const gridRef = useRef(null);
  const columns: ColDef<RowData>[] = [
    { headerName: "Mac", field: "mac" },
    { headerName: "IP", field: "ip" },
    { headerName: "Computer Name", field: "computer_name" },
    { headerName: "Alert Source", field: "alert_source" },
    { headerName: "Alert Level ID", field: "alert_level_id" },
    { headerName: "Event Time", field: "event_time" },
  ];
  type RowData = {
    mac: string;
    ip: string;
    computer_name: string;
    alert_source: string;
    alert_level_id: string;
    event_time: string;
  };

  const onExportClick = useCallback(() => {
    // gridRef.current.api.exportDataAsCsv();
  }, []);

  return (
    <div className="pb-20 gap-16 sm:py-20 font-[family-name:var(--font-geist-sans)]">
      {contextHolder}
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
            // onChange={(e) => gridRef.current.api.setQuickFilter(e.target.value)}
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
            rowData={data}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={5}
            defaultColDef={{
              sortable: true,
              filter: true,
              floatingFilter: true, // Adds a floating filter box under each column
              resizable: true,
            }}
            onRowDoubleClicked={onRowDoubleClicked}
          />
        </div>
      </Card>
      <Drawer
        title="Row Details"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={800}
      >
        {selectedRow && (
          <ReactJson
            src={selectedRow}
            theme="monokai"
            displayDataTypes={false}
            enableClipboard={true}
            style={{ padding: "10px" }}
          />
        )}
      </Drawer>
    </div>
  );
}
