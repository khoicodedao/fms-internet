"use client";
import React from "react";
import { Card, Table, Row, Col, Typography } from "antd";
import {
  // ApartmentOutlined,
  DesktopOutlined,
  // SettingOutlined,
  // UserOutlined,
} from "@ant-design/icons";
import "reactflow/dist/style.css";
import DetailDirectory from "./active-directory";

// import dynamic from "next/dynamic";

// const Flow = dynamic(() => import("../../../../../components/Flow"), {
//   ssr: false,
// });

function MachineProfile() {
  // const sampleNodes: any[] = [
  //   {
  //     //ts-ignore
  //     id: "computer4",
  //     label: "Computer",
  //     icon: (
  //       <DesktopOutlined
  //         color="#007bff"
  //         onPointerEnterCapture={undefined}
  //         onPointerLeaveCapture={undefined}
  //       />
  //     ),
  //   },
  //   {
  //     id: "setting4",
  //     label: "Setting",
  //     icon: (
  //       <SettingOutlined
  //         color="#ffc107"
  //         onPointerEnterCapture={undefined}
  //         onPointerLeaveCapture={undefined}
  //       />
  //     ),
  //   },
  //   {
  //     id: "user4",
  //     label: "User",
  //     icon: (
  //       <UserOutlined
  //         onPointerEnterCapture={undefined}
  //         onPointerLeaveCapture={undefined}
  //       />
  //     ),
  //   },
  //   {
  //     id: "cloud4",
  //     label: "Cloud",
  //     icon: (
  //       <ApartmentOutlined
  //         onPointerEnterCapture={undefined}
  //         onPointerLeaveCapture={undefined}
  //       />
  //     ),
  //   },
  // ];

  // const sampleConnections: any[] = [
  //   { source: "computer4", target: "setting4" },
  //   { source: "computer4", target: "user4" },
  //   { source: "setting4", target: "cloud4" },
  // ];
  const columns = [
    {
      title: "Machine Name",
      dataIndex: "machineName",
      key: "machineName",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "MAC Address",
      dataIndex: "mac",
      key: "mac",
    },
    {
      title: "IP Address",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Operating System",
      dataIndex: "os",
      key: "os",
    },
  ];

  const data = [
    {
      key: "1",
      machineName: "DESKTOP-ABC123",
      user: "john.doe",
      mac: "00:1A:2B:3C:4D:5E",
      ip: "192.168.1.1",
      os: "Windows 10 Pro",
    },
    {
      key: "2",
      machineName: "LAPTOP-XYZ789",
      user: "jane.smith",
      mac: "00:2C:4E:6F:8G:9H",
      ip: "10.0.0.1",
      os: "Ubuntu 22.04",
    },
  ];

  return (
    <div className="top-0 z-10 p-4 bg-white">
      <Row gutter={16}>
        <Col span={8}>
          <Card style={{ height: 500 }} className="shadow pb-8">
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
            <Table
              columns={columns}
              dataSource={data}
              title={() => "System Details"}
              pagination={false}
              scroll={{ x: true }}
            />
          </Card>
        </Col>

        <Col span={16}>
          <div className="flex flex-col space-y-44">
            {/* <Flow nodes={sampleNodes} connections={sampleConnections} /> */}
            <DetailDirectory />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default function MachineProfilePage() {
  return <MachineProfile />;
}
