"use client";
import { FileOutlined } from "@ant-design/icons";
import { Typography, Divider, Collapse } from "antd";
import React from "react";
import getNodeIcon from "@/common/get-node-icon";

type FileEvent = {
  fields: {
    file_name: string;
    file_path: string;
  };
};

type ResultItem = {
  computer_name: string;
  mac: string;
  file_events: FileEvent[];
};

type Props = {
  data: any[];
};

export default function AffectedFile({ data }: Props) {
  const dataFile = React.useMemo(() => {
    const uniqueFiles = new Map<
      string,
      { name: string; path: string; icon: React.ReactNode }
    >();

    data.forEach((machine: any) => {
      machine.file_events.forEach((event: any) => {
        const { file_name, file_path } = event.fields || {};
        if (file_name && file_path) {
          const key = `${file_name}|${file_path}`;
          if (!uniqueFiles.has(key)) {
            uniqueFiles.set(key, {
              name: file_name,
              path: file_path,
              icon: getNodeIcon(file_name),
            });
          }
        }
      });
    });

    return Array.from(uniqueFiles.values());
  }, [data]);

  const items = [
    {
      key: "1",
      label: `${dataFile.length} Affected Files`,
      children: (
        <div className="space-y-4">
          {dataFile.map((file, index) => (
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
    <div className="w-full" style={{ maxHeight: "600px", overflowY: "scroll" }}>
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
      <Collapse items={items} defaultActiveKey={["1"]} />
    </div>
  );
}
