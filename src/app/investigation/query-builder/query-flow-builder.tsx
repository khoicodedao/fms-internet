import React, { useState, useEffect } from "react";
import QueryBuilder, { RuleGroupType } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import { QueryBuilderAntD } from "@react-querybuilder/antd";
import { Button, Card } from "antd";

interface QueryBuilderFormProps {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
  fields?: any[];
}

export default function QueryBuilderForm({
  setReload,
  reload,
  fields: propsFields,
}: QueryBuilderFormProps) {
  const [description, setDescription] = useState("");
  const { mutation, contextHolder } = usePostApi(
    API_URL.INVESTIGATION_PAGE.ADD,
    true
  );
  const customOperators = [
    { name: "have", label: "have" },
    { name: "like", label: "like" },
    { name: "=", label: "=" },
    { name: "!=", label: "!=" },
    { name: ">", label: ">" },
    { name: "<", label: "<" },
    { name: ">=", label: ">=" },
    { name: "<=", label: "<=" },
    { name: "contains", label: "Contains" },
    { name: "startsWith", label: "Starts with" },
    { name: "endsWith", label: "Ends with" },
  ];
  const handleSubmit = () => {
    const conditions = flattenQueryToSQL(query);
    mutation.mutate(
      {
        filter: conditions,
        ...(description && { description }),
      },
      {
        onSuccess: () => {
          setReload(!reload);
        },
      }
    );
  };

  const initialQuery: RuleGroupType = { combinator: "and", rules: [] };
  const [query, setQuery] = useState(initialQuery);
  const [fields, setFields] = useState(propsFields || []);

  // Update fields when propsFields changes
  useEffect(() => {
    if (propsFields) {
      setFields(propsFields);
    } // Tạo một bản sao mới của propsFields
  }, [propsFields]);

  return (
    <Card className="p-4" style={{ minHeight: "calc(100vh - 300px)" }}>
      {contextHolder}

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description (optional)"
        className="border px-2 py-1 rounded w-full mb-2"
      />

      <QueryBuilderAntD className="p-1">
        <QueryBuilder
          // Buộc re-render khi fields thay đổi
          fields={fields}
          query={query}
          onQueryChange={setQuery}
          resetOnOperatorChange
          operators={customOperators}
          showCombinatorsBetweenRules
        />
      </QueryBuilderAntD>
      <div className="flex gap-2 mt-4">
        <Button type="primary" onClick={handleSubmit}>
          Create
        </Button>
      </div>
    </Card>
  );
}

// 👉 Convert querybuilder structure to SQL-like string
function flattenQueryToSQL(query: RuleGroupType, isNested = false): string {
  if (!query || !query.rules?.length) return "";

  const sqlParts = query.rules.map((rule) => {
    if ("rules" in rule) {
      // Là một nhóm con
      return flattenQueryToSQL(rule, true); // ✅ Đánh dấu là nested
    } else {
      const { field, operator, value } = rule;
      switch (operator) {
        case "contains":
          return `${field} LIKE '%${value}%'`;
        case "startsWith":
          return `${field} LIKE '${value}%'`;
        case "endsWith":
          return `${field} LIKE '%${value}'`;
        default:
          return `${field} ${operator} '${value}'`;
      }
    }
  });

  const combined = sqlParts.join(` ${query.combinator?.toUpperCase()} `);

  // ✅ Chỉ bọc ngoặc nếu là nhóm con (nested)
  return isNested ? `(${combined})` : combined;
}
