"use client";
import React from "react";
import { Timeline, Typography, Divider } from "antd";
import {
  LaptopOutlined,
  SettingOutlined,
  FileOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
const { Title } = Typography;

// 👇 Hàm xử lý để chuyển đổi dữ liệu thành mảng các item cho Timeline
function buildTimelineItems(result: any[]) {
  const allEvents: any[] = [];

  result.forEach((device) => {
    const { computer_name, mac, process_events, file_events } = device;

    // Xử lý process_events
    process_events?.forEach((event: any) => {
      allEvents.push({
        time: event.event_time,
        children: `🖥️ ${computer_name} (${mac}) \n — Process ${event.action}: ${
          event.fields.process_name ||
          event.fields.file_name ||
          event.fields.process_name ||
          event.fields.file_path
        }`,
        dot: (
          <SettingOutlined
            style={{ fontSize: 18, color: "#52c41a" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ),
      });
    });

    // Xử lý file_events
    file_events?.forEach((event: any) => {
      allEvents.push({
        time: event.event_time,
        children: `🖥️ ${computer_name} (${mac}) \n — File \n ${event.action}: ${event.fields.file_name}`,
        dot: (
          <FileOutlined
            style={{ fontSize: 18, color: "#f5222d" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ),
      });
    });
  });

  // Sắp xếp theo thời gian tăng dần
  return allEvents
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    .map((e) => ({
      ...e,
      children: `\n ${e.children} — ${new Date(e.time).toLocaleString()}`,
    }));
}

type TimelineEventsProps = {
  result: any[]; // Mảng dữ liệu result gồm nhiều máy
};

const TimelineEvents: React.FC<TimelineEventsProps> = ({ result }) => {
  const timelineItems = buildTimelineItems(result[0]?.result || []);
  return (
    <div className="w-full overflow-y-scroll" style={{ height: "500px" }}>
      <div className="flex items-center space-x-2 mb-4">
        <ClockCircleOutlined
          style={{ fontSize: 24, color: "rgb(239, 68, 68)" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <Title level={5} style={{ margin: 0 }}>
          Timeline
        </Title>
      </div>
      <Divider />
      <Timeline mode="alternate" items={timelineItems} />
    </div>
  );
};

export default TimelineEvents;
