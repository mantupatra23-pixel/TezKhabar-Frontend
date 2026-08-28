import { MetadataRoute } from "next";
import { getLatestNews, FRONTEND_URL } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = FRONTEND_URL;
  let articles = [];
  try {
    articles = await getLatestNews(50);
  } catch (e) {
    console.error("Sitemap fetch error:", e);
  }

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

  const articleEntries: MetadataRoute.Sitemap = (articles || []).map((art) => {
    const rawDate = art.updated_at || art.published_at;
    const dateObj = rawDate ? new Date(rawDate) : new Date();
    return {
      url: `${baseUrl}/news/${art.slug}`,
      lastModified: Number.isNaN(dateObj.getTime()) ? new Date() : dateObj,
      changeFrequency: "never",
      priority: 0.9,
    };
  });

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
