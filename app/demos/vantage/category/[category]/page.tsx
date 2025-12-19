"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";
import VantageHeader from "../../components/VantageHeader";

type Post = {
  id: number;
  title: string;
  slug: string;
  category: string;
  image: string;
  excerpt?: string;
  content?: string;
  created_at?: string;
  author?: string;
  author_avatar?: string;
  read_time?: string;
};

// 分類映射（支援大小寫不敏感）
const categoryMap: Record<string, { name: string; subtitle: string }> = {
  design: { name: "設計", subtitle: "探索 設計 相關的深度文章" },
  tech: { name: "科技", subtitle: "探索 科技 相關的深度文章" },
  culture: { name: "人文", subtitle: "探索 人文 相關的深度文章" },
  // 支援 Title Case
  Design: { name: "設計", subtitle: "探索 設計 相關的深度文章" },
  Tech: { name: "科技", subtitle: "探索 科技 相關的深度文章" },
  Culture: { name: "人文", subtitle: "探索 人文 相關的深度文章" },
};

// 計算閱讀時間
const calculateReadingTime = (content?: string): number => {
  if (!content) return 5;
  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

export default function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const { category } = use(props.params);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  // 將 slug 轉換為分類資訊（支援大小寫不敏感）
  const categoryInfo = categoryMap[category] || categoryMap[category.toLowerCase()] || {
    name: category,
    subtitle: `探索 ${category} 相關的深度文章`,
  };

  // 標準化分類名稱（用於資料庫查詢）
  // 先嘗試從 categoryMap 取得，否則使用原始值
  const getCategoryNameForQuery = (cat: string): string => {
    const info = categoryMap[cat] || categoryMap[cat.toLowerCase()];
    return info ? info.name : cat;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      // 除錯資訊：顯示當前分類參數
      console.log('Current Category:', category);
      
      // 取得標準化的分類名稱（用於顯示）
      const categoryName = getCategoryNameForQuery(category);
      console.log('Category Name for Query:', categoryName);
      
      // 使用 ilike 進行大小寫不敏感的查詢
      // Supabase 可能不直接支援 .ilike()，所以我們使用 .filter() 配合 SQL 函數
      // 或者使用客戶端過濾作為備選方案
      try {
        // 嘗試使用 ilike（如果 Supabase 支援）
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .ilike('category', category)
          .order("created_at", { ascending: false });
        
        if (!error && data) {
          console.log('Posts found with ilike:', data.length);
          setPosts(data);
        } else {
          // 如果 ilike 不支援或出錯，使用客戶端過濾
          console.log('ilike query error or not supported, using client-side filter:', error);
          const { data: allData, error: allError } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });
          
          if (!allError && allData) {
            // 在客戶端進行大小寫不敏感的過濾
            const filteredPosts = allData.filter(
              (post) => post.category?.toLowerCase() === category.toLowerCase() ||
                       post.category?.toLowerCase() === categoryName.toLowerCase() ||
                       post.category === category ||
                       post.category === categoryName
            );
            console.log('Posts found with client-side filter:', filteredPosts.length);
            setPosts(filteredPosts);
          }
        }
      } catch (err) {
        // 如果 ilike 方法不存在，使用客戶端過濾
        console.log('ilike method not available, using client-side filter:', err);
        const { data: allData, error: allError } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (!allError && allData) {
          const filteredPosts = allData.filter(
            (post) => post.category?.toLowerCase() === category.toLowerCase() ||
                     post.category?.toLowerCase() === categoryName.toLowerCase() ||
                     post.category === category ||
                     post.category === categoryName
          );
          console.log('Posts found with client-side filter:', filteredPosts.length);
          setPosts(filteredPosts);
        }
      }
      
      setLoading(false);
    };

    fetchPosts();
  }, [category]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`感謝訂閱！我們會將最新內容寄送至 ${email}`);
    setEmail("");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <VantageHeader />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-stone-500 font-sans">載入中...</p>
          </div>
        ) : (
          <>
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h1 className="text-5xl md:text-6xl font-serif text-stone-900 mb-6 leading-relaxed">
                {categoryInfo.name}
              </h1>
              <p className="text-xl md:text-2xl font-serif text-stone-600 mb-4 italic leading-relaxed">
                {categoryInfo.subtitle}
              </p>
              <p className="text-base font-sans text-stone-500">
                共 {posts.length} 篇文章
              </p>
            </motion.div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
              <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mb-24"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => {
                    const readingTime = post.read_time || `${calculateReadingTime(post.content)} 分鐘閱讀`;
                    return (
                      <motion.article
                        key={post.id}
                        variants={itemVariants}
                      >
                        <Link href={`/demos/vantage/${post.slug}`}>
                          <div className="space-y-4 group">
                            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 rounded-lg">
                              {post.image ? (
                                <Image
                                  src={post.image}
                                  alt={post.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-400">
                                  無圖片
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                              <div className="absolute inset-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="space-y-3">
                              <span className="text-xs font-sans tracking-widest uppercase text-stone-500">
                                {post.category}
                              </span>
                              <h3 className="text-xl font-serif text-stone-900 group-hover:text-stone-700 transition-colors leading-relaxed">
                                {post.title}
                              </h3>
                              {post.excerpt && (
                                <p className="text-sm font-sans text-stone-600 line-clamp-2">
                                  {post.excerpt}
                                </p>
                              )}
                              <div className="flex items-center text-xs font-sans text-stone-500 gap-2">
                                {post.created_at && (
                                  <>
                                    <time>
                                      {new Date(post.created_at).toLocaleDateString(
                                        "zh-TW",
                                        {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        }
                                      )}
                                    </time>
                                    <span>·</span>
                                  </>
                                )}
                                <span>{readingTime}</span>
                              </div>
                              {post.author && (
                                <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                                  {post.author_avatar ? (
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-stone-200 flex-shrink-0">
                                      <Image
                                        src={post.author_avatar}
                                        alt={post.author}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-stone-300 flex-shrink-0 flex items-center justify-center text-stone-600 text-xs font-sans font-medium">
                                      {post.author.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <span className="text-sm font-sans text-stone-700">
                                    {post.author}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.section>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center py-24"
              >
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-6xl mb-4">📚</div>
                  <h2 className="text-2xl font-serif text-stone-900 mb-2">
                    尚無此分類文章
                  </h2>
                  <p className="text-lg font-sans text-stone-500 mb-8">
                    我們找不到與 "{category}" 相關的文章。
                  </p>
                  <Link
                    href="/demos/vantage"
                    className="inline-block px-6 py-3 bg-stone-900 text-white font-sans text-sm tracking-wider uppercase hover:bg-stone-800 transition-colors rounded"
                  >
                    返回總覽
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Newsletter */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-stone-900 py-20 -mx-6 md:-mx-0 rounded-none md:rounded-lg"
            >
              <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-serif text-white leading-relaxed">
                  訂閱 Vantage 週報
                </h2>
                <p className="text-stone-300 font-sans text-lg leading-relaxed">
                  每週一早晨，為您送上最具深度的設計觀點。
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 mt-8">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="輸入您的 Email"
                    required
                    className="flex-1 px-4 py-3 border border-stone-700 bg-stone-800 text-white font-sans placeholder:text-stone-500 focus:outline-none focus:border-stone-500 transition-colors rounded"
                  />
                  <motion.button
                    type="submit"
                    className="px-8 py-3 bg-white text-stone-900 font-sans text-sm tracking-wider uppercase hover:bg-stone-100 transition-colors rounded whitespace-nowrap"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    立即訂閱
                  </motion.button>
                </form>
              </div>
            </motion.section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-24 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-sans text-stone-500">
            © {new Date().getFullYear()} VANTAGE. 版權所有。
          </p>
        </div>
      </footer>
    </div>
  );
}

