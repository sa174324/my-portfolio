"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 從 URL 參數讀取預設值
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchValue(q);
    }
  }, [searchParams]);

  // 處理搜尋（按下 Enter 鍵）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  };

  // 執行搜尋
  const performSearch = () => {
    const trimmedValue = searchValue.trim();
    
    if (trimmedValue) {
      // 使用 encodeURIComponent 編碼關鍵字，跳轉到搜尋頁面
      const encodedQuery = encodeURIComponent(trimmedValue);
      router.push(`/demos/vantage/search?q=${encodedQuery}`);
    } else {
      // 如果沒有搜尋關鍵字，跳轉回主頁
      router.push("/demos/vantage");
    }
  };

  // 清除搜尋
  const handleClear = () => {
    setSearchValue("");
    // 清除搜尋後跳轉回主頁
    router.push("/demos/vantage");
    
    // 聚焦回輸入框
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        {/* 放大鏡圖標 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="absolute left-4 w-5 h-5 text-stone-400 pointer-events-none z-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>

        {/* 輸入框 */}
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜尋文章..."
          className="w-full pl-12 pr-10 py-3 bg-gray-100 text-stone-900 font-sans placeholder:text-stone-400 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-800 focus:ring-offset-2 focus:bg-white transition-all duration-200"
        />

        {/* 清除按鈕 (X) */}
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors rounded-full hover:bg-stone-200"
            aria-label="清除搜尋"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

