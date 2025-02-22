"use client";
import React from "react";
import { Card, Table, Row, Col, Typography } from "antd";
import {
  ApartmentOutlined,
  DesktopOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "reactflow/dist/style.css";
const { Title } = Typography;
import Detail from "./detail";
import dynamic from "next/dynamic";

const Flow = dynamic(() => import("../../../../../components/Flow"), {
  ssr: false,
});

function Process() {
  // Dữ liệu mẫu
  const sampleNodes: any[] = [
    {
      //ts-ignore
      id: "computer1",
      label: "Computer",
      icon: (
        <DesktopOutlined
          color="#007bff"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      id: "setting1",
      label: "Setting",
      icon: (
        <SettingOutlined
          color="#ffc107"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      id: "user1",
      label: "User",
      icon: (
        <UserOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      id: "cloud1",
      label: "Cloud",
      icon: (
        <ApartmentOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
  ];

  const sampleConnections: any[] = [
    { source: "computer1", target: "setting1" },
    { source: "computer1", target: "user1" },
    { source: "setting1", target: "cloud1" },
  ];
  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
  ];

  const data = [
    {
      key: "1",
      name: "cerber.exe",
    },
  ];

  return (
    <div className="top-0 z-10 p-4 bg-white">
      <Row gutter={16}>
        <Col span={8}>
          <Card style={{ height: 500 }} className="shadow pb-8">
            <div className="flex items-center space-x-2 mb-4">
              <SettingOutlined
                style={{ fontSize: "24px", color: "rgb(239, 68, 68)" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Processes Profile
                </Title>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={data}
              title={() => "Malicious Connections"}
              pagination={false}
            />
          </Card>
        </Col>

        <Col span={16}>
          <Row gutter={16}>
            <Flow nodes={sampleNodes} connections={sampleConnections} />
          </Row>
          <Row gutter={16}>
            <Detail />
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default function ProcessPage() {
  return <Process />;
}
