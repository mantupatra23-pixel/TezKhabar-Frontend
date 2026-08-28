import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryNews } from "@/lib/api";
import NewsCard from "@/components/news/NewsCard";

interface CategoryPageProps {
  params: { category: string };
}

export function generateStaticParams() {
  return [
    { category: "india" },
    { category: "politics" },
    { category: "business" },
    { category: "technology" },
    { category: "ai" },
    { category: "finance" },
    { category: "sports" },
    { category: "entertainment" },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const cat = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  return {
    title: `${cat} News - Analysis & Live Updates`,
    description: `Comprehensive editorial coverage and latest reporting on ${cat} from TezKhabar.`,
    alternates: {
      canonical: `/category/${params.category}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const articles = await getCategoryNews(params.category);
  const catTitle = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="border-b border-brand-navy pb-4 mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy uppercase tracking-wide">
          {catTitle} News
        </h1>
        <p className="text-xs text-brand-blue font-medium mt-1">
          Latest developments, analysis, and breaking stories in {catTitle}.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-brand-blue">No recent stories published in this section.</p>
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
