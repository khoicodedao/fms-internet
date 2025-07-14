/* eslint-disable */
"use client";
import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

interface KQLSearchBoxProps {
  onSearch?: (query: string) => void;
}

const KQLSearchBox: React.FC<KQLSearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
    console.log("Search query:", query);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-3 py-2 outline-none"
        placeholder="Enter your KQL query here..."
      />
      <button
        className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-r-md"
        onClick={handleSearch}
      >
        <SearchOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </button>
    </div>
  );
};

export default KQLSearchBox;
