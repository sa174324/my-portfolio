"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SearchInput from "./SearchInput";

interface VantageHeaderProps {
  isScrolled?: boolean;
}

const categories = [
  { name: "設計", slug: "Design", label: "設計 (Design)" },
  { name: "科技", slug: "Tech", label: "科技 (Tech)" },
  { name: "人文", slug: "Culture", label: "人文 (Culture)" },
];

export default function VantageHeader({ 
  isScrolled = false
}: VantageHeaderProps) {
  const [scrolled, setScrolled] = useState(isScrolled);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isScrolled) {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isScrolled]);

  // 判斷當前路徑是否為該分類
  const isActive = (slug: string) => {
    return pathname?.includes(`/category/${slug}`);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/50"
          : "border-b border-stone-200 bg-white/50 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 桌面版佈局：Logo、導航、搜尋框水平排列 */}
        <div className="hidden md:flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/demos/vantage" className="flex-shrink-0">
            <h1 className="text-4xl font-serif tracking-wider text-stone-900 leading-relaxed">
              VANTAGE
            </h1>
          </Link>

          {/* 導航選單 - 中間 */}
          <nav className="flex items-center space-x-8 text-sm font-sans tracking-wider uppercase flex-1 justify-center">
            {categories.map((category) => {
              const active = isActive(category.slug);
              return (
                <Link
                  key={category.slug}
                  href={`/demos/vantage/category/${category.slug}`}
                  className="relative group"
                >
                  <span
                    className={`relative z-10 transition-colors ${
                      active
                        ? "text-stone-900 font-bold"
                        : "text-stone-500 group-hover:text-stone-900"
                    }`}
                  >
                    {category.label}
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 origin-left"
                    initial={{ scaleX: active ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* 搜尋框 - 右側 */}
          <div className="flex-shrink-0 w-full max-w-md">
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>
          </div>
        </div>

        {/* 手機版佈局：垂直排列 */}
        <div className="md:hidden flex flex-col items-center space-y-4">
          {/* 第一行：Logo 和搜尋 Icon */}
          <div className="w-full flex items-center justify-between">
            <Link href="/demos/vantage">
              <h1 className="text-3xl font-serif tracking-wider text-stone-900 leading-relaxed">
                VANTAGE
              </h1>
            </Link>
            
            {/* 搜尋 Icon 按鈕 */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="開啟搜尋"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>

          {/* 展開的搜尋框 */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full overflow-hidden"
              >
                <div className="pb-2">
                  <Suspense fallback={null}>
                    <SearchInput />
                  </Suspense>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 導航選單 */}
          <nav className="flex items-center space-x-6 text-xs font-sans tracking-wider uppercase">
            {categories.map((category) => {
              const active = isActive(category.slug);
              return (
                <Link
                  key={category.slug}
                  href={`/demos/vantage/category/${category.slug}`}
                  className="relative group"
                >
                  <span
                    className={`relative z-10 transition-colors ${
                      active
                        ? "text-stone-900 font-bold"
                        : "text-stone-500 group-hover:text-stone-900"
                    }`}
                  >
                    {category.name}
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 origin-left"
                    initial={{ scaleX: active ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

