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

  // Breaking ya Taza Khabar ke liye top 5 news extract kar rahe hain
  const tazaKhabar = newsList.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 antialiased">
      
      {/* 🔴 TOP RED HEADER LOGO BAR */}
      <div className="bg-[#cc0000] text-white text-center py-2 text-xs font-bold tracking-wider uppercase border-b border-red-700">
        ⚡ TEZ KHABAR AUTOMATED REAL-TIME NEWS ENGINE
      </div>

      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col items-center justify-between gap-2 md:flex-row">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#cc0000] font-serif">
              तेज़ ख़बर
            </h1>
            <p className="text-[11px] text-neutral-500 font-mono uppercase tracking-widest mt-0.5">
              TezKhabar AI Portal v5.0
            </p>
          </div>
          <div className="text-xs text-neutral-500 font-medium font-mono hidden md:block">
            {new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* 🎛️ PROFESSIONAL NAVIGATION MENU BAR */}
        <div className="bg-[#222222] text-white">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap border-b-4 ${
                  activeCategory === cat
                    ? "bg-[#cc0000] border-white text-white"
                    : "border-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {cat === "All" ? "होम" : cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 📰 MAIN PORTAL BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-9 h-9 border-4 border-neutral-200 border-t-[#cc0000] rounded-full animate-spin"></div>
            <p className="text-neutral-500 font-mono text-xs">Loading Live Portal Layout...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 font-medium bg-white border border-neutral-200 rounded-lg shadow-sm">
            📭 Is category me abhi koi khabar nahi mili bhai!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* 🔴 LEFT SIDEBAR: TAZA KHABAR (BULLET LIST) */}
            <aside className="lg:col-span-1 bg-white border border-neutral-200 p-4 rounded-lg shadow-sm h-fit">
              <h2 className="text-md font-bold text-white bg-[#cc0000] px-3 py-1.5 rounded uppercase tracking-wide mb-4 flex items-center gap-2 font-serif">
                <span className="animate-ping w-2 h-2 rounded-full bg-white inline-block"></span>
                ताजा खबरें
              </h2>
              <div className="divide-y divide-neutral-100">
                {tazaKhabar.map((news, i) => (
                  <div key={i} className="py-3 first:pt-0 last:pb-0 group">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">
                      {news.category || "BREAKING"}
                    </span>
                    <a
                      href={news.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-neutral-800 hover:text-[#cc0000] transition-colors line-clamp-3 leading-snug"
                    >
                      • {news.title}
                    </a>
                  </div>
                ))}
              </div>
            </aside>

            {/* ⚡ CENTER & RIGHT CONTENT: MAIN NEWS PORTAL GRID */}
            <section className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsList.map((news, index) => (
                <article 
                  key={index} 
                  className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative h-48 w-full bg-neutral-100 border-b border-neutral-100">
                      {news.image_url ? (
                        <img
                          src={news.image_url}
                          alt={news.title || "News Image"}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-mono">
                          [ Image Not Available ]
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-[#cc0000] text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                        {news.badge ? news.badge.replace(/[\[\]]/g, "") : "LIVE"}
                      </span>
                    </div>

                    {/* Text Box */}
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider font-mono">
                        {news.category || "General"}
                      </span>
                      <h3 className="text-base font-extrabold text-neutral-900 mt-1 hover:text-[#cc0000] transition-colors leading-snug">
                        {news.title}
                      </h3>
                      <p className="mt-2 text-neutral-600 text-xs font-normal leading-relaxed line-clamp-4">
                        {news.content}
                      </p>
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center text-[11px] font-mono text-neutral-500">
                    <span>
                      🕒 {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent"}
                    </span>
                    <a
                      href={news.source_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-red-600 hover:underline flex items-center gap-0.5"
                    >
                      पढ़ें पूरा सोर्स →
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
