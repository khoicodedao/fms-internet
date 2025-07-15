/* eslint-disable*/
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { usePostApi } from "@/common/usePostApi";
import { Button, Card, Drawer, Pagination, Select } from "antd";
import ReactJson from "react-json-view";
import DatetimePicker from "@/components/DatetimePicker";
import { useDateContext } from "@/common/date-context";
import SearchBar from "@/components/SearchBar";
import { useTranslation } from "react-i18next";
import { ExportOutlined } from "@ant-design/icons";
// @ts-ignore
import { unparse } from "papaparse";

interface DataTableProps {
  title?: string;
  apiUrl: string;
  columns: ColDef[];
  dataFieldName: string;
  body?: any;
  reload?: boolean; // Add onReload prop
  showFilter?: boolean; // Add showFilter prop
  showDatepicker?: boolean; // Add showDatepicker prop
  HeaderDrawer?: React.ReactNode; //show component here
  tableHeight?: string;
}

export default function DataTable({
  apiUrl,
  title,
  columns,
  dataFieldName,
  body,
  reload,
  showFilter = true,
  showDatepicker = true,
  HeaderDrawer,
  tableHeight = "calc(100vh - 220px)",
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState(""); // State để lưu giá trị tìm kiếm
  const handleSearch = (query: string) => {
    setPagination({ ...pagination, current: 1 }); // Reset trang về 1 khi tìm kiếm
    setSearchQuery(query.replaceAll('"', "'")); // Cập nhật state khi nhận giá trị từ component con
  };
  const { t } = useTranslation();
  const { startDate, endDate } = useDateContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [exportMode, setExportMode] = useState<"current" | "all">("current");

  const [data, setData] = useState([]); // Dữ liệu hiển thị trong bảng
  const gridRef = useRef<any>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50 });
  const [rowTotal, setRowTotal] = useState(0); // Tổng số row từ API
  const { mutation, contextHolder } = usePostApi(apiUrl, false);
  const bodyData = body || "";
  const idColumn: ColDef = {
    headerName: "#",
    field: "autoId",
    width: 70,
    pinned: "left",
    valueGetter: (params) => {
      const rowIndex = params.node?.rowIndex;
      if (rowIndex !== undefined) {
        //@ts-ignore
        return (pagination.current - 1) * pagination.pageSize + rowIndex + 1;
      }
      return null;
    },
  };
  const columnDefs = [idColumn, ...columns];
  // Fetch data từ API
  const fetchData = () => {
    mutation.mutate(
      {
        filter: searchQuery ? searchQuery + " and " + bodyData : bodyData,
        start_date: startDate,
        end_date: endDate,
        skip: (pagination.current - 1) * pagination.pageSize,
        limit: pagination.pageSize,
        // ...bodyData,
      },
      {
        onSuccess: (response: any) => {
          if (response?.data?.[dataFieldName]) {
            setRowTotal(response.data.countTotal); // Lưu tổng số row
            setData(response.data[dataFieldName]); // Lưu dữ liệu bảng
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
  }, [
    startDate,
    endDate,
    pagination.current,
    pagination.pageSize,
    searchQuery,
  ]);
  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [reload]);

  // Sự kiện khi đổi trang
  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize });
  };

  // Sự kiện khi nhấn double-click vào row
  const onRowDoubleClicked = (event: any) => {
    setSelectedRow(event.data);
    setIsDrawerOpen(true);
  };

  // Xuất CSV
  const onExportClick = useCallback(() => {
    if (exportMode === "current") {
      gridRef.current?.api.exportDataAsCsv();
    } else {
      mutation.mutate(
        {
          filter: searchQuery ? searchQuery + " and " + bodyData : bodyData,
          start_date: startDate,
          end_date: endDate,
          skip: 0,
          limit: 2000,
        },
        {
          onSuccess: (response: any) => {
            const allData = response?.data?.[dataFieldName];
            if (allData?.length) {
              const csv = unparse(allData); // Convert JSON -> CSV

              // Tạo và tải file CSV
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "export-all.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              console.warn("No data to export");
            }
          },
          onError: (error: any) => {
            console.error("Failed to export all data:", error);
          },
        }
      );
    }
  }, [exportMode, searchQuery, startDate, endDate]);

  return (
    <div className="gap-16 font-[family-name:var(--font-geist-sans)]">
      {contextHolder}
      <Card>
        <div className="flex justify-between items-center mb-4">
          {title && (
            <p className="text-gray-600 text-sm leading-relaxed font-bold">
              {title}
            </p>
          )}
          {showDatepicker && <DatetimePicker />}
        </div>

        {showFilter && (
          <div style={{ marginBottom: 10, display: "flex", gap: "10px" }}>
            <Select
              defaultValue="current"
              style={{ width: 160 }}
              // @ts-ignore
              onChange={(value) => setExportMode(value)}
              options={[
                {
                  label: t("export_current_page") || "Export current page",
                  value: "current",
                },
                {
                  label: t("export_all_data") || "Export all data",
                  value: "all",
                },
              ]}
            />
            <Button
              icon={
                <ExportOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              }
              onClick={onExportClick}
              type="primary"
            >
              {t("export_csv")}
            </Button>
            <SearchBar onSearch={handleSearch} />
          </div>
        )}

        {/* Table */}
        <div
          className="ag-theme-alpine"
          style={{ height: tableHeight, width: "100%" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={data}
            columnDefs={columnDefs}
            pagination={false} // Tắt phân trang mặc định của AgGrid
            onRowDoubleClicked={onRowDoubleClicked}
          />
        </div>

        {/* Phân trang Ant Design */}
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={rowTotal} // Tổng số row từ API
            showSizeChanger
            pageSizeOptions={[10, 25, 50, 100]}
            onChange={onPaginationChange}
          />
        </div>
      </Card>

      {/* Drawer hiển thị chi tiết dữ liệu */}
      <Drawer
        title={
          HeaderDrawer && typeof HeaderDrawer === "function"
            ? // @ts-ignore
              HeaderDrawer({ selectedRow })
            : "Detail"
        }
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
