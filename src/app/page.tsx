/* eslint-disable  */
"use client";
import { Button, Card, Row, Col, Typography, Statistic } from "antd";
import ReactECharts from "echarts-for-react";
import {
  ExportOutlined,
  SyncOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileOutlined,
  SettingOutlined,
  CloudOutlined,
  AlertOutlined,
  DesktopOutlined,
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
import { useRouter } from "next/navigation";
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
  countProcess: number;
  countHttp: number;
  countalertDeviceTotal: number;
};
//@ts-ignore
import { saveAs } from "file-saver";
export default function Home() {
  const { startDate, endDate } = useDateContext(); // Reducer sử dụng để set giá  trị cho startDate và endDate toàn bộ project
  const [data, setData] = useState<DashboardData>({} as DashboardData);
  const [tatic, setTatic] = useState([]);
  const exportToJson = () => {
    const jsonData = JSON.stringify(data, null, 2); // Chuyển đổi dữ liệu thành JSON
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, "dashboard-data.json"); // Tải file với tên "dashboard-data.json"
  };
  const { mutation: mutationTactic } = usePostApi(
    API_URL.HOME_PAGE.TATIC,
    false
  );
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
    mutationTactic.mutate(
      {
        start_date: startDate,
        end_date: endDate,
      },
      {
        onSuccess: (response: any) => {
          // Kiểm tra nếu API trả về thành công
          setTatic(response.data);
        },
      }
    );
  }, [startDate, endDate]);
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
      formatter: "{b}: {d}%",
    },
    legend: {
      orient: "vertical", // sửa chính tả: horizontal | vertical
      right: 0,
      top: "middle",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        label: {
          show: true,
          formatter: (params: any) => {
            return `${params.value.toLocaleString("vi-VN")}`;
          },
        },
        data: [
          { value: data.countSocket, name: "Socket" },
          { value: data.countRegistry, name: "Registry" },
          { value: data.countFile, name: "File" },
          { value: data.countFlow, name: "Flow" },
          { value: data.countProcess, name: "Process" },
          { value: data.countHttp, name: "Http" },
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
    graphic: [
      {
        type: "group",
        left: "center",
        top: "middle",
        children: [
          {
            type: "text",
            style: {
              text: `${(
                (data.countSocket || 0) +
                (data.countRegistry || 0) +
                (data.countFile || 0) +
                (data.countFlow || 0) +
                (data.countProcess || 0) +
                (data.countHttp || 0)
              ).toLocaleString("vi-VN")}`,
              fill: "#000",
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: "Segoe UI",
              textAlign: "center",
            },
          },
          {
            type: "text",
            top: 25,
            style: {
              text: "Total",
              fill: "rgba(0,0,0,0.6)",
              fontSize: 14,
              fontFamily: "Segoe UI",
              textAlign: "center",
            },
          },
        ],
      },
    ],
  };

  const onChartNDRClick = (params: any) => {
    router.push("/ndr");
  };
  const onChartEDRClick = (params: any) => {
    router.push("/edr");
  };

  const ndrPieOption = {
    title: {
      text: t("NDR Status"),
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
      formatter: "{b}: {d}%",
    },
    legend: {
      bottom: "5%",
      left: "center", // nếu muốn căn giữa
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data: [
          { value: data.countNdrOnline, name: "Online" },
          { value: data.countNdrTotal - data.countNdrOnline, name: "Offline" },
        ],
        label: {
          show: true,
          formatter: (params: any) => {
            return `${params.value.toLocaleString("vi-VN")}`;
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: `${data.countNdrTotal}`, // số tổng hiển thị
          fill: "#000",
          fontSize: 18,
          fontWeight: "bold",
          fontFamily: "Segoe UI",
        },
      },
      {
        type: "text",
        top: 25,
        style: {
          text: "Total",
          fill: "rgba(0,0,0,0.6)",
          fontSize: 14,
          fontFamily: "Segoe UI",
          textAlign: "center",
        },
      },
    ],
  };
  const lineChartOption = {
    title: {
      text: "MalOps by Unit",
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
      data: ["TT586", "TT186", "TT286", "TT386", "TT486"],
      axisLabel: { interval: 0, rotate: 30 },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Total MalOps",
        type: "bar",
        data: [120, 132, 101, 134, 90],
      },
    ],
  };
  const router = useRouter();

  const onBarClick = (params: any) => {
    if (params?.componentType !== "series") return;
    const label = String(params.name ?? "");
    router.push(`/mittre-events?tatic=${encodeURIComponent(label)}`);
    // Nếu muốn thay lịch sử:
    // router.replace(`/mittre-events?tatic=${encodeURIComponent(label)}`);
  };

  const columnChartOption = useMemo(() => {
    const xLabels = tatic.map((item: any) => item.tactic || "Unknown");
    const yValues = tatic.map((item: any) => item.count);

    return {
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
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: xLabels,
        axisLabel: { interval: 0, rotate: 30 },
      },
      yAxis: { type: "value" },
      series: [
        {
          data: yValues,
          type: "bar",
          itemStyle: { color: "#5C7BD9" },
        },
      ],
    };
  }, [tatic, t]);

  const machineStatusPieOption = useMemo(() => {
    const total = (data.countEdrTotal || 0) ?? 0;

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
        formatter: "{b}: {d}%",
      },
      legend: {
        bottom: "5%",
        left: "center",
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          label: {
            show: true,
            formatter: (params: any) => {
              return ` ${params.value.toLocaleString("vi-VN")}`;
            },
          },
          data: [
            { value: data.countEdrOnline || 0, name: "Online" },
            {
              value: (data.countEdrTotal || 0) - (data.countEdrOnline || 0),
              name: "Offline",
            },
          ],
        },
      ],
      graphic: [
        {
          type: "group",
          left: "center",
          top: "middle",
          children: [
            {
              type: "text",
              style: {
                text: `${total.toLocaleString("vi-VN")}`,
                fill: "#000",
                fontSize: 20,
                fontWeight: "bold",
                fontFamily: "Segoe UI",
                textAlign: "center",
              },
            },
            {
              type: "text",
              top: 25,
              style: {
                text: "Total",
                fill: "rgba(0,0,0,0.6)",
                fontSize: 14,
                fontFamily: "Segoe UI",
                textAlign: "center",
              },
            },
          ],
        },
      ],
    };
  }, [data]);

  return (
    <div className="home-page grid p-2 gap-1 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full flex justify-end items-center  rounded-lg">
        <div className="flex gap-1 mr-1">
          <DatetimePicker />
        </div>
        <div className="flex">
          <Button
            type="primary"
            icon={
              <ExportOutlined
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            className="mr-1"
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
              title: "Alert",
              tab: "",
              value: data.countAlert || 0,
              icon: (
                <AlertOutlined
                  style={{ color: "#faad14", marginRight: "8px" }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
            },
            {
              title: "Device",
              tab: "",
              value: data.countalertDeviceTotal || 0,
              icon: (
                <DesktopOutlined
                  style={{ color: "#eb2f96", marginRight: "8px" }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
            },

            {
              title: "Process Event",
              tab: "process",
              value: data.countProcess || 0,
              icon: (
                <SettingOutlined
                  style={{ color: "#ff4d4f", marginRight: "8px" }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
            },
            {
              title: "File Event",
              tab: "file",
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
              title: "Socket Event",
              tab: "socket",
              value: data?.countSocket || 0,
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
              tab: "registry",
              value: data.countRegistry || 0,
              icon: (
                <DatabaseOutlined
                  style={{ color: "#52c41a", marginRight: "8px" }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
            },
          ].map((item, index) => (
            <Col key={index} span={4}>
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
                  <Link
                    style={{ color: "var(--textDark)" }}
                    href={`/events?tab=${item.tab}`}
                  >
                    {item.title}
                  </Link>
                </Title>
                <div className="flex justify-center">
                  <Statistic
                    value={item.value}
                    formatter={(value) => (
                      //@ts-ignore
                      <CountUp end={value} duration={1} separator="." />
                    )}
                    className="text-2xl font-bold mb-2"
                  />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
      <Card>
        <Row
          style={{ height: "max-content" }}
          gutter={[16, 16]}
          className="w-full"
        >
          <Col span={12}>
            <div>
              <ReactECharts
                option={statusPieOption}
                style={{ height: "300px", fontFamily: "Roboto" }}
              />
            </div>
          </Col>

          <Col span={12}>
            <div>
              <ReactECharts
                option={lineChartOption}
                style={{ height: "300px" }}
              />
            </div>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={[16, 16]} className="w-full">
          <Col span={12}>
            <div>
              <ReactECharts
                option={columnChartOption}
                onEvents={{ click: onBarClick }}
                style={{ height: 300 }}
              />
            </div>
          </Col>
          <Col span={6}>
            <div className="h-full">
              <ReactECharts
                onEvents={{ click: onChartNDRClick }}
                option={ndrPieOption}
                style={{ height: "300px" }}
              />
            </div>
          </Col>
          <Col span={6}>
            <div>
              {data.countEdrTotal !== undefined &&
              data.countEdrOnline !== undefined ? (
                <ReactECharts
                  option={machineStatusPieOption}
                  onEvents={{ click: onChartEDRClick }}
                  style={{ height: "300px" }}
                />
              ) : (
                <div
                  style={{ height: "300px" }}
                  className="flex justify-center items-center"
                >
                  Loading...
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
