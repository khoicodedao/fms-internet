import React from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import {
  DesktopOutlined,
  UserOutlined,
  SettingOutlined,
  WifiOutlined,
} from "@ant-design/icons";

// Node component với icon từ Ant Design
const CustomNode = ({ data }) => {
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
      <div style={{ fontSize: "24px", color: data.color }}>{data.icon}</div>
      <div style={{ fontSize: "14px", marginTop: "5px", fontWeight: "bold" }}>
        {data.label}
      </div>
      <div style={{ fontSize: "12px", color: "#666" }}>{data.description}</div>
    </div>
  );
};

// Định nghĩa các node và edge
const nodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 0, y: 50 },
    data: {
      label: "2 Machines",
      description: "Affected machines",
      icon: (
        <DesktopOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      color: "#1890ff",
    },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 200, y: 50 },
    data: {
      label: "2 Users",
      description: "Affected users",
      icon: (
        <UserOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      color: "#52c41a",
    },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 100, y: 150 },
    data: {
      label: "cerber.exe",
      description: "Ransomware hash\nRoot cause",
      icon: (
        <SettingOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      color: "red",
    },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 100, y: 250 },
    data: {
      label: "2 Suspicious Processes",
      description: "Malicious process",
      icon: (
        <SettingOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      color: "#faad14",
    },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 0, y: 350 },
    data: {
      label: "No Connections",
      description: "Incoming connections",
      icon: (
        <WifiOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      color: "#000",
    },
  },
  {
    id: "6",
    type: "custom",
    position: { x: 200, y: 350 },
    data: {
      label: "200 Connections",
      description: "Outgoing connections",
      icon: (
        <WifiOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      color: "#000",
    },
  },
];

const edges = [
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    style: { stroke: "#888" },
    markerEnd: { type: "arrowclosed", color: "#888" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    style: { stroke: "#888" },
    markerEnd: { type: "arrowclosed", color: "#888" },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    style: { stroke: "#888" },
    markerEnd: { type: "arrowclosed", color: "#888" },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    animated: true,
    style: { stroke: "#888" },
    markerEnd: { type: "arrowclosed", color: "#888" },
  },
  {
    id: "e4-6",
    source: "4",
    target: "6",
    animated: true,
    style: { stroke: "#888" },
    markerEnd: { type: "arrowclosed", color: "#888" },
  },
];

const nodeTypes = { custom: CustomNode };

function Diagram() {
  return (
    <div style={{ height: 500 }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default Diagram;
