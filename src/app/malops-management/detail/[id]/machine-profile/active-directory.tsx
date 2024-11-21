import {
  DesktopOutlined,
  WindowsOutlined,
  CheckCircleOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { Typography, Divider, Collapse } from "antd";
import React from "react";

export default function DetailDirectory() {
  const machines = [
    {
      name: "Desktop-01",
      osVersion: "Windows 10 Pro",
      status: "Online",
      directories: [
        {
          path: "C:\\Windows\\System32",
          size: "4.2 GB",
          lastModified: "2023-10-15",
        },
        {
          path: "C:\\Program Files",
          size: "15.8 GB",
          lastModified: "2023-10-14",
        },
        { path: "C:\\Users", size: "25.3 GB", lastModified: "2023-10-15" },
      ],
    },
    {
      name: "Desktop-02",
      osVersion: "Windows 11 Enterprise",
      status: "Offline",
      directories: [
        {
          path: "C:\\Windows\\System32",
          size: "4.5 GB",
          lastModified: "2023-10-15",
        },
        {
          path: "C:\\Program Files",
          size: "20.1 GB",
          lastModified: "2023-10-15",
        },
        { path: "C:\\Users", size: "18.7 GB", lastModified: "2023-10-14" },
      ],
    },
  ];

  const items = [
    {
      key: "1",
      label: "Machine Details",
      children: (
        <div className="space-y-6">
          {machines.map((machine, index) => (
            <div key={index} className="space-y-4">
              <div className="grid grid-cols-3 gap-4 hover:bg-gray-100 p-4 rounded">
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
              <div className="ml-8 bg-gray-50 p-4 rounded">
                <Typography.Text strong>Directory Information:</Typography.Text>
                <div className="mt-2 space-y-2">
                  {machine.directories.map((dir, dirIndex) => (
                    <div key={dirIndex} className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <FolderOutlined
                          className="text-blue-400"
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                        <span>{dir.path}</span>
                      </div>
                      <span>Size: {dir.size}</span>
                      <span>Last Modified: {dir.lastModified}</span>
                    </div>
                  ))}
                </div>
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
      <Divider />
      <Collapse items={items} />
    </div>
  );
}
