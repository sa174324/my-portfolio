import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import VantageHeader from "../components/VantageHeader";

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

// 計算閱讀時間（假設每分鐘 200 字）
const calculateReadingTime = (content?: string): number => {
  if (!content) return 5; // 預設 5 分鐘
  const text = content.replace(/<[^>]*>/g, ""); // 移除 HTML 標籤
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

// 建立 Supabase 客戶端（Server Component 使用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const trimmedQuery = query.trim();

  let posts: Post[] = [];

  // 如果有搜尋關鍵字，查詢資料庫
  if (trimmedQuery) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .or(`title.ilike.%${trimmedQuery}%,excerpt.ilike.%${trimmedQuery}%`)
        .order("created_at", { ascending: false });

      if (!error && data) {
        posts = data;
      }
    } catch (err) {
      console.error("搜尋錯誤:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <VantageHeader />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 頁面標題 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4 leading-relaxed">
            {trimmedQuery ? `"${trimmedQuery}" 的搜尋結果` : "搜尋結果"}
          </h1>
          {trimmedQuery && posts.length > 0 && (
            <p className="text-base font-sans text-stone-500">
              找到 {posts.length} 篇文章
            </p>
          )}
        </div>

        {/* 搜尋結果或空狀態 */}
        {!trimmedQuery ? (
          <div className="text-center py-24">
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 text-stone-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-serif text-stone-900 mb-2">
                請輸入搜尋關鍵字
              </h2>
              <p className="text-lg font-sans text-stone-500 mb-8">
                在上方搜尋框輸入關鍵字來搜尋文章
              </p>
              <Link
                href="/demos/vantage"
                className="inline-block px-6 py-3 bg-stone-900 text-white font-sans text-sm tracking-wider uppercase hover:bg-stone-800 transition-colors rounded"
              >
                返回首頁
              </Link>
            </div>
          </div>
        ) : posts.length > 0 ? (
          /* 搜尋結果 Grid - 3 欄式佈局 */
          <section className="mb-24">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {posts.map((post) => {
                const readingTime = post.read_time || `${calculateReadingTime(post.content)} 分鐘閱讀`;
                return (
                  <article key={post.id}>
                    <Link href={`/demos/vantage/${post.slug}`}>
                      <div className="space-y-4 group">
                        {/* 縮圖 */}
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

                        {/* 內容 */}
                        <div className="space-y-3">
                          {/* 分類標籤 */}
                          <span className="text-xs font-sans tracking-widest uppercase text-stone-500">
                            {post.category}
                          </span>

                          {/* 標題（粗體） */}
                          <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-stone-700 transition-colors leading-relaxed">
                            {post.title}
                          </h3>

                          {/* 摘要（限制行數） */}
                          {post.excerpt && (
                            <p className="text-sm font-sans text-stone-600 line-clamp-2 leading-relaxed">
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

                          {/* 作者資訊 */}
                          <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                            {post.author_avatar ? (
                              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-stone-200 flex-shrink-0">
                                <Image
                                  src={post.author_avatar}
                                  alt={post.author || "編輯部"}
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
                              {post.author || "編輯部"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          /* 空狀態 - 沒有搜尋結果 */
          <div className="text-center py-24">
            <div className="max-w-md mx-auto space-y-6">
              {/* 放大鏡圖示 */}
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 text-stone-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>

              {/* 文字提示 */}
              <h2 className="text-2xl font-serif text-stone-900 mb-2">
                找不到相關文章
              </h2>
              <p className="text-lg font-sans text-stone-500 mb-8">
                找不到與 "{trimmedQuery}" 相關的文章，請嘗試其他關鍵字。
              </p>

              {/* 返回首頁按鈕 */}
              <Link
                href="/demos/vantage"
                className="inline-block px-6 py-3 bg-stone-900 text-white font-sans text-sm tracking-wider uppercase hover:bg-stone-800 transition-colors rounded"
              >
                返回首頁
              </Link>
            </div>
          </div>
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

