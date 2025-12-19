"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function MouseCursor() {
  const pathname = usePathname();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  // 如果是 LUMINA、TaskFlow、Pulse 或 Vantage 頁面，不顯示此組件
  const isLuminaPage = pathname?.includes("/demos/lumina");
  const isTaskflowPage = pathname?.includes("/demos/taskflow");
  const isPulsePage = pathname?.includes("/demos/pulse");
  const isVantagePage = pathname?.includes("/demos/vantage");
  const shouldDisable = isLuminaPage || isTaskflowPage || isPulsePage || isVantagePage;

  useEffect(() => {
    // 如果是 LUMINA、TaskFlow、Pulse 或 Vantage 頁面，設置 body 的 data 屬性並恢復默認光標
    if (shouldDisable) {
      document.body.setAttribute('data-custom-cursor-disabled', 'true');
      return () => {
        document.body.removeAttribute('data-custom-cursor-disabled');
      };
    }

    // 檢測是否為移動設備
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
    
    if (isMobile) {
      return; // 移動設備不顯示自定義光標
    }

    const updateMousePosition = (x: number, y: number) => {
      if (!isVisible) setIsVisible(true);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ x, y });
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    // 檢查是否在可互動元素上
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!(
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.style.cursor === "pointer" ||
        window.getComputedStyle(target).cursor === "pointer"
      );
      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVisible, shouldDisable]);

  // 如果是 LUMINA、TaskFlow 或 Pulse 頁面，不渲染此組件
  if (shouldDisable) return null;

  if (!isVisible) return null;

  return (
    <>
      {/* 自定義光標 */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
      >
        {/* 主光標點 - 帶有漸變效果 */}
        <div
          className={`absolute rounded-full transition-all duration-200 ease-out ${
            isHovering
              ? "w-10 h-10"
              : "w-5 h-5"
          }`}
          style={{
            background: isHovering
              ? "radial-gradient(circle, rgba(74, 222, 128, 0.9) 0%, rgba(74, 222, 128, 0.6) 50%, rgba(74, 222, 128, 0.3) 100%)"
              : "radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.4) 100%)",
            boxShadow: isHovering
              ? "0 0 30px rgba(74, 222, 128, 0.9), 0 0 60px rgba(74, 222, 128, 0.5), 0 0 90px rgba(74, 222, 128, 0.2)"
              : "0 0 15px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.3)",
            filter: "blur(0.5px)",
          }}
        />
        
        {/* 外圈光暈 - 脈衝動畫 */}
        <div
          className={`absolute rounded-full border transition-all duration-500 ${
            isHovering
              ? "w-20 h-20 border-green-400/50"
              : "w-14 h-14 border-white/40"
          }`}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            animation: "cursorPulse 2s ease-in-out infinite",
          }}
        />
        
        {/* 第二層光暈 */}
        <div
          className={`absolute rounded-full border transition-all duration-700 ${
            isHovering
              ? "w-28 h-28 border-green-400/20"
              : "w-20 h-20 border-white/20"
          }`}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            animation: "cursorPulse 2.5s ease-in-out infinite",
            animationDelay: "0.5s",
          }}
        />
      </div>

      {/* 全局樣式 */}
      <style jsx global>{`
        @media (pointer: fine) {
          body:not([data-custom-cursor-disabled]) * {
            cursor: none !important;
          }
        }
        @keyframes cursorPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.2;
          }
        }
      `}</style>
    </>
  );
}
