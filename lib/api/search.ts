import { apiClient } from "./client";
import { NewsArticle, normalizeArticle } from "./types";

export async function searchNewsApi(query: string, category?: string): Promise<NewsArticle[]> {
  if (!query || query.trim().length === 0) return [];

  try {
    const data = await apiClient<any>("/api/search", {
      params: { q: query.trim(), category: category || undefined },
      cache: "no-store",
    });

    const rawList = Array.isArray(data) ? data : data.articles || data.results || data.data || [];
    return rawList.map(normalizeArticle);
  } catch (error) {
    console.error(`[searchNewsApi Error] Query: "${query}":`, error);
    return [];
  }
}
