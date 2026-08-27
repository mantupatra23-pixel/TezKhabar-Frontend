import { MetadataRoute } from "next";
import { getLatestNews } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tezkhabar.com";
  const articles = await getLatestNews(50);

  const categories = [
    "india",
    "politics",
    "business",
    "technology",
    "ai",
    "finance",
    "sports",
    "entertainment",
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/news/${art.slug}`,
    lastModified: new Date(art.updatedAt || art.publishedAt),
    changeFrequency: "never",
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    ...categoryEntries,
    ...articleEntries,
  ];
}
