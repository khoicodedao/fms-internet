/* eslint-disable */
"use client";
import React from "react";
import Editor, { Monaco } from "@monaco-editor/react";

const KQLSearchBox: React.FC = () => {
  // Cấu hình gợi ý & highlight cho Monaco Editor
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
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: "status",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "status: ",
          },
          {
            label: "cpu",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "cpu: ",
          },
          {
            label: "memory",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "memory: ",
          },
          {
            label: "disk",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "disk: ",
          },
          {
            label: "ip",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "ip: ",
          },
          {
            label: "mac",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "mac: ",
          }, // Bổ sung "mac"
          {
            label: "description",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "description: ",
          },
          {
            label: "hostname",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: "hostname: ",
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
    <Editor
      height="30px"
      width="90%"
      defaultLanguage="kql"
      theme="light"
      className="border border-gray-300 rounded-md"
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
    />
  );
};

export default KQLSearchBox;
