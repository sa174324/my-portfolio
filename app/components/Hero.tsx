"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.h1
        className="text-5xl md:text-8xl font-bold tracking-tighter mb-6"
        initial={{ opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.42, 0, 0.58, 1] }}
      >
        Hello, I'm <br />
        <span className="text-green-400">An Design</span>
      </motion.h1>
      <motion.p
        className="text-gray-400 max-w-lg mb-10 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        專注於打造極致的數位體驗，結合美學與功能性的介面設計。
      </motion.p>
      <motion.a
        href="#works"
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById("works");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        className="px-8 py-3 rounded-full bg-green-400 text-black font-medium hover:bg-green-500 transition-colors shadow-[0_0_20px_rgba(74,222,128,0.5)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10 }}
        transition={{ 
          delay: 0.8, 
          duration: 0.6, 
          ease: [0.4, 0, 0.2, 1],
          y: { delay: 0.02, duration: 0.4, ease: [0.4, 0, 0.2, 1] }
        }}
      >
        查看作品
      </motion.a>
    </section>
  );
}
