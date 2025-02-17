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
  defaultData?: any;
}

export default function DataTable({
  apiUrl,
  title,
  columns,
  dataFieldName,
  defaultData,
}: DataTableProps) {
  const { t } = useTranslation();
  const { startDate, endDate } = useDateContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [data, setData] = useState([]);
  const gridRef = useRef(null);

  const { mutation, contextHolder } = usePostApi(apiUrl, false);

  useEffect(() => {
    mutation.mutate(
      {
        start_date: startDate.format("YYYY-MM-DD HH:mm:ss"),
        end_date: endDate.format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        onSuccess: (response: any) => {
          setData(response.data.map((item: any) => item[dataFieldName]));
        },
        onError: () => {
          setData(defaultData);
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
          <SearchBar></SearchBar>
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
