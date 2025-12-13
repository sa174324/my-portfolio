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
  return (
    <>
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