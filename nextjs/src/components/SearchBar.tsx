/* eslint-disable */
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

interface KQLSearchBoxProps {
  onSearch?: (query: string) => void;
  /** Danh sách gợi ý dạng chuỗi (KQL snippets). Nếu không truyền sẽ dùng DEFAULT_SUGGESTIONS. */
  suggestions?: string[];
  /** Placeholder cho ô tìm kiếm */
  placeholder?: string;
  /** Thêm class vào wrapper nếu cần */
  className?: string;
  /** Tự động gọi onSearch sau khi chọn gợi ý */
  autoSearchOnSelect?: boolean;
}

const DEFAULT_SUGGESTIONS: string[] = [
  "response.status_code: 200",
  "response.status_code: 404",
  'url.path: "/api/*"',
  "method: GET",
  'kubernetes.pod.name: "auth-*"',
  'host.name: "prod-*"',
  'message: "timeout" OR message: "failed"',
  "@timestamp >= now-15m",
  "@timestamp >= now-24h and @timestamp < now",
  "bytes > 1048576",
  'geo.country_name: "Vietnam"',
  "log.level: error",
  "log.level: warn",
  'user.name: "admin"',
  'agent.type: "filebeat"',
];

const MAX_ITEMS = 8;
const LOGICAL_TOKENS = new Set(["and", "or"]);

// Helper: tách phần prefix và token cuối theo khoảng trắng đơn giản (giữ nguyên khoảng trắng)
function getPrefixAndTerm(q: string): { prefix: string; term: string } {
  const lastSpace = q.lastIndexOf(" ");
  if (lastSpace === -1) return { prefix: "", term: q };
  return { prefix: q.slice(0, lastSpace + 1), term: q.slice(lastSpace + 1) };
}

const KQLSearchBox: React.FC<KQLSearchBoxProps> = ({
  onSearch,
  suggestions,
  placeholder = "Enter your KQL query here...",
  className = "",
  autoSearchOnSelect = false,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pool =
    suggestions && suggestions.length > 0 ? suggestions : DEFAULT_SUGGESTIONS;

  // Lọc theo token cuối cùng (term). Nếu term là 'and'/'or' hoặc rỗng => reset về gợi ý mặc định
  const filtered = useMemo(() => {
    const { term } = getPrefixAndTerm(query);
    const raw = term.toLowerCase();
    const t = term.trim().toLowerCase();
    if (!t || LOGICAL_TOKENS.has(t)) {
      return pool.slice(0, MAX_ITEMS);
    }

    const withScore = pool
      .map((s) => {
        const l = s.toLowerCase();
        const starts = l.startsWith(t) ? 1 : 0;
        const contains = l.includes(t) ? 1 : 0;
        const score = starts * 2 + contains; // ưu tiên startsWith
        return { s, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.s.length - b.s.length; // ngắn hơn lên trước
      })
      .slice(0, MAX_ITEMS)
      .map((x) => x.s);
    return withScore;
  }, [query, pool]);

  // Inline completion: tắt khi term là 'and'/'or' hoặc rỗng
  const inlineCompletion = useMemo(() => {
    const { term } = getPrefixAndTerm(query);
    const t = term.trim().toLowerCase();
    if (!t || LOGICAL_TOKENS.has(t)) return "";
    const first = filtered.find((s) =>
      s.toLowerCase().startsWith(term.toLowerCase())
    );
    if (!first) return "";
    return first.slice(term.length);
  }, [query, filtered]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSearch = () => {
    onSearch?.(query.trim());
  };

  // Chọn gợi ý
  const selectSuggestion = (value: string) => {
    const { prefix, term } = getPrefixAndTerm(query);
    const t = term.trim().toLowerCase();
    let next: string;
    if (!t) {
      // Không có token cuối => nối vào sau prefix (prefix đã là toàn bộ query)
      next = `${prefix}${value}`;
    } else if (LOGICAL_TOKENS.has(t)) {
      // Sau AND/OR => không thay thế toán tử, chỉ nối giá trị phía sau
      const needsSpace = query.endsWith(" ") ? "" : " ";
      next = `${query}${needsSpace}${value}`;
    } else {
      // Thay thế token cuối bằng gợi ý
      next = `${prefix}${value}`;
    }

    setQuery(next);
    setOpen(false);
    setActiveIndex(-1);
    if (autoSearchOnSelect) {
      onSearch?.(next);
    } else {
      inputRef.current?.focus();
    }
  };

  const acceptInline = () => {
    if (inlineCompletion) {
      setQuery((prev) => prev + inlineCompletion);
      setOpen(true);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const len = filtered.length;
    if (e.key === "ArrowDown") {
      setOpen(true);
      setActiveIndex((prev) => {
        const next = prev + 1;
        return next >= len ? 0 : next;
      });
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowUp") {
      setOpen(true);
      setActiveIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? Math.max(0, len - 1) : next;
      });
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      if (open && activeIndex >= 0 && activeIndex < len) {
        e.preventDefault();
        selectSuggestion(filtered[activeIndex]);
        return;
      }
      e.preventDefault();
      handleSearch();
      return;
    }
    if (e.key === "Tab" || e.key === "ArrowRight") {
      if (inlineCompletion) {
        e.preventDefault();
        acceptInline();
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
  };

  const renderHighlighted = (text: string) => {
    const { term } = getPrefixAndTerm(query);
    const q = term.trim().toLowerCase();
    if (!q || LOGICAL_TOKENS.has(q)) return text;
    const lower = text.toLowerCase();
    const idx = lower.indexOf(q);
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const mid = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length);
    return (
      <>
        {before}
        <span className="font-semibold">{mid}</span>
        {after}
      </>
    );
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div
        className="flex items-center border border-gray-300 rounded-md w-full bg-white focus-within:ring-2 focus-within:ring-blue-500"
        style={{ width: "calc(100vw - 432px)" }}
      >
        {/* Ghost inline suggestion overlay */}
        <div className="absolute inset-0 pointer-events-none select-none text-gray-400 overflow-hidden">
          <div className="px-3 py-2 whitespace-nowrap">
            <span className="opacity-0">{query}</span>
            <span>{inlineCompletion}</span>
          </div>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="flex-grow px-3 py-2 outline-none bg-transparent"
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="kql-suggestion-list"
          role="combobox"
        />
        <button
          className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-r-md"
          onClick={handleSearch}
          aria-label="Search"
        >
          <SearchOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        </button>
      </div>

      {/* Dropdown suggestions */}
      {open && filtered.length > 0 && (
        <ul
          id="kql-suggestion-list"
          className="absolute z-50 mt-1 w-full max-h-72 overflow-auto border border-gray-200 rounded-md bg-white shadow-lg"
          role="listbox"
        >
          {filtered.map((s, idx) => (
            <li
              key={`${s}-${idx}`}
              role="option"
              aria-selected={idx === activeIndex}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectSuggestion(s)}
              className={`px-3 py-2 cursor-pointer text-sm flex items-start gap-2 ${
                idx === activeIndex ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-gray-300" />
              <span className="text-gray-800">{renderHighlighted(s)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default KQLSearchBox;
