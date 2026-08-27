export interface NewsSource {
  name: string;
  url?: string;
  stance?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  category: string;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  keyFacts?: string[];
  sources?: NewsSource[];
  isBreaking?: boolean;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://tezkhabar.onrender.com").replace(/\/+$/, "");

/**
 * Safe fetch wrapper with timeout for Render free tier cold-starts
 */
async function safeFetch(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    clearTimeout(timer);
    return response;
  } catch (error) {
    clearTimeout(timer);
    console.error(`[Fetch Error] Failed for ${url}:`, error);
    return null;
  }
}

/**
 * Normalizes varied backend response shapes into strict NewsArticle schema.
 */
export function normalizeArticle(raw: any): NewsArticle {
  if (!raw || typeof raw !== "object") {
    return {
      id: "unknown",
      slug: "unknown-story",
      title: "Untitled Story",
      description: "",
      content: "",
      category: "india",
      source: "TezKhabar Wire",
      publishedAt: new Date().toISOString(),
    };
  }

  const title = String(raw.title || raw.headline || "Untitled Story").trim();

  const fallbackSlug = (raw.id || raw._id || title)
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const slug = String(raw.slug || raw.url_slug || fallbackSlug);

  const image =
    raw.image ||
    raw.image_url ||
    raw.imageUrl ||
    raw.thumbnail ||
    raw.cover_image ||
    undefined;

  let sources: NewsSource[] = [];
  if (Array.isArray(raw.sources)) {
    sources = raw.sources.map((s: any) => ({
      name: typeof s === "string" ? s : s.name || s.source || "TezKhabar Wire",
      url: s.url || s.link || undefined,
      stance: s.stance || undefined,
    }));
  }

  let keyFacts: string[] = [];
  if (Array.isArray(raw.key_facts)) keyFacts = raw.key_facts;
  else if (Array.isArray(raw.keyFacts)) keyFacts = raw.keyFacts;
  else if (Array.isArray(raw.highlights)) keyFacts = raw.highlights;

  return {
    id: String(raw.id || raw._id || slug),
    slug: slug,
    title: title,
    description: String(raw.description || raw.summary || raw.dek || "").trim(),
    content: String(raw.content || raw.body || raw.article_text || "").trim(),
    image: typeof image === "string" && image.startsWith("http") ? image : undefined,
    category: String(raw.category || "india").toLowerCase(),
    source: String(raw.source || raw.publisher || raw.source_name || "TezKhabar Wire"),
    sourceUrl: raw.source_url || raw.sourceUrl || raw.url || undefined,
    publishedAt: raw.published_at || raw.publishedAt || raw.created_at || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updated_at || raw.updatedAt || undefined,
    author: raw.author || raw.byline || undefined,
    keyFacts: keyFacts.length > 0 ? keyFacts : undefined,
    sources: sources.length > 0 ? sources : undefined,
    isBreaking: Boolean(raw.is_breaking || raw.isBreaking || raw.breaking),
  };
}

/**
 * Fetch latest news articles
 */
export async function getLatestNews(limit = 20): Promise<NewsArticle[]> {
  try {
    let res = await safeFetch(`${API_BASE}/api/news?limit=${limit}`, { next: { revalidate: 120 } });
    if (!res || !res.ok) {
      res = await safeFetch(`${API_BASE}/news?limit=${limit}`, { next: { revalidate: 120 } });
    }

    if (!res || !res.ok) return [];

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.articles || data.results || data.data || [];
    return list.map(normalizeArticle);
  } catch (error) {
    console.error("[getLatestNews Error]:", error);
    return [];
  }
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  if (!slug) return null;

  try {
    let res = await safeFetch(`${API_BASE}/api/news/${slug}`, { next: { revalidate: 60 } });
    if (!res || !res.ok) {
      res = await safeFetch(`${API_BASE}/news/${slug}`, { next: { revalidate: 60 } });
    }
    if (!res || !res.ok) {
      res = await safeFetch(`${API_BASE}/api/articles/${slug}`, { next: { revalidate: 60 } });
    }

    if (!res || !res.ok) return null;

    const data = await res.json();
    const raw = data.article || data.data || data;
    return normalizeArticle(raw);
  } catch (error) {
    console.error(`[getArticleBySlug Error] Slug: ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch articles filtered by category
 */
export async function getCategoryNews(category: string, limit = 20): Promise<NewsArticle[]> {
  if (!category) return [];

  try {
    const cleanCat = category.toLowerCase();
    let res = await safeFetch(`${API_BASE}/api/news?category=${cleanCat}&limit=${limit}`, {
      next: { revalidate: 120 },
    });
    if (!res || !res.ok) {
      res = await safeFetch(`${API_BASE}/api/category/${cleanCat}?limit=${limit}`, {
        next: { revalidate: 120 },
      });
    }

    if (!res || !res.ok) return [];

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.articles || data.results || data.data || [];
    return list.map(normalizeArticle);
  } catch (error) {
    console.error(`[getCategoryNews Error] Category: ${category}:`, error);
    return [];
  }
}

/**
 * Fetch trending news
 */
export async function getTrendingNews(limit = 10): Promise<NewsArticle[]> {
  try {
    let res = await safeFetch(`${API_BASE}/api/trending?limit=${limit}`, { next: { revalidate: 300 } });
    if (!res || !res.ok) {
      res = await safeFetch(`${API_BASE}/trending?limit=${limit}`, { next: { revalidate: 300 } });
    }

    if (!res || !res.ok) return [];

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.articles || data.trending || data.results || [];
    return list.map(normalizeArticle);
  } catch (error) {
    console.error("[getTrendingNews Error]:", error);
    return [];
  }
}

/**
 * Search articles by query
 */
export async function searchNews(query: string, category?: string): Promise<NewsArticle[]> {
  if (!query || query.trim().length === 0) return [];

  try {
    const searchParams = new URLSearchParams({ q: query.trim() });
    if (category) searchParams.append("category", category.toLowerCase());

    const res = await safeFetch(`${API_BASE}/api/search?${searchParams.toString()}`, {
      cache: "no-store",
    });

    if (!res || !res.ok) return [];

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.articles || data.results || data.data || [];
    return list.map(normalizeArticle);
  } catch (error) {
    console.error(`[searchNews Error] Query: "${query}":`, error);
    return [];
  }
}

// Aliases for compatibility
export const fetchLatestNews = getLatestNews;
export const fetchArticleBySlug = getArticleBySlug;
export const fetchCategoryNews = getCategoryNews;
export const fetchTrendingNews = getTrendingNews;
export const searchNewsApi = searchNews;
