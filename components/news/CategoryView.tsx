"use client";

import { useEffect, useState } from "react";
import { NewsArticle, fetchCategoryNews } from "@/lib/api";
import NewsCard from "@/components/news/NewsCard";

export default function CategoryView({ category }: { category: string }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const catTitle = category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchCategoryNews(category, 20);
      setArticles(data);
      setLoading(false);
    }
    load();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="border-b border-brand-navy pb-4 mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy uppercase tracking-wide">
          {catTitle} News
        </h1>
        <p className="text-xs text-brand-blue font-medium mt-1">
          Latest developments and breaking reports in {catTitle}.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="bg-white/70 h-64 rounded border border-brand-sage"></div>
          <div className="bg-white/70 h-64 rounded border border-brand-sage"></div>
          <div className="bg-white/70 h-64 rounded border border-brand-sage"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-brand-sage rounded p-12 text-center my-8">
          <p className="font-serif text-lg font-bold text-brand-navy mb-1">
            No recent stories published in this section.
          </p>
          <p className="text-xs text-brand-blue">
            New reports are ingested continuously from the wire.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
