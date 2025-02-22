/* eslint-disable */
"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { jsPlumb } from "jsplumb";
import { Typography } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface Node {
  left: any;
  top: any;
  id: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

interface Connection {
  source: string;
  target: string;
}

interface JsPlumbFlowProps {
  nodes: Node[];
  connections: Connection[];
}

const JsPlumbFlow: React.FC<JsPlumbFlowProps> = ({ nodes, connections }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [positionedNodes, setPositionedNodes] = useState<Node[]>([]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window === "undefined") return;

    // Xây dựng cây quan hệ
    const nodeMap = new Map<string, Node>();
    nodes.forEach((node) => nodeMap.set(node.id, { ...node }));

    // Tìm các node gốc (không có cha)
    const childNodes = new Set(connections.map((c) => c.target));
    const rootNodes = nodes.filter((node) => !childNodes.has(node.id));

    // Tạo danh sách hàng (theo level)
    const levels: Node[][] = [];
    const visited = new Set<string>();

    const buildLevels = (currentNodes: Node[], level: number) => {
      if (currentNodes.length === 0) return;

      if (!levels[level]) levels[level] = [];
      levels[level].push(...currentNodes);
      //@ts-ignore
      visited.add(...currentNodes.map((n) => n.id));

      // Tìm con của các node trong level hiện tại
      const nextNodes = connections
        .filter((c) => currentNodes.some((n) => n.id === c.source))
        .map((c) => nodeMap.get(c.target)!)
        .filter((n) => n && !visited.has(n.id));

      buildLevels(nextNodes, level + 1);
    };

    buildLevels(rootNodes, 0);

    // Tính toán vị trí
    const positioned: any[] = [];
    levels.forEach((row, rowIndex) => {
      const rowCount = row.length;
      row.forEach((node, colIndex) => {
        positioned.push({
          ...node,
          top: rowIndex * 120,
          left: colIndex * 180,
        });
      });
    });

    setPositionedNodes(positioned);
  }, [nodes, connections]);
  // @ts-ignore
  useEffect(() => {
    if (!isClient || !containerRef.current) return;
    const instance = jsPlumb.getInstance({
      //@ts-ignore
      Connector: ["Straight"],
      Endpoint: ["Dot", { radius: 5 }],
      PaintStyle: { stroke: "#4caf50", strokeWidth: 2 },
      EndpointStyle: { fill: "#4caf50" },
      Anchors: ["Bottom", "Top"],
    });

    instance.setContainer(containerRef.current);
    connections.forEach(({ source, target }) => {
      instance.connect({ source, target, connector: "Straight" });
    });

    return () => instance.deleteEveryEndpoint();
  }, [isClient, positionedNodes, connections]);

  if (!isClient) return null;

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <ApartmentOutlined
          style={{ fontSize: "24px", color: "red" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <Title level={5} style={{ margin: 0 }}>
          Flow Chart
        </Title>
      </div>

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: `${(positionedNodes.length / 2) * 150}px`,
          position: "relative",
          padding: "20px",
        }}
      >
        {positionedNodes.map((node) => (
          <div
            key={node.id}
            id={node.id}
            style={{
              ...nodeStyle,
              top: `${node?.top}px`,
              left: `${node?.left}px`,
            }}
          >
            {node.icon}
            <div>{node.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Style cho các node
const nodeStyle: React.CSSProperties = {
  width: "100px",
  height: "100px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #d9d9d9",
  borderRadius: "5px",
  position: "absolute",
  cursor: "pointer",
};

const JsPlumbFlowNoSSR = dynamic(() => Promise.resolve(JsPlumbFlow), {
  ssr: false,
});

export default JsPlumbFlowNoSSR;
