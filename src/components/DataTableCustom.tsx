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
  const gridRef = useRef<any>(null);
  const [pagination, setPagination] = useState({ skip: 0, limit: 10 });
  const { mutation, contextHolder } = usePostApi(apiUrl, false);
  const bodyData = body || {};

  const fetchData = () => {
    mutation.mutate(
      {
        start_date: startDate,
        end_date: endDate,
        skip: pagination.skip,
        limit: pagination.limit,
        ...bodyData,
      },
      {
        onSuccess: (response: any) => {
          console.log("API response:", response);
          if (response?.data?.[dataFieldName]) {
            // Set the row count if available
            if (gridRef.current?.api?.setRowCount) {
              gridRef.current.api.setRowCount(response.data.countTotal || 0);
            }
            // Update the data state to table with the fetched data
            setData(response.data[dataFieldName]);
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
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, pagination]);

  const onPaginationChanged = useCallback(() => {
    if (gridRef.current) {
      const api = gridRef.current.api;
      const pageSize = api.paginationGetPageSize();
      const currentPage = api.paginationGetCurrentPage();

      setPagination((prev) => {
        const newPagination = {
          skip: currentPage * pageSize,
          limit: pageSize,
        };
        return JSON.stringify(prev) === JSON.stringify(newPagination)
          ? prev
          : newPagination;
      });
    }
  }, []);

  const onRowDoubleClicked = (event: any) => {
    setSelectedRow(event.data);
    setIsDrawerOpen(true);
  };

  const onExportClick = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv();
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
            paginationPageSize={pagination.limit}
            paginationPageSizeSelector={[10, 25, 50, 100]} // Cho phép chọn số dòng mỗi trang
            defaultColDef={{
              sortable: true,
              resizable: true,
            }}
            onRowDoubleClicked={onRowDoubleClicked}
            onPaginationChanged={onPaginationChanged}
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
