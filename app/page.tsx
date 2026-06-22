"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Politics", "Bollywood", "Tech", "Sports", "Crypto"];
  const API_URL = "https://tezkhabar.onrender.com";

  useEffect(() => {
    document.title = activeCategory === "All" 
      ? "तेज़ ख़बर | निष्पक्ष खबर, सबसे तेज़" 
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

    const interval = setInterval(fetchNews, 180000);
    return () => clearInterval(interval);
  }, [activeCategory]);

  const cleanText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\*\*|\[|\]/g, "")
      .trim();
  };

  // Direct secure translation of image URLs to allow the absolute real image stream
  const getRealImageUrl = (url: string) => {
    if (!url || url.length < 10) return null;
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  };

  const quickBriefStream = newsList.slice(0, 5);

  return (
    <div className="bg-white min-h-screen text-neutral-900 antialiased font-sans flex flex-col justify-between">
      <div>

        {/* METROPOLITAN CLEAN NEWS HEADER */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 flex flex-row justify-between items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#cc0000] font-serif leading-none select-none">
                तेज़ ख़बर
              </h1>
              <p className="text-[10px] text-neutral-500 font-bold tracking-wide mt-2.5 select-none">
                निष्पक्ष खबर, सबसे तेज़ <span className="text-zinc-300 mx-1">|</span> <span className="text-zinc-400 font-normal">Real-Time News Stream</span>
              </p>
            </div>
            <div className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded select-none">
              {new Date().toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* DYNAMIC NAVIGATION LINKS */}
          <div className="bg-white border-t border-neutral-100">
            <div className="max-w-2xl mx-auto px-2 flex gap-1 overflow-x-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap border-b-2 ${
                    activeCategory === cat
                      ? "border-[#cc0000] text-[#cc0000] font-black"
                      : "border-transparent text-neutral-400 hover:text-zinc-900"
                  }`}
                >
                  {cat === "All" ? "Main Feed" : cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTAINER */}
        <main className="max-w-xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-36 gap-2">
              <div className="w-5 h-5 border-2 border-neutral-300 border-t-[#cc0000] rounded-full animate-spin"></div>
              <p className="text-neutral-400 font-mono text-[9px] tracking-widest uppercase">Syncing Live Stream...</p>
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-20 text-neutral-400 font-mono text-xs bg-white border border-neutral-200 rounded-xl">
              📭 Feed stack empty. Scraper pipeline idle.
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* QUICK BRIEFING BOARD */}
              <div className="bg-neutral-50 border border-neutral-200/60 p-4 rounded-xl shadow-2xs">
                <h3 className="text-[10px] font-mono font-black text-neutral-500 uppercase tracking-widest mb-3 pb-1.5 border-b border-neutral-200/60">
                  ⚡ QUICK BRIEFING
                </h3>
                <div className="space-y-2.5 font-sans divide-y divide-neutral-200/40">
                  {quickBriefStream.map((news, i) => (
                    <div key={i} className={`text-xs text-neutral-800 ${i > 0 ? "pt-2.5" : ""}`}>
                      <a
                        href={news.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-neutral-700 hover:text-[#cc0000] leading-snug no-underline block"
                      >
                        • {cleanText(news.title)}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* AUTOMATED MAIN STREAM ARTICLES */}
              <div className="divide-y divide-neutral-200">
                {newsList.map((news, index) => {
                  const targetImage = getRealImageUrl(news.image_url);
                  return (
                    <article key={index} className="py-8 first:pt-0 last:pb-0 flex flex-col">
                      
                      {/* Meta context fields */}
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider mb-2 select-none">
                        <span className="text-[#cc0000] font-extrabold">{cleanText(news.category || "General")}</span>
                        <span>•</span>
                        <span>{news.badge ? cleanText(news.badge) : "LIVE FEED"}</span>
                      </div>

                      {/* Headline Title */}
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 leading-tight font-serif hover:text-[#cc0000] transition-colors mb-4">
                        {cleanText(news.title)}
                      </h2>

                      {/* Pure Real Image Container with Auto-Hide Collapse Fallback */}
                      {targetImage && (
                        <div className="w-full aspect-video bg-neutral-100 rounded-xl overflow-hidden mb-5 relative flex items-center justify-center shadow-2xs">
                          <img
                            src={targetImage}
                            alt="TezKhabar News Real Stream Graph"
                            className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity duration-200"
                            loading="lazy"
                            onError={(e) => {
                              // Safely collapses the image space completely if url link drops dead
                              const target = e.target as HTMLElement;
                              if (target && target.parentElement) {
                                target.parentElement.style.display = 'none';
                              }
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Content Body Layout */}
                      <p className="text-neutral-700 text-sm sm:text-base font-normal leading-relaxed text-justify tracking-wide whitespace-pre-line px-1">
                        {cleanText(news.content)}
                      </p>

                      {/* Footer Specs info */}
                      <div className="mt-5 flex justify-between items-center text-[10px] font-mono text-neutral-400 select-none px-1">
                        <span>🕒 {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent"}</span>
                        <a
                          href={news.source_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-black text-[#cc0000] hover:underline uppercase text-[10px] tracking-wider"
                        >
                          READ FULL SOURCE →
                        </a>
                      </div>

                    </article>
                  );
                })}
              </div>

            </div>
          )}
        </main>
      </div>

      <footer className="text-center py-10 text-[10px] text-neutral-400 border-t border-neutral-200 font-mono bg-white mt-16 select-none">
        © 2026 TEZKHABAR AUTOMATION GROUP NETWORKS LTD. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
