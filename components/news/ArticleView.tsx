"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsArticle, fetchNewsBySlug, formatNewsDate } from "@/lib/api";
import CategoryFallback from "@/components/news/CategoryFallback";
import AskTezKhabar from "@/components/ai/AskTezKhabar";
import RelatedStories from "@/components/news/RelatedStories";

interface ArticleViewProps {
  slug: string;
  initialArticle?: NewsArticle | null;
}

export default function ArticleView({ slug, initialArticle = null }: ArticleViewProps) {
  const [article, setArticle] = useState<NewsArticle | null>(initialArticle);
  const [loading, setLoading] = useState(!initialArticle);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      if (!initialArticle) {
        setLoading(true);
        const data = await fetchNewsBySlug(slug);
        setArticle(data);
        setLoading(false);
      }
    }
    load();
  }, [slug, initialArticle]);

  if (loading) {
    return (
      <div className="max-w-article mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-6">
        <div className="h-4 bg-brand-sage/60 rounded w-1/4"></div>
        <div className="h-10 bg-brand-sage/60 rounded w-full"></div>
        <div className="h-6 bg-brand-sage/40 rounded w-3/4"></div>
        <div className="h-72 bg-brand-sage/50 rounded w-full"></div>
        <div className="space-y-3">
          <div className="h-4 bg-brand-sage/40 rounded w-full"></div>
          <div className="h-4 bg-brand-sage/40 rounded w-full"></div>
          <div className="h-4 bg-brand-sage/40 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-brand-sage rounded-lg p-8 shadow-sm">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-peach bg-brand-navy px-2.5 py-1 rounded">
            TezKhabar Notice
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-navy mt-4 mb-2">
            Story Not Found
          </h1>
          <p className="text-sm text-brand-navy/80 mb-1">
            Ye story ab available nahi hai ya update ho chuki hai.
          </p>
          <p className="text-xs text-brand-blue mb-6">
            Please browse our latest reports on the homepage.
          </p>
          <Link
            href="/"
            className="inline-block bg-brand-navy text-brand-cream px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-colors"
          >
            ← Back to Top Stories
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = article.image_url || article.image;
  const showImage = Boolean(imageUrl && !imgError);

  return (
    <article className="max-w-article mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-wider text-brand-blue mb-4">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:underline">Home</Link>
          </li>
          <li><span>/</span></li>
          <li>
            <Link href={`/category/${article.category}`} className="hover:underline capitalize font-semibold text-brand-navy">
              {article.category}
            </Link>
          </li>
        </ol>
      </nav>

      {/* Headline */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-[1.15]">
        {article.title}
      </h1>

      {/* Dek / Summary */}
      {article.summary && (
        <p className="text-base sm:text-lg text-brand-navy/85 font-serif italic mt-4 leading-relaxed">
          {article.summary}
        </p>
      )}

      {/* Metadata Bar */}
      <div className="flex items-center justify-between text-xs text-brand-blue font-medium py-3.5 my-6 border-y border-brand-sage/60">
        <div>
          <span>Reported by </span>
          <span className="font-bold text-brand-navy">{article.source_name}</span>
        </div>
        <time dateTime={article.published_at}>
          {formatNewsDate(article.published_at)}
        </time>
      </div>

      {/* Hero Media */}
      <div className="relative aspect-[16/9] w-full rounded overflow-hidden my-6 bg-brand-sage/20 border border-brand-sage/40">
        {showImage ? (
          <Image
            src={imageUrl!}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 740px"
            className="object-cover"
            priority
            onError={() => setImgError(true)}
          />
        ) : (
          <CategoryFallback category={article.category} className="h-full" />
        )}
      </div>

      {/* Highlights */}
      {article.key_facts && article.key_facts.length > 0 && (
        <div className="bg-brand-creamLight border-l-4 border-brand-peach p-5 rounded-r my-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-2">
            Key Highlights
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-brand-navy/90 leading-relaxed font-sans">
            {article.key_facts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Body */}
      <div className="prose font-sans text-[17px] sm:text-[18px] text-brand-navy leading-[1.8] space-y-5">
        {article.content && article.content.startsWith("<") ? (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <p className="whitespace-pre-line">{article.content || article.summary}</p>
        )}
      </div>

      {/* Original Source Link */}
      <div className="mt-10 p-4 bg-brand-sage/20 rounded border border-brand-sage/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-xs">
          <span className="font-bold text-brand-navy">Original Source: </span>
          <span className="text-brand-blue">{article.source_name}</span>
        </div>
        {article.source_url && article.source_url !== "#" && (
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-blue text-white text-xs px-3.5 py-1.5 rounded font-bold hover:bg-brand-navy transition-colors inline-flex items-center gap-1 shrink-0"
          >
            Read Original Source ↗
          </a>
        )}
      </div>

      {/* Multi-Source Comparison */}
      {article.sources && article.sources.length > 1 && (
        <section className="mt-8 pt-4 border-t border-brand-sage/50">
          <h3 className="text-xs uppercase tracking-widest font-bold text-brand-blue mb-3">
            Coverage Cross-Reference ({article.sources.length} Sources)
          </h3>
          <ul className="space-y-2">
            {article.sources.map((s, i) => (
              <li key={i} className="text-xs flex items-center justify-between bg-white p-2.5 rounded border border-brand-sage/40">
                <span className="font-semibold text-brand-navy">{s.name}</span>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                    View Coverage →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* AI Reader Explainer */}
      <AskTezKhabar articleSlug={article.slug} articleTitle={article.title} />

      {/* Related Stories */}
      <RelatedStories category={article.category} currentSlug={article.slug} />

      {/* Back Link */}
      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-block bg-brand-navy text-brand-cream px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-colors"
        >
          ← Back to Top Stories
        </Link>
      </div>
    </article>
  );
}
