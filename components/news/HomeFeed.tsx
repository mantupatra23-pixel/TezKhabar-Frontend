"use client";

import { useEffect, useState } from "react";
import { NewsArticle, getLatestNews } from "@/lib/api";
import HeroStory from "./HeroStory";
import NewsCard from "./NewsCard";

export default function HomeFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLatestNews(15);
      if (Array.isArray(data) && data.length > 0) {
        setArticles(data);
      } else {
        setArticles([]);
      }
    } catch (err: any) {
      console.error("[HomeFeed Error]:", err);
      setError("Unable to connect to live news wire.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="bg-white/70 h-80 rounded border border-brand-sage"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/70 h-64 rounded border border-brand-sage"></div>
          <div className="bg-white/70 h-64 rounded border border-brand-sage"></div>
          <div className="bg-white/70 h-64 rounded border border-brand-sage"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-brand-sage rounded p-8 text-center my-6 max-w-md mx-auto">
        <p className="font-serif text-lg font-bold text-brand-navy mb-2">News feed temporarily unavailable</p>
        <p className="text-xs text-brand-blue mb-4 leading-relaxed">{error}</p>
        <button
          onClick={loadFeed}
          className="bg-brand-navy text-brand-cream px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-opacity-90"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white border border-brand-sage rounded p-12 text-center my-6">
        <h2 className="font-serif text-2xl font-bold text-brand-navy mb-2">TezKhabar News Wire</h2>
        <p className="text-xs text-brand-blue mb-4">No stories currently in feed.</p>
        <button
          onClick={loadFeed}
          className="bg-brand-navy text-brand-cream px-4 py-2 rounded text-xs font-bold uppercase tracking-wider"
        >
          Check for Updates
        </button>
      </div>
    );
  }

  const lead = articles[0];
  const remaining = articles.slice(1);

  return (
    <>
      <HeroStory article={lead} />
      <div className="flex items-center justify-between border-b-2 border-brand-navy pb-2 mb-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy uppercase tracking-wide">
          Latest Reports
        </h2>
        <span className="text-xs text-brand-blue font-bold uppercase">Real-Time Coverage</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {remaining.map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>
    </>
  );
}
