"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Tree } from "antd";
import { WifiOutlined } from "@ant-design/icons";
import NetworkGraph from "./network";

const { Title } = Typography;

type Process = {
  process_name: string;
  xxhash_path: string;
};

type ProcessProps = {
  processListProcess: Process[];
};

function buildProcessTree(processList: Process[]) {
  const pathMap: Record<string, any> = {};

  processList.forEach((proc) => {
    const segments = proc.xxhash_path.split("/");
    let currentPath = "";
    let currentNode = null;

    segments.forEach((segment, index) => {
      currentPath = index === 0 ? segment : `${currentPath}/${segment}`;

      if (!pathMap[currentPath]) {
        const isLeaf = index === segments.length - 1;
        const processInfo = isLeaf ? proc.process_name : segment;

        const newNode = {
          title: processInfo,
          key: currentPath,
          children: [],
        };
        pathMap[currentPath] = newNode;

        if (index > 0) {
          const parentPath = segments.slice(0, index).join("/");
          pathMap[parentPath].children.push(newNode);
        }
      }
    });
  });

  const roots = Object.values(pathMap).filter(
    (node: any) => !node.key.includes("/")
  );
  return roots;
}

export default function Communication({ processListProcess }: ProcessProps) {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    const builtTree = buildProcessTree(processListProcess);
    setTreeData(builtTree);

    const firstParentKey = builtTree.find((node) => node.children?.length)?.key;
    if (firstParentKey) {
      setExpandedKeys([firstParentKey]);
    }
  }, [processListProcess]);

  return (
    <div className="top-0 z-10 p-4 bg-white">
      <Row gutter={16}>
        <Col span={8}>
          <div
            style={{ height: 500, overflow: "auto" }}
            className="pb-8 scrollbar-hide"
          >
            <div className="flex items-center space-x-2 mb-4">
              <WifiOutlined
                style={{ fontSize: "24px", color: "rgb(239, 68, 68)" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <Title level={5} style={{ margin: 0 }}>
                Communication
              </Title>
            </div>
            <Tree
              treeData={treeData}
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
              height={450}
              showLine
              blockNode
            />
          </div>
        </Col>

        <Col span={16}>
          <div style={{ height: 500, overflow: "hidden" }}>
            <NetworkGraph />
          </div>
        </Col>
      </Row>
    </div>
  );
}
