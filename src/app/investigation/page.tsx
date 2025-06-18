/* eslint-disable */
"use client";
import React, { useState } from "react";
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
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import API_URL from "@/common/api-url";
import dynamic from "next/dynamic";
import formatDateTime from "@/common/formatDate";

const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
import { usePostApi } from "@/common/usePostApi";

import QueryFlowBuilder from "./query-builder/query-flow-builder";
import Link from "next/link";
// import { Collapse } from "antd";
export default function Investigation() {
  const { t } = useTranslation(); //multi-language support
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
    // { icon: UserOutlined, label: t("user") },
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
    { icon: LinkOutlined, label: t("connection") },
    // { icon: GlobalOutlined, label: t("domain_name") },
    // { icon: BugOutlined, label: t("malop_process") },
  ];
  const [reload, setReload] = React.useState(false);
  const [fields, setFields] = useState<any[]>(items[0].fields || []);
  const { mutation: mutationDelete, contextHolder: contextHolderDelete } =
    usePostApi(API_URL.INVESTIGATION_PAGE.DELETE, true);
  const onDelete = (id: string) => {
    mutationDelete.mutate(
      {
        id: id,
      },
      {
        onSuccess: (response: any) => {
          setReload(!reload);
        },
      }
    );
  };

  const columns = [
    {
      headerName: t("Function"),
      width: 100,
      field: "id",
      cellRenderer: (params: any) => {
        return (
          //@ts-ignore
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => onDelete(params.data.id)}
          />
        );
      },
    },

    {
      headerName: "Description",
      field: "description",
      width: 200,
      cellRenderer: (params: any) => {
        return (
          <Link href={`/malops-management/detail/${params.data.id}`}>
            {params.value}
          </Link>
        );
      },
    },

    { headerName: "Filter", field: "filter", width: 500 },
    {
      headerName: "Created at",
      field: "created_at",
      valueFormatter: formatDateTime,
    },
  ];
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="grid py-4 pb-20 gap-3 sm:pt-10 font-[family-name:var(--font-geist-sans)]">
      {contextHolderDelete}
      <div
        style={{ background: "#FCFBFB" }}
        className="grid p-4 pb-20 gap-3  font-[family-name:var(--font-geist-sans)]"
      >
        <h2 className="text-2xl ml-4 pt-7 font-bold text-gray-800 mb-4">
          {t("build_query")}
        </h2>
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-full  ${
                  activeIndex == index ? "bg-[#F6BD03]" : "bg-[#F2F2F2]"
                }  flex items-center justify-center`}
                onClick={() => {
                  setFields(item.fields || []);
                  setActiveIndex(index);
                }}
              >
                {React.createElement(item.icon)}
              </div>
              <span className="text-sm text-center">{item.label}</span>
            </div>
          ))}
        </section>
      </div>
      <div className="flex w-full justify-stretch">
        <div style={{ background: "#FCFBFB" }} className="flex-1 min-w-[300px]">
          <QueryFlowBuilder
            fields={fields}
            reload={reload}
            setReload={setReload}
          />
        </div>
        <div
          style={{ background: "#FCFBFB" }}
          className="flex-1 p-4 pb-20 gap-3 sm:pt-10 font-[family-name:var(--font-geist-sans)]"
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <section>
                <DataTable
                  showDatepicker={false}
                  showFilter={false}
                  title="Query Flow"
                  dataFieldName="filters"
                  apiUrl={API_URL.INVESTIGATION_PAGE.DEFAULT}
                  columns={columns}
                  reload={reload}
                />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
