"use client";
import React from "react";
import { Card, Table, Row, Col, Typography } from "antd";
import {
  WifiOutlined, // Router Icon
} from "@ant-design/icons";
import "vis-network/styles/vis-network.css"; // CSS cho vis-network
import NetworkGraph from "./network";
const { Title } = Typography;
import Detail from "./detail";
function Communication() {
  const sampleConnections: any[] = [
    {
      source: "DESKTOP-I9T8DIF",
      target: "DESKTOP-AS",
      ip: "192.168.1.1",
      port: "8080",
      mac: "00:1A:2B:3C:4D:5E",
    },
    {
      source: "My_PC",
      target: "DESKTOP-AZ",
      ip: "192.168.1.2",
      port: "8081",
      mac: "00:1A:2B:3C:4D:5F",
    },
    {
      source: "My_PC",
      target: "DESKTOP-AZ",
      ip: "192.168.1.3",
      port: "8082",
      mac: "00:1A:2B:3C:4D:60",
    },
  ];

  const columns = [
    { title: "MAC Address", dataIndex: "mac", key: "mac" },
    { title: "Source", dataIndex: "source", key: "source" },
    { title: "Target", dataIndex: "target", key: "target" },
    { title: "IP", dataIndex: "ip", key: "ip" },
    { title: "Port", dataIndex: "port", key: "port" },
  ];

  const data = sampleConnections.map((connection, index) => ({
    key: index.toString(),
    source: connection.source,
    target: connection.target,
    ip: connection.ip,
    port: connection.port,
    mac: connection.mac,
  }));

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
              <Title level={5} style={{ margin: 0 }}>
                Communication Profile
              </Title>
            </div>
            <div style={{ overflowX: "auto" }}>
              <Table columns={columns} dataSource={data} pagination={false} />
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card style={{ height: 500, overflow: "hidden" }}>
            <NetworkGraph />
          </Card>
          <Detail></Detail>
        </Col>
      </Row>
    </div>
  );
}

export default function CommunicationPage() {
  return <Communication />;
}
