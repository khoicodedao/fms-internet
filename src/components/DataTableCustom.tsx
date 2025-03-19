import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { usePostApi } from "@/common/usePostApi";
import { Card, Drawer, Pagination } from "antd";
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
  const [searchQuery, setSearchQuery] = useState(""); // State để lưu giá trị tìm kiếm
  const handleSearch = (query: string) => {
    setPagination({ ...pagination, current: 1 }); // Reset trang về 1 khi tìm kiếm
    setSearchQuery(query.replaceAll('"', "'")); // Cập nhật state khi nhận giá trị từ component con
  };
  const { t } = useTranslation();
  const { startDate, endDate } = useDateContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [data, setData] = useState([]); // Dữ liệu hiển thị trong bảng
  const gridRef = useRef<any>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [rowTotal, setRowTotal] = useState(0); // Tổng số row từ API
  const { mutation, contextHolder } = usePostApi(apiUrl, false);
  const bodyData = body || {};

  // Fetch data từ API
  const fetchData = () => {
    mutation.mutate(
      {
        filter: searchQuery,
        start_date: startDate,
        end_date: endDate,
        skip: (pagination.current - 1) * pagination.pageSize,
        limit: pagination.pageSize,
        ...bodyData,
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
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Table */}
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            columnDefs={columns}
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
