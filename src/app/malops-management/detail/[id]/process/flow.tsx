/* eslint-disable */
"use client";
import React, { useEffect, useRef } from "react";
import { jsPlumb } from "jsplumb";
import {
  FileOutlined,
  ApartmentOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import { Divider } from "antd";
const { Title } = Typography;

const JsPlumbFlow = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // @ts-ignore
  useEffect(() => {
    const instance = jsPlumb.getInstance({
      Connector: ["Bezier", { curviness: 50 }],
      Endpoint: ["Dot", { radius: 5 }],
      PaintStyle: { stroke: "#4caf50", strokeWidth: 2 },
      EndpointStyle: { fill: "#4caf50" },
      Anchors: ["Bottom", "Top"],
    });
    // @ts-ignore
    instance.setContainer(containerRef?.current);

    // Connect parent process to child processes
    instance.connect({
      source: "parent-process",
      target: "child-process-1",
      connector: "Straight",
    });
    instance.connect({
      source: "parent-process",
      target: "child-process-2",
      connector: "Straight",
    });
    instance.connect({
      source: "parent-process",
      target: "child-process-3",
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
            Process Flow Chart
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
        {/* Parent process */}
        <div
          id="parent-process"
          style={{ ...nodeStyle, top: "50px", left: "calc(50% - 50px)" }}
        >
          <FileOutlined
            style={{ ...iconStyle, color: "#007bff" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div>Parent Process</div>
        </div>

        {/* Child processes */}
        <div
          id="child-process-1"
          style={{ ...nodeStyle, top: "300px", left: "calc(50% - 250px)" }}
        >
          <SettingOutlined
            style={{ ...iconStyle, color: "#28a745" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div>Child Process 1</div>
        </div>

        <div
          id="child-process-2"
          style={{ ...nodeStyle, top: "300px", left: "calc(50% - 50px)" }}
        >
          <SettingOutlined
            style={{ ...iconStyle, color: "#ffc107" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div>Child Process 2</div>
        </div>

        <div
          id="child-process-3"
          style={{ ...nodeStyle, top: "300px", left: "calc(50% + 150px)" }}
        >
          <SettingOutlined
            style={{ ...iconStyle, color: "#17a2b8" }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div>Child Process 3</div>
        </div>
      </div>
    </>
  );
};

// Style for the nodes
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
