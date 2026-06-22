""use client"";
import { useEffect, useState } from ""react"";
import { motion, AnimatePresence } from ""framer-motion"";

export default function Home() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(""All"");
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("""");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const categories = [""All"", ""Politics"", ""Business"", ""Technology"", ""AI"", ""Finance"", ""Sports"", ""Entertainment""];
  const API_URL = ""https://tezkhabar.onrender.com"";

  useEffect(() => {
    // SEO Document Title Dynamic Sync
    document.title = activeCategory === ""All"" 
      ? ""TezKhabar AI | Elite Global News Hub"" 
      : `${activeCategory} Matrix - TezKhabar`;

    async function fetchNews() {
      try {
        setLoading(true);
        let url = `${API_URL}/api/news`;
        if (activeCategory !== ""All"") {
          url += `?category=${activeCategory}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setNewsList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(""Portal Core Pipeline Exception:"", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();

    // Live Web Sync: Auto refresh every 3 minutes
    const interval = setInterval(fetchNews, 180000);
    return () => clearInterval(interval);
  }, [activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener(""scroll"", handleScroll);
    return () => window.removeEventListener(""scroll"", handleScroll);
  }, []);

  const cleanText = (text: string, maxLength: number = 140) => {
    if (!text) return """";
    const cleaned = text.replace(/<\/?[^>]+(>|$)/g, """").replace(/\*\*|\[|\]/g, """").trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.slice(0, maxLength) + ""..."";
  };

  const getSecureImageUrl = (url: string, id: number) => {
    if (!url || url.includes(""googleusercontent.com"") || url.includes(""logo"") || url.length < 10) {
      const curatedStock = [
        ""https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000"",
        ""https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000"",
        ""https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1000"",
        ""https://images.unsplash.com/photo-1495020689067-958852a6565d?q=80&w=1000""
      ];
      return curatedStock[id % curatedStock.length];
    }
    return url.startsWith(""http://"") ? url.replace(""http://"", ""https://"") : url;
  };

  // Content Filtering and Segmentation
  const heroArticle = newsList[0];
  const trendingGrid = newsList.slice(1, 4);
  const coreFeed = newsList.slice(4);
  const quickBriefs = newsList.slice(0, 6);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0F172A] text-slate-100" : "bg-slate-50 text-slate-900"} font-sans antialiased transition-colors duration-300`}>
      
      {/* 📈 STICKY READING PROGRESS BAR */}
      <div className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-600 via-orange-500 to-amber-400 z-[100] transition-all duration-75" style={{ width: `${scrollProgress}%` }} />

      {/* 🌐 STICKY GLASSMORPHISM NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${darkMode ? "bg-[#0F172A]/80 border-slate-800" : "bg-white/80 border-slate-200"} px-4 sm:px-8 py-4 transition-all duration-200 shadow-xs`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500 font-serif select-none">
              TEZKHABAR<span className="text-xs font-mono font-bold tracking-widest text-slate-400 ml-1">AI</span>
            </h1>
            <div className="hidden lg:flex items-center gap-1">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide uppercase transition-all ${
                    activeCategory === cat 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                      : "text-slate-400 hover:text-blue-500"
                  }`}
                >
                  {cat === ""All"" ? ""Home"" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Search news intelligence..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg border focus:outline-hidden ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-100 border-slate-200 text-black"}`}
                  />
                )}
              </AnimatePresence>
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg hover:bg-slate-800/20 text-slate-400 hover:text-blue-500">
                🔍
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-slate-800/20 text-slate-400">
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Mobile Burger Menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-800/20 text-slate-400">
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE NAVIGATION SLIDE DOWN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`lg:hidden border-b overflow-hidden ${darkMode ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200"}`}
          >
            <div className="px-4 py-4 flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setMobileMenuOpen(false); }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase ${activeCategory === cat ? "bg-blue-600 text-white" : "bg-slate-800/20 text-slate-400"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔴 BREAKING NEWS TICKER MODULE */}
      {newsList.length > 0 && (
        <div className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-900" : "bg-blue-50 border-slate-200"} py-2.5 px-4 overflow-hidden`}>
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <span className="bg-red-600 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded shadow-xs shrink-0 animate-pulse">
              Breaking
            </span>
            <div className="w-full overflow-hidden relative h-4">
              <div className="absolute whitespace-nowrap text-xs font-bold tracking-wide flex gap-12 animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
                {newsList.slice(0, 3).map((n, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="text-blue-500">✦</span> {cleanText(n.title, 90)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📰 MAIN GRID ENVIRONMENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-xs font-mono tracking-widest text-slate-500 uppercase animate-pulse">Compiling Live Feed Stack...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-28 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 font-mono text-xs">
            📭 Structural Feed Empty. Scraper Array Down.
          </div>
        ) : (
          <div className="space-y-12">

            {/* ⚡ HOMEPAGE HEROS: COMBINED HIGH-END BROADCAST VIEW */}
            {heroArticle && activeCategory === ""All"" && (
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Large Featured Hero Box */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  className={`lg:col-span-2 group rounded-3xl overflow-hidden border transition-all duration-300 ${darkMode ? "bg-slate-900/40 border-slate-800/80 hover:border-blue-500/30 shadow-xl" : "bg-white border-slate-200/80 shadow-md"}`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img 
                      src={getSecureImageUrl(heroArticle.image_url, 0)} 
                      alt="Hero" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-101 transition-transform duration-500" 
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg">
                        {cleanText(heroArticle.category || ""FEATURED"", 15)}
                      </span>
                      <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white font-serif mt-3 leading-tight group-hover:text-blue-400 transition-colors">
                        {cleanText(heroArticle.title, 100)}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      {cleanText(heroArticle.content, 180)}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-800/40 pt-4 text-[11px] font-mono text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px] font-bold">AZ</span>
                        <span className="font-bold text-slate-400">Automated Desk</span>
                      </div>
                      <span>⏱️ 2 min read</span>
                    </div>
                  </div>
                </motion.div>

                {/* PREMIUM HORIZONTAL QUICK BRIEFING SIDEBAR */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-950/40 border-slate-900" : "bg-white border-slate-200"} flex items-center justify-between`}>
                    <h3 className="text-xs font-black tracking-widest uppercase text-orange-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block animate-ping" />
                      InShorts Stream
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Live Matrix</span>
                  </div>
                  <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-none">
                    {quickBriefs.map((news, idx) => (
                      <motion.a
                        href={news.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4 }}
                        key={idx}
                        className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                          darkMode ? "bg-slate-900/30 border-slate-800/60 hover:bg-slate-900/60 hover:border-orange-500/20" : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-[9px] font-mono font-bold uppercase text-blue-500 tracking-wider">
                          {news.category || ""STREAM""}
                        </span>
                        <h4 className="text-xs font-bold leading-snug text-slate-300 group-hover:text-white">
                          {cleanText(news.title, 80)}
                        </h4>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 🎴 TRENDING GRID CARDS SYSTEM */}
            {trendingGrid.length > 0 && activeCategory === ""All"" && (
              <section className="space-y-6">
                <h3 className="text-sm font-black tracking-widest uppercase text-blue-500 flex items-center gap-2">
                  <span>⚡</span> Trending Intelligence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trendingGrid.map((news, index) => (
                    <motion.article
                      whileHover={{ y: -4 }}
                      key={index}
                      className={`rounded-2xl overflow-hidden border flex flex-col justify-between transition-all duration-200 ${
                        darkMode ? "bg-slate-900/40 border-slate-800/60 hover:border-slate-700" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                        <img src={getSecureImageUrl(news.image_url, index + 1)} alt="news" className="w-full h-full object-cover" loading="lazy" />
                        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded">
                          {news.category || ""GRID""}
                        </span>
                      </div>
                      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                        <h4 className="text-base font-bold font-serif leading-snug line-clamp-2">
                          {cleanText(news.title, 75)}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                          <span>🕒 {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""Recent""}</span>
                          <a href={news.source_url} target="_blank" className="font-bold text-blue-500 hover:underline">Source →</a>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            {/* ⚡ LATEST STREAM MATRIX */}
            <section className="space-y-6">
              <h3 className="text-sm font-black tracking-widest uppercase text-slate-400 flex items-center gap-2">
                <span>🗂️</span> {activeCategory === ""All"" ? ""Latest Feed Stream"" : `${activeCategory} Feed Grid`}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeCategory === ""All"" ? coreFeed : newsList).map((news, index) => (
                  <motion.article
                    whileHover={{ y: -4 }}
                    key={index}
                    className={`rounded-2xl border overflow-hidden flex flex-col justify-between shadow-xs transition-all ${
                      darkMode ? "bg-slate-900/20 border-slate-800/60 hover:border-slate-800 hover:bg-slate-900/40" : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="p-6 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-[9px] font-mono tracking-widest uppercase font-bold text-orange-500">
                        <span>{news.category || ""GENERAL""}</span>
                        <span className="text-slate-600">{news.badge ? cleanText(news.badge, 10) : ""LIVE""}</span>
                      </div>
                      <h4 className="text-base font-black font-serif leading-snug text-slate-100 group-hover:text-blue-500 transition-colors">
                        {cleanText(news.title, 80)}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {cleanText(news.content, 130)}
                      </p>
                    </div>
                    <div className="px-6 py-4 border-t border-slate-800/40 bg-slate-950/20 flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>🕒 {news.created_at ? new Date(news.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""Recent""}</span>
                      <a
                        href={news.source_url || ""#""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wider text-[9px]"
                      >
                        Explore Source →
                      </a>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            {/* 📩 PREMIUM NEWSLETTER SECTION */}
            <section className={`rounded-3xl border p-8 sm:p-12 relative overflow-hidden ${darkMode ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800" : "bg-blue-50 border-blue-100"}`}>
              <div className="absolute top-0 right-0 w-44 h-44 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="max-w-xl space-y-4 relative z-10">
                <span className="text-xs font-black tracking-widest uppercase text-blue-500">Stay Ahead of the Curve</span>
                <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">Subscribe to our Real-Time Intelligence Briefings</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">Get filtered high-signal tech, macro economics, and AI updates pushed straight to your terminal inbox every single day.</p>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <input type="email" placeholder="Enter secure corporate email..." className={`text-xs px-4 py-3 rounded-xl border font-mono focus:outline-hidden ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-blue-500" : "bg-white border-slate-200 text-black focus:border-blue-600"}`} />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20 whitespace-nowrap">
                    Join Intelligence Hub
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* 🏁 PREMIUM GLOBAL FOOTER */}
      <footer className={`border-t py-12 px-6 sm:px-12 font-mono text-xs text-slate-500 transition-colors ${darkMode ? "bg-slate-950 border-slate-900" : "bg-white border-slate-200"}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-black tracking-tight text-slate-400 font-serif text-lg">TEZKHABAR AI</h4>
            <p className="text-[10px]">Real-Time Autonomous Content Scraper & News Matrix Platform.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase font-bold tracking-wider">
            <a href="#" className="hover:text-blue-500 transition-colors">Terminals</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Infrastructure</a>
            <a href="#" className="hover:text-blue-500 transition-colors">API Channels</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center border-t border-slate-800/40 mt-8 pt-6 text-[9px] tracking-widest text-slate-600">
          © 2026 TEZKHABAR CONVERGENCE LABS. PIPELINES ENCRYPTED SECURELY. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}
