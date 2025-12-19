import { MetadataRoute } from 'next';

// Base URL - 請修改為你的真實網域（與 sitemap.ts 保持一致）
const BASE_URL = 'https://andesign.com.co';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

