import React from "react";
import { Badge } from "antd";
import { BadgeProps } from "antd/lib/badge";

export type StatusType =
  | "running"
  | "stopped"
  | "warning"
  | "error"
  | "processing"
  | "default";

interface StatusProps {
  status: StatusType;
  text?: string;
}

const statusConfig: Record<
  StatusType,
  { status: BadgeProps["status"]; text: string }
> = {
  running: {
    status: "success",
    text: "Running",
  },
  stopped: {
    status: "error",
    text: "Stopped",
  },
  warning: {
    status: "warning",
    text: "Warning",
  },
  error: {
    status: "error",
    text: "Error",
  },
  processing: {
    status: "processing",
    text: "Processing",
  },
  default: {
    status: "default",
    text: "Default",
  },
};

// eslint-disable-next-line react/display-name
const Status: React.FC<StatusProps> = React.memo(({ status, text }) => {
  const config = statusConfig[status] || statusConfig.default;

  return <Badge status={config.status} text={text || config.text} />;
});

Status.defaultProps = {
  text: undefined,
};

export default Status;
