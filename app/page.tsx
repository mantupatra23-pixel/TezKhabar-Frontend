"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Politics", "Bollywood", "Tech", "Sports", "Crypto"];
  const API_URL = "https://tezkhabar.onrender.com";

  useEffect(() => {
    // Inject dynamic HTML document title browser-side for premium SEO tracking
    document.title = activeCategory === "All" 
      ? "तेज़ ख़बर | Premium Automated News Platform" 
      : `${activeCategory} - तेज़ ख़बर`;

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
        console.error("Portal API Pipeline Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();

    // 🔄 AUTOMATIC POLLING: Background silent data refresh every 3 minutes
    const interval = setInterval(fetchNews, 180000);
    return () => clearInterval(interval);
  }, [activeCategory]);

  // Clean raw automation texts from syntax marks or bold symbols (** / [ / ]) and HTML residue
  const cleanText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/<\/?[^>]+(>|$)/g, "") // Strips raw HTML tags if any bleed through
      .replace(/\*\*|\[|\]/g, "")
      .trim();
  };

  // Secure Image proxy validation to bypass mixed content policy block constraints smoothly
  const getSecureImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  };

  const quickBriefStream = newsList.slice(0, 5);

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-neutral-900 antialiased font-sans flex flex-col justify-between">
      
      <div>
        {/* 🔴 TOP AGGREGATOR RUNNING HEADLINES ACCENT */}
        <div className="bg-[#cc0000] text-white text-center py-2 text-[10px] font-mono font-black tracking-widest uppercase shadow-sm selection:bg-white selection:text-red-600">
          ⚡ TEZ KHABAR AUTOMATED REAL-TIME NEWS AGGREGATOR ENGINE
        </div>

        {/* METROPOLITAN SLATE PORTAL HEADER */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-row justify-between items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-[#cc0000] font-serif leading-none select-none">
                तेज़ ख़बर
              </h1>
              <p className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase font-bold mt-1.5">
                Premium Automation Web Feed Network
              </p>
            </div>
            <div className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-md shadow-xs select-none">
              {new Date().toLocaleDateString('hi-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* DYNAMIC SCROLLABLE NAVIGATION LINKS */}
          <div className="bg-white border-t border-neutral-100">
            <div className="max-w-6xl mx-auto px-2 flex gap-1 overflow-x-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap border-b-2 ${
                    activeCategory === cat
                      ? "border-[#cc0000] text-[#cc0000] bg-red-50/40 font-black"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {cat === "All" ? "Main Feed" : cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* 📰 CORE VIEW CONTAINER BLOCK */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-36 gap-3">
              <div className="w-6 h-6 border-2 border-neutral-300 border-t-[#cc0000] rounded-full animate-spin"></div>
              <p className="text-neutral-400 font-mono text-[9px] tracking-widest uppercase font-bold">Syncing Portal Matrix...</p>
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-24 text-neutral-400 font-mono text-xs bg-white border border-neutral-200 rounded-xl shadow-xs">
              📭 Empty segment stack. No active responses from automated loops.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* 📋 QUICK BRIEFING STREAM TRACK */}
              <aside className="lg:col-span-1 bg-white border border-neutral-200 p-4 rounded-xl shadow-xs">
                <h3 className="text-[11px] font-black text-neutral-800 uppercase tracking-wider mb-3 pb-2 border-b border-neutral-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block animate-pulse"></span>
                  Quick Stream
                </h3>
                <div className="space-y-3 font-sans">
                  {quickBriefStream.map((news, i) => (
                    <div key={i} className="text-xs pb-3 last:pb-0 border-b border-neutral-100 last:border-0">
                      <a
                        href={news.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-neutral-700 hover:text-[#cc0000] transition-colors leading-snug no-underline block"
                      >
                        ⚡ {cleanText(news.title)}
                      </a>
                    </div>
                  ))}
                </div>
              </aside>

              {/* ⚡ ACTIVE DYNAMIC ARTICLE GRID FLOW */}
              <section className="lg:col-span-3 space-y-6">
                {newsList.map((news, index) => (
                  <article 
                    key={index} 
                    className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col"
                  >
                    {/* Media Frame Grid Layout */}
                    {news.image_url && (
                      <div className="relative w-full aspect-video bg-neutral-50 overflow-hidden border-b border-neutral-100">
                        <img
                          src={getSecureImageUrl(news.image_url)}
                          alt="TezKhabar Live Snapshot Feed"
                          className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity"
                          loading="lazy"
                          onError={(e) => {
                            // If proxy chain triggers an error, cleanly collapse or hide image frame to stay premium
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5 items-center select-none">
                          <span className="bg-red-600 text-white font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                            {news.badge ? cleanText(news.badge) : "LIVE"}
                          </span>
                          <span className="bg-neutral-900/85 text-white font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded">
                            {cleanText(news.category || "Feed")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content Frame Context Section */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        {!news.image_url && (
                          <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono block mb-1">
                            {cleanText(news.category || "General")}
                          </span>
                        )}
                        <h2 className="text-lg font-extrabold text-neutral-950 leading-snug tracking-tight hover:text-[#cc0000] transition-colors font-serif">
                          {cleanText(news.title)}
                        </h2>
                        <p className="mt-3 text-neutral-600 text-xs font-normal leading-relaxed text-justify">
                          {cleanText(news.content)}
                        </p>
                      </div>

                      {/* Footer Info Action Bars */}
                      <div className="mt-5 pt-3 border-t border-neutral-100 flex justify-between items-center text-[10px] font-mono text-neutral-400 select-none">
                        <span className="font-medium">
                          🕒 {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent"}
                        </span>
                        <a
                          href={news.source_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#cc0000] hover:text-red-700 tracking-wider uppercase text-[10px] no-underline border border-neutral-200 hover:border-[#cc0000] rounded px-2.5 py-1 transition-all"
                        >
                          Read Full Source →
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

            </div>
          )}
        </main>
      </div>

      {/* FOOTER SECTION */}
      <footer className="text-center py-10 text-[10px] text-neutral-400 border-t border-neutral-200 font-mono bg-white mt-12 select-none">
        © 2026 TEZKHABAR AUTOMATION GROUP NETWORKS LTD. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
