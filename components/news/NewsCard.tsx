import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/lib/api/types";
import CategoryFallback from "./CategoryFallback";

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex flex-col bg-white border border-brand-sage rounded overflow-hidden shadow-sm hover:shadow-md transition-all">
      <Link href={`/news/${article.slug}`} className="block relative aspect-[16/9] w-full bg-brand-sage/40">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <CategoryFallback category={article.category} className="h-full" />
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold tracking-wider uppercase text-brand-blue mb-2">
            <span className="bg-brand-sage/60 text-brand-navy px-1.5 py-0.5 rounded text-[10px]">
              {article.category}
            </span>
          </div>

          <Link href={`/news/${article.slug}`}>
            <h3 className="font-serif text-lg font-bold text-brand-navy leading-snug line-clamp-2 hover:text-brand-blue">
              {article.title}
            </h3>
          </Link>

          {article.description && (
            <p className="text-xs text-brand-navy/75 mt-2 line-clamp-2 leading-relaxed font-sans">
              {article.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-brand-blue font-medium mt-4 pt-3 border-t border-brand-sage/40">
          <span className="font-semibold text-brand-navy/80">{article.source}</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
    </article>
  );
}
