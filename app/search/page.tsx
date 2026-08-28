"use client";

import { useState } from "react";
import NewsCard from "@/components/news/NewsCard";
import { searchNews, NewsArticle } from "@/lib/api";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    const res = await searchNews(q);
    setResults(res);
    setSearched(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold text-brand-navy mb-6">Search News Wire</h1>
      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mb-8">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search topics, politics, technology..."
          className="flex-1 bg-white border border-brand-sage p-2.5 rounded text-sm text-brand-navy focus:outline-none"
        />
        <button type="submit" className="bg-brand-navy text-brand-cream px-5 py-2.5 rounded text-sm font-bold">
          Search
        </button>
      </form>

      {searched && results.length === 0 && (
        <p className="text-sm text-brand-blue">No stories found for "{q}".</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((art) => (
          <NewsCard key={art.slug} article={art} />
        ))}
      </div>
    </div>
  );
}
