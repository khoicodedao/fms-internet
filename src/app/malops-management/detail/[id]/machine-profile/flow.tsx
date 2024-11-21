"use client";
import React, { useEffect, useRef } from "react";
import { jsPlumb } from "jsplumb";
import {
  DesktopOutlined,
  SettingOutlined,
  UserOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import { Divider } from "antd";
const { Title } = Typography;
const JsPlumbFlow = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instance = jsPlumb.getInstance({
      Connector: ["Bezier", { curviness: 50 }],
      Endpoint: ["Dot", { radius: 5 }],
      PaintStyle: { stroke: "#4caf50", strokeWidth: 2 },
      EndpointStyle: { fill: "#4caf50" },
      Anchors: ["Bottom", "Top"],
    });

    instance.setContainer(containerRef?.current);

    // Kết nối từ máy tính đến các thành phần khác
    instance.connect({
      source: "computer3",
      target: "file3",
      connector: "Straight",
    });
    instance.connect({
      source: "computer3",
      target: "database3",
      connector: "Straight",
    });
    instance.connect({
      source: "computer3",
      target: "cloud3",
      connector: "Straight",
    });

    return () => instance.deleteEveryEndpoint();
  }, []);

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <ApartmentOutlined
          style={{ fontSize: "24px", color: "rgb(239, 68, 68)" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <div>
          <Title level={5} style={{ margin: 0 }}>
            Flow chart
          </Title>
        </div>
      </div>
      <Divider />
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "500px",
          position: "relative",
          padding: "20px",
        }}
      >
        {/* Máy tính ở trên cùng */}
        <div
          id="computer3"
          style={{ ...nodeStyle, top: "50px", left: "calc(50% - 50px)" }}
        >
          <DesktopOutlined
            style={{ ...iconStyle, color: "#007bff" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div>computer</div>
        </div>

        {/* Các icon khác ở phía dưới theo hàng ngang */}
        <div
          id="file3"
          style={{ ...nodeStyle, top: "300px", left: "calc(50% - 250px)" }}
        >
          <SettingOutlined
            style={{ ...iconStyle, color: "#28a745" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div>Setting</div>
        </div>

        <div
          id="database3"
          style={{ ...nodeStyle, top: "300px", left: "calc(50% - 50px)" }}
        >
          <UserOutlined
            style={{ ...iconStyle, color: "#ffc107" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div>User</div>
        </div>

        <div
          id="cloud3"
          style={{ ...nodeStyle, top: "300px", left: "calc(50% + 150px)" }}
        >
          <ApartmentOutlined
            style={{ ...iconStyle, color: "#17a2b8" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div>Cloud</div>
        </div>
      </div>
    </>
  );
};

// Style cho các node
const nodeStyle: React.CSSProperties = {
  width: "100px",
  height: "100px",
  background: "#f0f2f5",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #d9d9d9",
  borderRadius: "5px",
  position: "absolute",
  cursor: "pointer",
};

const iconStyle: React.CSSProperties = {
  fontSize: "30px",
};

export default JsPlumbFlow;
