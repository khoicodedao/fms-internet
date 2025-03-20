import React from "react";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

export type SocketStatusType =
  | "ESTABLISHED"
  | "TIME-WAIT"
  | "CLOSED"
  | "UNKNOWN"
  | "REMOVE"; // Added "REMOVED"

interface SocketStatusProps {
  status: SocketStatusType;
}

const socketStatusConfig: Record<
  SocketStatusType,
  { label: string; color: string; icon: React.ReactNode }
> = {
  ESTABLISHED: {
    label: "Established",
    color: "green",
    icon: (
      <CheckCircleOutlined
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    ),
  },
  "TIME-WAIT": {
    label: "Time-Wait",
    color: "orange",
    icon: (
      <ClockCircleOutlined
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    ),
  },
  CLOSED: {
    label: "Closed",
    color: "red",
    icon: (
      <CloseCircleOutlined
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    ),
  },
  UNKNOWN: {
    label: "Unknown",
    color: "gray",
    icon: (
      <QuestionCircleOutlined
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    ),
  },
  REMOVE: {
    label: "Remove",
    color: "gray",
    icon: (
      <DeleteOutlined
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    ),
  },
};

const SocketStatus: React.FC<SocketStatusProps> = ({ status }) => {
  const config = socketStatusConfig[status] || socketStatusConfig.UNKNOWN;

  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};

export default SocketStatus;
