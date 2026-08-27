import { apiClient } from "./client";
import { NewsArticle, normalizeArticle } from "./types";

export async function fetchTrendingNews(limit = 10): Promise<NewsArticle[]> {
  try {
    let data: any;
    try {
      data = await apiClient<any>("/api/trending", { params: { limit }, next: { revalidate: 300 } });
    } catch {
      data = await apiClient<any>("/trending", { params: { limit }, next: { revalidate: 300 } });
    }

    const rawList = Array.isArray(data) ? data : data.articles || data.trending || data.results || [];
    return rawList.map(normalizeArticle);
  } catch (error) {
    console.error("[fetchTrendingNews Error]:", error);
    return [];
  }
}
