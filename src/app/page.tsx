/* eslint-disable  */
"use client";
import { Button, Card, Row, Col, Typography, Progress, Statistic } from "antd";
import ReactECharts from "echarts-for-react";
import {
  ExportOutlined,
  SyncOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileOutlined,
} from "@ant-design/icons";
import DatetimePicker from "@/components/DatetimePicker";
import { useDateContext } from "@/common/date-context";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
const { Title } = Typography;
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import CountUp from "react-countup";
import Link from "next/link";
type DashboardData = {
  countEdrTotal: number;
  countNdrTotal: number;
  countEdrOnline: number;
  countNdrOnline: number;
  countAlert: number;
  countSocket: number;
  countRegistry: number;
  countFile: number;
  countFlow: number;
};
//@ts-ignore
import { saveAs } from "file-saver";
export default function Home() {
  const { startDate, endDate } = useDateContext(); // Reducer sử dụng để set giá  trị cho startDate và endDate toàn bộ project
  const [data, setData] = useState<DashboardData>({} as DashboardData);
  const exportToJson = () => {
    const jsonData = JSON.stringify(data, null, 2); // Chuyển đổi dữ liệu thành JSON
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, "dashboard-data.json"); // Tải file với tên "dashboard-data.json"
  };
  const { mutation, contextHolder } = usePostApi(
    API_URL.HOME_PAGE.DEFAULT,
    false
  );
  useEffect(() => {
    mutation.mutate(
      {
        start_date: startDate,
        end_date: endDate,
      },
      {
        onSuccess: (response: any) => {
          // Kiểm tra nếu API trả về thành công
          setData(response.data);
        },
      }
    );
  }, []);
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
  const machineStatusPieOption = useMemo(() => {
    return {
      title: {
        text: "EDR Status",
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
            { value: data.countEdrOnline || 0, name: "Online" },
            {
              value: data.countEdrTotal,
              name: "Offline",
            },
          ],
        },
      ],
    };
  }, [data]); //
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
            onClick={exportToJson}
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
            onClick={() => {
              mutation.mutate(
                {
                  start_date: startDate,
                  end_date: endDate,
                },
                {
                  onSuccess: (response: any) => {
                    setData(response.data); // Update the dashboard data
                  },
                }
              );
            }}
          >
            {t("Refresh")}
          </Button>
        </div>
      </div>
      <Card style={{ height: "max-content" }} className="w-full">
        <Row gutter={[16, 16]}>
          {[
            {
              title: "Socket Event",
              value: data.countSocket || 0,
              icon: (
                <ClusterOutlined
                  style={{ color: "#1890ff", marginRight: "8px" }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
            },
            {
              title: "Registry Event",
              value: data.countRegistry || 0,
              icon: (
                <DatabaseOutlined
                  style={{ color: "#52c41a", marginRight: "8px" }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
            },
            {
              title: "File Event",
              value: data.countFile || 0,
              icon: (
                <FileOutlined
                  style={{ color: "#faad14", marginRight: "8px" }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
            },
            {
              title: "Flow Event",
              value: data.countFlow || 0,
              icon: (
                <DeploymentUnitOutlined
                  style={{ color: "#eb2f96", marginRight: "8px" }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
            },
          ].map((item, index) => (
            <Col key={index} span={6}>
              <div className="text-center">
                <Title
                  level={5}
                  style={{
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                  <Link style={{ color: "var(--textDark)" }} href={"/events"}>
                    {item.title}
                  </Link>
                </Title>
                <div className="flex justify-center">
                  <Statistic
                    value={item.value}
                    formatter={(value) => (
                      //@ts-ignore
                      <CountUp end={value} duration={1} separator="," />
                    )}
                    className="text-2xl font-bold mb-2"
                  />
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
            {data.countEdrTotal !== undefined &&
            data.countEdrOnline !== undefined ? (
              <ReactECharts
                option={machineStatusPieOption}
                style={{ height: "400px" }}
              />
            ) : (
              <div
                style={{ height: "400px" }}
                className="flex justify-center items-center"
              >
                Loading...
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
