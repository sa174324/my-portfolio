"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";
// 定義作品資料的形狀
type Project = {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  link?: string; // 問號代表這個欄位是選填的 (有些作品可能沒有 Demo)
};

const imageVariant: Variants = {
  initial: { scale: 1.1, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.42, 0, 0.58, 1] },
  },
};

const fadeUpStagger: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUpItem: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  },
};

export default function WorkDetail(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError("");
      // 修改這邊的 select，撈出所有欄位與 link 欄位
      const { data, error } = await supabase
        .from('projects')
        .select('*, link')
        .eq('id', id)
        .single();
      if (error || !data) {
        setError("找不到資料");
      } else {
        setProject(data);
      }
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Loading...</h1>
        <Link href="/" className="text-gray-400 hover:text-white underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">{error || "Project not found"}</h1>
        <Link href="/" className="text-gray-400 hover:text-white underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#111] text-white pb-20">
      {/* Back button nav */}
      <nav className="p-6 fixed top-0 left-0 w-full z-10 bg-gradient-to-b from-black/50 to-transparent">
        <motion.div
          initial={false}
          whileHover={{ x: -10 }}
          className="inline-block"
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <span className="mr-2">←</span> Back
          </Link>
        </motion.div>
      </nav>
      {/* Hero image with zoom-out */}
      <motion.div
        className="w-full h-[60vh] relative"
        initial="initial"
        animate="animate"
        variants={imageVariant}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#111] to-transparent" />
      </motion.div>
      {/* Content fadeUp stagger */}
      <motion.div
        className="max-w-3xl mx-auto px-6 -mt-20 relative z-10"
        variants={fadeUpStagger}
        initial="initial"
        animate="animate"
      >
        <motion.span
          className="text-green-400 text-sm tracking-widest uppercase mb-2 block"
          variants={fadeUpItem}
        >
          {project.category}
        </motion.span>
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-8"
          variants={fadeUpItem}
        >
          {project.title}
        </motion.h1>
        <motion.div
          className="prose prose-invert prose-lg text-gray-300"
          variants={fadeUpItem}
        >
          <p className="text-xl leading-relaxed text-white mb-8">
            {project.description}
          </p>
          {/* 新增「Live Demo」按鈕於描述下方 */}
          {project.link && (
            <div className="mb-8">
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-full bg-green-400 text-black font-medium hover:bg-green-500 transition-colors shadow-[0_0_20px_rgba(74,222,128,0.5)]"
                whileHover={{ y: -10 }}
                transition={{ 
                  y: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                }}
              >
                🚀 View Live Demo
              </motion.a>
            </div>
          )}
          {/* 可以根據 DB 加更多欄位 */}
        </motion.div>
      </motion.div>
    </main>
  );
}