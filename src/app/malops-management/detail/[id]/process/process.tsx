"use client";
import React, { useEffect, useState } from "react";
import { Tree, Card, Tabs, Table, Typography, Badge, Input } from "antd";
import {
  FileOutlined,
  DatabaseOutlined,
  ClusterOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  SettingOutlined,
  SearchOutlined,
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
  score_level: number;
};
// màu gợi ý theo mức độ (bạn chỉnh lại theo thang điểm của bạn)
const getScoreColor = (score?: number) => {
  if (score == null) return "#d9d9d9";
  if (score >= 80) return "#ff4d4f"; // cao
  if (score >= 60) return "#faad14"; // trung bình
  if (score >= 30) return "#52c41a"; // thấp
  return "#d9d9d9";
};

const makeTitle = (text: string, score?: number, showBadge = false) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {showBadge && (
      <Badge
        count={score}
        showZero
        color={getScoreColor(typeof score === "number" ? score : undefined)}
      />
    )}
    <span>{text}</span>
  </div>
);

function buildProcessTree(processList: Process[]) {
  const pathMap: Record<string, any> = {};

  processList.forEach((proc) => {
    const rawPath = proc.xxhash_path?.toString() || "";

    // Không có "/" hoặc "\" → tạo node đơn
    if (!rawPath.includes("/") && !rawPath.includes("\\")) {
      const key = rawPath || proc.process_name;
      if (!pathMap[key]) {
        pathMap[key] = {
          title: makeTitle(proc.process_name, proc.score_level, true), // ✅ badge ở leaf
          key,
          children: [],
        };
      }
      return;
    }

    // Có path nhiều cấp
    const segments = rawPath.split(/[\\/]/); // hỗ trợ "/" và "\"
    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath = index === 0 ? segment : `${currentPath}/${segment}`;
      const isLeaf = index === segments.length - 1;
      const processInfo = isLeaf ? proc.process_name : segment;

      if (!pathMap[currentPath]) {
        const newNode = {
          // ✅ chỉ hiện badge ở leaf (node cuối)
          title: makeTitle(processInfo, proc.score_level, isLeaf),
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

export default function ProcessViewer({
  processListProcess,
  alert_id,
}: ProcessViewerProps) {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [dataEvents, setDataEvents] = useState<EventItem>({
    xxHash_path: "",
    Process: [],
    Registry: [],
    File: [],
    Socket: [],
    Other: [],
  });
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<keyof EventItem>("Process");

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
    if (!selectedPath) return;

    mutationEvents.mutate(
      {
        id_alert: alert_id,
        get_process_tree: "False",
        xxhash: selectedPath,
      },
      {
        onSuccess: (data) => {
          const rawEvents = data.data.events;

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
          setFilteredData(grouped[activeTab]);
        },
        onError: (error) => {
          console.error("Lỗi khi gọi API:", error);
        },
      }
    );
  }, [selectedPath]);

  const handleSelect = (keys: any[]) => {
    if (keys.length > 0) {
      setSelectedPath(keys[0]);
    }
  };

  const handleSearch = (value: string, tabKey: keyof EventItem) => {
    setSearchText(value);
    const originalData = dataEvents[tabKey] || [];

    if (!value) {
      setFilteredData(originalData);
      return;
    }

    const lowerValue = value.toLowerCase();

    const filtered = originalData.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(lowerValue)
    );

    setFilteredData(filtered);
  };

  const eventTabs = [
    {
      key: "Process",
      label: (
        <div className="flex items-center justify-center">
          <AppstoreOutlined
            style={{ color: "#1890ff", fontSize: 20 }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />{" "}
          Process
        </div>
      ),
    },
    {
      key: "Registry",
      label: (
        <div className="flex items-center justify-center">
          <DatabaseOutlined
            style={{ color: "#52c41a", fontSize: 20 }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />{" "}
          Registry
        </div>
      ),
    },
    {
      key: "File",
      label: (
        <div className="flex items-center justify-center">
          <FileOutlined
            style={{ color: "#fa8c16", fontSize: 20 }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />{" "}
          File
        </div>
      ),
    },
    {
      key: "Socket",
      label: (
        <div className="flex items-center justify-center">
          <ClusterOutlined
            style={{ color: "#13c2c2", fontSize: 20 }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />{" "}
          Socket
        </div>
      ),
    },
    {
      key: "Other",
      label: (
        <div className="flex items-center justify-center">
          <ThunderboltOutlined
            style={{ color: "#eb2f96", fontSize: 20 }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />{" "}
          Other
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", gap: "16px", height: "100%" }}>
      <div style={{ width: "30%", overflow: "auto" }}>
        <Card
          title={
            <div className="flex items-center space-x-2 ">
              <SettingOutlined
                style={{ fontSize: "24px", color: "Yellow" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <Typography.Title level={5} style={{ margin: 0 }}>
                Process
              </Typography.Title>
            </div>
          }
          style={{ height: "100%" }}
        >
          <Tree
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as string[])}
            // height={450}
            showLine
            blockNode
            onSelect={handleSelect}
          />
        </Card>
      </div>

      <div style={{ flex: 1, overflow: "hidden", maxWidth: "100%" }}>
        <Card
          // title={`Events for ${selectedPath || "..."}`}
          style={{ height: "100%" }}
        >
          {selectedPath ? (
            <Tabs
              defaultActiveKey="Process"
              onChange={(key) => {
                const tabKey = key as keyof EventItem;
                setActiveTab(tabKey);
                setSearchText("");
                setFilteredData(dataEvents[tabKey] || []);
              }}
              items={eventTabs.map((tab) => {
                const tabKey = tab.key as keyof EventItem;
                const currentData = searchText
                  ? filteredData
                  : dataEvents[tabKey];

                return {
                  key: tab.key,
                  label: tab.label,
                  children:
                    tab.key === "Socket" ? (
                      <SocketGraph events={dataEvents["Socket"]} />
                    ) : (
                      <div className="max-w-full overflow-x-scroll">
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ marginBottom: 12 }}>
                            <Input
                              placeholder="Search in table..."
                              value={searchText}
                              onChange={(e) =>
                                handleSearch(e.target.value, tabKey)
                              }
                              prefix={
                                <SearchOutlined style={{ color: "#999" }} />
                              }
                              style={{ width: 300 }}
                            />
                          </div>
                        </div>
                        <Table
                          rowKey={(record, index) =>
                            `${record.name}-${record.log_time}-${index}`
                          }
                          dataSource={currentData}
                          columns={[
                            {
                              title: "Alert time",
                              dataIndex: "log_time",
                              key: "log_time",
                              width: 150,
                            },
                            {
                              title: "Action",
                              key: "action",
                              dataIndex: "action",
                              width: 150,
                              render: (_, record) =>
                                record?.data?.action || "-",
                            },
                            {
                              title: "Image path",
                              key: "image_path",
                              width: 300,
                              render: (_, record) => (
                                <div className="w-80">
                                  {record?.data?.fields?.image_path || "-"}
                                </div>
                              ),
                            },
                            {
                              title: "Pid",
                              key: "pid",
                              render: (_, record) =>
                                record?.data?.fields?.pid || "-",
                            },
                            {
                              title: "Md5",
                              key: "md5",
                              render: (_, record) =>
                                record?.data?.fields?.md5_hash || "-",
                            },
                            {
                              title: "Hostname",
                              key: "host_name",
                              render: (_, record) =>
                                record?.data?.fields?.host_name || "-",
                            },
                          ]}
                          expandable={{
                            expandedRowRender: (record) => (
                              <div
                                style={{
                                  background: "white",
                                  padding: "12px",
                                }}
                              >
                                <ReactJson
                                  src={record}
                                  displayDataTypes={false}
                                  enableClipboard={true}
                                  style={{ padding: "10px" }}
                                />
                              </div>
                            ),
                            rowExpandable: () => true,
                          }}
                          pagination={false}
                        />
                      </div>
                    ),
                };
              })}
            />
          ) : (
            <p>Please select a process to view its events.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
