import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/types/news";
import CategoryFallback from "./CategoryFallback";

export default function HeroStory({ article }: { article: NewsArticle }) {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-brand-creamLight border border-brand-sage/80 rounded-md p-4 sm:p-6 mb-8">
      <div className="lg:col-span-7 relative aspect-[16/10] w-full rounded overflow-hidden">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority
          />
        ) : (
          <CategoryFallback category={article.category} className="h-full" />
        )}
      </div>

      <div className="lg:col-span-5 flex flex-col justify-between py-2">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-brand-blue mb-2">
            <span>{article.category}</span>
            <span className="text-brand-sage">•</span>
            <span>Lead Story</span>
          </div>

          <Link href={`/news/${article.slug}`}>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-navy leading-tight hover:underline">
              {article.title}
            </h2>
          </Link>

          {article.description && (
            <p className="text-sm text-brand-navy/90 mt-4 leading-relaxed line-clamp-3">
              {article.description}
            </p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-brand-sage/40 flex items-center justify-between text-xs text-brand-blue">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-brand-navy">{article.source}</span>
            {article.sources && article.sources.length > 1 && (
              <span className="bg-brand-sage/50 text-brand-navy text-[10px] px-1.5 py-0.5 rounded font-bold">
                {article.sources.length} sources
              </span>
            )}
          </div>
          <Link
            href={`/news/${article.slug}`}
            className="text-xs font-bold text-brand-navy hover:text-brand-blue inline-flex items-center"
          >
            Read story →
          </Link>
        </div>
      </div>
    </article>
  );
}
