"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Table, Tag } from "antd";
import { WifiOutlined, WindowsOutlined } from "@ant-design/icons";
import NetworkGraph from "./network";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import moment from "moment";

const { Title } = Typography;

// Hàm để group các socket theo xxHash_path
const groupSocketsByHashPath = (sockets: any[]) => {
  const grouped = sockets.reduce((acc: any, curr: any) => {
    const key = curr.xxHash_path;
    if (!acc[key]) {
      acc[key] = {
        ...curr,
        connections: [{ ...curr.data.fields, alert_time: curr.alert_time }],
      };
    } else {
      acc[key].connections.push(curr.data.fields);
    }
    return acc;
  }, {});

  return Object.values(grouped);
};

const columns = [
  {
    title: "Time",
    dataIndex: "log_time",
    key: "time",
    render: (log_time: string) => moment(log_time).format("HH:mm:ss DD/MM"),
  },
  {
    title: "Process",
    dataIndex: "data",
    key: "process",
    render: (_: any, record: any) => {
      const imagePath =
        record?.data?.fields?.image_path || record?.image_path || "Unknown";
      const exeName = imagePath.split("\\").pop();
      return (
        <div className="flex items-center gap-2">
          <WindowsOutlined
            className="text-lg text-blue-500"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <span>{exeName}</span>
        </div>
      );
    },
  },
  {
    title: "Remote",
    key: "remote",
    render: (_: any, record: any) => (
      <div className="space-y-1">
        {record.connections.map((conn: any, idx: number) => (
          <div key={idx}>
            <div>{conn.remote_address || "—"}</div>
            <div className="text-xs text-gray-500">
              Port: {conn.remote_port ?? "—"}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Protocol",
    key: "protocol",
    render: (_: any, record: any) => (
      <div className="space-y-1">
        {record.connections.map((conn: any, idx: number) => (
          <div style={{ height: "38px" }}>
            {" "}
            <Tag key={idx} color="geekblue" className="uppercase">
              {conn.protocol || "—"}
            </Tag>
          </div>
        ))}
      </div>
    ),
  },
];

export default function Communication({ alert_id }: { alert_id: string }) {
  const [sockets, setSockets] = useState([]);
  const [rawData, setRawData] = useState([]);
  const { mutation: mutationSockets, contextHolder } = usePostApi(
    API_URL.ALERT_PAGE.EVENTS_SOCKET,
    true
  );
  console.log(sockets);
  useEffect(() => {
    mutationSockets.mutate(
      { id_alert: alert_id },
      {
        onSuccess: (data) => {
          setRawData(data.data);
          const grouped = groupSocketsByHashPath(data.data);
          setSockets(grouped);
        },
        onError: (error) => {
          console.error("Lỗi khi gọi API:", error);
        },
      }
    );
  }, [alert_id]);

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
            <Table
              dataSource={sockets}
              columns={columns}
              rowKey={(record) => record.xxHash_path}
              pagination={false}
              size="small"
            />
          </div>
        </Col>

        <Col span={16}>
          <div>
            <NetworkGraph
              totalConnections={rawData.length}
              machineCount={1}
              user={Array.from(
                new Set(rawData.map((item) => item.data?.fields?.user))
              )}
              suspiciousProcessCount={sockets.length}
              externalIp={Array.from(
                new Set(
                  rawData.map((item) => item.data?.fields?.remote_address)
                )
              )}
              outgoingPorts={Array.from(
                new Set(rawData.map((item) => item.data?.fields?.remote_port))
              ).filter((port) => port !== undefined && port !== null)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
