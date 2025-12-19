"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Twitter, Facebook, Link as LinkIcon } from "lucide-react";
import VantageHeader from "../components/VantageHeader";
import HireMeCTA from "../components/HireMeCTA";

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

type PostContentProps = {
  post: Post;
  otherPosts: Post[];
};

export default function PostContent({ post, otherPosts }: PostContentProps) {
  const [tableOfContents, setTableOfContents] = useState<{ id: string; title: string }[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 閱讀進度條
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // 監聽滾動以控制返回按鈕的模糊效果
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 生成 ID（從標題文字轉換）
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // 從內容中提取 h2 標籤生成目錄
  useEffect(() => {
    if (post?.content) {
      const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
      const matches = Array.from(post.content.matchAll(h2Regex));
      const toc = matches.map((match) => {
        const titleText = match[1].replace(/<[^>]*>/g, "");
        return {
          id: generateId(titleText),
          title: titleText,
        };
      });
      setTableOfContents(toc);
    } else {
      setTableOfContents([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.content]);

  // 處理文章內容，在文章中段插入引用區塊，並為 h2 添加 id
  const processContent = (content: string, excerpt?: string) => {
    if (!content) return "<p>本文內容正在準備中，敬請期待。</p>";
    
    // 先為所有 h2 標籤添加 id
    let processedContent = content.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (match, titleText) => {
      const id = generateId(titleText.replace(/<[^>]*>/g, ""));
      return `<h2 id="${id}" class="toc-heading">${titleText}</h2>`;
    });
    
    // 使用正則表達式匹配所有段落
    const paragraphRegex = /<p[^>]*>.*?<\/p>/gi;
    const matches = processedContent.match(paragraphRegex);
    
    if (!matches || matches.length < 3 || !excerpt) {
      return processedContent;
    }
    
    // 在中段插入引用區塊
    const midPoint = Math.floor(matches.length / 2);
    const blockquote = `<blockquote class="article-blockquote">${excerpt}</blockquote>`;
    
    // 找到插入位置（在 midPoint 段落之後）
    const insertIndex = processedContent.indexOf(matches[midPoint]) + matches[midPoint].length;
    const beforeContent = processedContent.substring(0, insertIndex);
    const afterContent = processedContent.substring(insertIndex);
    
    return beforeContent + blockquote + afterContent;
  };

  // 平滑捲動到對應標題
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // Header 高度 + 一些額外空間
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // 分享功能
  const handleShare = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = post?.title || "";
    
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("連結已複製到剪貼簿");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* 閱讀進度條 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-stone-200 z-[100]"
        style={{ originX: 0 }}
      >
        <motion.div
          className="h-full bg-[#991b1b]"
          style={{ width: progressWidth }}
        />
      </motion.div>

      {/* Header */}
      <VantageHeader />

      {/* Sticky Back Button - Top Left */}
      <motion.div
        className={`fixed top-4 left-4 md:top-6 md:left-6 z-[60] transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border border-stone-200/50 shadow-lg"
            : "bg-transparent"
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/demos/vantage"
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full text-xs md:text-sm font-sans text-stone-700 hover:text-stone-900 transition-colors"
        >
          <span className="text-base md:text-lg">←</span>
          <span className="hidden sm:inline">返回首頁</span>
        </Link>
      </motion.div>

      {/* Article Header Section */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Category */}
          <span className="text-xs font-sans tracking-widest uppercase text-stone-500 block mb-4">
            {post.category}
          </span>

          {/* Large Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-stone-900 mb-6 leading-relaxed">
            {post.title}
          </h1>

          {/* Published Date and Author Info */}
          <div className="flex items-center gap-3 flex-wrap">
            {post.created_at && (
              <p className="text-sm font-sans text-stone-500">
                {new Date(post.created_at).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            {(post.author || post.author_avatar) && (
              <div className="flex items-center gap-3">
                {post.author_avatar && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-stone-200 flex-shrink-0">
                    <Image
                      src={post.author_avatar}
                      alt={post.author || "作者"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {post.author && (
                  <p className="text-sm font-sans text-stone-700">
                    {post.author}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Featured Image - Full Width */}
      {post.image && (
        <motion.div
          className="relative w-full h-[60vh] md:h-[70vh] mb-16 overflow-hidden bg-stone-100"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      )}

      {/* Content Body - Two Column Layout on Large Screens */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* 左欄：文章內容 */}
          <motion.article
            ref={contentRef}
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl font-sans text-stone-700 mb-12 leading-relaxed italic">
                {post.excerpt}
              </p>
            )}

            {/* Content with Drop Cap */}
            <div 
              className="article-content text-lg md:text-xl font-sans text-stone-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: processContent(post.content || "", post.excerpt)
              }}
            />
          </motion.article>

          {/* 右欄：側邊資訊欄 (Sticky) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-white/50 backdrop-blur-sm border border-stone-200 rounded-lg p-6">
                  <h3 className="text-sm font-sans tracking-widest uppercase text-stone-500 mb-4">
                    目錄導覽
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, index) => (
                      <button
                        key={item.id || index}
                        onClick={() => item.id && scrollToHeading(item.id)}
                        className="block w-full text-left text-sm font-sans text-stone-700 hover:text-stone-900 transition-colors py-1 group"
                      >
                        <span className="relative">
                          {item.title}
                          <motion.span
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Share Buttons */}
              <div className="bg-white/50 backdrop-blur-sm border border-stone-200 rounded-lg p-6">
                <h3 className="text-sm font-sans tracking-widest uppercase text-stone-500 mb-4">
                  分享文章
                </h3>
                <div className="flex flex-col space-y-3">
                  <motion.button
                    onClick={() => handleShare("twitter")}
                    className="flex items-center space-x-3 text-sm font-sans text-stone-700 hover:text-stone-900 transition-colors py-2"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Twitter size={18} />
                    <span>Twitter</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleShare("facebook")}
                    className="flex items-center space-x-3 text-sm font-sans text-stone-700 hover:text-stone-900 transition-colors py-2"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Facebook size={18} />
                    <span>Facebook</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleShare("copy")}
                    className="flex items-center space-x-3 text-sm font-sans text-stone-700 hover:text-stone-900 transition-colors py-2"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LinkIcon size={18} />
                    <span>複製連結</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* More Stories Section */}
          {otherPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-serif text-stone-900 mb-8 leading-relaxed">
                延伸閱讀
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {otherPosts.map((otherPost) => (
                  <Link
                    key={otherPost.id}
                    href={`/demos/vantage/${otherPost.slug}`}
                    className="group"
                  >
                    <motion.article
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        {otherPost.image && (
                          <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 rounded-lg">
                            <Image
                              src={otherPost.image}
                              alt={otherPost.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            <div className="absolute inset-0 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        <div className="space-y-2">
                          <span className="text-xs font-sans tracking-widest uppercase text-stone-500">
                            {otherPost.category}
                          </span>
                          <h3 className="text-xl font-serif text-stone-900 group-hover:text-stone-700 transition-colors leading-relaxed">
                            {otherPost.title}
                          </h3>
                          {otherPost.excerpt && (
                            <p className="text-sm font-sans text-stone-600 line-clamp-2">
                              {otherPost.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

        </div>
      </div>

      {/* HireMe CTA */}
      <HireMeCTA />

      {/* Footer */}
      <footer className="border-t border-stone-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-sans text-stone-500">
            © {new Date().getFullYear()} VANTAGE. 版權所有。
          </p>
        </div>
      </footer>

      {/* Enhanced Typography CSS */}
      <style jsx global>{`
        /* 首字放大 (Drop Cap) - 優化樣式 */
        .article-content p:first-of-type::first-letter {
          float: left;
          font-size: 6rem;
          line-height: 0.75;
          padding-right: 0.75rem;
          padding-top: 0.5rem;
          font-family: serif;
          color: #1c1917;
          font-weight: 400;
          margin-right: 0.5rem;
        }

        .article-content p {
          margin-bottom: 1.5rem;
          line-height: 2;
        }

        .article-content h2,
        .article-content h3,
        .article-content h4 {
          font-family: serif;
          color: #292524;
          margin-bottom: 1rem;
          font-weight: 600;
          line-height: 1.6;
        }

        .article-content h2 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 3rem;
          padding-top: 6rem;
          margin-top: -3rem;
          scroll-margin-top: 6rem;
        }
        
        /* 第一個 h2 不需要上邊距 */
        .article-content > h2:first-of-type {
          margin-top: 0;
          padding-top: 6rem;
          margin-top: -3rem;
        }

        .article-content h3 {
          font-size: 1.5rem;
        }

        .article-content ul,
        .article-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .article-content li {
          margin-bottom: 0.5rem;
        }

        .article-content a {
          color: #78716c;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .article-content a:hover {
          color: #292524;
        }

        .article-content img {
          width: 100%;
          height: auto;
          margin: 2rem 0;
          border-radius: 0.5rem;
        }

        /* 引用區塊 (Blockquote) - 雜誌風格 */
        .article-content blockquote,
        .article-content .article-blockquote {
          border-left: 4px solid #991b1b;
          padding: 1.5rem 2rem 1.5rem 2.5rem;
          margin: 2.5rem 0;
          font-style: italic;
          font-size: 1.25rem;
          line-height: 1.8;
          color: #1c1917;
          background-color: #fef2f2;
          font-family: serif;
          position: relative;
        }

        .article-content blockquote::before,
        .article-content .article-blockquote::before {
          content: '"';
          font-size: 4rem;
          line-height: 1;
          color: #991b1b;
          position: absolute;
          left: 1rem;
          top: 0.5rem;
          opacity: 0.3;
          font-family: serif;
        }
      `}</style>
    </div>
  );
}

