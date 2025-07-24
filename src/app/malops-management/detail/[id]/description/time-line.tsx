"use client";
import React, { useState } from "react";
import {
  FileAddOutlined,
  DeleteOutlined,
  CloudSyncOutlined,
  ClockCircleOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Timeline, Typography, Tag, Card, Modal, Descriptions } from "antd";
import "./time-line.scss";
const { Text } = Typography;

const data = [
  {
    name: "DeleteFile",
    log_time: "2025-07-14 16:22:38",
    data: {
      alert_time: "2025-07-14 16:21:35",
      object: "File",
      action: "Delete",
      fields: {
        file_path:
          "C:\\Users\\admin\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\data.lnk",
        pid: 5872,
        process_name: "C:\\Windows\\explorer.exe",
      },
    },
  },
  {
    name: "CreateFile",
    log_time: "2025-07-14 16:22:38",
    data: {
      alert_time: "2025-07-14 16:21:35",
      object: "File",
      action: "Create",
      fields: {
        file_path:
          "C:\\Users\\admin\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\data.lnk",
        pid: 5872,
        process_name: "C:\\Windows\\explorer.exe",
      },
    },
  },
  {
    name: "DeleteFile",
    log_time: "2025-07-14 16:22:38",
    data: {
      alert_time: "2025-07-14 16:21:34",
      object: "File",
      action: "Delete",
      fields: {
        file_path:
          "C:\\Users\\admin\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\data.db.lnk",
        pid: 5872,
        process_name: "C:\\Windows\\explorer.exe",
      },
    },
  },
  {
    name: "CreateFile",
    log_time: "2025-07-14 16:22:38",
    data: {
      alert_time: "2025-07-14 16:21:34",
      object: "File",
      action: "Create",
      fields: {
        file_path:
          "C:\\Users\\admin\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\data.db.lnk",
        pid: 5872,
        process_name: "C:\\Windows\\explorer.exe",
      },
    },
  },
  {
    name: "ESTABLISHEDSocket",
    log_time: "2025-07-14 14:19:06",
    data: {
      alert_time: "2025-07-14 14:18:06",
      object: "Socket",
      action: "ESTABLISHED",
      fields: {
        family: "ipv4",
        image_path: "C:\\Windows\\explorer.exe",
        local_address: "192.168.18.175",
        local_port: 50140,
        pid: 5872,
        protocol: "tcp",
        remote_address: "23.206.203.77",
        remote_port: 443,
        success: true,
        md5_hash: "66D658B86F7FDB193D4607454F877C15",
        signature_valid: "True",
        signer: "Microsoft Windows",
        user: "DESKTOP-8GP8UNV\\admin",
        uid: 3532,
      },
    },
  },
];

const getIcon = (name: string) => {
  switch (name) {
    case "CreateFile":
      return (
        <FileAddOutlined
          style={{ color: "#1677ff" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );
    case "DeleteFile":
      return (
        <DeleteOutlined
          style={{ color: "#ff4d4f" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );
    case "ESTABLISHEDSocket":
      return (
        <SwapOutlined
          style={{ color: "#52c41a" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );
    default:
      return (
        <ClockCircleOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );
  }
};

const getTagColor = (action: string) => {
  switch (action) {
    case "Create":
      return "blue";
    case "Delete":
      return "red";
    case "ESTABLISHED":
      return "green";
    default:
      return "default";
  }
};

export default function TimelineComponent() {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div>
      <Timeline
        mode="alternate"
        items={data.map((item) => {
          const { name, log_time, data: eventData } = item;
          const { action, object, fields } = eventData;

          return {
            dot: getIcon(name),
            children: (
              <Card
                hoverable
                style={{ backgroundColor: "#f9fafb", borderRadius: 12 }}
                onClick={() => setSelected(item)}
              >
                <Tag color={getTagColor(action)}>{action}</Tag>
                <Text>{`${object} - ${
                  fields?.file_path || fields?.image_path
                }`}</Text>
                <div style={{ marginTop: 4, fontSize: 12, color: "#888" }}>
                  {log_time}
                </div>
              </Card>
            ),
          };
        })}
      />

      <Modal
        open={!!selected}
        title="Chi tiết sự kiện"
        onCancel={() => setSelected(null)}
        footer={null}
      >
        {selected && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Tên">{selected.name}</Descriptions.Item>
            <Descriptions.Item label="Hành động">
              <Tag color={getTagColor(selected.data.action)}>
                {selected.data.action}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Đối tượng">
              {selected.data.object}
            </Descriptions.Item>
            {Object.entries(selected.data.fields).map(([key, value]) => (
              <Descriptions.Item label={key} key={key}>
                {String(value)}
              </Descriptions.Item>
            ))}
            <Descriptions.Item label="Thời gian ghi log">
              {selected.log_time}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian cảnh báo">
              {selected.data.alert_time}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
