import React, { useState, useEffect } from "react";
import QueryBuilder, { RuleGroupType } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import { QueryBuilderAntD } from "@react-querybuilder/antd";

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
  const { mutation, contextHolder } = usePostApi(
    API_URL.INVESTIGATION_PAGE.ADD,
    true
  );
  const handleSubmit = () => {
    const conditions = flattenQueryToSQL(query);
    mutation.mutate(
      {
        filter: conditions.replaceAll("(", " ").replaceAll(")", " "),
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
    <div className="p-4">
      {contextHolder}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Done
        </button>
      </div>

      <QueryBuilderAntD className="bg-white rounded-lg shadow-md p-4">
        <QueryBuilder
          // Buộc re-render khi fields thay đổi
          fields={fields}
          query={query}
          onQueryChange={setQuery}
          resetOnOperatorChange
          showCombinatorsBetweenRules
        />
      </QueryBuilderAntD>
    </div>
  );
}

// 👉 Convert querybuilder structure to SQL-like string
function flattenQueryToSQL(query: RuleGroupType): string {
  if (!query || !query.rules?.length) return "";

  return query.rules
    .map((rule) => {
      if ("rules" in rule) {
        return `(${flattenQueryToSQL(rule)})`;
      } else {
        return `${rule.field} ${rule.operator} '${rule.value}'`;
      }
    })
    .join(` ${query.combinator?.toUpperCase()} `);
}
