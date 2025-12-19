"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HireMeCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="bg-stone-900 text-white py-16 md:py-20"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 leading-relaxed"
        >
          想打造像 Vantage 這樣的高效能網站？
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl font-sans text-stone-300 mb-8 leading-relaxed max-w-2xl mx-auto"
        >
          我能運用 Next.js 與 Supabase 技術，為您的品牌建構兼具 SEO 優勢與極致體驗的數位產品。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="mailto:sa10113402@gmail.com"
            className="inline-block"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="px-8 py-4 bg-white text-stone-900 font-sans font-medium text-base md:text-lg rounded-lg hover:bg-stone-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              預約專案諮詢
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

