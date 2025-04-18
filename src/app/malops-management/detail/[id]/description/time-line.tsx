"use client";
import React from "react";
import {
  LaptopOutlined,
  SettingOutlined,
  WifiOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Divider, Timeline } from "antd";
import { Typography } from "antd";
import "./time-line.scss";
const App: React.FC = () => (
  <div className="w-full">
    <div className="flex items-center space-x-2 mb-4">
      <ClockCircleOutlined
        style={{ fontSize: "24px", color: "rgb(239, 68, 68)" }}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
      <div>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Timeline
        </Typography.Title>
      </div>
    </div>
    <Divider />
    <div className="flex flex-col justify-center items-center">
      <Timeline
        mode="alternate"
        items={[
          {
            children: "Remove registry - 2025-02-21 17:26:09",
            dot: (
              <LaptopOutlined
                style={{ fontSize: "20px", color: "#1890ff" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            ),
          },
          {
            children: "DESKTOP-I9T8DIF Terminate process 2025-02-21 17:26:09",
            color: "green",
            dot: (
              <SettingOutlined
                style={{ fontSize: "20px", color: "#52c41a" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            ),
          },
          {
            dot: (
              <WifiOutlined
                style={{ fontSize: "20px", color: "#f5222d" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            ),
            children: `Sed up 2015-09-01 `,
          },
          {
            color: "red",
            children: "Network problems being solved 2025-22-01",
            dot: (
              <LaptopOutlined
                style={{ fontSize: "20px", color: "#faad14" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            ),
          },
          {
            children: "Create a services site 2025-22-01",
            dot: (
              <SettingOutlined
                style={{ fontSize: "20px", color: "#1890ff" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            ),
          },
          {
            dot: (
              <WifiOutlined
                style={{ fontSize: "20px", color: "#ff4d4f" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            ),
            children: "Technical testing 2015-09-01",
          },
        ]}
      />
    </div>
  </div>
);

export default App;
