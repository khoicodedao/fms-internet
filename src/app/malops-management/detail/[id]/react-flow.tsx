"use client";
import React from "react";
import ReactFlow, { Edge, MarkerType, NodeProps } from "reactflow";
import { Card, Collapse, Row, Col, Typography } from "antd";
import {
  InfoCircleOutlined,
  DesktopOutlined,
  UserOutlined,
  SettingOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import "reactflow/dist/style.css";
const { Text, Title } = Typography;
const { Panel } = Collapse;

// Custom Node Component with Icons
interface CustomNodeData {
  icon: React.ReactNode;
  color: string;
  label: string;
  description: string;
}

function Flow() {
  const InfoNode = ({ data }: NodeProps<CustomNodeData>) => {
    const { icon, color, label, description } = data;
    return (
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          width: "120px",
        }}
      >
        <div style={{ fontSize: "24px", color: color }}>{icon}</div>
        <div style={{ fontSize: "14px", marginTop: "5px", fontWeight: "bold" }}>
          {label}
        </div>
        <div style={{ fontSize: "12px", color: "#666" }}>{description}</div>
      </div>
    );
  };
  // Nodes and Edges Configuration
  const nodes = [
    {
      id: "1",
      type: "infoNode", // Use 'custom' type for this node
      position: { x: 0, y: 50 },
      data: {
        label: "Node 1",
        icon: (
          <DesktopOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ),
        color: "#1890ff",
        description: "This is Node 1",
      },
    },
    {
      id: "2",
      type: "infoNode", // Use 'custom' type for this node
      position: { x: 200, y: 50 },
      data: {
        label: "Node 2",
        icon: (
          <UserOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ),
        color: "#52c41a",
        description: "This is Node 2",
      },
    },
    {
      id: "3",
      type: "infoNode", // Use 'custom' type for this node
      position: { x: 400, y: 50 },
      data: {
        label: "Node 3",
        icon: (
          <SettingOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ),
        color: "#fa8c16",
        description: "This is Node 3",
      },
    },
    {
      id: "4",
      type: "infoNode", // Use 'custom' type for this node
      position: { x: 600, y: 50 },
      data: {
        label: "Node 4",
        icon: (
          <WifiOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ),
        color: "#13c2c2",
        description: "This is Node 4",
      },
    },
    {
      id: "5",
      type: "infoNode", // Use 'custom' type for this node
      position: { x: 800, y: 50 },
      data: {
        label: "Node 5",
        icon: (
          <InfoCircleOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ),
        color: "#eb2f96",
        description: "This is Node 5",
      },
    },
    {
      id: "6",
      type: "infoNode", // Use 'custom' type for this node
      position: { x: 1000, y: 50 },
      data: {
        label: "Node 6",
        icon: (
          <DesktopOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ),
        color: "#722ed1",
        description: "This is Node 6",
      },
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const edges: Edge[] = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#888", strokeWidth: 2 },
      markerEnd: { type: MarkerType.Arrow, color: "#888" },
      type: "default",
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: true,
      style: { stroke: "#888", strokeWidth: 2 },
      markerEnd: { type: MarkerType.Arrow, color: "#888" },
      type: "default",
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      animated: true,
      style: { stroke: "#888", strokeWidth: 2 },
      markerEnd: { type: MarkerType.Arrow, color: "#888" },
      type: "default",
    },
    {
      id: "e4-5",
      source: "4",
      target: "5",
      animated: true,
      style: { stroke: "#888", strokeWidth: 2 },
      markerEnd: { type: MarkerType.Arrow, color: "#888" },
      type: "default",
    },
    {
      id: "e5-6",
      source: "5",
      target: "6",
      animated: true,
      style: { stroke: "#888", strokeWidth: 2 },
      markerEnd: { type: MarkerType.Arrow, color: "#888" },
      type: "default",
    },
  ];

  return (
    <div style={{ height: 500 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ infoNode: InfoNode }}
        // onInit={onInit}
        fitView
      ></ReactFlow>
    </div>
  );
}

function Diagram() {
  return (
    <div className="sticky top-0 z-10 p-4 bg-gray-100">
      <Row gutter={16}>
        {/* Block 1 */}
        <Col span={8}>
          <Card style={{ height: 500 }} className="shadow pb-8">
            <div className="flex items-center space-x-2 mb-4">
              <InfoCircleOutlined
                style={{ fontSize: "24px", color: "#1890ff" }}
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
          <Card>
            <Flow />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default function DiagramPage() {
  return <Diagram />;
}
