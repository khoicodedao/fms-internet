import React, { useEffect, useState } from "react";
import { Tree, Card, Tabs, List, Typography, Collapse, Table } from "antd";
import type { DataNode } from "antd/es/tree";
import {
  DesktopOutlined,
  FileOutlined,
  DatabaseOutlined,
  ClusterOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ReactJson from "react-json-view";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import SocketGraph from "./socket-graph";
interface FileInfo {
  name: string;
  tatics: string;
  path: string;
  hash: string;
  file_path: string;
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
  processListProcess: Process[];
  alert_id: string;
}
type Process = {
  process_name: string;
  xxhash_path: string;
};

function buildProcessTree(processList: Process[]) {
  const pathMap: Record<string, any> = {};

  processList.forEach((proc) => {
    const rawPath = proc.xxhash_path?.toString() || "";

    // Nếu path không có "/" hoặc "\", vẫn tạo node đơn lẻ
    if (!rawPath.includes("/") && !rawPath.includes("\\")) {
      const key = rawPath || proc.process_name;
      if (!pathMap[key]) {
        pathMap[key] = {
          title: proc.process_name,
          key: key,
          children: [],
        };
      }
      return;
    }

    // Nếu có path nhiều cấp
    const segments = rawPath.split(/[\\/]/); // Hỗ trợ cả "/" và "\"
    let currentPath = "";

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
          if (pathMap[parentPath]) {
            pathMap[parentPath].children.push(newNode);
          }
        }
      }
    });
  });

  // Lấy các node gốc (không có "/")
  const roots = Object.values(pathMap).filter(
    (node: any) => !node.key.includes("/")
  );
  return roots;
}
const deepFlattenAllObjects = (obj: any): Record<string, any> => {
  const result: Record<string, any> = {};

  const recurse = (curr: any, parentKey = "") => {
    for (const [key, value] of Object.entries(curr || {})) {
      const fullKey = parentKey ? `${parentKey}_${key}` : key;
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        recurse(value, fullKey); // đệ quy lồng sâu hơn
      } else {
        result[fullKey] = value;
      }
    }
  };

  recurse(obj);
  return result;
};

export default function ProcessViewer({
  processListProcess,
  alert_id,
}: ProcessViewerProps) {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [dataEvents, setDataEvents] = useState([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const { mutation: mutationEvents } = usePostApi(
    API_URL.ALERT_PAGE.EVENTS,
    true
  );
  useEffect(() => {
    const builtTree = buildProcessTree(processListProcess);
    setTreeData(builtTree);

    const firstParentKey = builtTree.find((node) => node.children?.length)?.key;
    if (firstParentKey) {
      setExpandedKeys([firstParentKey]);
    }
  }, [processListProcess]);
  useEffect(() => {
    mutationEvents.mutate(
      {
        id_alert: alert_id,
        get_process_tree: "False",
        xxhash: selectedPath,
      },
      {
        onSuccess: (data) => {
          const rawEvents = data.data.events;

          // Phân loại theo name
          const grouped = {
            Process: [],
            Registry: [],
            File: [],
            Socket: [],
            Other: [],
          };

          rawEvents.forEach((event: any) => {
            const name = event.name.toLowerCase();

            if (name.includes("process")) grouped.Process.push(event);
            else if (name.includes("registry")) grouped.Registry.push(event);
            else if (name.includes("file")) grouped.File.push(event);
            else if (name.includes("socket")) grouped.Socket.push(event);
            else grouped.Other.push(event);
          });

          setDataEvents(grouped);
        },
        onError: (error) => {
          console.error("Lỗi khi gọi API:", error);
        },
      }
    );
  }, [selectedPath]);

  // Hàm chuyển process_tree thành dạng tree của Antd

  const handleSelect = (keys: any[]) => {
    if (keys.length > 0) {
      setSelectedPath(keys[0]);
    }
  };

  const eventTabs = [
    {
      key: "Process",
      label: (
        <span>
          <AppstoreOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          Process
        </span>
      ),
    },
    {
      key: "Registry",
      label: (
        <span>
          <DatabaseOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          Registry
        </span>
      ),
    },
    {
      key: "File",
      label: (
        <span>
          <FileOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          File
        </span>
      ),
    },
    {
      key: "Socket",
      label: (
        <span>
          <ClusterOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          Socket
        </span>
      ),
    },
    {
      key: "Other",
      label: (
        <span>
          <ThunderboltOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          Other
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", gap: "16px", height: "100%" }}>
      {/* LEFT: Process Tree */}
      <div style={{ width: "30%", overflow: "auto" }}>
        <Card
          title={
            <div className="flex items-center space-x-2 ">
              <SettingOutlined
                style={{ fontSize: "24px", color: "Yellow" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <div>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  Process
                </Typography.Title>
              </div>
            </div>
          }
          style={{ height: "100%" }}
        >
          <Tree
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as string[])}
            height={450}
            showLine
            blockNode
            onSelect={handleSelect}
          />
        </Card>
      </div>

      {/* RIGHT: Event Viewer */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Card
          title={`Events for ${selectedPath || "..."}`}
          style={{ height: "100%" }}
        >
          {selectedPath && dataEvents ? (
            <Tabs
              defaultActiveKey="Process"
              items={eventTabs.map((tab) => ({
                key: tab.key,
                label: tab.label,
                children:
                  tab.key === "Socket" ? (
                    <SocketGraph events={dataEvents["Socket"]} />
                  ) : (
                    <Table
                      className="max-h-96 overflow-y-scroll"
                      rowKey={(record, index) =>
                        `${record.name}-${record.log_time}-${index}`
                      }
                      dataSource={dataEvents[tab.key as keyof EventItem]}
                      columns={[
                        {
                          title: "Log Time",
                          dataIndex: "log_time",
                          key: "log_time",
                          width: "10%",
                        },
                        {
                          title: "Data",
                          key: "data",
                          render: (record) => {
                            const data = record.data || {};

                            const renderFieldsObject = (
                              fieldsObj: Record<string, any>
                            ) => {
                              return (
                                <span style={{ whiteSpace: "pre-wrap" }}>
                                  {"{"}
                                  {Object.entries(fieldsObj).map(
                                    ([k, v], idx, arr) => (
                                      <span key={k}>
                                        <span
                                          style={{
                                            color: "#f90",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          "{k}"
                                        </span>
                                        :{" "}
                                        <span style={{ color: "#aaa" }}>
                                          {typeof v === "string"
                                            ? `"${v}"`
                                            : JSON.stringify(v)}
                                        </span>
                                        {idx < arr.length - 1 ? ", " : ""}
                                      </span>
                                    )
                                  )}
                                  {"}"}
                                </span>
                              );
                            };

                            return (
                              <div
                                style={{
                                  fontFamily: "monospace",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {Object.entries(data).map(([key, value]) => (
                                  <span key={key}>
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        color: "#1677ff",
                                      }}
                                    >
                                      {key}
                                    </span>
                                    =
                                    {key === "fields" &&
                                    typeof value === "object" &&
                                    value !== null ? (
                                      renderFieldsObject(value)
                                    ) : (
                                      <span> {String(value)} </span>
                                    )}{" "}
                                  </span>
                                ))}
                              </div>
                            );
                          },
                        },
                      ]}
                      expandable={{
                        expandedRowRender: (record) => (
                          <div
                            style={{ background: "#fafafa", padding: "12px" }}
                          >
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontFamily: "monospace",
                              }}
                            >
                              <tbody>
                                {Object.entries(record).map(([key, value]) => (
                                  <tr key={key}>
                                    <td
                                      style={{
                                        fontWeight: "bold",
                                        padding: "6px",
                                        verticalAlign: "top",
                                        borderBottom: "1px solid #eee",
                                        width: "30%",
                                      }}
                                    >
                                      {key}
                                    </td>
                                    <td
                                      style={{
                                        padding: "6px",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {typeof value === "object" &&
                                      value !== null ? (
                                        <ReactJson
                                          src={value}
                                          displayDataTypes={false}
                                          enableClipboard={true}
                                          style={{ padding: "10px" }}
                                        />
                                      ) : (
                                        String(value)
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ),
                        rowExpandable: () => true,
                      }}
                      pagination={false}
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
