"use client";
import { useEffect, useRef } from "react";

const LINES = 6; // 可自訂線條數量
const WIDTH = 1920;
const HEIGHT = 1080;
// 基礎線條顏色陣列，整體再淡一階
const COLORS = ["#00C951", "#e3e3e3", "#cfcfcf", "#a2a2a2", "#787878", "#98ffce", "#e3e3e3", "#9c9c9c", "#5a5a5a"];
const STROKES = [0.7, 0.7, 0.75, 1.25, 1.05, 0.95, 0.9, 0.85, 0.8];
const STAR_COUNT = 30; // 背景亮點數量
const STAR_COLORS = ["#72ff9f", "#b4ffd9", "#ffffff", "#98ffce"]; // 亮點顏色

function generatePath(t: number, lineIdx: number, bendX: number, bendY: number) {
  const points = [];
  const seg = 9; // 折點（控制曲線流暢）
  for (let i = 0; i <= seg; i++) {
    const p = i / seg;
    const x = p * WIDTH;
    // 每條線 y 座標都隨 t & index & x 產生輕微不同波幅
    // Tweak sin/cos 參數可改起伏速度/幅度/混沌感
    const base =
      HEIGHT / (LINES + 1) * (lineIdx + 1) +
      Math.sin(p * 3 + t * (0.7 + lineIdx * 0.11)) * (32 + Math.abs(bendY) * 0.4) +
      Math.cos(p * 7 - t * (0.6 + lineIdx * 0.17)) * (12 + Math.abs(bendY) * 0.2);
    const curveInfluence = (p - 0.5) * bendX * 0.5;
    // 添加漣漪效果：從中心向外擴散的波動
    const ripple = Math.sin((p - 0.5) * Math.PI * 2 + t * 2) * Math.abs(bendX + bendY) * 0.15;
    const py = base + curveInfluence + ripple;
    points.push(`${x},${py}`);
  }
  return `M${points.join(" L")}`;
}

export default function DynamicLinesBg() {
  const ref = useRef<SVGSVGElement | null>(null);
  const hoverRef = useRef<number | null>(null);
  const dotsRef = useRef<{ offset: number; speed: number }[]>([]);
  const starsRef = useRef<
    { x: number; y: number; r: number; vx: number; vy: number; c: string; phase: number }[]
  >([]);

  useEffect(() => {
    let running = true;
    let frame = 0;
    let nx = 0;
    let ny = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      nx = e.clientX / innerWidth - 0.5;
      ny = e.clientY / innerHeight - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 初始化沿線亮點（每條線一個）
    dotsRef.current = Array.from({ length: LINES }).map(() => ({
      offset: Math.random(),
      speed: 0.03 + Math.random() * 0.04, // 速度可調
    }));

    // 初始化背景亮點（大小不一，隨機分布）
    starsRef.current = Array.from({ length: STAR_COUNT }).map(() => ({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      r: 1 + Math.random() * 3, // 大小 1-4
      vx: (Math.random() - 0.5) * 0.3, // 緩慢移動
      vy: (Math.random() - 0.5) * 0.3,
      c: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      phase: Math.random() * Math.PI * 2, // 閃爍相位
    }));

    function draw() {
      frame++;
      const t = frame * 0.016;
      const svg = ref.current;
      if (svg) {
        svg.style.transform = `translate3d(0, 0, 0)`; // 取消左右位移
        svg.style.opacity = "0.7";
        svg.style.filter = "none"; // 移除全局光暈

        for (let i = 0; i < LINES; i++) {
          const path = svg.querySelector<SVGPathElement>(`#line${i}`);
            if (path) {
              const isHover = hoverRef.current === i;
              // hover 時加強漣漪效果
              const rippleBoost = isHover ? 2.5 : 1;
              const rippleWave = isHover ? Math.sin(t * 3) * 0.3 : 0;
              path.setAttribute("d", generatePath(t, i, nx * 40 * rippleBoost + rippleWave, ny * 32 * rippleBoost + rippleWave));
              
              const strokeBase = STROKES[i % STROKES.length];
              const strokeHover = strokeBase;
              path.setAttribute("stroke-width", `${isHover ? strokeHover : strokeBase}`);

              const baseOpacity = i <= 2 ? 0.9 : 0.55;
              const hoverOpacity = baseOpacity;
              path.setAttribute("opacity", `${isHover ? hoverOpacity : baseOpacity}`);

              path.setAttribute("stroke", COLORS[i % COLORS.length]);
              path.style.filter = "none";
            }
        }

        // 沿線亮點滑動
        const dots = dotsRef.current;
        dots.forEach((dot, idx) => {
          const progress = (dot.offset + t * dot.speed) % 1;
          const x = progress * WIDTH;
          const baseY =
            HEIGHT / (LINES + 1) * (idx + 1) +
            Math.sin(progress * 3 + 0.7 * idx) * 48 +
            Math.cos(progress * 5 + 0.4 * idx) * 20;
          const circle = svg.querySelector<SVGCircleElement>(`#dot-${idx}`);
          if (circle) {
            circle.setAttribute("cx", `${x}`);
            circle.setAttribute("cy", `${baseY}`);
            circle.setAttribute("r", "3.6");
            circle.setAttribute("fill", "#72ff9f");
            circle.setAttribute("opacity", "0.95");
          }
        });

        // 背景亮點緩慢移動與閃爍
        const stars = starsRef.current;
        stars.forEach((star, idx) => {
          star.x += star.vx;
          star.y += star.vy;
          // 邊界循環
          if (star.x < 0) star.x = WIDTH;
          if (star.x > WIDTH) star.x = 0;
          if (star.y < 0) star.y = HEIGHT;
          if (star.y > HEIGHT) star.y = 0;
          // 閃爍效果
          const flicker = 0.4 + Math.sin(t * 0.5 + star.phase) * 0.3;
          const starCircle = svg.querySelector<SVGCircleElement>(`#star-${idx}`);
          if (starCircle) {
            starCircle.setAttribute("cx", `${star.x}`);
            starCircle.setAttribute("cy", `${star.y}`);
            starCircle.setAttribute("r", `${star.r}`);
            starCircle.setAttribute("fill", star.c);
            starCircle.setAttribute("opacity", `${Math.max(0.3, flicker)}`);
          }
        });
      }
      if (running) requestAnimationFrame(draw);
    }
    draw();
    return () => {
      running = false;
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="fixed top-0 left-0 w-screen h-screen -z-10 select-none"
      style={{ opacity: 0.65, margin: 0, padding: 0 }}
      aria-hidden="true"
    >
      <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="transparent" />
      {/* 背景亮點圖層 */}
      {Array.from({ length: STAR_COUNT }).map((_, i) => (
        <circle key={`star-${i}`} id={`star-${i}`} cx="0" cy="0" r="2" fill="#72ff9f" opacity="0.6" />
      ))}
      {/* 沿線亮點圖層 */}
      {Array.from({ length: LINES }).map((_, i) => (
        <circle key={`dot-${i}`} id={`dot-${i}`} cx="0" cy="0" r="3" fill="#72ff9f" opacity="0.8" />
      ))}
      {Array.from({ length: LINES }).map((_, i) => (
        <path
          key={i}
          id={`line${i}`}
          d={generatePath(0, i, 0, 0)}
          stroke={COLORS[i % COLORS.length]}
          strokeWidth={STROKES[i % STROKES.length]}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ opacity: i <= 2 ? 0.9 : 0.55, pointerEvents: "auto" }}
          onMouseEnter={() => (hoverRef.current = i)}
          onMouseLeave={() => (hoverRef.current = null)}
        />
      ))}
    </svg>
  );
}
