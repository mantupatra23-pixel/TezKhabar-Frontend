import { getTrendingNews } from "@/lib/api";
import NewsCard from "@/components/news/NewsCard";

export default async function TrendingPage() {
  const trending = await getTrendingNews(12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <header className="border-b border-brand-navy pb-4 mb-8">
        <h1 className="font-serif text-3xl font-bold text-brand-navy">Trending Stories</h1>
        <p className="text-xs text-brand-blue mt-1">Most engaged and developing reports across India.</p>
      </header>
      {trending.length === 0 ? (
        <p className="text-sm text-brand-blue text-center py-12">No trending stories available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((art) => (
            <NewsCard key={art.slug} article={art} />
          ))}
        </div>
      )}
    </div>
  );
}
