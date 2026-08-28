"use client";

import { useEffect, useState } from "react";
import { NewsArticle } from "@/lib/api/types";
import { getLatestNews } from "@/lib/api";
import HeroStory from "./HeroStory";
import NewsCard from "./NewsCard";

export default function HomeFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getLatestNews(15);
        setArticles(data);
      } catch (err) {
        console.error("HomeFeed error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
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

  if (articles.length === 0) {
    return (
      <div className="bg-white border border-brand-sage rounded p-12 text-center my-6">
        <h2 className="font-serif text-2xl font-bold text-brand-navy mb-2">TezKhabar News Wire</h2>
        <p className="text-xs text-brand-blue">Connecting to news feed. Stories will appear here shortly.</p>
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
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}
