/* eslint-disable */
"use client";
import { Card, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Link từ Next.js
import {
  DesktopOutlined,
  FileOutlined,
  AppstoreOutlined,
  LinkOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
// import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useTranslation } from "react-i18next";
import QueryFlowBuilder from "./query-builder/query-flow-builder";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
type Filter = {
  id: number;
  filter_name: string;
  filter_description: string;
  filters: { filter: string; object: string }[]; // array of object
  start_time: string;
  end_time: string;
  created_at: string;
};
// import ReactJson from "react-json-view";
import dynamic from "next/dynamic";

// Tắt SSR cho ReactJson
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

// Tắt SSR cho AgGridReact
const AgGridReact = dynamic(
  () => import("ag-grid-react").then((mod) => mod.AgGridReact),
  { ssr: false }
);
export default function MalOpsManagement() {
  const { mutation: mutationList } = usePostApi(
    API_URL.MALOPS_PAGE.DEFAULT,
    false
  );
  const { mutation: mutationAdd, contextHolder: contextAdd } = usePostApi(
    API_URL.MALOPS_PAGE.ADD,
    false
  );
  const { mutation: mutationDelete } = usePostApi(
    API_URL.MALOPS_PAGE.DELETE,
    true
  );
  const { mutation: mutationEdit, contextHolder: contextEdit } = usePostApi(
    API_URL.MALOPS_PAGE.EDIT,
    true
  );
  const { t } = useTranslation(); // multi-language support
  const [filter, setFilter] = useState<any>(null);
  const [filterName, setFilterName] = useState<string>("");
  const [filterDescription, setFilterDescription] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const items = [
    {
      icon: DesktopOutlined,
      label: t("machine"),
      fields: [
        { name: "internal_ip", label: "internal_ip" },
        { name: "public_ip", label: "public_ip" },
        { name: "os", label: "os" },
        { name: "last_seen", label: "last_seen" },
        { name: "cpu_use", label: "cpu_use" },
        { name: "mac_address", label: "mac_address" },
        { name: "version string", label: "version string" },
        { name: "last_update", label: "last_update" },
        { name: "is_remote", label: "is_remote" },
        { name: "machine_name", label: "machine_name" },
        { name: "memory_use", label: "memory_use" },
      ],
    },
    {
      icon: AppstoreOutlined,
      label: t("process"),
      fields: [
        { name: "mac", label: "mac" },
        { name: "ip", label: "ip" },
        { name: "computer_name", label: "computer_name" },
        { name: "alert_time", label: "alert_time" },
        { name: "object", label: "object" },
        { name: "action", label: "action" },
        { name: "fields.command_line", label: "fields.command_line" },
        {
          name: "fields.image_path_created",
          label: "fields.image_path_created",
        },
        { name: "fields.exe", label: "fields.exe" },
        {
          name: "fields.current_working_directory",
          label: "fields.current_working_directory",
        },
        { name: "fields.pid", label: "fields.pid" },
        { name: "fields.ppid", label: "fields.ppid" },
        { name: "fields.file_path", label: "fields.file_path" },
        { name: "fields.extention", label: "fields.extention" },
        { name: "fields.md5_hash", label: "fields.md5_hash" },
        { name: "fields.sha1_hash", label: "fields.sha1_hash" },
        { name: "fields.sha256_hash", label: "fields.sha256_hash" },
        { name: "fields.fqdn", label: "fields.fqdn" },
        { name: "fields.host_name", label: "fields.host_name" },
        { name: "fields.integrity_level", label: "fields.integrity_level" },
        { name: "fields.sid", label: "fields.sid" },
        { name: "fields.user", label: "fields.user" },
        { name: "fields.uid", label: "fields.uid" },
        { name: "fields.signature_valid", label: "fields.signature_valid" },
        { name: "fields.signer", label: "fields.signer" },
        { name: "fields.access_level", label: "fields.access_level" },
        { name: "fields.call_trace", label: "fields.call_trace" },
        { name: "fields.env_vars", label: "fields.env_vars" },
        { name: "fields.guid", label: "fields.guid" },
        {
          name: "fields.parent_commandline",
          label: "fields.parent_commandline",
        },
        { name: "fields.parent_guid", label: "fields.parent_guid" },
        { name: "fields.target_address", label: "fields.target_address" },
        { name: "fields.target_guid", label: "fields.target_guid" },
        { name: "fields.target_name", label: "fields.target_name" },
        { name: "fields.target_pid", label: "fields.target_pid" },
        { name: "alert_type", label: "alert_type" },
        { name: "alert_source", label: "alert_source" },
        { name: "alert_level_id", label: "alert_level_id" },
        { name: "event_time", label: "event_time" },
        { name: "time_send", label: "time_send" },
        { name: "created_at", label: "created_at" },
      ],
    },
    {
      icon: FileOutlined,
      label: t("file"),
      fields: [
        { name: "file_name", label: "file_name" },
        { name: "file_path", label: "file_path" },
        { name: "file_size", label: "file_size" },
        { name: "file_type", label: "file_type" },
        { name: "file_extention", label: "file_extention" },
        { name: "file_md5", label: "file_md5" },
        { name: "file_sha1", label: "file_sha1" },
        { name: "file_sha256", label: "file_sha256" },
        { name: "file_sha512", label: "file_sha512" },
        { name: "file_ssdeep", label: "file_ssdeep" },
        { name: "file_imphash", label: "file_imphash" },
        { name: "file_version", label: "file_version" },
      ],
    },
    {
      icon: LinkOutlined,
      label: t("connection"),
      fields: [
        { name: "mac", label: "mac" },
        { name: "ip", label: "ip" },
        { name: "computer_name", label: "computer_name" },
        { name: "alert_time", label: "alert_time" },
        { name: "object", label: "object" },
        { name: "action", label: "action" },
        { name: "fields.family", label: "fields.family" },
        { name: "fields.image_path", label: "fields.image_path" },
        { name: "fields.local_address", label: "fields.local_address" },
        { name: "fields.local_port", label: "fields.local_port" },
        { name: "fields.pid", label: "fields.pid" },
        { name: "fields.protocol", label: "fields.protocol" },
        { name: "fields.remote_address", label: "fields.remote_address" },
        { name: "fields.remote_port", label: "fields.remote_port" },
        { name: "fields.success", label: "fields.success" },
        { name: "alert_type", label: "alert_type" },
        { name: "alert_source", label: "alert_source" },
        { name: "alert_level_id", label: "alert_level_id" },
        { name: "event_time", label: "event_time" },
        { name: "time_send", label: "time_send" },
        { name: "created_at", label: "created_at" },
      ],
    },
  ];
  const [fields, setFields] = useState<any[]>(items[0].fields || []);
  const [label, setLabel] = useState<string>(items[0].label || "");
  const [rowData, setRowData] = useState<Filter[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gridColumnApi, setGridColumnApi] = useState<any>(null);

  const columnDefs = [
    {
      headerName: t("#"),
      width: 100,
      field: "id",
      cellClass: "text-center",
      cellRenderer: (params: any) => {
        return (
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => handleDelete(params.data.id)}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        );
      },
    },
    { headerName: "ID", field: "id", width: 80 },
    {
      headerName: "Tên Filter",
      field: "filter_name",
      editable: true,
      cellRenderer: (params: any) => {
        return (
          <Link href={`/malops-management/detail/${params.data.id}`}>
            {params.value}
          </Link>
        );
      },
    },
    { headerName: "Mô tả", field: "filter_description", editable: true },
    {
      headerName: "Filters",
      field: "filters",
      cellRenderer: (params: any) => {
        return (
          <ReactJson
            src={params.value} // Dữ liệu JSON
            name={false} // Không hiển thị tên gốc
            collapsed={true} // Thu gọn JSON mặc định
            enableClipboard={false} // Tắt tính năng copy
            displayDataTypes={false} // Ẩn kiểu dữ liệu
            style={{ fontSize: "12px" }} // Tùy chỉnh kích thước chữ
          />
        );
      },
    },
    { headerName: "Từ", field: "start_time", editable: true },
    { headerName: "Đến", field: "end_time", editable: true },
    { headerName: "Tạo lúc", field: "created_at" },
  ];

  const onGridReady = (params: any) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleAdd = () => {
    if (
      !filterName ||
      !filterDescription ||
      !startTime ||
      !endTime ||
      !filter
    ) {
      console.log(filter);
      message.error("Vui lòng nhập đầy đủ thông tin!"); // Sử dụng Ant Design message
      return;
    }

    console.log(filter);
    mutationAdd.mutate({
      filter_name: filterName,
      filter_description: filterDescription,
      filters: filter,
      start_time: startTime,
      end_time: endTime,
    });
  };

  const handleEdit = (updatedFilter: Filter) => {
    mutationEdit.mutate({
      id: updatedFilter.id,
      filter_name: updatedFilter.filter_name,
      filter_description: updatedFilter.filter_description,
      filters: updatedFilter.filters,
      start_time: updatedFilter.start_time,
      end_time: updatedFilter.end_time,
    });
  };

  const handleDelete = (id: string) => {
    mutationDelete.mutate({ id });
  };

  // Lấy dữ liệu đã thay đổi
  const getUpdatedData = () => {
    const updatedRows: any[] = [];
    gridApi.getEditingCells().forEach((cell: any) => {
      const rowNode = gridApi.getRowNode(cell.rowIndex);
      if (rowNode) {
        updatedRows.push(rowNode.data);
      }
    });
    return updatedRows;
  };

  // Lưu dữ liệu đã thay đổi
  const handleUpdate = () => {
    const updatedRows = getUpdatedData();
    updatedRows.forEach((row: Filter) => {
      handleEdit(row);
    });
  };
  useEffect(() => {
    mutationList.mutate(
      {
        start_date: "2025-03-31",
        end_date: "2026",
        skip: 0,
        limit: 50,
        filter: "",
      },
      {
        onSuccess: (data) => {
          // Kiểm tra nếu data là mảng, nếu không thì gán giá trị mặc định là mảng rỗng
          if (data && data.data.investigation) {
            setRowData(data.data.investigation); // Gán dữ liệu vào state rowData
          } else {
            console.error("API trả về dữ liệu không phải là mảng:", data);
            setRowData([]);
          }
        },
        onError: (error) => {
          console.error("Lỗi khi gọi API:", error);
          setRowData([]); // Gán giá trị mặc định nếu có lỗi
        },
      }
    );
  }, []);

  return (
    <div className="pb-20 gap-16 sm:py-10 font-[family-name:var(--font-geist-sans)]">
      {contextAdd}
      {contextEdit}
      <Row gutter={[16, 16]} className="w-full items-start justify-around">
        <div className="flex-1 p-4 pb-20 gap-3  font-[family-name:var(--font-geist-sans)]">
          <h2 className="text-2xl ml-4 pt-7 font-bold text-gray-800 mb-4">
            {t("build_query")}
          </h2>
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full  ${
                    activeIndex == index ? "bg-[#F6BD03]" : "bg-[#F2F2F2]"
                  }  flex items-center justify-center border border-gray-30 cursor-pointer`}
                  onClick={() => {
                    setFields(item.fields || []);
                    setLabel(item.label || "");
                    setActiveIndex(index);
                  }}
                >
                  {React.createElement(item.icon)}
                </div>
                <span className="text-sm text-center">{item.label}</span>
              </div>
            ))}
          </section>
          <Card className="mt-4">
            <div className="mb-4">
              <p>Tên Filter:</p>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label>Mô tả Filter:</label>
              <input
                type="text"
                value={filterDescription}
                onChange={(e) => setFilterDescription(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label>Filter:</label>
              <ReactJson
                src={filter} // Dữ liệu JSON
                name={false} // Không hiển thị tên gốc
                collapsed={false} // Thu gọn JSON mặc định
                enableClipboard={false} // Tắt tính năng copy
                displayDataTypes={false} // Ẩn kiểu dữ liệu
                style={{ fontSize: "12px" }} // Tùy chỉnh kích thước chữ
              />
            </div>
            <div className="mb-4">
              <label>Thời gian bắt đầu:</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label>Thời gian kết thúc:</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <button
              onClick={handleAdd}
              style={{
                marginBottom: "10px",
                padding: "10px",

                color: "white",
              }}
              className="ant-btn ant-btn-primary"
            >
              Thêm Filter
            </button>
          </Card>
        </div>
        <div className="flex-1 min-w-[300px]">
          <QueryFlowBuilder
            label={label}
            //@ts-ignore
            setFilters={setFilter}
            fields={fields}
          />
        </div>
      </Row>
      <Card className="py-6">
        <button
          onClick={handleUpdate}
          style={{
            marginBottom: "10px",
            padding: "10px",
            background: "#34B7F1",
            color: "white",
          }}
          className="ant-btn ant-btn-primary"
        >
          Cập nhật dữ liệu
        </button>
        <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            columnDefs={columnDefs}
            rowData={rowData}
            pagination={true}
            domLayout="autoHeight"
            onGridReady={onGridReady}
            enableRangeSelection={true}
          />
        </div>
      </Card>
    </div>
  );
}
