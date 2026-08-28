import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getLatestNews } from "@/lib/api";
import CategoryFallback from "@/components/news/CategoryFallback";
import AskTezKhabar from "@/components/ai/AskTezKhabar";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const articles = await getLatestNews(10);
    if (articles.length > 0) {
      return articles.map((art) => ({ slug: art.slug }));
    }
  } catch {}
  return [{ slug: "latest-news" }];
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return (
      <div className="max-w-article mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-bold text-brand-navy mb-3">Loading Editorial Report</h1>
        <p className="text-xs text-brand-blue mb-6">Fetching live dispatch from the news wire...</p>
        <Link href="/" className="bg-brand-navy text-brand-cream px-4 py-2 rounded text-xs font-bold uppercase tracking-wider">
          Return to Top Stories
        </Link>
      </div>
    );
  }

  const imageUrl = article.image_url || article.image;
  const summaryText = article.description || article.summary || article.dek;
  const pubDate = article.published_at || article.publishedAt || new Date().toISOString();
  const sourceName = article.source_name || article.source || "TezKhabar Wire";

  return (
    <article className="max-w-article mx-auto px-4 sm:px-6 py-8">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-wider text-brand-blue mb-4">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><span>/</span></li>
          <li>
            <Link href={`/category/${article.category}`} className="hover:underline capitalize">
              {article.category}
            </Link>
          </li>
        </ol>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-[1.15]">
        {article.title}
      </h1>

      {summaryText && (
        <p className="text-base sm:text-lg text-brand-navy/80 font-serif italic mt-4 leading-relaxed">
          {summaryText}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-brand-blue font-medium py-4 my-6 border-y border-brand-sage/60">
        <div>
          <span>Reported by </span>
          <span className="font-bold text-brand-navy">{article.author || sourceName}</span>
        </div>
        <time dateTime={pubDate}>
          {new Date(pubDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
      </div>

      <div className="relative aspect-[16/9] w-full rounded overflow-hidden my-6 bg-brand-sage/20">
        {imageUrl ? (
          <Image
            src={imageUrl}
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

      {article.key_facts && article.key_facts.length > 0 && (
        <div className="bg-brand-creamLight border-l-4 border-brand-peach p-5 rounded-r my-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-2">
            Quick Factual Summary
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-brand-navy/90 leading-relaxed">
            {article.key_facts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="prose font-sans text-[17px] sm:text-[18px] text-brand-navy leading-[1.8] space-y-6">
        {article.content ? (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <p>{summaryText}</p>
        )}
      </div>

      {article.sources && article.sources.length > 0 && (
        <section className="mt-12 pt-6 border-t border-brand-sage/60">
          <h3 className="text-xs uppercase tracking-widest font-bold text-brand-blue mb-3">
            Source Cross-Reference ({article.sources.length})
          </h3>
          <ul className="space-y-2">
            {article.sources.map((s, i) => (
              <li key={i} className="text-xs flex items-center justify-between bg-brand-creamLight p-2.5 rounded border border-brand-sage/40">
                <span className="font-semibold text-brand-navy">{s.name}</span>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                    View Original →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <AskTezKhabar articleSlug={article.slug} articleTitle={article.title} />
    </article>
  );
}
