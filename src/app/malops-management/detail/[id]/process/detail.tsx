"use client";
import { FileOutlined } from "@ant-design/icons";
import { Typography, Divider, Collapse, Table } from "antd";
import React from "react";
import getNodeIcon from "@/common/get-node-icon";
export default function Detail({ dataList }: { dataList: any[] }) {
  const columns = [
    {
      title: "ID",
      dataIndex: ["fields", "ID"],
      key: "ID",
    },
    {
      title: "Process Name",
      dataIndex: ["fields", "exe"],
      key: "exe",
      render: (text: string) => (
        <div className="flex items-center">
          {getNodeIcon(text)}
          <span className="ml-2">{text}</span>
        </div>
      ),
    },
    {
      title: "PID",
      dataIndex: ["fields", "pid"],
      key: "pid",
    },
    {
      title: "User",
      dataIndex: ["fields", "user"],
      key: "user",
      render: (text: string) => (
        <div className="flex items-center">
          {getNodeIcon("computer")}
          <span className="ml-2">{text}</span>
        </div>
      ),
    },
    {
      title: "Computer Name",
      dataIndex: "computer_name",
      key: "computer_name",
    },
    {
      title: "IP Address",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Alert Time",
      dataIndex: "alert_time",
      key: "alert_time",
    },
    {
      title: "Alert Type",
      dataIndex: "alert_type",
      key: "alert_type",
    },
  ];

  const items = [
    {
      key: "1",
      label: "Process List",
      children: (
        <Table
          dataSource={dataList.map((item, index) => ({ ...item, ID: index }))}
          columns={columns}
          rowKey={(record) => record.fields?.pid || Math.random()}
          expandable={{
            expandedRowRender: (record) => (
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Image Path:</strong> {record.fields?.image_path}
                    </p>
                    <p>
                      <strong>Working Directory:</strong>{" "}
                      {record.fields?.current_working_directory}
                    </p>
                    <p>
                      <strong>Integrity Level:</strong>{" "}
                      {record.fields?.integrity_level}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>MD5 Hash:</strong> {record.fields?.md5_hash}
                    </p>
                    <p>
                      <strong>SHA1 Hash:</strong> {record.fields?.sha1_hash}
                    </p>
                    <p>
                      <strong>MAC Address:</strong> {record.mac}
                    </p>
                  </div>
                </div>
              </div>
            ),
          }}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-4">
        <FileOutlined
          style={{ fontSize: "24px", color: "#1890ff" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Process Details
          </Typography.Title>
        </div>
      </div>
      <Divider />
      <Collapse items={items} defaultActiveKey={["1"]} />
    </div>
  );
}
