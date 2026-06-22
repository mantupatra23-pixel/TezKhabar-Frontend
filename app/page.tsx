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
  
  // 📚 Internal Reader State Framework (Bypasses external redirection)
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const categories = ["All", "Politics", "Business", "Technology", "AI", "Finance", "Sports", "Entertainment"];
  const API_URL = "https://tezkhabar.onrender.com";

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
    if (selectedArticle) {
      document.title = `${cleanText(selectedArticle.title, 50)} - तेज़ ख़बर Premium Reader`;
    } else {
      document.title = activeCategory === "All" 
        ? "TezKhabar Pro | Real-Time News Intelligence Engine" 
        : `${activeCategory} Feed - TezKhabar Pro`;
    }

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

    const interval = setInterval(fetchNews, 180000);
    return () => clearInterval(interval);
  }, [activeCategory, selectedArticle]);

  const cleanText = (text: string, limit: number = 110) => {
    if (!text) return "";
    const filtered = text.replace(/<\/?[^>]+(>|$)/g, "").replace(/\*\*|\[|\]/g, "").trim();
    return filtered.length > limit ? filtered.slice(0, limit) + "..." : filtered;
  };

  const getPrioritizedImage = (newsItem: any, index: number) => {
    if (newsItem.image_url && newsItem.image_url.length > 12 && !newsItem.image_url.includes("googleusercontent.com") && !newsItem.image_url.includes("logo")) {
      return newsItem.image_url.startsWith("http://") ? newsItem.image_url.replace("http://", "https://") : newsItem.image_url;
    }
    const cat = newsItem.category || "General";
    const bank = categoryStockImages[cat] || categoryStockImages["General"];
    return bank[index % bank.length];
  };

  const openInternalReader = (newsItem: any) => {
    setSelectedArticle(newsItem);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeInternalReader = () => {
    setSelectedArticle(null);
  };

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setBookmarked(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const triggerNativeShare = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: item.title, url: item.source_url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(item.source_url);
      alert("Source link copied to clipboard!");
    }
  };

  const heroNews = newsList[0];
  const trendingNews = newsList.slice(1, 5);
  const coreFeedStream = newsList.slice(5, visibleCount);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0F172A] text-slate-100" : "bg-slate-50 text-slate-900"} font-sans antialiased transition-colors duration-300 pb-16`}>
      
      {/* 🌐 PREMIUM GLASSMORPHISM NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-all border-b ${darkMode ? "bg-[#0F172A]/80 border-slate-800/80 shadow-lg" : "bg-white/85 border-slate-200/60 shadow-xs"} px-4 sm:px-8 py-3.5`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-orange-500 font-serif select-none cursor-pointer" onClick={closeInternalReader}>
              तेज़ ख़बर
            </h1>
            
            <div className="hidden lg:flex items-center gap-1">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); closeInternalReader(); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-150 ${
                    activeCategory === cat && !selectedArticle ? "bg-blue-600 text-white" : "text-slate-400 hover:text-blue-500"
                  }`}
                >
                  {cat === "All" ? "Top Stories" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-800/10 text-slate-400">{darkMode ? "☀️" : "🌙"}</button>
          </div>
        </div>
      </nav>

      {/* DYNAMIC VIEW SWITCHER */}
      <AnimatePresence mode="wait">
        {selectedArticle ? (
          
          /* 🛑 MODULE A: PREMIUM IMMERSIVE ARTICLE READER CANVAS */
          <motion.div
            key="reader"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 space-y-6"
          >
            {/* Back Nav Button */}
            <button 
              onClick={closeInternalReader} 
              className="flex items-center gap-2 text-xs font-mono font-black uppercase text-[#2563EB] bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-full transition-all tracking-wider"
            >
              ← Return To Feed Stream
            </button>

            {/* Meta Category Tracking */}
            <div className="flex items-center gap-3 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest pt-2">
              <span className="text-[#2563EB] font-black">{selectedArticle.category || "General"}</span>
              <span>•</span>
              <span>⏱️ 2 Min Read</span>
              <span>•</span>
              <span>{selectedArticle.created_at ? new Date(selectedArticle.created_at * 1000).toLocaleDateString() : "Live"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight text-slate-100">
              {selectedArticle.title.replace(/\*\*|\[|\]/g, "")}
            </h1>

            {/* Share & Bookmark Strip Actions Bar */}
            <div className="flex items-center gap-2 py-2 border-y border-slate-800/60">
              <button onClick={(e) => triggerNativeShare(e, selectedArticle)} className="text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-800">
                📤 Share Matrix Link
              </button>
              <span className="text-xs font-mono text-slate-500 ml-auto">Desk: Autonomous Core Agent</span>
            </div>

            {/* Big Hero Visual Aspect Board */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl">
              <img 
                src={getPrioritizedImage(selectedArticle, 9)} 
                alt="Reader Target View" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Immersive Body Context */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-justify tracking-wide whitespace-pre-line font-normal font-sans pt-4 px-1">
              {selectedArticle.content.replace(/\*\*|\[|\]/g, "")}
              {"\n\n"}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            {/* 🔗 READ ORIGINAL SOURCE REDIRECT CAPTURE FOOTER BAR */}
            <div className="mt-12 p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-black font-serif text-slate-200">Verify Verification Streams</h4>
                <p className="text-xs text-slate-500">This article is gathered autonomously via our real-time content scraper loops.</p>
              </div>
              <a 
                href={selectedArticle.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black font-sans text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 hover:scale-102"
              >
                Read Original Source →
              </a>
            </div>

          </motion.div>

        ) : (

          /* 🗂️ MODULE B: THE MASTER FEED GRID HOME (Default View) */
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 📱 MOBILE HORIZONTAL SCROLL PILLS (Bypasses wrapping issues) */}
            <div className="lg:hidden overflow-x-auto scrollbar-none py-2.5 px-4 border-b border-slate-900 bg-slate-950/40">
              <div className="flex flex-row space-x-1.5 whitespace-nowrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                      activeCategory === cat ? "bg-[#2563EB] text-white" : "bg-slate-900 text-slate-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 📰 MAIN GRID CONTAINER ENVIRONMENT */}
            <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 h-96 bg-slate-800/20 rounded-3xl animate-pulse" />
                  <div className="lg:col-span-1 h-96 bg-slate-800/20 rounded-3xl animate-pulse" />
                </div>
              ) : newsList.length === 0 ? (
                <div className="text-center py-24 rounded-3xl bg-slate-900/10 text-slate-400 font-mono text-xs">
                  📭 Structural Feed Stack Idle.
                </div>
              ) : (
                <div className="space-y-12">

                  {/* HERO ELEMENT BOX */}
                  {heroNews && activeCategory === "All" && (
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      <motion.article 
                        whileHover={{ y: -4 }}
                        onClick={() => openInternalReader(heroNews)}
                        className="lg:col-span-2 rounded-[24px] overflow-hidden shadow-xl cursor-pointer flex flex-col bg-slate-900/30 border border-transparent hover:border-slate-800/80 transition-all duration-300"
                      >
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                          <img src={getPrioritizedImage(heroNews, 0)} alt="Hero" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                          <span className="absolute top-4 left-4 bg-[#2563EB] text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg">
                            {heroNews.category || "TOP STORY"}
                          </span>
                          <div className="absolute bottom-6 left-6 right-6">
                            <h2 className="text-xl sm:text-3xl font-black font-serif tracking-tight text-white leading-tight">
                              {cleanText(heroNews.title, 95)}
                            </h2>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-sm text-slate-400 leading-relaxed mb-4">{cleanText(heroNews.content, 160)}</p>
                          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                            👁️ Click to Open Internal Reader
                          </div>
                        </div>
                      </motion.article>

                      {/* TRENDING SIDE PANEL */}
                      <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-xs font-black tracking-widest uppercase text-orange-500 px-1">📈 Trending Matrix</h3>
                        <div className="space-y-3.5 max-h-[500px] overflow-y-auto scrollbar-none pr-1">
                          {trendingNews.map((news, i) => (
                            <div 
                              onClick={() => openInternalReader(news)}
                              key={i} 
                              className="p-4 rounded-[24px] bg-slate-900/20 hover:bg-slate-900/40 border border-transparent hover:border-slate-800 cursor-pointer flex gap-4 items-center transition-all shadow-xs"
                            >
                              <div className="w-16 h-16 rounded-[16px] bg-slate-950 overflow-hidden shrink-0">
                                <img src={getPrioritizedImage(news, i + 1)} alt="trend" className="w-full h-full object-cover" />
                              </div>
                              <h4 className="text-xs font-extrabold leading-snug line-clamp-2 text-slate-200">{cleanText(news.title, 70)}</h4>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* FEEDS GRID */}
                  <section className="space-y-6">
                    <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 px-1">📰 LATEST BROADCAST</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {(activeCategory === "All" ? coreFeedStream : newsList).map((news, index) => (
                        <motion.article
                          whileHover={{ y: -5 }}
                          onClick={() => openInternalReader(news)}
                          key={index}
                          className="rounded-[24px] overflow-hidden shadow-lg bg-slate-900/20 hover:bg-slate-900/40 border border-transparent hover:border-slate-800 cursor-pointer flex flex-col justify-between transition-all duration-200"
                        >
                          <div>
                            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                              <img src={getPrioritizedImage(news, index + 6)} alt="stream" className="w-full h-full object-cover" loading="lazy" />
                              <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-md">
                                {news.category || "General"}
                              </span>
                              <div className="absolute top-3 right-3 flex gap-1">
                                <button onClick={(e) => toggleBookmark(e, index)} className="p-2 bg-slate-900/60 backdrop-blur-md rounded-full text-[10px]">
                                  {bookmarked.includes(index) ? "❤️" : "🤍"}
                                </button>
                              </div>
                            </div>
                            <div className="p-6 space-y-2">
                              <h4 className="text-base font-extrabold font-serif leading-snug text-slate-100 line-clamp-2">{cleanText(news.title, 75)}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{cleanText(news.content, 110)}</p>
                            </div>
                          </div>
                          <div className="px-6 py-4 border-t border-slate-800/20 bg-slate-950/10 text-[10px] font-mono text-slate-500 flex justify-between">
                            <span>🕒 Stream Active</span>
                            <span className="text-[#2563EB] font-black">Open View →</span>
                          </div>
                        </motion.article>
                      ))}
                    </div>

                    {newsList.length > visibleCount && (
                      <div className="text-center pt-8">
                        <button onClick={() => setVisibleCount(prev => prev + 6)} className="px-6 py-2.5 bg-slate-800/30 border border-slate-800/40 rounded-full text-xs font-black font-mono uppercase tracking-widest hover:bg-[#2563EB] transition-all">
                          ⚡ Load More Stories
                        </button>
                      </div>
                    )}
                  </section>

                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏁 FOOTER */}
      <footer className="border-t font-mono text-xs text-slate-500 mt-24 pt-12 px-6 sm:px-12 bg-slate-950 border-slate-900 text-center sm:text-left">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 pb-8">
          <div>
            <h4 className="font-black font-serif tracking-tight text-slate-300 text-lg">TEZKHABAR AI</h4>
            <p className="text-[10px]">Real-Time Autonomous Content Reader Matrix Platform.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
