import { motion } from "framer-motion";

const aboutTransition = {
  duration: 0.7,
  ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
};

const tags = [
  "全端產品設計 (Full-stack Design)",
  "Next.js / React 開發",
  "UI/UX 策略規劃",
  "設計系統 (Design Systems)",
  "AI 賦能工作流 (AI Workflow)",
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
      <motion.h3
        className="text-2xl font-bold mb-6 text-green-400"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ ...aboutTransition, delay: 0.08 }}
      >
        連結美學與工程的｜全端產品設計師
      </motion.h3>
      <motion.p
        className="text-lg text-gray-400 mb-6"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...aboutTransition, delay: 0.16 }}
      >
        具備豐富的 UI/UX 經驗，更掌握 Next.js 前端開發技術與 AI 高效工作流。我致力於填補『設計』與『開發』之間的鴻溝，從商業目標出發，為您提供從設計到開發且具備高度可行性的數位產品服務，大幅降低溝通成本並加速產品上市。
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
