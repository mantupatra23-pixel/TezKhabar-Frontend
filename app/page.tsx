"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);

  const categories = ["All", "Politics", "Business", "Technology", "AI", "Finance", "Sports", "Entertainment"];
  const API_URL = "https://tezkhabar.onrender.com";

  // Dynamic Content-Driven Category Mapping Fallbacks to avoid repeating same image
  const categoryStockImages: { [key: string]: string[] } = {
    Politics: [
      "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600",
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=600"
    ],
    Business: [
      "https://images.unsplash.com/photo-1444653389962-8149286c578a?q=80&w=600",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600"
    ],
    Technology: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600"
    ],
    AI: [
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600"
    ],
    General: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600",
      "https://images.unsplash.com/photo-1495020689067-958852a6565d?q=80&w=600"
    ]
  };

  useEffect(() => {
    // SEO Canonical Strategy / OpenGraph Title Sync
    document.title = activeCategory === "All" 
      ? "TezKhabar Pro | Real-Time News Intelligence Engine" 
      : `${activeCategory} Feed - TezKhabar Pro`;

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
        console.error("Portal Architecture API Exception:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();

    const interval = setInterval(fetchNews, 180000); // Dynamic polling loop
    return () => clearInterval(interval);
  }, [activeCategory]);

  const cleanText = (text: string, limit: number = 110) => {
    if (!text) return "";
    const filtered = text.replace(/<\/?[^>]+(>|$)/g, "").replace(/\*\*|\[|\]/g, "").trim();
    return filtered.length > limit ? filtered.slice(0, limit) + "..." : filtered;
  };

  // Robust fallback pipeline system addressing ISSUE #2
  const getPrioritizedImage = (newsItem: any, index: number) => {
    if (newsItem.image_url && newsItem.image_url.length > 12 && !newsItem.image_url.includes("googleusercontent.com") && !newsItem.image_url.includes("logo")) {
      return newsItem.image_url.startsWith("http://") ? newsItem.image_url.replace("http://", "https://") : newsItem.image_url;
    }
    
    // Priority 3 & 4: Context-driven dynamic fallbacks based on category metadata pools
    const cat = newsItem.category || "General";
    const bank = categoryStockImages[cat] || categoryStockImages["General"];
    return bank[index % bank.length];
  };

  const handleArticleNavigation = (sourceUrl: string) => {
    if (sourceUrl) window.open(sourceUrl, "_blank", "noopener,noreferrer");
  };

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Disables raw card link navigation event capture triggers
    setBookmarked(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const triggerNativeShare = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: item.title, url: item.source_url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(item.source_url);
      alert("Source link copied securely to clipboard console matrix!");
    }
  };

  const heroNews = newsList[0];
  const trendingNews = newsList.slice(1, 5);
  const coreFeedStream = newsList.slice(5, visibleCount);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0F172A] text-slate-100" : "bg-slate-50 text-slate-900"} font-sans antialiased transition-colors duration-300 pb-16`}>
      
      {/* 🌐 GLASSMORPHISM PREMIUM STICKY NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-all border-b ${darkMode ? "bg-[#0F172A]/80 border-slate-800/80 shadow-lg" : "bg-white/85 border-slate-200/60 shadow-xs"} px-4 sm:px-8 py-3.5`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-orange-500 font-serif select-none cursor-pointer" onClick={() => setActiveCategory("All")}>
              तेज़ ख़बर
            </h1>
            
            {/* Desktop Navigation Category Pills (Strictly Row Non-wrapping) */}
            <div className="hidden lg:flex items-center gap-1">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-150 ${
                    activeCategory === cat ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/20" : "text-slate-400 hover:text-blue-500"
                  }`}
                >
                  {cat === "All" ? "Top Stories" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 160, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Type search queries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`text-xs px-3 py-1.5 rounded-full ${darkMode ? "bg-slate-900 text-white border-slate-800" : "bg-slate-100 text-black border-slate-200"} border focus:outline-hidden`}
                />
              )}
            </AnimatePresence>
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-slate-800/10 text-slate-400">🔍</button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-800/10 text-slate-400">{darkMode ? "☀️" : "🌙"}</button>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE HORIZONTAL SCROLL CATEGORIES SYSTEM (Bypasses Issue #4) */}
      <div className={`lg:hidden overflow-x-auto scrollbar-none py-2.5 px-4 border-b ${darkMode ? "bg-slate-950/40 border-slate-900" : "bg-white border-slate-100"}`}>
        <div className="flex flex-row space-x-1.5 wrap-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat ? "bg-[#2563EB] text-white" : darkMode ? "bg-slate-900 text-slate-400" : "bg-slate-100 text-slate-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🔴 REAL-TIME SCROLLING NEWS TICKER */}
      {newsList.length > 0 && (
        <div className={`py-2 px-4 overflow-hidden ${darkMode ? "bg-slate-950/30" : "bg-red-50/50"}`}>
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <span className="bg-[#cc0000] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-xs shrink-0 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-white inline-block animate-ping" /> LIVE
            </span>
            <div className="w-full overflow-hidden relative h-4 text-xs font-bold tracking-wide">
              <div className="absolute whitespace-nowrap flex gap-12 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
                {newsList.slice(0, 4).map((n, i) => (
                  <span key={i} onClick={() => handleArticleNavigation(n.source_url)} className="hover:text-blue-500 transition-colors">
                    ⚡ {cleanText(n.title, 85)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📰 CORE FEED MATRIX PORTAL MAIN */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
        
        {loading ? (
          /* SKELETON ENGINE PACKSAGES */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-slate-800/20 rounded-3xl animate-pulse" />
            <div className="lg:col-span-1 h-96 bg-slate-800/20 rounded-3xl animate-pulse" />
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-slate-900/10 text-slate-400 font-mono text-xs">
            📭 Structural Cluster Empty. No Responses Logged from Scraper Routers.
          </div>
        ) : (
          <div className="space-y-12">

            {/* ⚡ PREMIUM HERO SECTION OVERHAUL */}
            {heroNews && activeCategory === "All" && (
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Large Featured Card (Addressing Issue #1: Bound Handling) */}
                <motion.article 
                  whileHover={{ y: -4 }}
                  onClick={() => handleArticleNavigation(heroNews.source_url)}
                  className={`lg:col-span-2 rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] cursor-pointer flex flex-col justify-between transition-all duration-300 border border-transparent ${
                    darkMode ? "bg-slate-900/30 hover:bg-slate-900/50 hover:border-slate-800" : "bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img src={getPrioritizedImage(heroNews, 0)} alt="Hero" className="w-full h-full object-cover transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-[#2563EB] text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg">
                        {heroNews.category || "TOP FEATURED"}
                      </span>
                      <span className="bg-orange-500 text-white font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1">
                        🔥 SCORE 9.8
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-xl sm:text-3xl font-black font-serif tracking-tight text-white leading-tight">
                        {cleanText(heroNews.title, 95)}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">{cleanText(heroNews.content, 160)}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500">
                      <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-md">🕒 Updated 5 mins ago</span>
                      <span className="text-[#2563EB] font-black tracking-widest text-[9px]">READ MORE →</span>
                    </div>
                  </div>
                </motion.article>

                {/* 📈 HORIZONTAL CARD DESIGN QUICK BRIEFINGS */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-black tracking-widest uppercase text-orange-500">🔥 Trending Feed Stream</h3>
                    <span className="text-[10px] font-mono text-slate-500">Pulse Engine</span>
                  </div>
                  <div className="space-y-3.5 max-h-[510px] overflow-y-auto pr-1 scrollbar-none">
                    {trendingNews.map((news, i) => (
                      <motion.div 
                        whileHover={{ y: -2 }}
                        onClick={() => handleArticleNavigation(news.source_url)}
                        key={i} 
                        className={`p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex gap-4 items-center cursor-pointer transition-all border border-transparent ${
                          darkMode ? "bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-800" : "bg-white hover:border-slate-200"
                        }`}
                      >
                        <div className="w-20 h-20 rounded-[16px] bg-slate-950 overflow-hidden shrink-0">
                          <img src={getPrioritizedImage(news, i + 1)} alt="trend" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1.5 flex-grow">
                          <div className="flex justify-between items-center text-[8px] font-mono font-black text-[#2563EB] uppercase">
                            <span>{news.category || "Hot"}</span>
                            <span className="text-slate-500">Score {8.5 - i * 0.4}</span>
                          </div>
                          <h4 className="text-xs font-extrabold leading-snug line-clamp-2 text-slate-200">{cleanText(news.title, 70)}</h4>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </section>
            )}

            {/* 🗂️ LATEST STREAM COMPLIANCE GRIDS */}
            <section className="space-y-6">
              <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 flex items-center gap-2 px-1">
                <span>📰</span> {activeCategory === "All" ? "LATEST INTELLIGENCE STREAM" : `${activeCategory} ARCHITECTURE FEED`}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(activeCategory === "All" ? coreFeedStream : newsList).map((news, index) => (
                  <motion.article
                    whileHover={{ y: -5 }}
                    onClick={() => handleArticleNavigation(news.source_url)}
                    key={index}
                    className={`rounded-[24px] overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.04)] flex flex-col justify-between cursor-pointer transition-all duration-200 border border-transparent ${
                      darkMode ? "bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-800" : "bg-white hover:border-slate-200"
                    }`}
                  >
                    <div>
                      {/* Media container */}
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                        <img src={getPrioritizedImage(news, index + 6)} alt="stream" className="w-full h-full object-cover" loading="lazy" />
                        
                        <div className="absolute bottom-3 left-3 flex gap-1.5 items-center select-none">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-md">
                            {news.category || "General"}
                          </span>
                          <span className="bg-red-600 text-white font-black text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-md shadow-xs">LIVE</span>
                        </div>

                        <div className="absolute top-3 right-3 flex gap-1">
                          <button onClick={(e) => toggleBookmark(e, index)} className="p-2 bg-slate-900/60 backdrop-blur-md rounded-full text-[10px] hover:bg-slate-900 transition-colors">
                            {bookmarked.includes(index) ? "❤️" : "🤍"}
                          </button>
                          <button onClick={(e) => triggerNativeShare(e, news)} className="p-2 bg-slate-900/60 backdrop-blur-md rounded-full text-[10px] hover:bg-slate-900 transition-colors">
                            📤
                          </button>
                        </div>
                      </div>

                      {/* Text details content wrapper block */}
                      <div className="p-6 space-y-2.5">
                        <h4 className="text-base font-extrabold font-serif leading-snug line-clamp-2 tracking-tight text-slate-100 group-hover:text-blue-500">
                          {cleanText(news.title, 75)}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {cleanText(news.content, 110)}
                        </p>
                      </div>
                    </div>

                    {/* Footer specifications elements */}
                    <div className="px-6 py-4 border-t border-slate-800/20 bg-slate-950/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <div className="flex items-center gap-1">
                        <span>🌐</span>
                        <span className="uppercase tracking-wider font-bold text-slate-400">SOURCE FEED</span>
                      </div>
                      <span>⏱️ 1 min read</span>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* INFINITE SCROLL LOADER EMULATION BUTTON LINK */}
              {newsList.length > visibleCount && (
                <div className="text-center pt-8">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="px-6 py-2.5 bg-slate-800/30 border border-slate-800/40 rounded-full text-xs font-black font-mono uppercase tracking-widest hover:bg-[#2563EB] hover:text-white transition-all shadow-xs"
                  >
                    ⚡ Load More Streams
                  </button>
                </div>
              )}
            </section>

            {/* 📩 LUXURY NEWSLETTER HUB */}
            <section className={`rounded-[24px] p-8 sm:p-12 relative overflow-hidden ${darkMode ? "bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl" : "bg-blue-50/40"}`}>
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#2563EB]/10 rounded-full blur-3xl" />
              <div className="max-w-xl space-y-4 relative z-10">
                <span className="text-[10px] font-mono font-black tracking-widest uppercase text-[#2563EB]">Real-Time Data Distribution</span>
                <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">Subscribe to Real-Time Context briefings</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Get filtered high-signal technological updates, macro-economic metrics and automation scripts pushed straight to your mailbox console logs daily.</p>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <input type="email" placeholder="Enter clean active corporate email..." className={`text-xs px-4 py-3 rounded-xl focus:outline-hidden font-mono ${darkMode ? "bg-slate-900 text-white" : "bg-white text-black"}`} />
                  <button className="bg-[#2563EB] text-white font-bold text-xs px-6 py-3 rounded-xl whitespace-nowrap shadow-md shadow-blue-500/10">Join Channels</button>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* 🏁 GLOBAL MEDIA COMPACT FOOTER */}
      <footer className={`border-t font-mono text-xs text-slate-500 mt-24 pt-12 px-6 sm:px-12 ${darkMode ? "bg-slate-950 border-slate-900" : "bg-white border-slate-200"}`}>
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
