/* eslint-disable */
"use client";
import React from "react";
import {
  Collapse,
  Row,
  Col,
  Typography,
  Tag,
  Descriptions,
  Tooltip,
} from "antd";
import {
  BulbOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
  InfoCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "reactflow/dist/style.css";
const { Text, Title } = Typography;
const { Panel } = Collapse;
// import AffectedFile from "./affected-file";
import TimeLine from "./time-line";
type Props = {
  tatics?: string;
  techniques?: string;
  targetProcess: Object;
  events: any;
};

function Description({ tatics, techniques, targetProcess, events }: Props) {
  const { t } = useTranslation();
  const renderTags = (items: string) => {
    if (!items) return null;

    return items.split(",").map((item) => {
      const trimmedItem = item.trim();
      const isTactic = /^TA\d{4}$/.test(trimmedItem); // e.g. TA0001
      const isTechnique = /^T\d{4}(\.\d{3})?$/.test(trimmedItem); // e.g. T1059 or T1059.001

      let url = "#";
      let description = "Thông tin chưa có";

      if (isTactic) {
        url = `https://attack.mitre.org/tactics/${trimmedItem}/`;
        description = `Tactic ${trimmedItem} - Xem chi tiết tại MITRE`;
      } else if (isTechnique) {
        url = `https://attack.mitre.org/techniques/${trimmedItem}/`;
        description = `Technique ${trimmedItem} - Xem chi tiết tại MITRE`;
      }

      return (
        <Tooltip key={trimmedItem} title={description}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Tag color="blue">{trimmedItem}</Tag>
          </a>
        </Tooltip>
      );
    });
  };
  return (
    <div className=" top-0 z-10 p-4 bg-white">
      <Row gutter={16}>
        {/* Block 1 */}
        <Col span={8}>
          <div style={{ height: 500 }} className="pb-8">
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

            <Collapse defaultActiveKey={["1", "2", "3"]}>
              <Panel
                header={
                  <span>
                    <BulbOutlined
                      style={{ marginRight: 8, color: "#eab308" }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    {t("Tatics")}
                  </span>
                }
                key="1"
              >
                {renderTags(tatics || "")}
              </Panel>

              <Panel
                header={
                  <span>
                    <ToolOutlined
                      style={{ marginRight: 8, color: "#3b82f6" }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    {t("Techniques")}
                  </span>
                }
                key="2"
              >
                {renderTags(techniques || "")}
              </Panel>

              <Panel
                header={
                  <span>
                    <FileSearchOutlined
                      style={{ marginRight: 8, color: "#10b981" }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    Chi tiết file
                  </span>
                }
                key="3"
              >
                <Descriptions
                  className="max-h-96 overflow-y-scroll"
                  bordered
                  size="default"
                  column={1}
                >
                  {Object.entries(targetProcess?.file_info || []).map(
                    ([key, value]) => (
                      <Descriptions.Item label={key} key={key}>
                        {value && value !== "" ? value : "—"}
                      </Descriptions.Item>
                    )
                  )}
                </Descriptions>
              </Panel>
            </Collapse>
          </div>
        </Col>

        {/* Block 2 */}
        <Col span={16}>
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ClockCircleOutlined
                style={{ fontSize: "24px", color: "rgb(239, 68, 68)" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Timeline
                </Title>
              </div>
            </div>
            <TimeLine events={events} />
          </div>
          {/* <Row gutter={16}>
            <AffectedFile />
          </Row> */}
        </Col>
      </Row>
    </div>
  );
}
export default Description;
