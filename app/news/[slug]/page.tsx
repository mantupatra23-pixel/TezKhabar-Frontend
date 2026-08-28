import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, FRONTEND_URL } from "@/lib/api";
import ArticleView from "@/components/news/ArticleView";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface PageProps {
  params: { slug: string };
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
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }
  return <ArticleView slug={params.slug} initialArticle={article} />;
}
