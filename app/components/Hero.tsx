"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function Hero() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        opacity: {
          delay: 0.4,
          duration: 0.6,
          ease: [0.42, 0, 0.58, 1]
        },
        y: {
          delay: 0.4,
          duration: 0.6,
          ease: [0.42, 0, 0.58, 1]
        }
      }
    });
  }, [controls]);
  return (
    <section className="h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.h1
        className="text-4xl md:text-7xl font-bold tracking-wide mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
      >
        <span className="text-green-400">設計</span>與<span className="text-green-400">工程</span>的完美結合
      </motion.h1>
      <motion.p
        className="text-gray-400 max-w-2xl mb-12 text-base md:text-lg leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
      >
        具備全端思維的 UI/UX 設計師，擅長將複雜的商業邏輯，轉化為可落地且直覺的數位產品體驗。
      </motion.p>
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById("works");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        className="px-8 py-3 rounded-full bg-green-400 text-black font-medium hover:bg-green-500 transition-colors shadow-[0_0_20px_rgba(74,222,128,0.5)]"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        whileHover={{ 
          y: -10,
          transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }
        }}
        onHoverEnd={() => {
          controls.start({ 
            y: 0,
            transition: {
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1]
            }
          });
        }}
        transition={{
          y: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1]
          },
          default: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }
        }}
      >
        查看作品
      </motion.button>
    </section>
  );
}
