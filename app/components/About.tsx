import { motion } from "framer-motion";

const aboutTransition = {
  duration: 0.7,
  ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
};

const tags = [
  "UI 設計",
  "UX 流程",
  "網頁架站",
  "品牌設計",
  "AI 協作",
];

export default function About() {
  return (
    <section
      id="about"
      className="max-w-3xl mx-auto px-4 py-40 text-center"
    >
      <motion.h2
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: 56 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ ...aboutTransition }}
      >
        關於我
      </motion.h2>
      <motion.p
        className="text-lg text-gray-400 mb-6"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...aboutTransition, delay: 0.08 }}
      >
        具備豐富 UI/UX 設計經驗，專長於良好用戶體驗、品牌視覺與跨平台規劃，致力於協助客戶實現最佳數位產品體驗。
      </motion.p>
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {tags.map((tag, idx) => (
          <motion.span
            key={tag}
            className="px-4 py-2 bg-[#222] rounded-lg text-green-400"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ ...aboutTransition, delay: 0.5 + idx * 0.1 }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
