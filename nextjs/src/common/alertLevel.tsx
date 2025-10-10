import React from "react";
import { Tag } from "antd";

export type AlertLevelType = 1 | 2 | 3;

interface AlertLevelProps {
  level: AlertLevelType;
}

const alertLevelConfig: Record<
  AlertLevelType,
  { label: string; color: string }
> = {
  1: { label: "Low", color: "green" },
  2: { label: "Medium", color: "orange" },
  3: { label: "High", color: "red" },
};

const AlertLevel: React.FC<AlertLevelProps> = ({ level }) => {
  const config = alertLevelConfig[level] || { label: "Info", color: "gray" };

  return <Tag color={config.color}>{config.label}</Tag>;
};

export default AlertLevel;
