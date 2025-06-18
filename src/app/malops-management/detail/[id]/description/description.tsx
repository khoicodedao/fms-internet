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
    <div className=" top-0 z-10 p-4 bg-white">
      <Row gutter={16}>
        {/* Block 1 */}
        <Col span={8}>
          <Card
            style={{ height: 500, overflow: "auto" }}
            className="shadow pb-8"
          >
            {/* ✅ Hiển thị bảng */}
            <Table
              columns={columns}
              dataSource={data}
              rowKey="filter_id"
              pagination={false}
              size="small"
              style={{ marginTop: 16 }}
              onRow={(record) => ({
                onClick: () => {
                  setSelectedResult(record.result);
                  setOpenModal(true);
                },
              })}
            />
            <Modal
              title="Chi tiết thiết bị"
              open={openModal}
              onCancel={() => setOpenModal(false)}
              footer={null}
              width={800}
            >
              {selectedResult.map((item, index) => (
                <Descriptions
                  key={index}
                  title={`Thiết bị ${index + 1}`}
                  bordered
                  size="small"
                  column={2}
                  style={{ marginBottom: 12 }}
                >
                  <Descriptions.Item label="MAC">{item.mac}</Descriptions.Item>
                  <Descriptions.Item label="Computer Name">
                    {item.computer_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Version">
                    {item.version}
                  </Descriptions.Item>
                  <Descriptions.Item label="Process Events">
                    {item.process_events?.length || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="File Events">
                    {item.file_events?.length || 0}
                  </Descriptions.Item>
                </Descriptions>
              ))}
            </Modal>
          </Card>
        </Col>
        <Modal
          title="Chi tiết thiết bị"
          open={openModal}
          onCancel={() => setOpenModal(false)}
          footer={null}
          width={800}
        >
          {selectedResult.map((item, index) => (
            <Descriptions
              key={index}
              title={`Thiết bị ${index + 1}`}
              bordered
              size="small"
              column={2}
              style={{ marginBottom: 12 }}
            >
              <Descriptions.Item label="MAC">{item.mac}</Descriptions.Item>
              <Descriptions.Item label="Computer Name">
                {item.computer_name}
              </Descriptions.Item>
              <Descriptions.Item label="Version">
                {item.version}
              </Descriptions.Item>
              <Descriptions.Item label="Process Events">
                {item.process_events?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label="File Events">
                {item.file_events?.length || 0}
              </Descriptions.Item>
            </Descriptions>
          ))}
        </Modal>
        {/* Block 2 */}
        <Col span={16}>
          <Row content="" gutter={16}>
            {/* <Col span={18}>
              <Flow nodes={sampleNodes} connections={sampleConnections} />
            </Col> */}
            {/* <Col span={6}> */}
            <TimeLine result={data} />
            {/* </Col> */}
          </Row>
          <Row gutter={16}>
            {/* ts-ignore */}
            <AffectedFile data={data[0]?.result || []} />
          </Row>
        </Col>
      </Row>
    </div>
  );
}
export default Description;
