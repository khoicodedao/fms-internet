/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { Card, Tree, Dropdown, Button } from "antd";
import { DownOutlined, ClusterOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import API_URL from "@/common/api-url";
import { usePostApi } from "@/common/usePostApi";

type ApiUnit = {
  unit_id: string;
  unit_name: string;
  full_name: string;
  parent_unit_id: string | null;
  location: string;
};

function buildTree(units: ApiUnit[]): any[] {
  const map: Record<string, any> = {};
  const roots: any[] = [];

  // Tạo map id -> node
  units.forEach((u) => {
    map[u.unit_id] = {
      title: u.unit_name,
      key: u.unit_id,
      unitName: u.unit_name,
      children: [],
    };
  });

  // Gắn con vào cha hoặc root
  units.forEach((u) => {
    if (u.parent_unit_id && map[u.parent_unit_id]) {
      map[u.parent_unit_id].children.push(map[u.unit_id]);
    } else {
      roots.push(map[u.unit_id]);
    }
  });

  return roots; // Không bọc thêm "ALL"
}

export default function UnitTreeDropdown() {
  const [treeData, setTreeData] = useState<any[]>([]);
  const { mutation } = usePostApi(API_URL.UNIT.LIST, false);

  const [selectedUnit, setSelectedUnit] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    mutation.mutate(
      {},
      {
        onSuccess: (res) => {
          const units: ApiUnit[] = res.data.units || [];
          const tree = buildTree(units);
          setTreeData(tree);

          // Khi load lại trang, nếu có unitCode trên URL thì set selected
          const currentUnit = searchParams.get("unitCode");
          if (currentUnit) {
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
            const found = findUnit(tree);
            if (found) {
              setSelectedUnit({ code: found.key, name: found.unitName });
            }
          }
        },
        onError: (error) => {
          console.error("Lỗi khi gọi API:", error);
        },
      }
    );
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
        style={{ width: 220 }}
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
