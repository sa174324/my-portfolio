"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: number;
  title: string;
  category: string;
  image: string;
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] } },
};

export default function Works() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalPages - 1;

  // 將項目分組
  const groupedProjects = useMemo(() => {
    const groups = [];
    for (let i = 0; i < projects.length; i += itemsPerPage) {
      groups.push(projects.slice(i, i + itemsPerPage));
    }
    return groups;
  }, [projects]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*');
      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // 計算 translateX 值
  const translateX = useMemo(() => {
    if (totalPages === 0) return '0%';
    // 每個組的寬度是 100%，移動 currentIndex 個組
    return `-${currentIndex * 100}%`;
  }, [currentIndex, totalPages]);

  return (
    <section id="works" className="max-w-7xl mx-auto px-6 py-40">
      <h2 className="text-3xl font-bold mb-12 border-l-4 border-green-400 pl-4">我的作品</h2>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="relative">
          <div className="relative overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: translateX,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
            >
              {groupedProjects.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-shrink-0 w-full"
                >
                  {group.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={cardVariant}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      <Link href={`/works/${project.id}`} className="group block">
                        <div className="relative aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-green-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">{project.category}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 w-10 h-10 md:w-12 md:h-12 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all z-10 shadow-lg"
                aria-label="上一頁"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 w-10 h-10 md:w-12 md:h-12 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all z-10 shadow-lg"
                aria-label="下一頁"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
