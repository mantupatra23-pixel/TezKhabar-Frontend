import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/types/news";
import CategoryFallback from "./CategoryFallback";

interface NewsCardProps {
  article: NewsArticle;
  priority?: boolean;
}

export default function NewsCard({ article, priority = false }: NewsCardProps) {
  return (
    <article className="flex flex-col bg-brand-creamLight border border-brand-sage/60 rounded-md overflow-hidden hover:border-brand-navy/40 transition-colors">
      <Link href={`/news/${article.slug}`} className="block relative aspect-[16/9] w-full overflow-hidden bg-brand-sage/20">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            priority={priority}
          />
        ) : (
          <CategoryFallback category={article.category} className="h-full" />
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold tracking-wider uppercase text-brand-blue mb-1.5">
            <span>{article.category}</span>
            {article.isBreaking && (
              <span className="bg-brand-peach text-brand-navy px-1 rounded text-[9px]">Breaking</span>
            )}
          </div>

          <Link href={`/news/${article.slug}`}>
            <h3 className="font-serif text-lg font-bold text-brand-navy leading-snug line-clamp-2 hover:underline">
              {article.title}
            </h3>
          </Link>

          {article.description && (
            <p className="text-xs text-brand-navy/80 mt-2 line-clamp-2 leading-relaxed">
              {article.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-brand-blue font-medium mt-4 pt-3 border-t border-brand-sage/30">
          <span>{article.source}</span>
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
