import {
  DesktopOutlined,
  WindowsOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Typography, Collapse } from "antd";
import React from "react";

export default function Detail() {
  const machines = [
    {
      name: "DESKTOP-I9T8DIF",
      osVersion: "Windows 10 Pro",
      status: "Online",
    },
    {
      name: "Desktop-02",
      osVersion: "Windows 11 Enterprise",
      status: "Offline",
    },
  ];

  const items = [
    {
      key: "1",
      label: "Machine Details",
      children: (
        <div className="space-y-6">
          {machines.map((machine, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 hover:bg-gray-100 p-4 rounded"
            >
              <div className="flex items-center space-x-2">
                <DesktopOutlined
                  className="text-blue-500 text-xl"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <span>Name: {machine.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <WindowsOutlined
                  className="text-gray-500 text-xl"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <span>OS: {machine.osVersion}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleOutlined
                  className={
                    machine.status === "Online"
                      ? "text-green-500 text-xl"
                      : "text-red-500 text-xl"
                  }
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <span>Status: {machine.status}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-4">
        <DesktopOutlined
          style={{ fontSize: "24px", color: "#1890ff" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Machine Information
          </Typography.Title>
        </div>
      </div>

      <Collapse items={items} defaultActiveKey={["1"]} />
    </div>
  );
}
