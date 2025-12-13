"use client";
import { motion } from "framer-motion";

const aboutTransition = {
  duration: 0.7,
  ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
};

const values = [
  {
    title: "協助打造您的事業起點",
    description: "從零開始建立您的品牌形象與數位平台，為事業奠定堅實基礎",
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
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
        <path d="M12 22l-4-2v-6l4 2 4-2v6l-4 2z" />
      </svg>
    ),
  },
  {
    title: "提供專業用戶體驗建議",
    description: "以數據驅動的 UX 分析，優化產品流程，提升用戶滿意度與轉換率",
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
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <line x1="18" y1="8" x2="23" y2="8" />
        <line x1="20.5" y1="5" x2="20.5" y2="11" />
      </svg>
    ),
  },
  {
    title: "客製化設計實現您的夢想",
    description: "量身打造獨特設計方案，將您的創意與願景轉化為真實的數位體驗",
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
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
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

