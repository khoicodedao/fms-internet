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
};
// Dữ liệu mẫu

function Description({ rootCauseDetails }: Props) {
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
              </div>
            </div>
            {/* Collapses */}
            <Collapse defaultActiveKey={["1"]}>
              <Panel header={t("description_detail.rootCauseInfo")} key="1">
                <p>{rootCauseDetails}</p>
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
