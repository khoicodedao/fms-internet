/* eslint-disable */
"use client";
import React from "react";
import { Card, Collapse, Row, Col, Typography } from "antd";
import {
  ApartmentOutlined,
  DesktopOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "reactflow/dist/style.css";
const { Text, Title } = Typography;
const { Panel } = Collapse;
import AffectedFile from "./affected-file";
import TimeLine from "./time-line";
import dynamic from "next/dynamic";
const Flow = dynamic(() => import("../../../../../components/Flow"), {
  ssr: false,
});
type Props = {
  rootCauseDetails: string;
  data: any[]; // hoặc kiểu cụ thể nếu bạn có
};
import { Table, Modal, Descriptions } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
// Dữ liệu mẫu

function Description({ rootCauseDetails, data }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any[]>([]);
  const { t } = useTranslation();
  const columns: ColumnsType<any> = [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
      width: 60,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(),
    },

    {
      title: "Results Count",
      dataIndex: "result",
      key: "result",
      align: "center",
      render: (res: any[]) => res.length,
    },
  ];

  return (
    <div className=" top-0 pt-2 z-10 bg-white">
      <Card>
        <TimeLine result={data} />
        <AffectedFile data={data[0]?.result || []} />
      </Card>
    </div>
  );
}
export default Description;
