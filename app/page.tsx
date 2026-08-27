import { getLatestNews } from "@/lib/api";
import HeroStory from "@/components/news/HeroStory";
import NewsCard from "@/components/news/NewsCard";
import Link from "next/link";

export default async function HomePage() {
  const articles = await getLatestNews(15);

  if (articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-bold text-brand-navy mb-2">Latest News Wire</h1>
        <p className="text-sm text-brand-blue">Updating news feed. Please check back in a few moments.</p>
      </div>
    );
  }

  const leadArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="sr-only">TezKhabar - Leading Indian News Wire</h1>
      
      {/* Editorial Lead Hero */}
      <HeroStory article={leadArticle} />

      <div className="flex items-center justify-between border-b border-brand-navy pb-2 mb-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy uppercase tracking-wide">
          Latest Reports
        </h2>
        <span className="text-xs text-brand-blue font-medium">Real-time Coverage</span>
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gridArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
