import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleBySlug, getLatestNews } from "@/lib/api";
import CategoryFallback from "@/components/news/CategoryFallback";
import AskTezKhabar from "@/components/ai/AskTezKhabar";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const articles = await getLatestNews(50);
    return articles.map((art) => ({
      slug: art.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found | TezKhabar" };

  return {
    title: `${article.title} | TezKhabar`,
    description: article.description || article.title,
    alternates: {
      canonical: `/news/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description || article.title,
      url: `/news/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      images: article.image ? [{ url: article.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || article.title,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.image ? [article.image] : [],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author || article.source || "TezKhabar Editorial",
    },
    publisher: {
      "@type": "Organization",
      name: "TezKhabar",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tezkhabar.com"}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://tezkhabar.com"}/news/${article.slug}`,
    },
  };

  return (
    <article className="max-w-article mx-auto px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-wider text-brand-blue mb-4">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <span>/</span>
          </li>
          <li>
            <Link href={`/category/${article.category}`} className="hover:underline capitalize">
              {article.category}
            </Link>
          </li>
        </ol>
      </nav>

      {/* Main Headline */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-[1.15]">
        {article.title}
      </h1>

      {article.description && (
        <p className="text-base sm:text-lg text-brand-navy/80 font-serif italic mt-4 leading-relaxed">
          {article.description}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-brand-blue font-medium py-4 my-6 border-y border-brand-sage/60">
        <div>
          <span>Reported by </span>
          <span className="font-bold text-brand-navy">{article.author || article.source}</span>
        </div>
        <time dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
      </div>

      {/* Featured Media */}
      <div className="relative aspect-[16/9] w-full rounded overflow-hidden my-6 bg-brand-sage/20">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 740px"
            className="object-cover"
            priority
          />
        ) : (
          <CategoryFallback category={article.category} className="h-full" />
        )}
      </div>

      {/* Quick Summary */}
      {article.keyFacts && article.keyFacts.length > 0 && (
        <div className="bg-brand-creamLight border-l-4 border-brand-peach p-5 rounded-r my-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-2">
            Quick Factual Summary
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-brand-navy/90 leading-relaxed">
            {article.keyFacts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Full Body */}
      <div className="prose font-sans text-[17px] sm:text-[18px] text-brand-navy leading-[1.8] space-y-6">
        {article.content ? (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <p>{article.description}</p>
        )}
      </div>

      {/* Multi-Source Attribution */}
      {article.sources && article.sources.length > 0 && (
        <section className="mt-12 pt-6 border-t border-brand-sage/60">
          <h3 className="text-xs uppercase tracking-widest font-bold text-brand-blue mb-3">
            Source Cross-Reference ({article.sources.length})
          </h3>
          <ul className="space-y-2">
            {article.sources.map((s, i) => (
              <li
                key={i}
                className="text-xs flex items-center justify-between bg-brand-creamLight p-2.5 rounded border border-brand-sage/40"
              >
                <span className="font-semibold text-brand-navy">{s.name}</span>
                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue hover:underline"
                  >
                    View Original →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* AI Reader Explainer */}
      <AskTezKhabar articleSlug={article.slug} articleTitle={article.title} />
    </article>
  );
}
