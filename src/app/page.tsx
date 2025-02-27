"use client";
import { Button, Card, Row, Col, Typography, Progress } from "antd";
import ReactECharts from "echarts-for-react";
import {
  ExportOutlined,
  SyncOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import DatetimePicker from "@/components/DatetimePicker";
import { useDateContext } from "@/common/date-context";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export default function Home() {
  const { startDate, endDate } = useDateContext(); // Reducer sử dụng để set giá  trị cho startDate và endDate toàn bộ project
  console.log(startDate, endDate);
  const { t } = useTranslation();

  const statusPieOption = {
    title: {
      text: t("Active MalOps by Status"),
      left: "center",
      textStyle: {
        paddingTop: "40px",
        color: "rgba(0, 0, 0, 0.88)",
        fontWeight: "600",
        fontSize: "16px",
        fontFamily: "Segoe UI",
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data: [
          { value: 35, name: "New" },
          { value: 25, name: "Reopened" },
          { value: 40, name: "On Hold" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const severityPieOption = {
    title: {
      text: t("Active MalOps by Severity"),
      left: "center",
      textStyle: {
        paddingTop: "40px",
        color: "rgba(0, 0, 0, 0.88)",
        fontWeight: "600",
        fontSize: "16px",
        fontFamily: "Segoe UI",
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data: [
          { value: 45, name: "High" },
          { value: 35, name: "Medium" },
          { value: 20, name: "Low" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const lineChartOption = {
    title: {
      text: t("MalOps Trends"),
      left: "center",
      textStyle: {
        paddingTop: "40px",
        color: "rgba(0, 0, 0, 0.88)",
        fontWeight: "600",
        fontSize: "16px",
        fontFamily: "Segoe UI",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Total MalOps",
        type: "line",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "Closed MalOps",
        type: "line",
        data: [80, 92, 71, 94, 60, 180, 160],
      },
    ],
  };

  const columnChartOption = {
    title: {
      text: t("MalOps by Mitre Tactic"),
      left: "center",
      textStyle: {
        paddingTop: "40px",
        color: "rgba(0, 0, 0, 0.88)",
        fontWeight: "600",
        fontSize: "16px",
        fontFamily: "Segoe UI",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: [
        "Execution",
        "Persistence",
        "Defense Evasion",
        "Discovery",
        "Lateral Movement",
      ],
      axisLabel: { interval: 0, rotate: 30 },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70],
        type: "bar",
      },
    ],
  };

  const machineStatusPieOption = {
    title: {
      text: t("Machines by Status"),
      left: "center",
      textStyle: {
        paddingTop: "40px",
        color: "rgba(0, 0, 0, 0.88)",
        fontWeight: "600",
        fontSize: "16px",
        fontFamily: "Segoe UI",
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data: [
          { value: 35, name: "Infected online" },
          { value: 25, name: "Infected offline" },
          { value: 30, name: "Clean online" },
          { value: 10, name: "Clean offline" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return (
    <div className="grid  p-8 pb-20 gap-3 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full flex justify-between items-center bg-gray-100 py-4 rounded-lg">
        <div className="flex gap-4">
          <DatetimePicker />
        </div>

        <div className="flex gap-4">
          <Button
            type="primary"
            icon={
              <ExportOutlined
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
          >
            {t("Export")}
          </Button>
          <Button
            type="primary"
            icon={
              <SyncOutlined
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
          >
            {t("Refresh")}
          </Button>
        </div>
      </div>

      <Card style={{ height: "max-content" }} className="w-full">
        <Row gutter={[32, 32]}>
          {[
            {
              title: t("Total Detections"),
              value: 2851,
              percent: 12.5,
              increase: true,
            },
            {
              title: t("Total MalOps"),
              value: 1250,
              percent: -5.2,
              increase: false,
            },
            {
              title: t("Prevented MalOps"),
              value: 584,
              percent: 8.3,
              increase: true,
            },
            {
              title: t("Active MalOps"),
              value: 12420,
              percent: 15.8,
              increase: true,
            },
            {
              title: t("MTTR"),
              value: 892,
              percent: -2.4,
              increase: false,
            },
            {
              title: t("Affected Users"),
              value: 458,
              percent: 6.7,
              increase: true,
            },
            {
              title: t("Service Issues"),
              value: 23,
              percent: -12.3,
              increase: false,
            },
            {
              title: t("Affected Hosts"),
              value: 156,
              percent: 4.2,
              increase: true,
            },
          ].map((item, index) => (
            <Col key={index} span={3}>
              <div className="text-center">
                <Title level={5} style={{ marginBottom: "8px" }}>
                  {item.title}
                </Title>
                <div className="text-2xl font-bold mb-2">{item.value}</div>
                <div
                  className={`flex items-center justify-center gap-1 ${
                    item.increase ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.increase ? (
                    <ArrowUpOutlined
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  ) : (
                    <ArrowDownOutlined
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  )}
                  <span>{Math.abs(item.percent)}%</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
      <Row
        style={{ height: "max-content" }}
        gutter={[16, 16]}
        className="w-full"
      >
        <Col span={6}>
          <Card>
            <ReactECharts
              option={statusPieOption}
              style={{ height: "400px", fontFamily: "Roboto" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <ReactECharts
              option={severityPieOption}
              style={{ height: "400px" }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts
              option={lineChartOption}
              style={{ height: "400px" }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="w-full">
        <Col span={12}>
          <Card>
            <ReactECharts
              option={columnChartOption}
              style={{ height: "400px", fontFamily: "inherit" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card title={t("Top IOC's")} className="h-full">
            <div className="space-y-4">
              <div>
                <div className="mb-2">{t("File")}</div>
                <Progress percent={71.4} />
              </div>
              <div>
                <div className="mb-2">{t("Process")}</div>
                <Progress percent={28.6} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <ReactECharts
              option={machineStatusPieOption}
              style={{ height: "400px" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
