"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "@/lib/supabase";
import VantageHeader from "./components/VantageHeader";

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
  is_popular?: boolean;
  tags?: string[];
  read_time?: string;
  image_url?: string;
};

// 計算閱讀時間（假設每分鐘 200 字）
const calculateReadingTime = (content?: string): number => {
  if (!content) return 5; // 預設 5 分鐘
  const text = content.replace(/<[^>]*>/g, ""); // 移除 HTML 標籤
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

// 視覺故事區塊組件（帶視差效果）
function VisualStorySection({ image }: { image: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  return (
    <motion.div
      ref={ref}
      className="relative w-full h-[60vh] md:h-[80vh] my-16 overflow-hidden rounded-lg"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <Image
          src={image}
          alt="Visual Story"
          fill
          className="object-cover scale-110"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-8"
        style={{ opacity }}
      >
        <div className="max-w-3xl text-center">
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-serif text-white leading-relaxed italic">
            "設計不只是視覺，更是思考的延伸"
          </blockquote>
          <p className="text-sm md:text-base font-sans text-white/80 mt-6 tracking-wider uppercase">
            — VANTAGE 編輯部
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VantagePage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // 從文章資料中提取所有標籤
  const extractTagsFromPosts = (postsData: Post[]): string[] => {
    const tagSet = new Set<string>();
    
    postsData.forEach((post) => {
      // 如果有 tags 欄位，使用它
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          // 移除 # 符號（如果有的話）
          const cleanTag = tag.replace(/^#/, '').trim();
          if (cleanTag) tagSet.add(cleanTag);
        });
      }
      // 也可以從 category 生成標籤
      if (post.category) {
        tagSet.add(post.category);
      }
    });
    
    // 如果資料庫沒有標籤，使用預設標籤
    if (tagSet.size === 0) {
      return ["AI", "Design", "Kyoto", "Minimalism", "Tech", "Culture", "Architecture", "Photography"];
    }
    
    return Array.from(tagSet).sort();
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      // 獲取所有文章（最新發布）
      const { data: fetchedPosts, error: allPostsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      // 獲取熱門文章（is_popular 為 true）
      const { data: popularData, error: popularError } = await supabase
        .from("posts")
        .select("*")
        .eq("is_popular", true)
        .order("created_at", { ascending: false });

      if (!allPostsError && fetchedPosts) {
        setAllPosts(fetchedPosts);
        // 第一篇文章作為 Featured Article
        setFeaturedPost(fetchedPosts[0] || null);
        // 其餘文章作為 Recent Stories
        setPosts(fetchedPosts.slice(1));
        
        // 提取並設定所有可用標籤
        const tags = extractTagsFromPosts(fetchedPosts);
        setAvailableTags(tags);
      }

      if (!popularError && popularData) {
        setPopularPosts(popularData);
      }
      
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // 篩選文章邏輯（僅標籤篩選）
  useEffect(() => {
    let filtered = allPosts.slice(1); // 排除第一篇（Featured Article）

    // 標籤篩選
    if (selectedTag) {
      filtered = filtered.filter((post) => {
        // 檢查 tags 陣列
        if (post.tags && Array.isArray(post.tags)) {
          return post.tags.some((tag) => 
            tag.toLowerCase().includes(selectedTag.toLowerCase())
          );
        }
        // 檢查 category
        if (post.category && post.category.toLowerCase().includes(selectedTag.toLowerCase())) {
          return true;
        }
        // 檢查標題和摘要是否包含標籤關鍵字
        const searchableText = `${post.title} ${post.excerpt || ""}`.toLowerCase();
        return searchableText.includes(selectedTag.toLowerCase());
      });
    }

    setPosts(filtered);
  }, [selectedTag, allPosts]);

  const handleTagClick = (tag: string) => {
    // 如果點擊的是已選中的標籤，則取消選擇
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 這裡可以加入實際的訂閱邏輯
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

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <VantageHeader />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-stone-500 font-sans">載入中...</p>
          </div>
        ) : (
          <>
            {/* Featured Article (Hero) */}
            {featuredPost && (
              <motion.article
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-24"
              >
                {(() => {
                  const readingTime = featuredPost.read_time || `${calculateReadingTime(featuredPost.content)} 分鐘閱讀`;
                  return (
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      {/* Left: Image */}
                      <Link href={`/demos/vantage/${featuredPost.slug}`} className="group">
                        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 rounded-lg">
                          {featuredPost.image ? (
                            <>
                              <Image
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                priority
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                              <div className="absolute inset-0 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              無圖片
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Right: Content */}
                      <div className="space-y-6">
                        <span className="text-xs font-sans tracking-widest uppercase text-stone-500">
                          {featuredPost.category}
                        </span>
                        <Link href={`/demos/vantage/${featuredPost.slug}`}>
                          <h2 className="text-5xl md:text-6xl font-serif text-stone-900 leading-relaxed hover:text-stone-700 transition-colors">
                            {featuredPost.title}
                          </h2>
                        </Link>
                        {featuredPost.excerpt && (
                          <p className="text-lg font-sans text-stone-600 leading-relaxed">
                            {featuredPost.excerpt}
                          </p>
                        )}
                        {/* 日期和閱讀時間 */}
                        <div className="flex items-center text-sm font-sans text-stone-500 gap-2">
                          {featuredPost.created_at && (
                            <>
                              <time>
                                {new Date(featuredPost.created_at).toLocaleDateString(
                                  "zh-TW",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </time>
                              <span>·</span>
                            </>
                          )}
                          <span>{readingTime}</span>
                        </div>
                        {/* Author Info */}
                        {featuredPost.author && (
                          <div className="flex items-center gap-3 pt-2">
                            {featuredPost.author_avatar ? (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-200 flex-shrink-0">
                                <Image
                                  src={featuredPost.author_avatar}
                                  alt={featuredPost.author}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-stone-300 flex-shrink-0 flex items-center justify-center text-stone-600 text-sm font-sans font-medium">
                                {featuredPost.author.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="text-base font-sans text-stone-700">
                              {featuredPost.author}
                            </span>
                          </div>
                        )}
                        <Link href={`/demos/vantage/${featuredPost.slug}`}>
                          <motion.button
                            className="px-8 py-3 border border-stone-900 text-stone-900 font-sans text-sm tracking-wider uppercase hover:bg-stone-900 hover:text-white transition-colors"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            閱讀全文
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  );
                })()}
              </motion.article>
            )}

            {/* Recent Stories Grid with Sidebar - 兩欄式佈局 */}
            <motion.section
              className="mb-24"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-serif text-stone-900 mb-12 text-center leading-relaxed"
              >
                最新發布
              </motion.h2>
              
              <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                {/* 主內容區 (左側, 佔 2/3) */}
                <div className="lg:col-span-2">
                  <div className="grid md:grid-cols-2 gap-8">
                    {posts.slice(0, 4).map((post) => {
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
                                  <>
                                    <Image
                                      src={post.image}
                                      alt={post.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                    <div className="absolute inset-0 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                                    無圖片
                                  </div>
                                )}
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
                                {/* 日期和閱讀時間 */}
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
                                {/* Author Info - 總是顯示，有備用邏輯 */}
                                <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                                  {post.author_avatar ? (
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-stone-200 flex-shrink-0">
                                      <Image
                                        src={post.author_avatar}
                                        alt={post.author || '編輯部'}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-stone-300 flex-shrink-0 flex items-center justify-center text-stone-600 text-xs font-sans font-medium">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                  <span className="text-sm font-sans text-stone-700">
                                    {post.author || '編輯部'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.article>
                      );
                    })}
                  </div>

                  {/* 視覺故事區塊 (Visual Story) - 全寬視差滾動圖片 */}
                  {posts.length > 0 && posts[0]?.image && (
                    <VisualStorySection image={posts[0].image} />
                  )}

                  {/* 繼續顯示剩餘文章 */}
                  {posts.length > 4 && (
                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                      {posts.slice(4).map((post) => {
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
                                    <>
                                      <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                      <div className="absolute inset-0 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                                      無圖片
                                    </div>
                                  )}
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
                                  {/* Author Info - 總是顯示，有備用邏輯 */}
                                  <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                                    {post.author_avatar ? (
                                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-stone-200 flex-shrink-0">
                                        <Image
                                          src={post.author_avatar}
                                          alt={post.author || '編輯部'}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-stone-300 flex-shrink-0 flex items-center justify-center text-stone-600 text-xs font-sans font-medium">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="w-4 h-4"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                    <span className="text-sm font-sans text-stone-700">
                                      {post.author || '編輯部'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.article>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 側邊欄 (右側, 佔 1/3) - Sticky */}
                <aside className="lg:col-span-1">
                  <div className="sticky top-24 space-y-8">
                    {/* 熱門精選 (Trending) - 排行榜風格 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="bg-white/50 backdrop-blur-sm border border-stone-200 rounded-lg p-6"
                    >
                      <h3 className="text-sm font-sans tracking-widest uppercase text-stone-500 mb-6">
                        熱門精選
                      </h3>
                      <div className="space-y-0">
                        {popularPosts.length > 0 ? (
                          popularPosts.slice(0, 3).map((post, index) => (
                            <Link
                              key={post.id}
                              href={`/demos/vantage/${post.slug}`}
                              className="group block py-4 first:pt-0 last:pb-0"
                            >
                              <div className="flex items-start gap-4">
                                {/* 巨大的序號 - 排行榜風格 */}
                                <span className="text-5xl font-serif text-stone-200 group-hover:text-stone-400 transition-colors flex-shrink-0 italic leading-none">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                {/* 文章標題與作者 */}
                                <div className="flex-1 min-w-0 pt-1">
                                  <h4 className="text-sm font-serif font-bold text-stone-900 group-hover:text-stone-700 transition-colors leading-relaxed line-clamp-2">
                                    {post.title}
                                  </h4>
                                  {post.author && (
                                    <p className="text-xs font-sans text-stone-500 mt-1.5">
                                      {post.author}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {/* 分隔線 */}
                              {index < popularPosts.slice(0, 3).length - 1 && (
                                <div className="mt-4 pt-4 border-t border-stone-100" />
                              )}
                            </Link>
                          ))
                        ) : (
                          <p className="text-sm font-sans text-stone-400 py-4">
                            暫無熱門文章
                          </p>
                        )}
                      </div>
                    </motion.div>

                    {/* 探索主題 (Explore Topics) - 標籤篩選 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="bg-white/50 backdrop-blur-sm border border-stone-200 rounded-lg p-6"
                    >
                      <h3 className="text-sm font-sans tracking-widest uppercase text-stone-500 mb-4">
                        Explore Topics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.length > 0 ? (
                          availableTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => handleTagClick(tag)}
                              className={`px-4 py-2 text-xs font-sans rounded-full transition-all ${
                                selectedTag === tag
                                  ? "bg-stone-900 text-white hover:bg-stone-800"
                                  : "bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900"
                              }`}
                            >
                              #{tag}
                            </button>
                          ))
                        ) : (
                          <p className="text-sm font-sans text-stone-400">
                            載入標籤中...
                          </p>
                        )}
                      </div>
                      {selectedTag && (
                        <button
                          onClick={() => setSelectedTag(null)}
                          className="mt-4 text-xs font-sans text-stone-500 hover:text-stone-700 underline"
                        >
                          清除篩選
                        </button>
                      )}
                    </motion.div>

                    {/* 廣告/宣傳方塊 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="bg-stone-900 rounded-lg p-6 text-center"
                    >
                      <h3 className="text-lg font-serif text-white mb-2 leading-relaxed">
                        Vantage Premium
                      </h3>
                      <p className="text-sm font-sans text-stone-300 mb-4 leading-relaxed">
                        訂閱紙本雜誌
                      </p>
                      <Link href="/demos/vantage/subscribe">
                        <motion.button
                          className="w-full px-6 py-3 bg-white text-stone-900 font-sans text-sm tracking-wider uppercase hover:bg-stone-100 transition-colors rounded"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          立即訂閱
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>
                </aside>
              </div>
            </motion.section>

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
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* About Vantage 區塊 */}
            <div className="space-y-4">
              <h3 className="text-xs font-sans tracking-widest uppercase text-stone-400 mb-3">
                About Vantage
              </h3>
              <p className="text-xs font-sans text-stone-400 leading-relaxed max-w-md">
                Vantage is a conceptual magazine project built by An Design. It serves as a playground for experimenting with Next.js web architecture and a medium for sharing thoughts on design and technology.
              </p>
              <Link 
                href="/"
                className="inline-block text-xs font-sans text-stone-500 hover:text-stone-700 transition-colors underline underline-offset-2"
              >
                Back to An Design Portfolio
              </Link>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-stone-200">
            <p className="text-sm font-sans text-stone-500">
              © {new Date().getFullYear()} VANTAGE. 版權所有。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


