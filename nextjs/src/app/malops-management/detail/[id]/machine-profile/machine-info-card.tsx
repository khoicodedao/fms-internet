import {
  DesktopOutlined,
  WindowsOutlined,
  GlobalOutlined,
  CloudOutlined,
  MacCommandOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Progress } from "antd";

export default function MachineInfoCard({ machine }: { machine: any }) {
  const InfoBlock = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string | React.ReactNode;
  }) => (
    <div className="flex flex-col items-start space-y-1">
      <div className="text-base">{icon}</div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium break-words max-w-[200px]">
        {value || "-"}
      </div>
    </div>
  );

  const parsePercent = (value: string | undefined) => {
    if (!value) return 0;
    const match = value.match(/(\d+(\.\d+)?)%/);
    return match ? parseFloat(match[1]) : 0;
  };

  const cpuPercent = parsePercent(machine?.cpu_use);
  const memPercent = parsePercent(machine?.memory_use);

  return (
    <Card>
      <Row gutter={[24, 24]}>
        {/* 8 mục chia đều thành 2 hàng (mỗi hàng 4 cột) */}
        <Col xs={24} sm={12} md={6}>
          <InfoBlock
            icon={
              <DesktopOutlined
                style={{ color: "#1890ff" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            label="Machine Name"
            value={machine?.machine_name}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InfoBlock
            icon={
              <WindowsOutlined
                style={{ color: "#722ed1" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            label="Operating System"
            value={machine?.os}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InfoBlock
            icon={
              <CloudOutlined
                style={{ color: "#52c41a" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            label="Internal IP"
            value={machine?.internal_ip}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InfoBlock
            icon={
              <GlobalOutlined
                style={{ color: "#13c2c2" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            label="Public IP"
            value={machine?.public_ip}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <InfoBlock
            icon={
              <MacCommandOutlined
                style={{ color: "#fa8c16" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            label="MAC Address"
            value={machine?.mac_address}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InfoBlock
            icon={
              <ClockCircleOutlined
                style={{ color: "#8c8c8c" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            label="Last Seen"
            value={
              machine?.last_seen
                ? new Date(machine.last_seen).toLocaleString()
                : "-"
            }
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InfoBlock
            icon={
              <LineChartOutlined
                style={{ color: "#eb2f96" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            label="CPU Usage"
            value={
              <Progress
                type="circle"
                percent={cpuPercent}
                size={60}
                strokeColor="#eb2f96"
                format={(p) => `${p}%`}
              />
            }
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InfoBlock
            icon={
              <LineChartOutlined
                style={{ color: "#722ed1" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            label="Memory Usage"
            value={
              <Progress
                type="circle"
                percent={memPercent}
                size={60}
                strokeColor="#722ed1"
                format={(p) => `${p}%`}
              />
            }
          />
        </Col>
      </Row>
    </Card>
  );
}
