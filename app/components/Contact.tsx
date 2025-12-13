"use client";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h2 className="text-3xl font-bold mb-4">聯絡我</h2>
      <p className="text-gray-400 mb-8">有專案合作或設計需求歡迎聯繫！</p>
      <div className="flex flex-col gap-4 items-center mb-8">
        <a href="mailto:youremail@example.com" className="text-green-400 underline">youremail@example.com</a>
        <div className="flex gap-4 justify-center">
          <a href="https://www.linkedin.com/" target="_blank" className="text-gray-400 hover:text-green-400">LinkedIn</a>
          <a href="https://www.instagram.com/" target="_blank" className="text-gray-400 hover:text-green-400">Instagram</a>
        </div>
      </div>
      <form className="space-y-4 mx-auto max-w-md">
        <input type="text" placeholder="您的姓名" className="w-full p-3 rounded bg-[#222] text-white" />
        <input type="email" placeholder="您的 Email" className="w-full p-3 rounded bg-[#222] text-white" />
        <textarea placeholder="您的訊息" className="w-full p-3 rounded bg-[#222] text-white" rows={4} />
        <motion.button
          type="submit"
          className="px-8 py-3 rounded-full bg-green-400 text-black font-medium hover:bg-green-500 transition-colors shadow-[0_0_20px_rgba(74,222,128,0.5)]"
          whileHover={{ y: -10 }}
          transition={{ delay: 0.02, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          送出訊息
        </motion.button>
      </form>
    </section>
  );
}
