"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Politics", "Bollywood", "Tech", "Sports", "Crypto"];
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tezkhabar.onrender.com";

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        let url = `${API_URL}/api/news`;
        if (activeCategory !== "All") {
          url += `?category=${activeCategory}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setNewsList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Portal fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [activeCategory, API_URL]);

  const cleanText = (text: string) => {
    if (!text) return "";
    return text.replace(/\*\*|\[|\]/g, "").trim();
  };

  const quickStream = newsList.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 antialiased font-sans pb-12">
      
      {/* ⚡ Sleek Top Minimal Alert Bar */}
      <div className="bg-[#cc0000] text-white text-center py-1.5 text-[10px] font-mono font-black tracking-widest uppercase">
        Live Feed Pipeline Active
      </div>

      {/* Premium Minimal Header (Inspired by The Hindu Layout) */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-3 flex flex-row justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#cc0000] font-serif leading-none">
              तेज़ ख़बर
            </h1>
            <p className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase font-bold mt-1">
              Automated News Aggregator
            </p>
          </div>
          <div className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded font-bold">
            {new Date().toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Horizontal Navigation Grid */}
        <div className="bg-white border-t border-neutral-100">
          <div className="max-w-4xl mx-auto px-2 flex gap-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap border-b-2 ${
                  activeCategory === cat
                    ? "border-[#cc0000] text-[#cc0000] bg-red-50/30"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {cat === "All" ? "Main Feed" : cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Layout Content Stream */}
      <main className="max-w-4xl mx-auto px-4 mt-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-5 h-5 border-2 border-neutral-300 border-t-[#cc0000] rounded-full animate-spin"></div>
            <p className="text-neutral-400 font-mono text-[9px] tracking-widest">LOADING SECURE FEED BLOCK...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 font-mono text-xs bg-white border border-neutral-200 rounded-xl">
            📭 Active stream empty. Check backend storage loops.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* 📋 Refined Quick Stream Sidebar Section */}
            <div className="md:col-span-1">
              <div className="bg-white border border-neutral-200 p-4 rounded-xl shadow-xs">
                <h3 className="text-[11px] font-black text-neutral-800 uppercase tracking-wider mb-3 pb-2 border-b border-neutral-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block animate-pulse"></span>
                  Quick Briefing
                </h3>
                <div className="space-y-3 font-sans">
                  {quickStream.map((news, i) => (
                    <div key={i} className="text-xs pb-3 last:pb-0 border-b border-neutral-50 last:border-0">
                      <a
                        href={news.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-neutral-700 hover:text-[#cc0000] leading-snug no-underline block"
                      >
                        ⚡ {cleanText(news.title)}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 📰 Main Feed Stream Line Grid */}
            <div className="md:col-span-2 space-y-5">
              {newsList.map((news, index) => (
                <article 
                  key={index} 
                  className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col"
                >
                  {/* Dynamic Scaled Banner Section */}
                  {news.image_url && (
                    <div className="relative h-48 sm:h-56 w-full bg-neutral-50 overflow-hidden border-b border-neutral-100">
                      <img
                        src={news.image_url}
                        alt="TezKhabar Content Banner"
                        className="object-cover w-full h-full opacity-95 transition-opacity hover:opacity-100"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                        <span className="bg-red-600 text-white font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                          {news.badge ? cleanText(news.badge) : "LIVE"}
                        </span>
                        <span className="bg-neutral-900/85 text-white font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded">
                          {cleanText(news.category || "Feed")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Body Content Blocks */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      {!news.image_url && (
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono block mb-1">
                          {cleanText(news.category || "General")}
                        </span>
                      )}
                      <h2 className="text-base font-extrabold text-neutral-950 leading-snug tracking-tight hover:text-[#cc0000] transition-colors font-serif">
                        {cleanText(news.title)}
                      </h2>
                      <p className="mt-2 text-neutral-600 text-xs font-normal leading-relaxed tracking-wide text-justify">
                        {cleanText(news.content)}
                      </p>
                    </div>

                    {/* Footer Row Metadata elements */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center text-[10px] font-mono text-neutral-400">
                      <span className="font-medium">
                        🕒 {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent"}
                      </span>
                      <a
                        href={news.source_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#cc0000] hover:text-red-700 tracking-wider uppercase text-[10px] no-underline"
                      >
                        READ FULL ARTICLE →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
