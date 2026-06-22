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
      ? "तेज़ ख़बर | Premium Automated News Engine" 
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
        console.error("Portal API Error:", error);
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

  // Smart validation handler to bypass dead links or static internal search assets
  const getCleanImageUrl = (url: string) => {
    if (!url || url.includes("googleusercontent.com") || url.includes("logo") || url.includes("default")) {
      return null; // Fallback to safe beautiful text slate layout
    }
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  };

  const quickBriefs = newsList.slice(0, 5);

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-zinc-900 antialiased font-sans flex flex-col justify-between">
      <div>
        {/* TOP ACCENT WIRE */}
        <div className="bg-[#cc0000] text-white text-center py-2 text-[10px] font-mono font-black tracking-widest uppercase shadow-xs">
          ⚡ TEZ KHABAR REAL-TIME AI PIPELINE INTERFACE
        </div>

        {/* MINIMAL HIGH-END BRANDING HEADER */}
        <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-5 pt-5 pb-3 flex flex-row justify-between items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#cc0000] font-serif leading-none">
                तेज़ ख़बर
              </h1>
              <p className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase font-extrabold mt-1.5">
                Automated Premium Digital Network
              </p>
            </div>
            <div className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded">
              {new Date().toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* STREAMLINED SCROLLER BAR */}
          <div className="bg-white border-t border-zinc-100">
            <div className="max-w-3xl mx-auto px-3 flex gap-1 overflow-x-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap border-b-2 ${
                    activeCategory === cat
                      ? "border-[#cc0000] text-[#cc0000] font-black bg-red-50/20"
                      : "border-transparent text-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  {cat === "All" ? "Main Feed" : cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* CENTRAL FEED CONTEXT STREAM */}
        <main className="max-w-3xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-36 gap-2">
              <div className="w-5 h-5 border-2 border-zinc-300 border-t-[#cc0000] rounded-full animate-spin"></div>
              <p className="text-zinc-400 font-mono text-[9px] tracking-widest uppercase">SYNCING DIGITAL CONTAINER...</p>
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 font-mono text-xs bg-white border border-zinc-200 rounded-xl">
              📭 Active pool stack empty. Scraper engine pipeline idle.
            </div>
          ) : (
            <div className="space-y-10">
              
              {/* 📋 ELITE QUICK STREAM COMPACT VIEW */}
              <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-2xs">
                <h3 className="text-[10px] font-black text-zinc-800 uppercase tracking-widest mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block animate-pulse"></span>
                  Quick Stream Briefs
                </h3>
                <div className="space-y-3 font-sans divide-y divide-zinc-100">
                  {quickBriefs.map((news, i) => (
                    <div key={i} className={`text-xs ${i > 0 ? "pt-3" : ""}`}>
                      <a
                        href={news.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-zinc-700 hover:text-[#cc0000] leading-relaxed no-underline block"
                      >
                        ⚡ {cleanText(news.title)}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* ⚡ ARTICLE STREAM LIST (THE HINDU INSPIRED WHITE PAPERS) */}
              <div className="space-y-8">
                {newsList.map((news, index) => {
                  const validImageUrl = getCleanImageUrl(news.image_url);
                  return (
                    <article 
                      key={index} 
                      className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col"
                    >
                      {/* Image Layout Area */}
                      {validImageUrl ? (
                        <div className="relative w-full aspect-video bg-zinc-50 overflow-hidden border-b border-zinc-100">
                          <img
                            src={validImageUrl}
                            alt="TezKhabar Broadcast Feature Asset"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4 flex gap-1.5 items-center">
                            <span className="bg-red-600 text-white font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded shadow-xs">
                              {news.badge ? cleanText(news.badge) : "LIVE"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Beautiful text slate accent if image is unrenderable or null */
                        <div className="w-full h-2 bg-gradient-to-r from-red-600 to-amber-500" />
                      )}

                      {/* Clean Text Frame Body Area */}
                      <div className="p-6 sm:p-8">
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono block mb-2">
                          {cleanText(news.category || "General Feed")}
                        </span>
                        
                        <h2 className="text-xl sm:text-2xl font-black text-zinc-950 leading-tight tracking-tight hover:text-[#cc0000] transition-colors font-serif">
                          {cleanText(news.title)}
                        </h2>
                        
                        <p className="mt-4 text-zinc-700 text-sm sm:text-base font-normal leading-relaxed text-justify tracking-wide">
                          {cleanText(news.content)}
                        </p>

                        {/* Article Footer Controls */}
                        <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center text-[10px] font-mono text-zinc-400 select-none">
                          <span className="font-semibold tracking-wider">
                            🕒 TIME: {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent"}
                          </span>
                          <a
                            href={news.source_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#cc0000] hover:text-white hover:bg-[#cc0000] tracking-wider uppercase text-[9px] no-underline border border-zinc-200 hover:border-[#cc0000] rounded-md px-3 py-1.5 transition-all duration-150 shadow-2xs"
                          >
                            Read Full Source →
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

            </div>
          )}
        </main>
      </div>

      {/* COMPACT CLEAN FOOTER */}
      <footer className="text-center py-12 text-[10px] text-zinc-400 border-t border-zinc-200 font-mono bg-white mt-16 select-none">
        © 2026 TEZKHABAR AI AUTOMATION CONVERGENCE GROUP. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
