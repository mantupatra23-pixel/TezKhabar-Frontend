export interface NewsSource {
  name: string;
  url?: string;
  domain?: string;
  published_at?: string;
}

export interface NewsArticle {
  id?: string;
  slug: string;
  title: string;
  dek?: string;
  summary?: string;
  description?: string;
  content?: string;
  category: string;
  subcategory?: string;
  badge?: string;
  image?: string | null;
  image_url?: string | null;
  source?: string;
  source_name: string;
  source_url?: string;
  sourceUrl?: string;
  source_domain?: string;
  published_at: string;
  publishedAt?: string;
  updated_at?: string;
  updatedAt?: string;
  created_at?: string;
  createdAt?: string;
  author?: string;
  ai_generated?: boolean;
  content_status?: string;
  confidence?: string;
  canonical_source_url?: string;
  canonical_url?: string;
  word_count?: number;
  sources?: NewsSource[];
  key_facts?: string[];
  keyFacts?: string[];
}

export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://tezkhabar.onrender.com"
).replace(/\/+$/, "");

export function stripHtml(html: string = ""): string {
  return html.replace(/<[^>]*>?/gm, "").trim();
}

export function normalizeArticle(raw: any): NewsArticle {
  if (!raw || typeof raw !== "object") {
    return {
      id: "news-story",
      slug: "news-story",
      title: "News Update",
      category: "india",
      source: "TezKhabar Wire",
      source_name: "TezKhabar Wire",
      published_at: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    };
  }

  const title = String(raw.title || raw.headline || "News Update").trim();
  const rawSlug = raw.slug || raw._id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const slug = String(rawSlug).trim();

  const img =
    raw.image_url ??
    raw.imageUrl ??
    raw.image ??
    raw.thumbnail ??
    raw.cover_image ??
    null;

  const validImage = typeof img === "string" && img.startsWith("http") ? img : null;
  const rawSummary = raw.dek || raw.summary || raw.description || "";
  const cleanSummary = stripHtml(rawSummary);
  const rawContent = raw.content || raw.body || raw.article_text || cleanSummary;
  const sourceName = String(raw.source_name || raw.source || "TezKhabar Wire");
  const pubDate = String(raw.published_at || raw.publishedAt || raw.created_at || raw.createdAt || new Date().toISOString());

  let sources: NewsSource[] = [];
  if (Array.isArray(raw.sources)) {
    sources = raw.sources.map((s: any) => ({
      name: typeof s === "string" ? s : s.name || s.source || "Source",
      url: s.url || s.link || undefined,
      domain: s.domain || undefined,
      published_at: s.published_at || undefined,
    }));
  }

  let keyFacts: string[] = [];
  if (Array.isArray(raw.key_facts)) keyFacts = raw.key_facts;
  else if (Array.isArray(raw.keyFacts)) keyFacts = raw.keyFacts;

  return {
    id: String(raw.id || raw._id || slug),
    slug: slug,
    title: title,
    dek: String(raw.dek || "").trim(),
    summary: cleanSummary || title,
    description: cleanSummary || title,
    content: rawContent,
    category: String(raw.category || "india").toLowerCase(),
    subcategory: raw.subcategory || "India",
    badge: raw.badge || undefined,
    image: validImage,
    image_url: validImage,
    source: sourceName,
    source_name: sourceName,
    source_url: raw.source_url || raw.sourceUrl || raw.url || "#",
    sourceUrl: raw.source_url || raw.sourceUrl || raw.url || "#",
    source_domain: raw.source_domain || undefined,
    published_at: pubDate,
    publishedAt: pubDate,
    updated_at: raw.updated_at || raw.updatedAt || undefined,
    updatedAt: raw.updated_at || raw.updatedAt || undefined,
    created_at: raw.created_at || raw.createdAt || undefined,
    createdAt: raw.created_at || raw.createdAt || undefined,
    author: raw.author || undefined,
    ai_generated: Boolean(raw.ai_generated),
    content_status: String(raw.content_status || "published"),
    confidence: String(raw.confidence || "developing"),
    canonical_source_url: raw.canonical_source_url || raw.source_url || undefined,
    canonical_url: raw.canonical_url || `https://tezkhabar-frontend.onrender.com/news/${slug}`,
    word_count: Number(raw.word_count || 0),
    sources: sources,
    key_facts: keyFacts,
    keyFacts: keyFacts,
  };
}

export function normalizeNewsResponse(payload: unknown): NewsArticle[] {
  if (!payload) return [];

  let rawList: any[] = [];

  if (Array.isArray(payload)) {
    rawList = payload;
  } else if (payload && typeof payload === "object") {
    const obj = payload as Record<string, any>;
    if (Array.isArray(obj.items)) {
      rawList = obj.items;
    } else if (Array.isArray(obj.articles)) {
      rawList = obj.articles;
    } else if (Array.isArray(obj.news)) {
      rawList = obj.news;
    } else if (Array.isArray(obj.results)) {
      rawList = obj.results;
    } else if (Array.isArray(obj.data)) {
      rawList = obj.data;
    }
  }

  return rawList.map(normalizeArticle);
}

export async function getLatestNews(limit = 15): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${API_BASE}/api/news?limit=${limit}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const payload = await res.json();
    return normalizeNewsResponse(payload);
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  if (!slug) return null;

  try {
    let res = await fetch(`${API_BASE}/api/news/${slug}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      res = await fetch(`${API_BASE}/api/articles/${slug}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
    }

    if (!res.ok) return null;

    const data = await res.json();
    const rawArticle = data.article || data.data || data;
    return normalizeArticle(rawArticle);
  } catch {
    return null;
  }
}

export async function getCategoryNews(category: string, limit = 15): Promise<NewsArticle[]> {
  if (!category) return [];

  try {
    const res = await fetch(`${API_BASE}/api/news?category=${category.toLowerCase()}&limit=${limit}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const payload = await res.json();
    return normalizeNewsResponse(payload);
  } catch {
    return [];
  }
}

export async function getTrendingNews(limit = 10): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${API_BASE}/api/trending?limit=${limit}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const payload = await res.json();
    return normalizeNewsResponse(payload);
  } catch {
    return [];
  }
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  if (!query || !query.trim()) return [];

  try {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query.trim())}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const payload = await res.json();
    return normalizeNewsResponse(payload);
  } catch {
    return [];
  }
}

export const fetchNews = getLatestNews;
