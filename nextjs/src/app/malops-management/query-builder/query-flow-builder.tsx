/* eslint-disable */
import React, { useState, useEffect } from "react";
import QueryBuilder, { RuleGroupType } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";

import { QueryBuilderAntD } from "@react-querybuilder/antd";

interface QueryBuilderFormProps {
  setFilters: (filters: Record<string, { filter: string }>) => void; // Trả về object chứa các filter
  fields?: any[];
  label: string;
}

export default function QueryBuilderForm({
  fields: propsFields,
  setFilters,
  label,
}: QueryBuilderFormProps) {
  const initialQuery: RuleGroupType = { combinator: "and", rules: [] };
  const [query, setQuery] = useState(initialQuery);
  const [fields, setFields] = useState(propsFields || []);
  const [currentLabel, setCurrentLabel] = useState(label);
  const customOperators = [
    { name: "have", label: "have" },
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
  // Reset QueryBuilder khi label thay đổi
  useEffect(() => {
    if (label !== currentLabel) {
      setQuery(initialQuery); // Reset query
      setCurrentLabel(label); // Cập nhật label hiện tại
    }
  }, [label, currentLabel]);

  // Update fields when propsFields changes
  useEffect(() => {
    if (propsFields) {
      setFields(propsFields);
    }
  }, [propsFields]);

  const handleSubmit = () => {
    console.log("Query:", query);
    // const conditions = flattenQueryToSQL(query);
    // const filter = conditions.replaceAll('"', "'");
    // //@ts-ignore
    // setFilters((prevFilters) => ({
    //   ...prevFilters,
    //   [label.toLowerCase()]: { filter }, // Gán filter vào object với key là label
    // }));
  };

  return (
    <div className="p-4">
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
          fields={fields}
          query={query}
          operators={customOperators}
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
