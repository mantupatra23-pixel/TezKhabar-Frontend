"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsArticle, formatNewsDate } from "@/lib/api";
import CategoryFallback from "./CategoryFallback";

export default function NewsCard({ article }: { article: NewsArticle }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = article.image_url || article.image;
  const showImage = Boolean(imageUrl && !imgError);

  return (
    <article className="flex flex-col bg-white border border-brand-sage rounded overflow-hidden shadow-sm hover:shadow-md transition-all">
      <Link href={`/news/${article.slug}`} className="block relative aspect-[16/9] w-full bg-brand-sage/40">
        {showImage ? (
          <Image
            src={imageUrl!}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            onError={() => setImgError(true)}
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
            {article.badge && (
              <span className="bg-brand-peach text-brand-navy px-1.5 py-0.5 rounded text-[9px] font-bold">
                {article.badge}
              </span>
            )}
          </div>

          <Link href={`/news/${article.slug}`}>
            <h3 className="font-serif text-lg font-bold text-brand-navy leading-snug line-clamp-2 hover:text-brand-blue">
              {article.title}
            </h3>
          </Link>

          {article.summary && (
            <p className="text-xs text-brand-navy/75 mt-2 line-clamp-2 leading-relaxed font-sans">
              {article.summary}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-brand-blue font-medium mt-4 pt-3 border-t border-brand-sage/40">
          <span className="font-semibold text-brand-navy/80 truncate max-w-[140px]">
            {article.source_name}
          </span>
          <time dateTime={article.published_at}>
            {formatNewsDate(article.published_at)}
          </time>
        </div>
      </div>
    </article>
  );
}
