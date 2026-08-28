import type { Metadata } from "next";
import { getArticleBySlug, getLatestNews, FRONTEND_URL } from "@/lib/api";
import ArticleView from "@/components/news/ArticleView";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const articles = await getLatestNews(30);
    if (articles && articles.length > 0) {
      return articles.map((art) => ({ slug: art.slug }));
    }
  } catch (err) {
    console.error("Static params fetch error:", err);
  }
  return [{ slug: "latest-news" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Story | TezKhabar" };

  return {
    title: `${article.title} | TezKhabar`,
    description: article.summary || article.title,
    alternates: {
      canonical: `${FRONTEND_URL}/news/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.summary || article.title,
      url: `${FRONTEND_URL}/news/${article.slug}`,
      type: "article",
      publishedTime: article.published_at,
      images: article.image_url ? [{ url: article.image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary || article.title,
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const initialArticle = await getArticleBySlug(params.slug);
  return <ArticleView slug={params.slug} initialArticle={initialArticle} />;
}
