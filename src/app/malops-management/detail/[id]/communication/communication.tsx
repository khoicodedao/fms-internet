"use client";
import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  MarkerType,
} from "reactflow";

import "reactflow/dist/style.css";
import {
  ClockCircleOutlined,
  DeploymentUnitOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";

type SocketEvent = {
  log_time: string;
  data: {
    fields: {
      image_path: string;
      local_address: string;
      local_port: number;
      remote_address: string;
      remote_port: number;
      protocol: string;
    };
  };
};

type Props = {
  data: SocketEvent[];
};

const SocketGraph: React.FC<Props> = ({ data }) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const getNodeId = (ip: string, port: number, label = "") =>
    `${ip}:${port}${label ? ` (${label})` : ""}`;

  const nodeMap = new Map<string, boolean>(); // để tránh trùng node

  data.forEach((item, index) => {
    const {
      local_address,
      local_port,
      remote_address,
      remote_port,
      image_path,
      protocol,
    } = item.data.fields;

    const localLabel = image_path.split("\\").pop() || "app.exe";
    const localId = getNodeId(local_address, local_port, localLabel);
    const remoteId = getNodeId(remote_address, remote_port);

    // Tạo nodes nếu chưa có
    if (!nodeMap.has(localId)) {
      nodeMap.set(localId, true);
      nodes.push({
        id: localId,
        data: { label: localId },
        position: { x: 50, y: index * 150 },
        style: { background: "#e6f7ff", border: "1px solid #1890ff" },
      });
    }

    if (!nodeMap.has(remoteId)) {
      nodeMap.set(remoteId, true);
      nodes.push({
        id: remoteId,
        data: { label: remoteId },
        position: { x: 400, y: index * 150 },
        style: { background: "#fff1f0", border: "1px solid #f5222d" },
      });
    }

    // Tạo edge từ local → remote
    edges.push({
      id: `edge-${index}`,
      source: localId,
      target: remoteId,
      label: `${protocol.toUpperCase()} - ${item.log_time.slice(11, 19)}`,
      type: "default",
      animated: true,
      style: { stroke: "#52c41a" },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#52c41a",
      },
    });
  });

  return (
    <div style={{ height: 600, width: "100%" }}>
      <div className="flex items-center p-4 space-x-2 mb-4">
        <DeploymentUnitOutlined
          style={{ fontSize: "24px", color: "red" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Communication
          </Typography.Title>
        </div>
      </div>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        {/* <Background /> */}
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default SocketGraph;
