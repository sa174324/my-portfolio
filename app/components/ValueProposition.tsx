"use client";
import { motion } from "framer-motion";

const aboutTransition = {
  duration: 0.7,
  ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
};

const values = [
  {
    title: "工程友善",
    subtitle: "Engineering-Ready",
    description: "融合前端邏輯 (Next.js/Tailwind)，確保設計稿從 Figma 到程式碼的完美落地，大幅降低開發溝通成本。",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-12 h-12"
      >
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M6 7h12" />
        <path d="M6 11h8" />
        <path d="M6 15h4" />
        <path d="M14 11h4" />
        <path d="M14 15h4" />
        <circle cx="18" cy="7" r="1" />
      </svg>
    ),
  },
  {
    title: "商業導向",
    subtitle: "Business-Driven",
    description: "美感只是基本，專注於優化使用者路徑與轉換率，用微互動 (Micro-interactions) 引導視覺焦點，解決商業痛點。",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-12 h-12"
      >
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
        <line x1="3" y1="20" x2="21" y2="20" />
        <circle cx="12" cy="8" r="2" />
        <circle cx="18" cy="2" r="2" />
        <circle cx="6" cy="14" r="2" />
      </svg>
    ),
  },
  {
    title: "系統思維",
    subtitle: "Scalable Systems",
    description: "擅長建構模組化的 Design System，從簡單網頁到複雜 SaaS 後台，確保產品隨業務擴張時依然保持一致與高效。",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-12 h-12"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <line x1="6.5" y1="6.5" x2="17.5" y2="17.5" />
        <line x1="17.5" y1="6.5" x2="6.5" y2="17.5" />
        <circle cx="6.5" cy="6.5" r="1" />
        <circle cx="17.5" cy="17.5" r="1" />
        <circle cx="17.5" cy="6.5" r="1" />
        <circle cx="6.5" cy="17.5" r="1" />
      </svg>
    ),
  },
];

export default function ValueProposition() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-40">
      <motion.h2
        className="text-3xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: 56 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ ...aboutTransition }}
      >
        我能提供什麼價值
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value, idx) => (
          <motion.div
            key={idx}
            className="group relative text-center p-6 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ ...aboutTransition, delay: idx * 0.15 }}
          >
            {/* 邊框動畫 SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ width: "100%", height: "100%" }}
            >
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="12"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                strokeDasharray="300 700"
                strokeDashoffset="0"
                className="group-hover:animate-[border-draw_2s_linear_infinite]"
              />
            </svg>
            <div className="relative z-10">
              <div className="flex justify-center mb-4 text-green-400">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-1">{value.title}</h3>
              <p className="text-green-400/70 text-xs mb-3 font-mono">
                {value.subtitle}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

