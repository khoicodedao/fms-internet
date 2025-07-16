"use client";
import { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/standalone";
import { DataItem } from "vis-timeline";
import { WindowsOutlined, ToolOutlined, FileOutlined } from "@ant-design/icons";
import ReactDOMServer from "react-dom/server";

type FileInfo = {
  file_path: string;
  created_at: string;
  signer: string;
};

type Process = {
  xxHash_path: string;
  file_info: FileInfo;
};

type Props = {
  processList: Process[];
};

const getIcon = (path: string) => {
  if (path.toLowerCase().includes("explorer")) return "🪟";
  if (path.toLowerCase().includes("procexp")) return "🛠️";
  return "📄";
};

export default function SimpleTimeline({ processList }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items: DataItem[] = processList.map((proc) => ({
      id: proc.xxHash_path,
      content: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="font-size:20px;">${getIcon(
            proc.file_info.file_path
          )}</div>
          <div style="margin-top:2px;font-size:13px;">${proc.file_info.file_path
            .split("\\")
            .pop()}</div>
        </div>
      `,
      start: proc.file_info.created_at,
      title: `
        <strong>${proc.file_info.file_path}</strong><br/>
        Signer: ${proc.file_info.signer}<br/>
        Created at: ${proc.file_info.created_at}
      `,
    }));

    const options = {
      stack: false,
      orientation: "top",
      margin: { item: 20 },
      zoomKey: "ctrlKey",
      maxHeight: "300px",
    };

    const timeline = new Timeline(containerRef.current!, items, options);
    return () => timeline.destroy();
  }, [processList]);

  return (
    <div
      className="mb-4"
      ref={containerRef}
      style={{ border: "1px solid #ddd" }}
    />
  );
}
