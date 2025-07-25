import React, { useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  WifiOutlined,
  UserOutlined,
  LaptopOutlined,
  SettingOutlined,
  GlobalOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { Tag, Tooltip } from "antd";

type FlowMapProps = {
  machineCount: number;
  user: string[];
  suspiciousProcessCount: number;
  totalConnections: number;
  incomingConnections: number;
  outgoingPorts: string[];
  externalIp: string[];
  externalElementCount: number;
};

export default function FlowMapComponent({
  machineCount,
  user,
  suspiciousProcessCount,
  totalConnections,
  incomingConnections,
  outgoingPorts,
  externalIp,
  externalElementCount,
}: FlowMapProps) {
  const baseNodes = [
    {
      id: "1",
      sourcePosition: "right",
      position: { x: 0, y: 100 },
      data: { label: null },
    },
    {
      id: "2",
      sourcePosition: "right",
      position: { x: 0, y: 202 },
      data: { label: null },
    },
    {
      id: "3",
      sourcePosition: "bottom",
      position: { x: 301, y: 50 },
      data: { label: null },
    },
    {
      id: "4",
      sourcePosition: "right",
      targetPosition: "left",
      position: { x: 300, y: 200 },
      data: { label: null },
    },
    {
      id: "5",
      position: { x: 500, y: 100 },
      targetPosition: "left",
      data: { label: null },
    },
    {
      id: "6",
      sourcePosition: "right",
      targetPosition: "left",
      position: { x: 500, y: 300 },
      data: { label: null },
    },
    {
      id: "7",
      position: { x: 700, y: 300 },
      targetPosition: "left",
      data: { label: null },
    },
  ];

  const baseEdges = [
    { id: "e1-4", source: "1", target: "4", type: "smoothstep" },
    { id: "e2-4", source: "2", target: "4", type: "smoothstep" },
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

  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, _, onEdgesChange] = useEdgesState(baseEdges);

  // Cập nhật lại nội dung của từng node khi props thay đổi
  useEffect(() => {
    // @ts-ignore
    setNodes((prev) =>
      prev.map((node) => {
        switch (node.id) {
          case "1":
            return {
              ...node,
              data: {
                label: (
                  <div className="text-center">
                    <LaptopOutlined
                      style={{ fontSize: 20, color: "#1e40af" }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    <div className="font-bold">{machineCount} Machines</div>
                    <div className="text-sm text-gray-500">Owner machine</div>
                  </div>
                ),
              },
            };
          case "2":
            return {
              ...node,
              data: {
                label: (
                  <div className="text-center">
                    <Tooltip
                      title={
                        <div className="max-h-[150px] overflow-y-auto">
                          {user.map((u: string, idx: number) => (
                            <div key={idx}>👤 {u}</div>
                          ))}
                        </div>
                      }
                      placement="top"
                    >
                      <UserOutlined
                        style={{ fontSize: 20, color: "#10b981" }}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    </Tooltip>
                    <div className="font-bold">{user.length} Users</div>
                  </div>
                ),
              },
            };
          case "3":
            return {
              ...node,
              data: {
                label: (
                  <div className="text-center">
                    <SettingOutlined
                      style={{ fontSize: 20, color: "#dc2626" }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    <div className="font-bold text-red-500">
                      {suspiciousProcessCount} suspicious Processes
                    </div>
                    <div className="text-sm text-gray-500">Processes</div>
                  </div>
                ),
              },
            };
          case "4":
            return {
              ...node,
              data: {
                label: (
                  <div className="text-center">
                    <WifiOutlined
                      style={{ fontSize: 24, color: "#f59e0b" }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    <div className="font-bold">
                      {totalConnections} Connections
                    </div>
                  </div>
                ),
              },
            };
          case "5":
            return {
              ...node,
              data: {
                label: (
                  <div>
                    <div className="font-bold">
                      {incomingConnections > 0
                        ? `TCP: ${incomingConnections} ports`
                        : "No incoming connections"}
                    </div>
                    <div className="text-sm text-gray-500">Incoming ports</div>
                  </div>
                ),
              },
            };
          case "6":
            return {
              ...node,
              data: {
                label: (
                  <div className="text-center ">
                    <Tooltip
                      title={
                        <div className="max-h-[150px] overflow-y-auto">
                          {outgoingPorts.map((ip, idx) => (
                            <div key={idx}>🔌 {ip}</div> // bạn có thể giữ 🌐 hoặc đổi thành 🔌
                          ))}
                        </div>
                      }
                      placement="top"
                    >
                      <div className="flex items-center justify-center gap-2 font-bold text-green-600 cursor-pointer">
                        <ExportOutlined
                          style={{ fontSize: 20, color: "#10b981" }}
                        />
                      </div>
                    </Tooltip>

                    <div className="font-bold">
                      {" "}
                      {outgoingPorts.length} out going port
                    </div>
                  </div>
                ),
              },
            };
          case "7":
            return {
              ...node,
              data: {
                label: (
                  <div className="text-center ">
                    <Tooltip
                      title={
                        <div className="max-h-[150px] overflow-y-auto">
                          {externalIp.map((ip, idx) => (
                            <div key={idx}>🌐 {ip}</div>
                          ))}
                        </div>
                      }
                      placement="top"
                    >
                      <div className="flex items-center justify-center gap-2 font-bold text-green-600 cursor-pointer">
                        <GlobalOutlined
                          style={{ fontSize: 20, color: "#10b981" }}
                        />
                      </div>
                    </Tooltip>

                    <div className="font-bold">
                      {" "}
                      {externalIp.length} External IP
                    </div>
                  </div>
                ),
              },
            };
          default:
            return node;
        }
      })
    );
  }, [
    machineCount,
    user,
    suspiciousProcessCount,
    totalConnections,
    incomingConnections,
    outgoingPorts,
    externalIp,
    externalElementCount,
    setNodes,
  ]);

  return (
    <div style={{ width: "100%", height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        zoomOnScroll={false}
        panOnScroll={false}
        panOnDrag={false}
        zoomOnDoubleClick={false}
      />
    </div>
  );
}
