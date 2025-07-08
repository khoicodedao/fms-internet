// ProcessTable.tsx
import React, { useMemo } from "react";
import { Table, Tag, Descriptions, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DesktopOutlined, SettingOutlined } from "@ant-design/icons";

interface ProcessData {
  alert_time: string;
  object: string;
  action: string;
  mitre_tactic: string;
  mitre_tecnique: string;
  mitre_desc: string;
  fields: Record<string, any>;
}

interface Props {
  data: ProcessData[];
}

const ProcessTable: React.FC<Props> = ({ data }) => {
  const columns: ColumnsType<ProcessData> = [
    {
      title: "Time",
      dataIndex: "alert_time",
      key: "alert_time",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Image",
      key: "image",
      render: (_, record) => record.fields?.exe || "N/A",
    },
    {
      title: "PID / PPID",
      key: "pid",
      render: (_, record) => `${record.fields?.pid} / ${record.fields?.ppid}`,
    },
    {
      title: "MITRE Technique",
      dataIndex: "mitre_tecnique",
      key: "mitre_tecnique",
    },
    {
      title: "Parent",
      key: "parent_exe",
      render: (_, record) => record.fields?.parent_exe || "N/A",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className=" ant-card-body flex items-center space-x-2  mb-4 ml-6">
        <SettingOutlined
          style={{ fontSize: "24px", color: "red" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Process Information
          </Typography.Title>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={"alert_time"}
        expandable={{
          expandedRowRender: (record) => (
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Command Line">
                {record.fields?.command_line}
              </Descriptions.Item>
              <Descriptions.Item label="Image Path">
                {record.fields?.image_path}
              </Descriptions.Item>
              <Descriptions.Item label="Parent Image Path">
                {record.fields?.parent_image_path}
              </Descriptions.Item>
              <Descriptions.Item label="xxHash Path">
                {record.fields?.xxHash_path}
              </Descriptions.Item>
              <Descriptions.Item label="MITRE Description">
                {record.mitre_desc}
              </Descriptions.Item>
            </Descriptions>
          ),
        }}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ProcessTable;
