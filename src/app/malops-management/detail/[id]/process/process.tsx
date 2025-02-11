"use client";
import React from "react";
import { Card, Table, Row, Col, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import "reactflow/dist/style.css";
const { Title } = Typography;
import Detail from "./detail";
import Flow from "./flow";

function Process() {
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
          <Flow />
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
