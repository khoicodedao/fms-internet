"use client";
import React, { useState } from "react";
import {
  FileAddOutlined,
  DeleteOutlined,
  CloudSyncOutlined,
  ClockCircleOutlined,
  SwapOutlined,
  EditOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Timeline, Typography, Tag, Card, Modal, Descriptions } from "antd";
import "./time-line.scss";
const { Text } = Typography;

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
    case "WriteFile":
      return (
        <EditOutlined
          style={{ color: "#F5A113" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );
    case "TerminateProcess":
      return (
        <PoweroffOutlined
          style={{ color: "red" }}
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
    case "Terminate":
      return "red";
    case "ESTABLISHED":
      return "green";
    case "Write":
      return "#F5A113";
    default:
      return "default";
  }
};

export default function TimelineComponent({ events }: { events: any }) {
  const [selected, setSelected] = useState<any | null>(null);
  console.log(events);
  return (
    <div className="scrollbar-none p-4" style={{ maxHeight: "600px" }}>
      <Timeline
        mode="alternate"
        items={events
          .slice() // để không mutate mảng gốc
          .sort(
            (a, b) =>
              new Date(a.log_time).getTime() - new Date(b.log_time).getTime()
          ) // sắp xếp tăng dần
          .map((item) => {
            const { name, log_time, data: eventData } = item;
            const { action, object, fields, mitre_tactic, mitre_tecnique } =
              eventData;

            return {
              dot: getIcon(name),
              children: (
                <Card
                  hoverable
                  style={{ backgroundColor: "#f9fafb", borderRadius: 12 }}
                  onClick={() => setSelected(item)}
                >
                  <Tag color={getTagColor(action)}>{mitre_tactic}</Tag>
                  <Tag color={getTagColor(action)}>{mitre_tecnique}</Tag>
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
