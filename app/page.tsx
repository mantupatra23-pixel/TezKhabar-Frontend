"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);

  const categories = ["All", "Politics", "Business", "Technology", "AI", "Finance", "Sports", "Entertainment"];
  const API_URL = "https://tezkhabar.onrender.com";

  useEffect(() => {
    document.title = activeCategory === "All" 
      ? "TezKhabar Elite | Nishpaksh Khabar, Sabse Tez" 
      : `${activeCategory} Intelligence - TezKhabar`;

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
        console.error("Portal Aggregator Stream Exception:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();

    const interval = setInterval(fetchNews, 180000);
    return () => clearInterval(interval);
  }, [activeCategory]);

  const cleanText = (text: string, limit: number = 120) => {
    if (!text) return "";
    const filtered = text.replace(/<\/?[^>]+(>|$)/g, "").replace(/\*\*|\[|\]/g, "").trim();
    return filtered.length > limit ? filtered.slice(0, limit) + "..." : filtered;
  };

  const getSecureImageUrl = (url: string, index: number) => {
    if (!url || url.includes("googleusercontent.com") || url.includes("logo") || url.length < 10) {
      const stockHub = [
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
        "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800",
        "https://images.unsplash.com/photo-1495020689067-958852a6565d?q=80&w=800"
      ];
      return stockHub[index % stockHub.length];
    }
    return url.startsWith("http://") ? url.replace("http://", "https://") : url;
  };

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  // Content Filtering Strategies
  const heroNews = newsList[0];
  const trendingNews = newsList.slice(1, 5);
  const remainingNews = newsList.slice(5, visibleCount);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0F172A] text-slate-100" : "bg-slate-50 text-slate-900"} font-sans antialiased transition-colors duration-300 pb-12`}>
      
      {/* 🌐 GLASSMORPHISM STICKY NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-200 ${darkMode ? "bg-[#0F172A]/80 shadow-[0_4px_30px_rgba(0,0,0,0.2)]" : "bg-white/85 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"} px-4 sm:px-8 py-4`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-orange-500 font-serif select-none">
              तेज़ ख़बर
            </h1>
            {/* Desktop Link Categories */}
            <div className="hidden lg:flex items-center gap-1.5">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeCategory === cat ? "bg-[#2563EB] text-white" : "text-slate-400 hover:text-blue-500"
                  }`}
                >
                  {cat === "All" ? "Main Feed" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Controls Bar Elements */}
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 160, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Search stream..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`text-xs px-3 py-1.5 rounded-full ${darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-black"} focus:outline-hidden`}
                />
              )}
            </AnimatePresence>
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-slate-800/10 text-slate-400">🔍</button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-800/10 text-slate-400">{darkMode ? "☀️" : "🌙"}</button>
          </div>
        </div>
      </nav>

      {/* 🧭 HORIZONTAL SCROLLER NAVIGATION FOR MOBILE DEVICES */}
      <div className={`lg:hidden overflow-x-auto scrollbar-none py-3 px-4 shadow-inner ${darkMode ? "bg-slate-950/40" : "bg-white"}`}>
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat ? "bg-[#2563EB] text-white" : "bg-slate-800/10 text-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🔥 AUTOMATED REAL-TIME MARQUEE TICKER */}
      {newsList.length > 0 && (
        <div className={`py-2.5 px-4 overflow-hidden shadow-xs ${darkMode ? "bg-slate-950/50" : "bg-red-50/60"}`}>
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <span className="bg-[#cc0000] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0 animate-pulse">LIVE</span>
            <div className="w-full overflow-hidden relative h-4 text-xs font-bold tracking-wide">
              <div className="absolute whitespace-nowrap flex gap-10 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
                {newsList.slice(0, 4).map((n, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="text-[#2563EB]">✦</span> {cleanText(n.title, 80)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📰 CENTRAL HUB INTERFACE CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-8">
        
        {/* SKELETON LOADER CONTAINER ENGINE */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 h-96 bg-slate-800/20 rounded-[20px] animate-pulse" />
            <div className="md:col-span-1 h-96 bg-slate-800/20 rounded-[20px] animate-pulse" />
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-28 rounded-[20px] bg-slate-900/10 text-slate-400 font-mono text-xs">
            📭 Empty active stream layout. Check MongoDB routing clusters.
          </div>
        ) : (
          <div className="space-y-12">

            {/* ⚡ MODERN HERO SECTION (NO BORDERS) */}
            {heroNews && activeCategory === "All" && (
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Full Width Dynamic Accent Hero Block */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className={`lg:col-span-2 rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-300 ${
                    darkMode ? "bg-slate-900/30 hover:bg-slate-900/50" : "bg-white"
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img src={getSecureImageUrl(heroNews.image_url, 0)} alt="Hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <span className="absolute top-4 left-4 bg-[#2563EB] text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg">
                      {heroNews.category || "TOP FEATURED"}
                    </span>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-xl sm:text-3xl font-black font-serif tracking-tight text-white leading-tight">
                        {cleanText(heroNews.title, 95)}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">{cleanText(heroNews.content, 180)}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500">
                      <span>⏱️ 2 MIN READ</span>
                      <a href={heroNews.source_url} target="_blank" className="bg-[#2563EB] text-white px-4 py-2 rounded-full font-sans uppercase font-black text-[9px] tracking-widest shadow-xs">Read Full Story</a>
                    </div>
                  </div>
                </motion.div>

                {/* 📈 TRENDING SIDEBAR SECTION */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="text-xs font-black tracking-widest uppercase text-orange-500">📈 Trending Matrix</h3>
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  </div>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-none">
                    {trendingNews.map((news, i) => (
                      <motion.div 
                        whileHover={{ x: 4 }}
                        key={i} 
                        className={`p-4 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.02)] flex gap-4 items-center transition-all ${
                          darkMode ? "bg-slate-900/20 hover:bg-slate-900/40" : "bg-white"
                        }`}
                      >
                        <div className="w-20 h-20 rounded-xl bg-slate-950 overflow-hidden shrink-0">
                          <img src={getSecureImageUrl(news.image_url, i + 1)} alt="trend" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono font-black text-[#2563EB] uppercase">{news.category || "Hot"}</span>
                          <h4 className="text-xs font-bold leading-snug line-clamp-2 text-slate-200"><a href={news.source_url} target="_blank">{cleanText(news.title, 65)}</a></h4>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </section>
            )}

            {/* 📰 LATEST NEWS MAIN CARDS GRID */}
            <section className="space-y-6">
              <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 flex items-center gap-2 px-2">
                <span>📰</span> {activeCategory === "All" ? "LATEST STREAM CONTEXT" : `${activeCategory} INTELLIGENCE`}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(activeCategory === "All" ? remainingNews : newsList).map((news, index) => (
                  <motion.article
                    whileHover={{ y: -4 }}
                    key={index}
                    className={`rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all duration-200 ${
                      darkMode ? "bg-slate-900/20 hover:bg-slate-900/40" : "bg-white"
                    }`}
                  >
                    <div>
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                        <img src={getSecureImageUrl(news.image_url, index + 5)} alt="stream" className="w-full h-full object-cover" loading="lazy" />
                        <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-md">
                          {news.category || "General"}
                        </span>
                        <button onClick={() => toggleBookmark(index)} className="absolute top-3 right-3 p-2 bg-slate-900/60 backdrop-blur-md rounded-full text-xs">
                          {bookmarked.includes(index) ? "❤️" : "🤍"}
                        </button>
                      </div>
                      <div className="p-6 space-y-2.5">
                        <h4 className="text-base font-extrabold font-serif leading-snug line-clamp-2 tracking-tight text-slate-100">
                          {cleanText(news.title, 75)}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {cleanText(news.content, 120)}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-slate-800/20 bg-slate-950/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>🕒 {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent"}</span>
                      <a href={news.source_url} target="_blank" className="font-black text-[#2563EB] uppercase text-[9px] tracking-wider">Explore Source →</a>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* 🔄 INFINITE SCROLL / LOAD MORE SIMULATION MODULE */}
              {newsList.length > visibleCount && (
                <div className="text-center pt-8">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="px-6 py-2.5 bg-slate-800/30 border border-slate-800/40 rounded-full text-xs font-black font-mono uppercase tracking-widest hover:bg-[#2563EB] hover:text-white transition-all shadow-sm"
                  >
                    ⚡ Load Infinite Stream
                  </button>
                </div>
              )}
            </section>

            {/* 📩 PREMIUM NEWSLETTER INFRASTRUCTURE */}
            <section className={`rounded-[20px] p-8 sm:p-12 relative overflow-hidden ${darkMode ? "bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl" : "bg-blue-50/50"}`}>
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#2563EB]/10 rounded-full blur-3xl" />
              <div className="max-w-xl space-y-4 relative z-10">
                <span className="text-[10px] font-mono font-black tracking-widest uppercase text-[#2563EB]">Stay Digitally Synced</span>
                <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">Subscribe to Real-Time Context Briefings</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Get filtered high-signal technological updates, automation structures and news digests pushed direct to your console feed daily.</p>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <input type="email" placeholder="Enter remote user console email..." className={`text-xs px-4 py-3 rounded-xl focus:outline-hidden font-mono ${darkMode ? "bg-slate-900 text-white" : "bg-white text-black"}`} />
                  <button className="bg-[#2563EB] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-blue-600/10 whitespace-nowrap">Join Channel</button>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* 🏁 CORPORATE GLOBAL MEDIA FOOTER */}
      <footer className={`border-t font-mono text-xs text-slate-500 mt-20 pt-12 px-6 sm:px-12 ${darkMode ? "bg-slate-950 border-slate-900" : "bg-white border-slate-200"}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 pb-8">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-black font-serif tracking-tight text-slate-300 text-lg">TEZKHABAR AI</h4>
            <p className="text-[10px]">Real-Time Autonomous Content Scraper & News Matrix Platform.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold tracking-widest uppercase">
            <a href="#" className="hover:text-blue-500">API Channels</a>
            <a href="#" className="hover:text-blue-500">Infrastructure</a>
            <a href="#" className="hover:text-blue-500">Terminals</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center border-t border-slate-800/20 pt-6 text-[9px] tracking-widest text-slate-600">
          © 2026 TEZKHABAR CONVERGENCE LABS. PIPELINES SECURELY ENCRYPTED. ALL RIGHTS RESERVED.
        </div>
      </footer>

    </div>
  );
}
