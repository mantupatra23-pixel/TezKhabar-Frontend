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
        console.error("Failed fetching news layout matrix:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [activeCategory, API_URL]);

  const tazaKhabar = newsList.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f4f5f6] text-zinc-900 antialiased font-sans">
      
      {/* 🔴 TOP BREAKING TICKER BAR */}
      <div className="bg-[#cc0000] text-white text-center py-2 text-[11px] font-bold tracking-widest uppercase shadow-sm">
        ⚡ LIVE REAL-TIME HINGLISH NEWS AUTOMATION ENGINE
      </div>

      {/* HEADER LOGO SECTION */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight text-[#cc0000] font-serif">
              तेज़ ख़बर
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">
              PRO DIGITAL PORTAL v5.0
            </p>
          </div>
          <div className="text-xs text-zinc-500 font-bold font-mono bg-zinc-100 px-3 py-1.5 rounded-md">
            {new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* 🎛️ PREMIUM STICKY NAVIGATION BAR */}
        <div className="bg-[#1a1a1a] text-white shadow-inner">
          <div className="max-w-7xl mx-auto px-2 flex gap-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider transition-all duration-150 whitespace-nowrap border-b-4 ${
                  activeCategory === cat
                    ? "bg-[#cc0000] border-white text-white shadow-md"
                    : "border-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {cat === "All" ? "मुख्य समाचार" : cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 📰 MAIN PORTAL CORE */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-8 h-8 border-4 border-zinc-200 border-t-[#cc0000] rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-mono text-xs tracking-wider">Syncing Portal Engine...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 font-semibold bg-white border border-zinc-200 rounded-xl shadow-xs">
            📭 Is category me abhi koi khabar nahi mili bhai!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* 🔴 SIDEBAR: TAZA KHABAR (CLEAN BULLET LIST WITH NO UNDERLINES) */}
            <aside className="lg:col-span-1 bg-white border border-zinc-200 p-5 rounded-xl shadow-xs h-fit">
              <h2 className="text-sm font-extrabold text-white bg-[#cc0000] px-4 py-2 rounded-lg uppercase tracking-wider mb-4 flex items-center gap-2 font-serif shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white inline-block animate-pulse"></span>
                अभी-अभी की खबरें
              </h2>
              <div className="divide-y divide-zinc-100">
                {tazaKhabar.map((news, i) => (
                  <div key={i} className="py-3.5 first:pt-0 last:pb-0 group">
                    <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block mb-1">
                      {news.category || "BREAKING"}
                    </span>
                    <a
                      href={news.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-zinc-800 hover:text-[#cc0000] transition-colors line-clamp-3 leading-relaxed no-underline block"
                    >
                      {news.title.replace(/\*\*|\[|\]/g, "")}
                    </a>
                  </div>
                ))}
              </div>
            </aside>

            {/* ⚡ MAIN CONTENT GRID ROW */}
            <section className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsList.map((news, index) => (
                <article 
                  key={index} 
                  className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative h-52 w-full bg-zinc-100 overflow-hidden border-b border-zinc-100">
                      {news.image_url ? (
                        <img
                          src={news.image_url}
                          alt={news.title || "News Media"}
                          className="object-cover w-full h-full hover:scale-102 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-400 text-xs font-mono">
                          [ Image Feed Loading ]
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-[#cc0000] text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                        {news.badge ? news.badge.replace(/[\[\]]/g, "") : "LIVE"}
                      </span>
                    </div>

                    {/* Post Content Area */}
                    <div className="p-5">
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-wider font-mono">
                        {news.category || "General"}
                      </span>
                      <h3 className="text-base font-black text-zinc-900 mt-1.5 leading-snug hover:text-[#cc0000] transition-colors">
                        {news.title.replace(/\*\*|\[|\]/g, "")}
                      </h3>
                      <p className="mt-2.5 text-zinc-600 text-xs font-normal leading-relaxed line-clamp-4">
                        {news.content}
                      </p>
                    </div>
                  </div>

                  {/* Clean Footer Info */}
                  <div className="mx-5 py-4 border-t border-zinc-100 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span className="font-medium">
                      🕒 {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent"}
                    </span>
                    <a
                      href={news.source_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-red-600 hover:text-red-700 transition-colors no-underline uppercase tracking-wider text-[10px]"
                    >
                      पूरा पढ़ें →
                    </a>
                  </div>
                </article>
              ))}
            </section>

          </div>
        )}
      </main>
    </div>
  );
}
