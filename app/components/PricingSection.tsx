"use client";

import { useRef, useEffect, useState } from "react";

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
  description: string;
  features: PricingFeature[];
  buttonText: string;
  isRecommended?: boolean;
}

const plans: PricingPlan[] = [
  {
    title: "入門方案",
    price: "$15,000+",
    description: "適合個人品牌",
    features: [
      { text: "單頁設計" },
      { text: "響應式設計" },
      { text: "3 天交付" },
    ],
    buttonText: "詢問",
  },
  {
    title: "專業方案",
    price: "$30,000+",
    description: "適合成長中的企業",
    features: [
      { text: "5 頁設計" },
      { text: "CMS 整合" },
      { text: "基礎 SEO" },
      { text: "動畫效果" },
    ],
    buttonText: "立即詢問",
    isRecommended: true,
  },
  {
    title: "企業方案",
    price: "$80,000+",
    description: "完整網站應用",
    features: [
      { text: "設計系統" },
      { text: "用戶測試" },
      { text: "進階原型設計" },
      { text: "優先支援" },
    ],
    buttonText: "詢問",
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
        className={`relative bg-[#1a1a1a]/80 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 z-10 overflow-hidden ${
          plan.isRecommended
            ? "border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
            : "border-white/10"
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
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-400 text-neutral-900 px-6 py-2 rounded-full font-semibold text-sm shadow-md z-20">
              推薦
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-white font-bold text-xl mb-2">{plan.title}</h3>
            <div className="text-white mb-4">
              <span className="text-5xl font-extrabold">{plan.price}</span>
            </div>
            <p className="text-white/60">{plan.description}</p>
          </div>

          <ul className="space-y-4 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/80">{feature.text}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={`w-full py-4 rounded-xl transition-all duration-300 font-semibold ${
              plan.isRecommended
                ? "bg-green-400 text-neutral-900 hover:bg-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.4)]"
                : "bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-green-400/50"
            }`}
          >
            {plan.buttonText}
          </button>
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
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">適合您的方案</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            選擇最適合您專案需求的方案。所有方案皆包含專業設計與專屬支援。
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
