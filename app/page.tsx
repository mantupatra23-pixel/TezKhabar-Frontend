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

  // Utility function to clean markdown junk or brackets from automation text source
  const cleanText = (text: string) => {
    if (!text) return "";
    return text.replace(/\*\*|\[|\]/g, "").trim();
  };

  const breakingNews = newsList.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-zinc-900 antialiased selection:bg-red-500 selection:text-white">
      
      {/* Ticker header */}
      <div className="bg-zinc-950 text-[#f3f4f6] text-center py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase">
        ⚡ REAL-TIME AI ENGINE PIPELINE ACTIVE
      </div>

      {/* Modern Clean Branding Bar */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-3 flex flex-col items-center justify-between gap-1 sm:flex-row">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-black tracking-tight text-[#cc0000] uppercase font-serif">
              तेज़ ख़बर
            </h1>
            <p className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase font-bold">
              Premium Automation News Aggregator
            </p>
          </div>
          <div className="text-[11px] font-mono font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded">
            {new Date().toLocaleDateString('hi-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="bg-white border-t border-zinc-100">
          <div className="max-w-4xl mx-auto px-2 flex gap-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap border-b-2 ${
                  activeCategory === cat
                    ? "border-[#cc0000] text-[#cc0000] bg-red-50/40"
                    : "border-transparent text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {cat === "All" ? "Main Feed" : cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-6 h-6 border-2 border-zinc-300 border-t-[#cc0000] rounded-full animate-spin"></div>
            <p className="text-zinc-400 font-mono text-[10px] tracking-widest">RENDERING FEED MATRIX...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 font-mono text-xs bg-white border border-zinc-200 rounded-xl shadow-xs">
            📭 Empty feed stack. Scraper loop inactive for this channel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Briefing list for quick views */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs">
                <h3 className="text-xs font-black text-white bg-zinc-900 px-3 py-1.5 rounded-md uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-ping"></span>
                  Quick Stream
                </h3>
                <div className="divide-y divide-zinc-100 font-sans">
                  {breakingNews.map((news, i) => (
                    <div key={i} className="py-2.5 first:pt-0 last:pb-0">
                      <a
                        href={news.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-zinc-700 hover:text-[#cc0000] transition-colors line-clamp-2 leading-snug no-underline block"
                      >
                        ⚡ {cleanText(news.title)}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Center Feed (Streamline Design) */}
            <div className="md:col-span-2 space-y-6">
              {newsList.map((news, index) => (
                <article 
                  key={index} 
                  className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col"
                >
                  {/* Dynamic Scaled Image Layout */}
                  {news.image_url && (
                    <div className="relative h-56 sm:h-64 w-full bg-zinc-50 overflow-hidden border-b border-zinc-100">
                      <img
                        src={news.image_url}
                        alt="News Banner Feed"
                        className="object-cover w-full h-full opacity-95"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                        <span className="bg-red-600 text-white font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded shadow-xs">
                          {news.badge ? cleanText(news.badge) : "LIVE"}
                        </span>
                        <span className="bg-zinc-900/80 backdrop-blur text-white font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded">
                          {cleanText(news.category || "Feed")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Text Grid Body Context */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      {!news.image_url && (
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono">
                          {cleanText(news.category || "General")}
                        </span>
                      )}
                      <h2 className="text-lg font-extrabold text-zinc-950 leading-snug tracking-tight hover:text-[#cc0000] transition-colors">
                        {cleanText(news.title)}
                      </h2>
                      <p className="mt-2.5 text-zinc-600 text-xs font-normal leading-relaxed tracking-wide">
                        {cleanText(news.content)}
                      </p>
                    </div>

                    {/* Metadata Footer Action items */}
                    <div className="mt-5 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                      <div className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>
                          {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent"}
                        </span>
                      </div>
                      <a
                        href={news.source_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#cc0000] hover:text-red-700 tracking-wider uppercase text-[10px] no-underline"
                      >
                        Read Full Article →
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
