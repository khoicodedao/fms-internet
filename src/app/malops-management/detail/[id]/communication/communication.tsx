"use client";
import React from "react";
import { Card, Table, Row, Col, Typography } from "antd";
import {
  ApartmentOutlined,
  DesktopOutlined,
  SettingOutlined,
  UserOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import "reactflow/dist/style.css";
const { Title } = Typography;
import Detail from "./detail";
import dynamic from "next/dynamic";

const Flow = dynamic(() => import("../../../../../components/Flow"), {
  ssr: false,
});

function Communication() {
  const sampleNodes: any[] = [
    {
      //ts-ignore
      id: "computer3",
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
      id: "setting3",
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
      id: "user3",
      label: "User",
      icon: (
        <UserOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      id: "cloud3",
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
    { source: "computer3", target: "setting3" },
    { source: "computer3", target: "user3" },
    { source: "setting3", target: "cloud3" },
  ];

  const columns = [
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Port",
      dataIndex: "port",
      key: "port",
    },
  ];

  const data = [
    {
      key: "1",
      ip: "192.168.1.1",
      port: "8080",
    },
    {
      key: "2",
      ip: "10.0.0.1",
      port: "443",
    },
  ];

  return (
    <div className="top-0 z-10 p-4 bg-white">
      <Row gutter={16}>
        <Col span={8}>
          <Card style={{ height: 500 }} className="shadow pb-8">
            <div className="flex items-center space-x-2 mb-4">
              <WifiOutlined
                style={{ fontSize: "24px", color: "rgb(239, 68, 68)" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Communication Profile
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
          <Col span={16}>
            <Flow nodes={sampleNodes} connections={sampleConnections} />
          </Col>
          <Row gutter={16}>
            <Detail />
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default function CommunicationPage() {
  return <Communication />;
}
