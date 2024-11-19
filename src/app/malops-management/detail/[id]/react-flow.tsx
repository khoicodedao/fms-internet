"use client";
import React from "react";
import { Card, Collapse, Row, Col, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import "reactflow/dist/style.css";
const { Text, Title } = Typography;
const { Panel } = Collapse;
import AffectedFile from "./affected-file";
import TimeLine from "./time-line";
import Flow from "./flow";
function Diagram() {
  return (
    <div className=" top-0 z-10 p-4 bg-gray-100">
      <Row gutter={16}>
        {/* Block 1 */}
        <Col span={8}>
          <Card style={{ height: 500 }} className="shadow pb-8">
            <div className="flex items-center space-x-2 mb-4">
              <InfoCircleOutlined
                style={{ fontSize: "24px", color: "rgb(239, 68, 68)" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Description
                </Title>
                <Text>Short description of the root cause.</Text>
              </div>
            </div>
            {/* Collapses */}
            <Collapse>
              <Panel header="Root Cause Info" key="1">
                <p>Details about the root cause info go here.</p>
              </Panel>
              <Panel header="Scope" key="2">
                <p>Details about the scope go here.</p>
              </Panel>
              <Panel header="Communication" key="3">
                <p>Details about the communication go here.</p>
              </Panel>
            </Collapse>
          </Card>
        </Col>

        {/* Block 2 */}
        <Col span={16}>
          <Row gutter={16}>
            <Col span={12}>
              <Flow />
            </Col>
            <Col span={12}>
              <TimeLine />
            </Col>
          </Row>
          <Row gutter={16}>
            <AffectedFile />
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default function DiagramPage() {
  return <Diagram />;
}
