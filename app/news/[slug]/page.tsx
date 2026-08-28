import { getLatestNews } from "@/lib/api";
import ArticleView from "@/components/news/ArticleView";

export async function generateStaticParams() {
  try {
    const articles = await getLatestNews(50);
    if (articles && articles.length > 0) {
      return articles.map((art) => ({ slug: art.slug }));
    }
  } catch (err) {
    console.error("Static params fetch error:", err);
  }
  return [{ slug: "latest-news" }];
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return <ArticleView slug={params.slug} />;
}
