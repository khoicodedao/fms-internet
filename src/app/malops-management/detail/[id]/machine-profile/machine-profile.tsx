"use client";
import React, { useEffect, useState } from "react";
import { Table, Row, Col, Typography } from "antd";
import {
  DesktopOutlined,
  UserOutlined,
  MacCommandOutlined,
  GlobalOutlined,
  WindowsOutlined,
  ClockCircleOutlined,
  CloudOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import "reactflow/dist/style.css";
import DetailDirectory from "./active-directory";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import MachineInfoCard from "./machine-info-card";
export default function MachineProfile({ uid }: { uid: string }) {
  const [machine, setMachine] = useState<any>({});
  const { mutation: mutationEdr } = usePostApi(API_URL.EDR_PAGE.DEFAULT, false);

  useEffect(() => {
    mutationEdr.mutate(
      {
        filter: `uid ='${uid}'`,
        skip: 0,
        limit: 1,
      },
      {
        onSuccess: (data) => {
          setMachine(data.data?.edrs?.[0] || {});
        },
        onError: (error) => {
          console.error("Lỗi khi gọi API:", error);
        },
      }
    );
  }, [uid]);

  return (
    <div className="top-0 z-10 p-4 bg-white">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <DesktopOutlined
            style={{ fontSize: "24px", color: "#1890ff" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <Typography.Title level={5} style={{ margin: 0 }}>
            Machine Information
          </Typography.Title>
        </div>

        <MachineInfoCard machine={machine} />
      </div>
    </div>
  );
}
