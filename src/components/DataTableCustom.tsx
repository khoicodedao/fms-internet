"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { usePostApi } from "@/common/usePostApi";
import { Card, Drawer } from "antd";
import ReactJson from "react-json-view";
import DatetimePicker from "@/components/DatetimePicker";
import { useDateContext } from "@/common/date-context";
import SearchBar from "@/components/SearchBar";
import { useTranslation } from "react-i18next";

interface DataTableProps {
  title?: string;
  apiUrl: string;
  columns: ColDef[];
  dataFieldName: string;
  body?: any;
}

export default function DataTable({
  apiUrl,
  title,
  columns,
  dataFieldName,
  body,
}: DataTableProps) {
  const { t } = useTranslation();
  const { startDate, endDate } = useDateContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [data, setData] = useState([]);
  const gridRef = useRef(null);

  const { mutation, contextHolder } = usePostApi(apiUrl, false);
  const bodyData = body || {};
  useEffect(() => {
    mutation.mutate(
      {
        start_date: startDate,
        end_date: endDate,
        skip: 0,
        limit: 50,
        ...bodyData,
      },
      {
        onSuccess: (response: any) => {
          console.log("API response:", response);
          if (response && response.data && response.data[dataFieldName]) {
            const dataRes = response.data[dataFieldName].map(
              (item: any) => item
            );
            console.log("Mapped data:", dataRes);
            setData(dataRes);
          } else {
            console.error("Unexpected API response format:", response);
            setData([]);
          }
        },
        onError: (error: any) => {
          console.error("API call failed:", error);
          setData([]);
        },
      }
    );
  }, [startDate, endDate]);

  const onRowDoubleClicked = (event: any) => {
    setSelectedRow(event.data);
    setIsDrawerOpen(true);
  };

  const onExportClick = useCallback(() => {
    if (gridRef.current) {
      (gridRef.current as any).api.exportDataAsCsv();
    }
  }, []);

  return (
    <div className="gap-16 font-[family-name:var(--font-geist-sans)]">
      {contextHolder}
      <Card className="mt-3 py-6">
        <div className="flex justify-between items-center mb-4">
          {title && (
            <p className="text-gray-600 text-sm leading-relaxed font-bold">
              {title}
            </p>
          )}
          <DatetimePicker />
        </div>

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
          <SearchBar />
        </div>

        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={5}
            defaultColDef={{
              sortable: true,
              resizable: true,
            }}
            onRowDoubleClicked={onRowDoubleClicked}
          />
        </div>
      </Card>

      <Drawer
        title="Data Details"
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
