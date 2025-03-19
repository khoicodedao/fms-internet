/* eslint-disable */
"use client";
import React, { useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { SearchOutlined } from "@ant-design/icons";
interface KQLSearchBoxProps {
  onSearch?: (query: string) => void; // Optional prop để gửi dữ liệu lên component cha
}
//ts-ignore
const KQLSearchBox: React.FC<KQLSearchBoxProps> = ({ onSearch }) => {
  // Cấu hình gợi ý & highlight cho Monaco Editor
  const [query, setQuery] = useState(""); // State để lưu giá trị editor
  const handleSearch = () => {
    if (onSearch) {
      onSearch(query); // Gửi dữ liệu lên component cha
    }
    console.log("Search query:", query); // Debug
  };
  const handleEditorDidMount = (monaco: Monaco) => {
    monaco.languages.register({ id: "kql" });

    // Cấu hình highlight từ khóa
    monaco.languages.setMonarchTokensProvider("kql", {
      tokenizer: {
        root: [
          [
            /\b(status|cpu|memory|disk|ip|hostname|mac|description)\b/,
            "keyword",
          ], // Bổ sung "mac"
          [/\b(up|down|running|stopped)\b/, "string"],
          [/[A-Za-z0-9_]+/, "variable"],
        ],
      },
    });

    // Gợi ý tự động (autocomplete)
    monaco.languages.registerCompletionItemProvider("kql", {
      // @ts-ignore
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: "status",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "status=",
          },
          {
            label: "cpu",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "cpu= ",
          },
          {
            label: "memory",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "memory= ",
          },
          {
            label: "disk",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "disk= ",
          },
          {
            label: "ip",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "ip= ",
          },
          {
            label: "mac",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "mac= ",
          }, // Bổ sung "mac"
          {
            label: "description",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "description= ",
          },
          {
            label: "hostname",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "hostname= ",
          },
          {
            label: "AND",
            kind: monaco.languages.CompletionItemKind.Operator,
            insertText: "AND ",
          },
          {
            label: "OR",
            kind: monaco.languages.CompletionItemKind.Operator,
            insertText: "OR ",
          },
          {
            label: "NOT",
            kind: monaco.languages.CompletionItemKind.Operator,
            insertText: "NOT ",
          },
        ];
        return { suggestions };
      },
    });
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md">
      <Editor
        height="30px"
        width="calc(100vw - 300px)"
        defaultLanguage="kql"
        theme="light"
        className="flex-grow"
        options={{
          wordWrap: "off",
          lineNumbers: "off",
          minimap: { enabled: false },
          scrollbar: { vertical: "hidden", horizontal: "hidden" },
          scrollBeyondLastLine: false,
          overviewRulerLanes: 0,
          renderLineHighlight: "none",
          folding: false,
          automaticLayout: true,
        }}
        onMount={(_, monaco) => handleEditorDidMount(monaco)}
        onChange={(value) => setQuery(value || "")} // Cập nhật state khi editor thay đổi
      />
      <button
        className=" py-3 bg-gray-100 hover:bg-gray-200 rounded-r-md"
        onClick={handleSearch}
      >
        <SearchOutlined
          className="px-4"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </button>
    </div>
  );
};

export default KQLSearchBox;
