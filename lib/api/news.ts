import { apiClient } from "./client";
import { NewsArticle, normalizeArticle } from "./types";

/**
 * Fetch latest articles from the news wire.
 * Attempts standard REST patterns: /api/news -> /news -> fallback
 */
export async function fetchLatestNews(limit = 20): Promise<NewsArticle[]> {
  try {
    let data: any;
    try {
      data = await apiClient<any>("/api/news", { params: { limit }, next: { revalidate: 120 } });
    } catch {
      data = await apiClient<any>("/news", { params: { limit }, next: { revalidate: 120 } });
    }

    const rawList = Array.isArray(data) ? data : data.articles || data.results || data.data || [];
    return rawList.map(normalizeArticle);
  } catch (error) {
    console.error("[fetchLatestNews Error]:", error);
    return [];
  }
}

/**
 * Fetch a single story by its slug or ID.
 */
export async function fetchArticleBySlug(slug: string): Promise<NewsArticle | null> {
  if (!slug) return null;

  try {
    let data: any;
    try {
      data = await apiClient<any>(`/api/news/${slug}`, { next: { revalidate: 60 } });
    } catch {
      try {
        data = await apiClient<any>(`/news/${slug}`, { next: { revalidate: 60 } });
      } catch {
        data = await apiClient<any>(`/api/articles/${slug}`, { next: { revalidate: 60 } });
      }
    }

    const rawArticle = data.article || data.data || data;
    return normalizeArticle(rawArticle);
  } catch (error) {
    console.error(`[fetchArticleBySlug Error] Slug: ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch articles filtered by category.
 */
export async function fetchCategoryNews(category: string, limit = 20): Promise<NewsArticle[]> {
  if (!category) return [];

  try {
    let data: any;
    try {
      data = await apiClient<any>("/api/news", {
        params: { category: category.toLowerCase(), limit },
        next: { revalidate: 120 },
      });
    } catch {
      data = await apiClient<any>(`/api/category/${category.toLowerCase()}`, {
        params: { limit },
        next: { revalidate: 120 },
      });
    }

    const rawList = Array.isArray(data) ? data : data.articles || data.results || data.data || [];
    return rawList.map(normalizeArticle);
  } catch (error) {
    console.error(`[fetchCategoryNews Error] Category: ${category}:`, error);
    return [];
  }
}
