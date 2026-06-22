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

  return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased selection:bg-green-500 selection:text-black">
      {/* 🟢 TOP PREMIUM NAVBAR */}
      <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur sticky top-0 z-50 px-4 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-green-400 to-green-500">
            TEZKHABAR <span className="text-xs font-mono font-bold text-green-400 border border-green-500/30 px-2 py-0.5 rounded bg-green-950/20">AI v5.0</span>
          </h1>
          <p className="text-xs text-zinc-500 font-mono tracking-wider">Real-time Hinglish Automation Matrix</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 🎛️ DYNAMIC CATEGORY FILTERS (Proper Spacing & Styling) */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-10 border-b border-zinc-900 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-lg font-medium tracking-wide text-xs uppercase transition-all duration-200 whitespace-nowrap block border ${
                activeCategory === cat
                  ? "bg-green-500 text-black font-bold border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🌀 LOADER ENGINE STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-mono text-xs tracking-widest">Syncing with MongoDB Pipeline...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-24 text-zinc-600 font-mono text-sm border border-dashed border-zinc-900 rounded-2xl bg-zinc-950/20">
            📭 Is category me abhi koi khabar nahi mili bhai! Scraper loop check karein.
          </div>
        ) : (
          /* ⚡ GRID CARD MANAGEMENT SYSTEM */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((news, index) => (
              <article 
                key={index} 
                className="group bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all duration-300 flex flex-col shadow-xl"
              >
                {/* Image Section */}
                <div className="relative h-52 w-full bg-zinc-900 overflow-hidden border-b border-zinc-900">
                  {news.image_url ? (
                    <img
                      src={news.image_url}
                      alt={news.title || "TezKhabar News"}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-600 text-xs font-mono">
                      [ No Image Feed ]
                    </div>
                  )}
                  {/* Badges */}
                  <span className="absolute top-4 left-4 bg-green-500 text-black font-black text-[10px] uppercase tracking-wider px-2 py-1 rounded shadow-md">
                    {news.badge ? news.badge.replace(/[\[\]]/g, "") : "ALERT"}
                  </span>
                  <span className="absolute bottom-4 right-4 bg-black/80 backdrop-blur text-green-400 text-[10px] uppercase font-mono tracking-wider px-2 py-1 rounded border border-green-500/20">
                    {news.category || "General"}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow justify-between bg-zinc-950">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100 group-hover:text-green-400 transition-colors duration-200 line-clamp-2 leading-snug">
                      {news.title}
                    </h3>
                    <p className="mt-3 text-zinc-400 text-sm font-normal leading-relaxed line-clamp-4">
                      {news.content}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center">
                    <span className="text-[11px] font-mono text-zinc-600">
                      {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent"} | Active
                    </span>
                    <a
                      href={news.source_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-green-500 hover:text-green-400 flex items-center gap-1 group/btn"
                    >
                      Source Link 
                      <span className="transform group-hover/btn:translate-x-0.5 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
