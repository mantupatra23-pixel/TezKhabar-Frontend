import type { Metadata } from "next";
import { getCategoryNews } from "@/lib/api";
import NewsCard from "@/components/news/NewsCard";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface CategoryPageProps {
  params: { category: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const cat = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  return {
    title: `${cat} News - Live Updates | TezKhabar`,
    description: `Latest reporting and developments in ${cat}.`,
    alternates: {
      canonical: `/category/${params.category}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const articles = await getCategoryNews(params.category, 20);
  const catTitle = params.category.charAt(0).toUpperCase() + params.category.slice(1);

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

      {articles.length === 0 ? (
        <div className="bg-white border border-brand-sage rounded p-12 text-center my-8">
          <p className="font-serif text-lg font-bold text-brand-navy mb-1">No recent stories published in this section.</p>
          <p className="text-xs text-brand-blue">Check back soon as new reports are ingested continuously.</p>
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
