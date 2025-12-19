import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PostContent from "./PostContent";

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

// 動態 Metadata 生成
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  
  try {
    // 查詢文章資料
    const { data, error } = await supabase
      .from("posts")
      .select("title, excerpt, image_url")
      .eq("slug", slug)
      .single();

    // 如果找不到文章或發生錯誤，回傳預設 Metadata
    if (error || !data) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";
      return {
        title: "Article Not Found | Vantage by An Design",
        description: "找不到這篇文章",
        openGraph: {
          title: "Article Not Found | Vantage by An Design",
          description: "找不到這篇文章",
          url: `${baseUrl}/demos/vantage/${slug}`,
        },
      };
    }

    // 構建完整的 URL（用於 OpenGraph）
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";
    const articleUrl = `${baseUrl}/demos/vantage/${slug}`;

    // 設定 Metadata
    return {
      title: `${data.title} | Vantage by An Design`,
      description: data.excerpt || "閱讀更多精彩內容",
      openGraph: {
        title: `${data.title} | Vantage by An Design`,
        description: data.excerpt || "閱讀更多精彩內容",
        url: articleUrl,
        images: data.image_url
          ? [
              {
                url: data.image_url,
                width: 1200,
                height: 630,
                alt: data.title,
              },
            ]
          : [],
      },
    };
  } catch (error) {
    // 發生錯誤時回傳預設 Metadata
    return {
      title: "Article Not Found | Vantage by An Design",
      description: "找不到這篇文章",
      openGraph: {
        title: "Article Not Found | Vantage by An Design",
        description: "找不到這篇文章",
      },
    };
  }
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  // 在 Server 端查詢當前文章
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  // 如果找不到文章，使用 Next.js 的 notFound() 函式
  if (postError || !post) {
    notFound();
  }

  // 查詢其他文章（排除當前文章，取前兩篇）
  const { data: otherPosts } = await supabase
    .from("posts")
    .select("*")
    .neq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(2);

  // 生成 JSON-LD 結構化資料
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.created_at || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: "An Design",
    },
    image: post.image || "",
    description: post.excerpt || "",
  };

  return (
    <>
      {/* Article Schema (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      
      {/* Client Component - 包含所有互動邏輯 */}
      <PostContent post={post as Post} otherPosts={(otherPosts || []) as Post[]} />
    </>
  );
}
