import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 這裡可以加入你的 middleware 邏輯
  // 目前只是通過請求，不做任何處理
  return NextResponse.next();
}

// 設定 matcher，排除靜態檔案
export const config = {
  matcher: [
    /*
     * 匹配所有路徑，但排除：
     * - api 路由
     * - _next/static (靜態檔案)
     * - _next/image (圖片優化)
     * - favicon.ico, sitemap.xml, robots.txt (靜態檔案)
     * - 其他靜態資源 (.svg, .png, .jpg 等)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};

