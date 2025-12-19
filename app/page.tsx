"use client";
import Hero from "./components/Hero";
import About from "./components/About";
import ValueProposition from "./components/ValueProposition";
import Works from "./components/Works";
import PricingSection from "./components/PricingSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import DynamicLinesBg from "./components/DynamicLinesBg";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "An Design",
    "description": "提供全端開發與 UI/UX 設計服務。專注於為新創與品牌打造高效能的數位產品，從 UI/UX 設計、Figma 原型到 Next.js 網站開發的一站式解決方案。",
    "url": "https://my-portfolio-ivory-eta-12.vercel.app/",
    "sameAs": [
      "https://www.instagram.com/sam.174324/"
    ],
    "priceRange": "$$"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DynamicLinesBg />
      <main className="min-h-screen text-white selection:bg-green-500 selection:text-black">
        <Hero />
        <About />
        <ValueProposition />
        <Works />
        <PricingSection />
        <Contact />
        <Footer />
      </main>
    </>
  );
}