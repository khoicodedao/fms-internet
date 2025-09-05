/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { Card, Tree, Dropdown, Button } from "antd";
import { DownOutlined, ClusterOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";

type UnitNode = {
  unitName: string;
  unitCode: string;
  children?: UnitNode[];
};

const mockData: UnitNode[] = [
  {
    unitName: "ALL",
    unitCode: "",
    children: [
      {
        unitName: "Bộ tư lệnh 86",
        unitCode: "Z8M1K4T9QP2J",
        children: [
          { unitName: "Trung tâm 586", unitCode: "A001-HN-KD" },
          { unitName: "Trung tâm 186", unitCode: "A001-HN-KT" },
        ],
      },
      {
        unitName: "Binh chủng pháo binh",
        unitCode: "A001-HCM",
        children: [
          { unitName: "Phòng Tham mưu", unitCode: "A001-HCM-NS" },
          { unitName: "Phòng Tài chính", unitCode: "A001-HCM-TC" },
        ],
      },
    ],
  },
];

function transformData(data: UnitNode[]): any[] {
  return data.map((item) => ({
    title: item.unitName,
    key: item.unitCode,
    unitName: item.unitName, // giữ lại unitName để lookup
    children: item.children ? transformData(item.children) : [],
  }));
}

export default function UnitTreeDropdown() {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const transformed = transformData(mockData);
    setTreeData(transformed);

    // Khi load lại trang, đọc unitCode từ URL để hiển thị label
    const currentUnit = searchParams.get("unitCode");
    if (currentUnit) {
      // Tìm unitName theo unitCode
      const findUnit = (nodes: any[]): any | null => {
        for (const n of nodes) {
          if (n.key === currentUnit) return n;
          if (n.children) {
            const f = findUnit(n.children);
            if (f) return f;
          }
        }
        return null;
      };
      const found = findUnit(transformed);
      if (found) {
        setSelectedUnit({ code: found.key, name: found.unitName });
      }
    }
  }, []);

  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (selectedKeys.length > 0) {
      const node = info.node;
      const unitCode = node.key as string;
      const unitName = node.title as string;

      current.set("unitCode", unitCode);
      setSelectedUnit({ code: unitCode, name: unitName });
    } else {
      current.delete("unitCode");
      setSelectedUnit(null);
    }

    const queryString = current.toString();
    router.push(queryString ? `?${queryString}` : "?");
  };

  const treeMenu = (
    <Card style={{ width: 300, maxHeight: 400, overflow: "auto" }}>
      <Tree treeData={treeData} defaultExpandAll onSelect={handleSelect} />
    </Card>
  );

  return (
    <Dropdown
      className="mr-2"
      overlay={treeMenu}
      trigger={["click"]}
      placement="bottomLeft"
    >
      <Button
        className="flex justify-stretch items-center"
        style={{ width: 220 }} // cố định width
        icon={
          <ClusterOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        }
      >
        <span
          style={{
            flex: 1,
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {selectedUnit ? selectedUnit.name : "Chọn đơn vị"}
        </span>
        <DownOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </Button>
    </Dropdown>
  );
}
