// VirtualListTable.tsx
import React, { useState } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import ReactJson from "react-json-view";

type Row = {
  name?: string;
  log_time?: string;
  data?: {
    action?: string;
    fields?: {
      image_path?: string;
      pid?: string | number;
      md5_hash?: string;
      host_name?: string;
    };
  };
};

interface VirtualListTableProps {
  currentData: Row[];
  height?: number; // chiều cao viewport
  rowHeight?: number; // chiều cao mỗi hàng (collapsed)
}

export default function VirtualListTable({
  currentData,
  height = 520,
  rowHeight = 40,
}: VirtualListTableProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const cols = "180px 140px 1fr 100px 260px 200px 72px";

  const RowRenderer = ({ index, style }: ListChildComponentProps) => {
    const record = currentData[index];
    const isExpanded = expandedIndex === index;

    return (
      <div style={{ ...style, borderBottom: "1px solid #f1f5f9" }}>
        {/* row chính */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 8,
            alignItems: "center",
            padding: "8px 12px",
            background: isExpanded ? "#fafafa" : "#fff",
          }}
        >
          <div>{record?.log_time || "-"}</div>
          <div>{record?.data?.action || "-"}</div>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={record?.data?.fields?.image_path || "-"}
          >
            {record?.data?.fields?.image_path || "-"}
          </div>
          <div>{record?.data?.fields?.pid ?? "-"}</div>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={record?.data?.fields?.md5_hash || "-"}
          >
            {record?.data?.fields?.md5_hash || "-"}
          </div>
          <div>{record?.data?.fields?.host_name || "-"}</div>
          <div>
            <button
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              style={{
                fontSize: 12,
                padding: "4px 8px",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                background: "white",
                cursor: "pointer",
              }}
            >
              {isExpanded ? "Hide" : "View"}
            </button>
          </div>
        </div>

        {/* phần expand (render thêm ngay dưới hàng) */}
        {isExpanded && (
          <div style={{ background: "#fff", padding: 12 }}>
            <ReactJson
              src={record}
              displayDataTypes={false}
              enableClipboard
              style={{ padding: 10 }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: cols,
          gap: 8,
          alignItems: "center",
          background: "#f3f4f6",
          fontWeight: 600,
          padding: "10px 12px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div>Alert time</div>
        <div>Action</div>
        <div>Image path</div>
        <div>Pid</div>
        <div>Md5</div>
        <div>Hostname</div>
        <div></div>
      </div>

      {/* virtual list */}
      <List
        height={height}
        itemCount={currentData.length}
        itemSize={rowHeight}
        width="100%"
      >
        {RowRenderer}
      </List>
    </div>
  );
}
