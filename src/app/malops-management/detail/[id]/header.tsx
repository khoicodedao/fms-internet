/* eslint-disable */
"use client";
import { Card, Typography } from "antd";
const { Title, Text } = Typography;
import formatDateTime from "@/common/formatDate";
import { ClockCircleOutlined } from "@ant-design/icons";

//@ts-ignore
const ObjectDetailHeader = ({
  icon,
  title,
  description,
  time_start,
  time_end,
}) => {
  return (
    <div className="flex items-center justify-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10 shadow">
      {/* Icon bên trái */}
      <div className="mr-4 text-6xl">
        {icon} {/* Đây là icon được truyền vào từ props */}
      </div>
      {/* Phần chứa tiêu đề và mô tả */}
      <div className="flex-1">
        {/* Block title màu đỏ */}
        {/* <p className="text-red-500 text-sm font-bold">{type}</p> */}
        <h3 className="text-xl font-bold">{title}</h3>
        {/* Mô tả bên dưới */}
        <p className="text-gray-700 opacity-75">{description}</p>
      </div>
      {/* Selector thời gian bên phải */}
      <div className="mr-4">
        <div className="flex items-center mb-2">
          <ClockCircleOutlined
            style={{ color: "#1890ff", marginRight: 8 }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <Text strong>Thời gian bắt đầu: </Text>{" "}
          <Text>{formatDateTime({ value: time_start })}</Text>
        </div>
        <div className="flex items-center">
          <ClockCircleOutlined
            style={{ color: "#ff4d4f", marginRight: 8 }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <Text strong>Thời gian kết thúc: </Text>{" "}
          <Text>{formatDateTime({ value: time_end })}</Text>
        </div>
      </div>
    </div>
  );
};

export default ObjectDetailHeader;
