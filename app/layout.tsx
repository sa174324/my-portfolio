import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import MouseCursor from "./components/MouseCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  // 標題公式：品牌名 | 核心職位 | 主要服務
  title: 'An Design | Design Engineer & Next.js Developer',
  
  // 描述：強調全端開發與 UI/UX 設計服務
  description: '提供全端開發與 UI/UX 設計服務。專注於為新創與品牌打造高效能的數位產品，從 UI/UX 設計、Figma 原型到 Next.js 網站開發的一站式解決方案。',
  
  // 關鍵字：讓爬蟲知道你的標籤
  keywords: ['Next.js 開發', 'UI/UX 設計', '台灣 Design Engineer', '網站接案', 'Supabase 開發', 'Framer Motion 動效', '全端開發', 'Design Engineer'],
  
  // 作者與建立者
  authors: [{ name: 'An Design', url: 'https://my-portfolio-ivory-eta-12.vercel.app' }],
  creator: 'An Design',
  
  // Open Graph (給社群分享用的)
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://my-portfolio-ivory-eta-12.vercel.app',
    title: 'An Design | Design Engineer & Next.js Developer',
    description: '提供全端開發與 UI/UX 設計服務。專注於為新創與品牌打造高效能的數位產品，從 UI/UX 設計、Figma 原型到 Next.js 網站開發的一站式解決方案。',
    siteName: 'An Design',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'An Design Portfolio Preview',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased bg-[#111] text-white`}
        suppressHydrationWarning
      >
        <MouseCursor />
        {children}
      </body>
    </html>
  );
}
