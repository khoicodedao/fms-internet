import React, { useState } from "react";
import { Tree, Card, Tabs, List } from "antd";
import type { DataNode } from "antd/es/tree";
import {
  DesktopOutlined,
  FileOutlined,
  DatabaseOutlined,
  ClusterOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

interface FileInfo {
  name: string;
  pid: number;
  path: string;
  hash: string;
}

interface ProcessNode {
  xxHash_path: string;
  parent: string | null;
  level: number;
  file_info: FileInfo;
}

interface EventItem {
  xxHash_path: string;
  Process: any[];
  Registry: any[];
  File: any[];
  Socket: any[];
  Other: any[];
}

interface ProcessViewerProps {
  process_tree: ProcessNode[];
  events: EventItem[];
}

export default function ProcessViewer({
  process_tree,
  events,
}: ProcessViewerProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Hàm chuyển process_tree thành dạng tree của Antd
  const buildTreeData = (): DataNode[] => {
    const map = new Map<string, DataNode & { children: DataNode[] }>();
    const roots: DataNode[] = [];

    process_tree.forEach((node) => {
      const treeNode: DataNode & { children: DataNode[] } = {
        title: (
          <>
            <DesktopOutlined style={{ marginRight: 8 }} />
            {node.file_info.name} (PID: {node.file_info.pid})
          </>
        ),
        key: node.xxHash_path,
        children: [],
      };
      map.set(node.xxHash_path, treeNode);
    });

    process_tree.forEach((node) => {
      const treeNode = map.get(node.xxHash_path)!;
      if (node.parent && map.has(node.parent)) {
        map.get(node.parent)!.children.push(treeNode);
      } else {
        roots.push(treeNode);
      }
    });

    return roots;
  };

  const handleSelect = (keys: any[]) => {
    if (keys.length > 0) {
      setSelectedPath(keys[0]);
    }
  };

  const currentEvent = events.find((e) => e.xxHash_path === selectedPath);

  const eventTabs = [
    {
      key: "Process",
      label: (
        <span>
          <AppstoreOutlined />
          Process
        </span>
      ),
    },
    {
      key: "Registry",
      label: (
        <span>
          <DatabaseOutlined />
          Registry
        </span>
      ),
    },
    {
      key: "File",
      label: (
        <span>
          <FileOutlined />
          File
        </span>
      ),
    },
    {
      key: "Socket",
      label: (
        <span>
          <ClusterOutlined />
          Socket
        </span>
      ),
    },
    {
      key: "Other",
      label: (
        <span>
          <ThunderboltOutlined />
          Other
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", gap: "16px", height: "100%" }}>
      {/* LEFT: Process Tree */}
      <div style={{ width: "30%", overflow: "auto" }}>
        <Card title=" Process Tree" style={{ height: "100%" }}>
          <Tree
            treeData={buildTreeData()}
            onSelect={handleSelect}
            defaultExpandAll
          />
        </Card>
      </div>

      {/* RIGHT: Event Viewer */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Card
          title={`Events for ${selectedPath || "..."}`}
          style={{ height: "100%" }}
        >
          {selectedPath && currentEvent ? (
            <Tabs
              defaultActiveKey="Process"
              items={eventTabs.map((tab) => ({
                key: tab.key,
                label: tab.label,
                children: (
                  <List
                    //@ts-ignore
                    dataSource={currentEvent[tab.key as keyof EventItem]}
                    renderItem={(item, idx) => (
                      <List.Item>
                        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </List.Item>
                    )}
                  />
                ),
              }))}
            />
          ) : (
            <p>Please select a process to view its events.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
