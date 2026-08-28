"use client";

import { useEffect, useState } from "react";
import { NewsArticle, fetchRelatedNews } from "@/lib/api";
import NewsCard from "./NewsCard";

interface RelatedProps {
  category: string;
  currentSlug: string;
}

export default function RelatedStories({ category, currentSlug }: RelatedProps) {
  const [stories, setStories] = useState<NewsArticle[]>([]);

  useEffect(() => {
    async function load() {
      const list = await fetchRelatedNews(category, currentSlug, 3);
      setStories(list);
    }
    load();
  }, [category, currentSlug]);

  if (stories.length === 0) return null;

  return (
    <section className="mt-14 pt-8 border-t-2 border-brand-navy">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl font-bold text-brand-navy uppercase tracking-wide">
          Related Stories in {category}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((art) => (
          <NewsCard key={art.slug} article={art} />
        ))}
      </div>
    </section>
  );
}
