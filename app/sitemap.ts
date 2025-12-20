import { MetadataRoute } from 'next';
// import { supabase } from '@/lib/supabase'; // 暫時註解掉 Supabase 邏輯

// Base URL - 請修改為你的真實網域
const BASE_URL = 'https://andesign.com.co';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 靜態路由 - 暫時只回傳這兩個固定網址來除錯
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/demos/vantage`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // 暫時註解掉所有 Supabase 資料庫抓取邏輯
  // let dynamicRoutes: MetadataRoute.Sitemap = [];
  // 
  // try {
  //   const { data: posts, error } = await supabase
  //     .from('posts')
  //     .select('slug, created_at')
  //     .order('created_at', { ascending: false });
  //
  //   if (!error && posts) {
  //     dynamicRoutes = posts.map((post) => ({
  //       url: `${BASE_URL}/demos/vantage/${post.slug}`,
  //       lastModified: post.created_at ? new Date(post.created_at) : new Date(),
  //       changeFrequency: 'weekly' as const,
  //       priority: 0.8,
  //     }));
  //   }
  // } catch (error) {
  //   console.error('Error fetching posts for sitemap:', error);
  //   // 如果抓取失敗，只返回靜態路由
  // }

  return staticRoutes; // 暫時只回傳靜態路由
  // return [...staticRoutes, ...dynamicRoutes];
}

