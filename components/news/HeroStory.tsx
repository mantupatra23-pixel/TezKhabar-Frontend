import Link from "next/link";
import Image from "next/image";
import { NewsArticle, stripHtml } from "@/lib/api";
import CategoryFallback from "./CategoryFallback";

export default function HeroStory({ article }: { article: NewsArticle }) {
  const displaySummary = stripHtml(article.dek || article.summary || "");

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-brand-sage rounded p-4 sm:p-6 shadow-sm mb-8">
      <div className="lg:col-span-7 relative aspect-[16/10] w-full rounded overflow-hidden bg-brand-sage/30">
        {article.image_url ? (
          <Image
            src={article.image_url}
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

      <div className="lg:col-span-5 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-brand-blue mb-2">
            <span className="bg-brand-peach/40 text-brand-navy px-2 py-0.5 rounded text-[10px]">
              {article.category}
            </span>
            <span className="text-brand-sage font-bold">•</span>
            <span>Lead Story</span>
          </div>

          <Link href={`/news/${article.slug}`}>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy leading-tight hover:text-brand-blue">
              {article.title}
            </h2>
          </Link>

          {displaySummary && (
            <p className="text-sm text-brand-navy/80 mt-3 leading-relaxed line-clamp-3">
              {displaySummary}
            </p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-brand-sage/50 flex items-center justify-between">
          <span className="text-xs font-bold text-brand-navy">{article.source_name}</span>
          <Link
            href={`/news/${article.slug}`}
            className="bg-brand-blue text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-brand-navy transition-colors"
          >
            Read Story →
          </Link>
        </div>
      </div>
    </article>
  );
}
