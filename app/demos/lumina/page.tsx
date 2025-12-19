"use client"

import Image from "next/image"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Lenis from "lenis"

// Scroll Reveal 動畫組件
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// 遮罩揭示圖片組件
function RevealMaskImage({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  speed = 0.2 
}: { 
  src: string
  alt: string
  className?: string
  containerClassName?: string
  speed?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  // 視差效果
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  return (
    <div ref={containerRef} className={`relative ${containerClassName} overflow-hidden`}>
      <motion.div style={{ y }} className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          quality={90}
        />
      </motion.div>
      {/* 遮罩揭示動畫 */}
      <motion.div
        ref={maskRef}
        // 遮罩從深色改為淡灰，讓 reveal 有柔和效果
        className="absolute inset-0 bg-slate-100 z-10"
        initial={{ scaleX: 1 }}
        animate={isInView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.3
        }}
        style={{ transformOrigin: "right" }}
      />
    </div>
  )
}

// 視差圖片組件（用於不需要遮罩的圖片）
function ParallaxImage({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  speed = 0.2 
}: { 
  src: string
  alt: string
  className?: string
  containerClassName?: string
  speed?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  return (
    <div ref={containerRef} className={containerClassName}>
      <motion.div style={{ y }} className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          quality={90}
        />
      </motion.div>
    </div>
  )
}

export default function LuminaLanding() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  // Lenis Smooth Scroll 初始化
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // 自訂游標跟隨滑鼠
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // 檢測是否在可互動元素上
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "IMG" || 
        target.closest("a") !== null || 
        target.closest("img") !== null ||
        target.closest("[data-cursor-hover]") !== null
      
      setIsHovering(isInteractive)
    }

    window.addEventListener("mousemove", updateMousePosition)
    
    // 初始位置
    setMousePosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [])

  // Works 圖片資料
  const works = [
    {
      id: 1,
      title: "Horizon House",
      image: "https://images.unsplash.com/photo-1730989427568-0a6fdb5a2fb1?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      aspect: "portrait"
    },
    {
      id: 2,
      title: "Urban Sanctuary",
      image: "https://images.unsplash.com/photo-1653972233499-eaad56990299?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      aspect: "landscape"
    },
    {
      id: 3,
      title: "Gallery Minimal",
      image: "https://images.unsplash.com/photo-1646987916641-1f3c8992daa2?q=80&w=3506&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      aspect: "portrait"
    },
    {
      id: 4,
      title: "Concrete Form",
      image: "https://images.unsplash.com/photo-1747669842414-f71cbf5d106b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      aspect: "landscape"
    },
    {
      id: 5,
      title: "Light Pavilion",
      image: "https://images.unsplash.com/photo-1730989427568-0a6fdb5a2fb1?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      aspect: "portrait"
    },
    {
      id: 6,
      title: "Modern Retreat",
      image: "https://images.unsplash.com/photo-1653972233499-eaad56990299?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      aspect: "landscape"
    }
  ]

  // Hero 視差效果
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const heroY = useTransform(heroScrollYProgress, [0, 1], ["0%", "20%"])

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* 自訂游標 */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-black pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-16 py-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-serif"
            style={{ letterSpacing: "-0.05em", color: "#111" }}
          >
            LUMINA
          </motion.div>
          <div className="hidden md:flex items-center gap-16">
            <a href="#philosophy" className="text-xs tracking-widest uppercase hover:opacity-60 transition-opacity font-sans text-black">
              Philosophy
            </a>
            <a href="#works" className="text-xs tracking-widest uppercase hover:opacity-60 transition-opacity font-sans text-black">
              Works
            </a>
            <a href="#services" className="text-xs tracking-widest uppercase hover:opacity-60 transition-opacity font-sans text-black">
              Services
            </a>
            <a href="#contact" className="text-xs tracking-widest uppercase hover:opacity-60 transition-opacity font-sans text-black">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" data-cursor-hover>
          <motion.div style={{ y: heroY }} className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1758957701419-2c6e266f7988?q=80&w=2526&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Lumina Architecture"
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </motion.div>
          <div className="absolute inset-0 bg-white/60" /> {/* Light overlay */}
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-8"
          >
            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-serif mb-6"
              style={{ letterSpacing: "-0.05em", color: "#111" }}
            >
              LUMINA
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xs md:text-sm tracking-widest uppercase font-sans text-slate-700"
          >
            Shaping the Future of Space
          </motion.p>
        </div>
      </section>

      {/* 裝飾線 */}
      <div className="w-full h-[1px] bg-slate-200" />

      {/* Philosophy Section */}
      <section id="philosophy" className="py-40 px-6 lg:px-16 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-24 items-start">
            <ScrollReveal>
              <div className="space-y-8">
                <h2
                  className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight"
                  style={{ letterSpacing: "-0.05em", color: "#111" }}
                >
                  Philosophy
                </h2>
                <div className="space-y-6 font-sans text-lg md:text-xl leading-relaxed text-slate-700">
                  <p>
                    We believe in the power of restraint. Every line, every surface, every shadow is intentional. Our
                    designs strip away the unnecessary to reveal the essential.
                  </p>
                  <p>
                    Architecture is not about filling space—it&apos;s about creating it. Through careful attention to
                    natural light and honest materials, we craft environments that inspire clarity and calm.
                  </p>
                  <p>
                    We approach each project with a deep respect for context, history, and the human experience. Our
                    work is a dialogue between past and present, form and function, light and shadow.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden" data-cursor-hover>
                <RevealMaskImage
                  src="https://images.unsplash.com/photo-1730989427568-0a6fdb5a2fb1?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Architectural Philosophy"
                  containerClassName="relative w-full h-full"
                  speed={0.2}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 裝飾線 */}
      <div className="w-full h-[1px] bg-slate-200" />

      {/* Selected Works */}
      <section id="works" className="py-40 px-6 lg:px-16 bg-white">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl font-serif mb-24"
              style={{ letterSpacing: "-0.05em", color: "#111" }}
            >
              Selected Works
            </h2>
          </ScrollReveal>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {works.map((work, index) => (
              <ScrollReveal key={work.id} delay={index * 0.1}>
                <motion.div
                  className="break-inside-avoid mb-8 group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  data-cursor-hover
                >
                  <div className="relative w-full overflow-hidden bg-slate-100" data-cursor-hover>
                    <div
                      className={`relative ${
                        work.aspect === "portrait" ? "h-[500px] md:h-[600px]" : "h-[300px] md:h-[400px]"
                      }`}
                      data-cursor-hover
                    >
                      <RevealMaskImage
                        src={work.image}
                        alt={work.title}
                        containerClassName="relative w-full h-full"
                        className="transition-transform duration-500 group-hover:scale-110"
                        speed={0.15}
                      />
                    </div>
                    <div className="absolute inset-0 bg-transparent group-hover:bg-slate-200/40 transition-colors duration-300" />
                  </div>
                  <h3
                    className="mt-6 text-2xl md:text-3xl font-serif"
                    style={{ letterSpacing: "-0.05em", color: "#111" }}
                  >
                    {work.title}
                  </h3>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 裝飾線 */}
      <div className="w-full h-[1px] bg-slate-200" />

      {/* Services Section */}
      <section id="services" className="py-40 px-6 lg:px-16 bg-white">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl font-serif mb-24"
              style={{ letterSpacing: "-0.05em", color: "#111" }}
            >
              Services
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-16 md:gap-24">
            <ScrollReveal>
              <div>
                <h3
                  className="text-3xl md:text-4xl font-serif mb-6"
                  style={{ letterSpacing: "-0.05em", color: "#111" }}
                >
                  Residential
                </h3>
                <ul className="space-y-3 font-sans text-lg text-slate-700">
                  <li>• Custom Home Design</li>
                  <li>• Renovation & Restoration</li>
                  <li>• Interior Architecture</li>
                  <li>• Landscape Integration</li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div>
                <h3
                  className="text-3xl md:text-4xl font-serif mb-6"
                  style={{ letterSpacing: "-0.05em", color: "#111" }}
                >
                  Commercial
                </h3>
                <ul className="space-y-3 font-sans text-lg text-slate-700">
                  <li>• Office Buildings</li>
                  <li>• Retail Spaces</li>
                  <li>• Hospitality Design</li>
                  <li>• Cultural Institutions</li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <h3
                  className="text-3xl md:text-4xl font-serif mb-6"
                  style={{ letterSpacing: "-0.05em", color: "#111" }}
                >
                  Urban Planning
                </h3>
                <ul className="space-y-3 font-sans text-lg text-slate-700">
                  <li>• Master Planning</li>
                  <li>• Community Development</li>
                  <li>• Sustainable Design</li>
                  <li>• Public Spaces</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 裝飾線 */}
      <div className="w-full h-[1px] bg-slate-200" />

      {/* Footer */}
      <footer id="contact" className="py-40 px-6 lg:px-16 border-t border-slate-200 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-16 md:gap-24">
            <ScrollReveal>
              <div>
                <h3 className="text-xs tracking-widest uppercase mb-6 font-sans text-slate-500">Address</h3>
                <address className="text-lg font-sans text-slate-700 leading-relaxed not-italic">
                  123 Design Avenue
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </address>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div>
                <h3 className="text-xs tracking-widest uppercase mb-6 font-sans text-slate-500">Email</h3>
                <a
                  href="mailto:hello@lumina.studio"
                  className="text-lg font-sans text-black hover:opacity-60 transition-opacity"
                >
                  hello@lumina.studio
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <h3 className="text-xs tracking-widest uppercase mb-6 font-sans text-slate-500">Social</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href="#"
                    className="text-lg font-sans text-black hover:opacity-60 transition-opacity"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="text-lg font-sans text-black hover:opacity-60 transition-opacity"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    className="text-lg font-sans text-black hover:opacity-60 transition-opacity"
                  >
                    Pinterest
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-24 pt-8 border-t border-slate-200">
            <ScrollReveal>
              <p className="text-sm font-sans text-slate-500 text-center">
                © {new Date().getFullYear()} Lumina. All rights reserved.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </footer>
    </main>
  )
}
