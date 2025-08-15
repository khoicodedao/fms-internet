"use client";
import React, { useEffect, useState } from "react";
import { Tree, Card, Tabs, Table, Typography } from "antd";
import {
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
            height={450}
            showLine
            blockNode
            onSelect={handleSelect}
          />
        </Card>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
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
                      <>
                        <div style={{ marginBottom: 12 }}>
                          <input
                            type="text"
                            placeholder="Search in table..."
                            value={searchText}
                            onChange={(e) =>
                              handleSearch(e.target.value, tabKey)
                            }
                            style={{
                              padding: 8,
                              width: 300,
                              border: "1px solid #ccc",
                              borderRadius: 4,
                            }}
                          />
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
                              width: 300,
                            },
                            {
                              title: "Action",
                              key: "action",
                              dataIndex: "action",
                              render: (_, record) =>
                                record?.data?.action || "-",
                            },
                            {
                              title: "Image path",
                              key: "image_path",
                              render: (_, record) =>
                                record?.data?.fields?.image_path || "-",
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
                                  background: "#fafafa",
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
                      </>
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
