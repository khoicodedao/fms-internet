// FlowMapComponent.tsx
"use client";
import React from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  WifiOutlined,
  UserOutlined,
  LaptopOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const initialNodes = [
  {
    id: "1",
    sourcePosition: "right",
    position: { x: 0, y: 100 },
    data: {
      label: (
        <div className="text-center">
          <LaptopOutlined style={{ fontSize: 20, color: "#1e40af" }} />{" "}
          {/* Xanh đậm */}
          <div className="font-bold">2 Machines</div>
          <div className="text-sm text-gray-500">Owner machine</div>
        </div>
      ),
    },
  },
  {
    id: "2",
    sourcePosition: "right",
    position: { x: 0, y: 201 },
    data: {
      label: (
        <div className="text-center">
          <UserOutlined style={{ fontSize: 20, color: "#10b981" }} />{" "}
          {/* Xanh lá */}
          <div className="font-bold">2 Users</div>
          <div className="text-sm text-gray-500">Owner users</div>
        </div>
      ),
    },
  },
  {
    id: "3",
    position: { x: 301, y: 50 },
    sourcePosition: "bottom",
    data: {
      label: (
        <div className="text-center">
          <SettingOutlined style={{ fontSize: 20, color: "#dc2626" }} />{" "}
          {/* Đỏ */}
          <div className="font-bold text-red-500">2 suspicious Processes</div>
          <div className="text-sm text-gray-500">Processes</div>
        </div>
      ),
    },
  },
  {
    id: "4",
    sourcePosition: "right",
    targetPosition: "left",
    position: { x: 300, y: 200 },
    data: {
      label: (
        <div className="text-center">
          <WifiOutlined style={{ fontSize: 24, color: "#f59e0b" }} />{" "}
          {/* Cam */}
          <div className="font-bold">4 Connections</div>
          <div className="text-sm text-gray-500">Connections</div>
        </div>
      ),
    },
  },
  {
    id: "5",
    position: { x: 500, y: 100 },
    targetPosition: "left",
    data: {
      label: (
        <div>
          <div className="font-bold">No incoming connections</div>
          <div className="text-sm text-gray-500">Incoming ports</div>
        </div>
      ),
    },
  },
  {
    id: "6",
    targetPosition: "left",
    sourcePosition: "right",
    position: { x: 500, y: 300 },
    data: {
      label: (
        <div>
          <div className="font-bold">TCP: 2 ports</div>
          <div className="text-sm text-gray-500">Outgoing ports</div>
        </div>
      ),
    },
  },
  {
    id: "7",
    position: { x: 700, y: 290 },
    targetPosition: "left",
    data: {
      label: (
        <div>
          <div className="font-bold">152.32.217.10</div>
          <div className="text-sm text-gray-500">External connections</div>
          <div className="text-sm text-gray-500">No Elements</div>
        </div>
      ),
    },
  },
];

const initialEdges = [
  { id: "e1-4", source: "1", target: "4", animated: false, type: "smoothstep" },
  { id: "e2-4", source: "2", target: "4", animated: false, type: "smoothstep" },
  {
    id: "e3-4",
    source: "3",
    target: "4",

    animated: true,
    type: "straight",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  { id: "e4-5", source: "4", target: "5", type: "smoothstep" },
  { id: "e4-6", source: "4", target: "6", type: "smoothstep" },
  { id: "e6-7", source: "6", target: "7", type: "smoothstep" },
];

export default function FlowMapComponent() {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, __, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: "100%", height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodesDraggable={false} // ❌ không cho kéo node
        nodesConnectable={false} // ❌ không cho kết nối node
        elementsSelectable={false} // ❌ không cho chọn node/edge
        zoomOnScroll={false} // ❌ không cho zoom bằng scroll
        panOnScroll={false} // ❌ không cho pan bằng scroll
        panOnDrag={false} // ❌ không cho pan bằng chuột
        zoomOnDoubleClick={false}
      ></ReactFlow>
    </div>
  );
}
