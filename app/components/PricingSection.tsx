"use client";

import { useRef, useEffect, useState } from "react";

// Instagram 連結（請替換為您的 Instagram 帳號）
const INSTAGRAM_URL = "https://www.instagram.com/sam.174324/";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  title: string;
  price: string;
  targetAudience: string;
  coreValue: string;
  features: PricingFeature[];
  isRecommended?: boolean;
}

const plans: PricingPlan[] = [
  {
    title: "品牌啟動",
    price: "$15,000+",
    targetAudience: "個人品牌、單一產品推廣、活動頁面",
    coreValue: "高視覺衝擊，專注於『轉換率』與『第一印象』",
    features: [
      { text: "單頁式滾動設計 (One-page Scroll)" },
      { text: "RWD 手機完美適配" },
      { text: "Lumina 等級的沈浸式動效" },
      { text: "3 天快速交付" },
    ],
  },
  {
    title: "商業成長",
    price: "$30,000+",
    targetAudience: "中小企業官網、設計工作室、內容創作者",
    coreValue: "建立品牌權威感，擁有完整的內容管理能力",
    features: [
      { text: "5 頁完整架構 (首頁/關於/服務/聯絡/文章)" },
      { text: "Vantage 風格部落格系統 (CMS)" },
      { text: "基礎 SEO 優化 (讓 Google 找得到你)" },
      { text: "後台易用性訓練" },
    ],
    isRecommended: true,
  },
  {
    title: "產品原型",
    price: "$80,000+",
    targetAudience: "新創 SaaS、後台管理系統、複雜互動應用",
    coreValue: "從 0 到 1 打造功能完整的 Web App",
    features: [
      { text: "TaskFlow 等級系統架構" },
      { text: "複雜資料庫串接 (Supabase)" },
      { text: "會員登入與權限管理" },
      { text: "可擴充的設計系統 (Design System)" },
    ],
  },
];

function PricingCard({ plan }: { plan: PricingPlan }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [contentMousePosition, setContentMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      // 邊框發光效果 - 使用百分比
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });

      // 內容區域發光效果 - 使用像素值（更精確）
      if (content) {
        const contentRect = content.getBoundingClientRect();
        const contentX = e.clientX - contentRect.left;
        const contentY = e.clientY - contentRect.top;
        setContentMousePosition({ x: contentX, y: contentY });
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      // 滑鼠離開時重置到中心，讓發光效果淡出
      setMousePosition({ x: 50, y: 50 });
      setContentMousePosition({ x: 0, y: 0 });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-3xl transition-all duration-300 ${
        plan.isRecommended ? "scale-105" : ""
      }`}
      style={
        {
          "--mouse-x": `${mousePosition.x}%`,
          "--mouse-y": `${mousePosition.y}%`,
        } as React.CSSProperties
      }
    >
      {/* 推薦方案的 Gradient 邊框 */}
      {plan.isRecommended && (
        <div
          className="absolute -inset-[2px] rounded-3xl pointer-events-none z-0"
          style={{
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.6), rgba(16, 185, 129, 0.6), rgba(34, 197, 94, 0.6))",
            backgroundSize: "200% 200%",
            animation: "gradient 3s ease infinite",
          }}
        />
      )}

      {/* Spotlight 發光邊框層 - 外層發光效果 */}
      <div
        className={`absolute -inset-[2px] rounded-3xl pointer-events-none transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `radial-gradient(circle 400px at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.8), transparent 70%)`,
          zIndex: 1,
        }}
      />

      {/* 內層遮罩 - 只顯示邊框區域的發光 */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: "rgba(26, 26, 26, 0.95)",
          zIndex: 2,
        }}
      />

      {/* 卡片內容容器 */}
      <div
        ref={contentRef}
        className={`relative bg-[#1a1a1a]/80 backdrop-blur-sm rounded-3xl p-8 transition-all duration-300 z-10 overflow-hidden ${
          plan.isRecommended
            ? "border border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
            : "border border-white/10"
        }`}
        style={
          {
            "--content-mouse-x": `${contentMousePosition.x}px`,
            "--content-mouse-y": `${contentMousePosition.y}px`,
          } as React.CSSProperties
        }
      >
        {/* 內容區域 Spotlight 發光效果 */}
        <div
          className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(
              600px circle at var(--content-mouse-x) var(--content-mouse-y),
              rgba(34, 197, 94, 0.25),
              rgba(34, 197, 94, 0.1),
              transparent 60%
            )`,
          }}
        />

        <div className="relative z-10">
          {plan.isRecommended && (
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-emerald-400 text-neutral-900 px-4 py-1.5 rounded-full font-semibold text-xs shadow-lg z-20">
              Most Popular
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-white font-bold text-2xl mb-3">{plan.title}</h3>
            <div className="text-white mb-4">
              <span className="text-5xl font-extrabold">{plan.price}</span>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div>
              <p className="text-white/50 text-sm mb-2">適合對象：</p>
              <p className="text-white/80 text-sm leading-relaxed">{plan.targetAudience}</p>
            </div>
            <div>
              <p className="text-white/50 text-sm mb-2">核心價值：</p>
              <p className="text-green-400/90 text-sm leading-relaxed font-medium">{plan.coreValue}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-white/50 text-sm mb-4">包含內容：</p>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 text-sm leading-relaxed">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3 rounded-xl transition-all duration-300 font-semibold text-center block ${
              plan.isRecommended
                ? "bg-green-400 text-neutral-900 hover:bg-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.4)]"
                : "bg-transparent text-white border-2 border-white/20 hover:bg-white/5 hover:border-green-400/50"
            }`}
          >
            預約諮詢
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">適合您的方案</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            每個方案都是針對不同階段需求的完整解決方案，而非單純的規格堆疊，專注於為您創造真正的商業價值。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
