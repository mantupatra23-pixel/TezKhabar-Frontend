import { NewsArticle } from "@/types/news";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function normalizeArticle(raw: any): NewsArticle {
  const title = raw.title || raw.headline || "Untitled Article";
  const slug =
    raw.slug ||
    raw._id ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  return {
    id: String(raw.id || raw._id || slug),
    slug: slug,
    title: title,
    description: raw.description || raw.summary || raw.dek || "",
    content: raw.content || raw.body || raw.article_text || "",
    image: raw.image || raw.image_url || raw.thumbnail || undefined,
    category: (raw.category || "India").toLowerCase(),
    source: raw.source || raw.publisher || "TezKhabar Wire",
    sourceUrl: raw.sourceUrl || raw.source_url || undefined,
    publishedAt: raw.publishedAt || raw.published_at || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.updated_at || undefined,
    author: raw.author || undefined,
    keyFacts: Array.isArray(raw.keyFacts || raw.key_facts) ? (raw.keyFacts || raw.key_facts) : [],
    sources: Array.isArray(raw.sources) ? raw.sources : [],
    isBreaking: Boolean(raw.isBreaking || raw.is_breaking),
  };
}

export async function getLatestNews(limit = 20): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${API_BASE}/news?limit=${limit}`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.articles || data.results || [];
    return list.map(normalizeArticle);
  } catch (error) {
    console.error("Fetch failed for latest news:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const res = await fetch(`${API_BASE}/news/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return normalizeArticle(data);
  } catch (error) {
    console.error(`Fetch failed for article [${slug}]:`, error);
    return null;
  }
}

export async function getCategoryNews(category: string): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${API_BASE}/news?category=${category}`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.articles || [];
    return list.map(normalizeArticle);
  } catch (error) {
    console.error(`Fetch failed for category [${category}]:`, error);
    return [];
  }
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  if (!query) return [];
  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.results || [];
    return list.map(normalizeArticle);
  } catch (error) {
    console.error("Search API failed:", error);
    return [];
  }
}
