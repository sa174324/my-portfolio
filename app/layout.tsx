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
  // 1. 基本資訊
  title: "An Design | UI/UX & Full-Stack Developer",
  description: "專注於打造高轉換率的形象網站與應用程式。提供從設計到開發的一站式服務。",
  
  // 2. 補上 Open Graph (解決 og:url, og:type 報錯)
  openGraph: {
    title: "An Design | UI/UX & Full-Stack Developer",
    description: "專注於打造高轉換率的形象網站與應用程式。",
    url: "https://https://my-portfolio-ivory-eta-12.vercel.app/", // ⚠️ 請務必換成你的真實網址
    siteName: "An Design Portfolio",
    locale: "zh_TW",
    type: "website", // 這就是解決 og:type 的關鍵
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
