import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-serif text-stone-900 mb-4 leading-relaxed">
        文章不存在
      </h1>
      <p className="text-stone-600 font-sans mb-6">
        找不到您要尋找的文章
      </p>
      <Link
        href="/demos/vantage"
        className="text-stone-600 hover:text-stone-900 underline font-sans"
      >
        ← 返回首頁
      </Link>
    </div>
  );
}

