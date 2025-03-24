/* eslint-disable */
"use client";
import React, { useEffect } from "react";
import { Card, Table, Row, Col, Typography, Badge, Button } from "antd";
import {
  ApartmentOutlined,
  // DesktopOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "reactflow/dist/style.css";
const { Title } = Typography;
import Detail from "./detail";
// import dynamic from "next/dynamic";
import getNodeIcon from "../../../../../common/get-node-icon";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";

// const Flow = dynamic(() => import("../../../../../components/Flow"), {
//   ssr: false,
// });

function Process() {
  const { mutation, contextHolder } = usePostApi(
    API_URL.EVENT_PAGE.DEFAULT,
    false
  );
  const [dataDetail, setDataDetail] = React.useState<any[]>([]);
  useEffect(() => {
    mutation.mutate(
      {
        start_date: "2025",
        end_date: "2026",
        skip: 0,
        limit: 2,
        object: "Process",
      },
      {
        onSuccess: (response: any) => {
          setDataDetail(response.data.events);
        },
      }
    );
  }, []);
  // Dữ liệu mẫu
  // const sampleNodes: any[] = [
  //   {
  //     //ts-ignore
  //     id: "computer1",
  //     label: "Computer",
  //     icon: getNodeIcon("Computer"),
  //   },
  //   {
  //     id: "setting1",
  //     label: "Setting",
  //     icon: getNodeIcon("Setting"),
  //   },
  //   {
  //     id: "user1",
  //     label: "User",
  //     icon: (
  //       <UserOutlined
  //         onPointerEnterCapture={undefined}
  //         onPointerLeaveCapture={undefined}
  //       />
  //     ),
  //   },
  //   {
  //     id: "cloud1",
  //     label: "Cloud",
  //     icon: (
  //       <ApartmentOutlined
  //         onPointerEnterCapture={undefined}
  //         onPointerLeaveCapture={undefined}
  //       />
  //     ),
  //   },
  // ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="flex items-center">
          {getNodeIcon(text)}
          <span className="ml-2">{text}</span>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: string) => (
        <Button type="primary" danger>
          {text}
        </Button>
      ),
    },
  ];

  let overviewDataProcess = dataDetail.map((item, index) => ({
    key: index,
    name: item.fields.exe,
    action: item.action,
  }));
  return (
    <div className="top-0 z-10 p-4 bg-white">
      {contextHolder}
      <Row gutter={16}>
        <Col span={8}>
          <Card style={{ height: 500 }} className="shadow pb-8">
            <div className="flex items-center space-x-2 mb-4">
              <SettingOutlined
                style={{ fontSize: "24px", color: "rgb(239, 68, 68)" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Processes Profile
                </Title>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={overviewDataProcess}
              pagination={false}
            />
          </Card>
        </Col>

        <Col span={16}>
          {/* <Row gutter={16}>
            <Flow nodes={sampleNodes} connections={sampleConnections} />
          </Row> */}
          <Row gutter={16}>
            <Detail dataList={dataDetail} />
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default function ProcessPage() {
  return <Process />;
}
