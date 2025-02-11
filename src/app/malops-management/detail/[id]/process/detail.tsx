/* eslint-disable react/no-unescaped-entities */
import {
  ApiOutlined,
  GlobalOutlined,
  NumberOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  ClockCircleOutlined,
  FileOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Typography, Divider, Collapse } from "antd";
import React from "react";

export default function Detail() {
  const processDetails = {
    name: "explorer.exe",
    pid: 1234,
    user: "SYSTEM",
    cpuUsage: "2.5%",
    memoryUsage: "150 MB",
    threads: 50,
    handles: 200,
  };

  const connections = [
    {
      state: "Established",
      protocol: "TCP",
      port: "443",
      bytesTransferred: "1.2 MB",
      bytesReceived: "856 KB",
      duration: "02:34:15",
    },
    {
      state: "Closed",
      protocol: "UDP",
      port: "53",
      bytesTransferred: "256 KB",
      bytesReceived: "128 KB",
      duration: "00:15:30",
    },
  ];

  const items = [
    {
      key: "1",
      label: "Process Details",
      children: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <FileOutlined
                className="text-blue-500"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <span>Name: {processDetails.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <NumberOutlined
                className="text-purple-500"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <span>PID: {processDetails.pid}</span>
            </div>
            <div className="flex items-center space-x-2">
              <SettingOutlined
                className="text-green-500"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <span>User: {processDetails.user}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockCircleOutlined
                className="text-red-500"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <span>CPU Usage: {processDetails.cpuUsage}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CloudDownloadOutlined
                className="text-cyan-500"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <span>Memory Usage: {processDetails.memoryUsage}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApiOutlined
                className="text-orange-500"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <span>Threads: {processDetails.threads}</span>
            </div>
            <div className="flex items-center space-x-2">
              <GlobalOutlined
                className="text-blue-500"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <span>Handles: {processDetails.handles}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Network Connections",
      children: (
        <div className="space-y-6">
          {connections.map((connection, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 hover:bg-gray-100 p-4 rounded"
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <ApiOutlined
                    className="text-green-500"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  <span>State: {connection.state}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GlobalOutlined
                    className="text-blue-500"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  <span>Protocol: {connection.protocol}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <NumberOutlined
                    className="text-purple-500"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  <span>Port: {connection.port}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CloudUploadOutlined
                    className="text-orange-500"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  <span>Transferred: {connection.bytesTransferred}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <CloudDownloadOutlined
                    className="text-cyan-500"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  <span>Received: {connection.bytesReceived}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockCircleOutlined
                    className="text-red-500"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  <span>Duration: {connection.duration}</span>
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
      <Collapse items={items} />
    </div>
  );
}
