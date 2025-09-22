"use client";
import API_URL from "@/common/api-url";
import { usePostApi } from "@/common/usePostApi";
import { FileOutlined } from "@ant-design/icons";
import { Typography, Divider, Collapse } from "antd";
import React, { useEffect } from "react";
import getNodeIcon from "@/common/get-node-icon";

export default function AffectedFile() {
  const { mutation } = usePostApi(API_URL.EVENT_PAGE.DEFAULT, false);
  const [dataFile, setDataFile] = React.useState<any[]>([]);

  useEffect(() => {
    mutation.mutate(
      {
        start_date: "2025",
        end_date: "2026",
        skip: 0,
        limit: 50,
        object: "File",
      },
      {
        onSuccess: (response: any) => {
          console.log(response.data.events);
          const mappedData = response.data.events.map((event: any) => ({
            icon: getNodeIcon(event.fields.file_name),
            name: event.fields.file_name,
            path: event.fields.file_path,
          }));
          setDataFile(mappedData);
        },
      }
    );
  }, []);

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
      <Collapse items={items} defaultActiveKey={["1"]} />
    </div>
  );
}
