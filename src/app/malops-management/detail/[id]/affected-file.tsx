import {
  FileOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { Typography, Divider, Collapse } from "antd";
import React from "react";

export default function AffectedFile() {
  const files = [
    {
      icon: (
        <FileWordOutlined
          style={{ color: "#2B579A" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      name: "65.Ke-hoach-tham-dong-vu-He-thu-2022_ledinhdungkytrung-25-08-2022_07h24p56.docx",
      path: "C:\\Users\\Admin\\Desktop",
    },
    {
      icon: (
        <FileWordOutlined
          style={{ color: "#2B579A" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      name: "1584519870255_Moi truong Huyen.docx",
      path: "C:\\Users\\Admin\\Desktop",
    },
    {
      icon: (
        <FileExcelOutlined
          style={{ color: "#217346" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      name: "bieu-mau-xd-ke-hoach-nam-2024.xlsx",
      path: "C:\\Users\\Admin\\Desktop",
    },
    {
      icon: (
        <FilePdfOutlined
          style={{ color: "#FF0000" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      name: "0_20240125103910.pdf",
      path: "C:\\Users\\Admin\\Desktop",
    },
    {
      icon: (
        <FilePdfOutlined
          style={{ color: "#FF0000" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      name: "120240319153658.pdf",
      path: "C:\\Users\\Admin\\Desktop",
    },
    {
      icon: (
        <FileWordOutlined
          style={{ color: "#2B579A" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      name: "1584519870255_Moi truong Huyen.docx",
      path: "C:\\Users\\manhd\\Desktop",
    },
    {
      icon: (
        <FilePdfOutlined
          style={{ color: "#FF0000" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      name: "120240319153658.pdf",
      path: "C:\\Users\\manhd\\Desktop",
    },
    {
      icon: (
        <FilePdfOutlined
          style={{ color: "#FF0000" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      name: "0_20240125103910.pdf",
      path: "C:\\Users\\manhd\\Desktop",
    },
    {
      icon: (
        <FilePdfOutlined
          style={{ color: "#FF0000" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      name: "3 BCTH KHBVMT Phu Giao.pdf",
      path: "C:\\Users\\manhd\\Desktop",
    },
    {
      icon: (
        <FileWordOutlined
          style={{ color: "#2B579A" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
      name: "65.Ke-hoach-tham-dong-vu-He-thu-2022_ledinhdungkytrung-25-08-2022_07h24p56.docx",
      path: "C:\\Users\\manhd\\Desktop",
    },
  ];

  const items = [
    {
      key: "1",
      label: "10 Affected Files",
      children: (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
            >
              {file.icon}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">{file.path}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-4">
        <FileOutlined
          style={{ fontSize: "24px", color: "rgb(239, 68, 68)" }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Affected Files
          </Typography.Title>
        </div>
      </div>
      <Divider />
      <Collapse items={items} />
    </div>
  );
}
