"use client";
import { motion } from "framer-motion";
import { useState, FormEvent } from "react";

const EMAIL = "sa10113402@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/sam.174324/";
const WEB3FORMS_ACCESS_KEY = "d1ced533-de1d-4192-827c-eadbabcc0e83";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: "訊息已送出！我會盡快回覆您。",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "送出失敗，請稍後再試。",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "送出失敗，請檢查網路連線後再試。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h2 className="text-3xl font-bold mb-4">聯絡我</h2>
      <p className="text-gray-400 mb-8">有專案合作或設計需求歡迎聯繫！</p>
      <div className="flex flex-col gap-4 items-center mb-8">
        <a
          href={`mailto:${EMAIL}`}
          className="text-green-400 underline hover:text-green-300 transition-colors"
        >
          {EMAIL}
        </a>
        <div className="flex gap-4 justify-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mx-auto max-w-md"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="您的姓名"
          required
          className="w-full p-3 rounded bg-[#222] text-white border border-transparent focus:border-green-400 focus:outline-none transition-colors"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="您的 Email"
          required
          className="w-full p-3 rounded bg-[#222] text-white border border-transparent focus:border-green-400 focus:outline-none transition-colors"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="您的訊息"
          required
          rows={4}
          className="w-full p-3 rounded bg-[#222] text-white border border-transparent focus:border-green-400 focus:outline-none transition-colors resize-none"
        />
        {submitStatus.type && (
          <div
            className={`p-3 rounded ${
              submitStatus.type === "success"
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-red-500/20 text-red-400 border border-red-500/50"
            }`}
          >
            {submitStatus.message}
          </div>
        )}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-full bg-green-400 text-black font-medium hover:bg-green-500 transition-colors shadow-[0_0_20px_rgba(74,222,128,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-400"
          whileHover={!isSubmitting ? { y: -10 } : {}}
          transition={{ delay: 0.02, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {isSubmitting ? "傳送中..." : "送出訊息"}
        </motion.button>
      </form>
    </section>
  );
}
