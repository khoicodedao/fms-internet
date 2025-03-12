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
  scopeDetails: string;
  communicationDetails: string;
};
// Dữ liệu mẫu
const sampleNodes: any[] = [
  {
    //ts-ignore
    id: "computer",
    label: "Computer",
    icon: (
      <DesktopOutlined
        color="#007bff"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    ),
  },
  {
    id: "setting",
    label: "Setting",
    icon: (
      <SettingOutlined
        color="#ffc107"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    ),
  },
  {
    id: "user",
    label: "User",
    icon: (
      <UserOutlined
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    ),
  },
  {
    id: "cloud",
    label: "Cloud",
    icon: (
      <ApartmentOutlined
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    ),
  },
];

const sampleConnections: any[] = [
  { source: "computer", target: "setting" },
  { source: "computer", target: "user" },
  { source: "setting", target: "cloud" },
];

function Description({
  rootCauseDetails,
  scopeDetails,
  communicationDetails,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className=" top-0 z-10 p-4 bg-white">
      <Row gutter={16}>
        {/* Block 1 */}
        <Col span={8}>
          <Card style={{ height: 500 }} className="shadow pb-8">
            <div className="flex items-center space-x-2 mb-4">
              <InfoCircleOutlined
                style={{ fontSize: "24px", color: "rgb(239, 68, 68)" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {t("description_detail.title")}
                </Title>
                <Text>{t("description_detail.shortDescription")}</Text>
              </div>
            </div>
            {/* Collapses */}
            <Collapse>
              <Panel header={t("description_detail.rootCauseInfo")} key="1">
                <p>{rootCauseDetails}</p>
              </Panel>
              <Panel header={t("description_detail.scope")} key="2">
                <p>{scopeDetails}</p>
              </Panel>
              <Panel header={t("description_detail.communication")} key="3">
                <p>{communicationDetails}</p>
              </Panel>
            </Collapse>
          </Card>
        </Col>

        {/* Block 2 */}
        <Col span={16}>
          <Row content="" gutter={16}>
            {/* <Col span={18}>
              <Flow nodes={sampleNodes} connections={sampleConnections} />
            </Col> */}
            {/* <Col span={6}> */}
            <TimeLine />
            {/* </Col> */}
          </Row>
          <Row gutter={16}>
            <AffectedFile />
          </Row>
        </Col>
      </Row>
    </div>
  );
}
export default Description;
