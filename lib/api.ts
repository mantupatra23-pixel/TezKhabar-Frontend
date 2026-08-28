export interface NewsSource {
  name: string;
  url?: string;
  domain?: string;
  published_at?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  dek?: string;
  summary: string;
  description: string;
  content: string;
  category: string;
  subcategory?: string;
  badge?: string;
  image: string | null;
  image_url: string | null;
  imageUrl?: string | null;
  source: string;
  source_name: string;
  sourceName: string;
  source_url: string;
  sourceUrl: string;
  source_domain?: string;
  published_at: string;
  publishedAt: string;
  updated_at?: string;
  updatedAt?: string;
  created_at?: string;
  createdAt?: string;
  author?: string;
  ai_generated?: boolean;
  aiGenerated?: boolean;
  content_status?: string;
  contentStatus?: string;
  confidence?: string;
  canonical_source_url?: string;
  canonical_url: string;
  word_count?: number;
  sources: NewsSource[];
  key_facts: string[];
  keyFacts: string[];
}

export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://tezkhabar.onrender.com"
).replace(/\/+$/, "");

export const FRONTEND_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tezkhabar-frontend.onrender.com"
).replace(/\/+$/, "");

export function stripHtml(raw: string = ""): string {
  if (!raw) return "";
  let text = raw.replace(/<[^>]*>?/gm, " ");
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

export function normalizeImageUrl(raw: any): string | null {
  const candidate =
    raw.image_url ||
    raw.imageUrl ||
    raw.image ||
    raw.thumbnail ||
    raw.og_image ||
    raw.cover_image;

  if (typeof candidate !== "string" || !candidate.startsWith("http")) {
    return null;
  }

  const lower = candidate.toLowerCase();
  const genericPatterns = [
    "lh3.googleusercontent.com",
    "gstatic.com",
    "google.com/logos",
    "news.google.com/api/attachments",
    "default_news",
    "placeholder",
    "fallback",
    "favicon",
  ];

  for (const pattern of genericPatterns) {
    if (lower.includes(pattern)) {
      return null;
    }
  }

  return candidate;
}

export function formatNewsDate(value?: string | null): string {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSec >= 0 && diffSec < 60) return "Just now";
  if (diffMin > 0 && diffMin < 60) return `${diffMin} min ago`;
  if (diffHrs > 0 && diffHrs < 24) return `${diffHrs} hr ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function normalizeTitle(rawTitle?: string): string {
  if (!rawTitle) return "";
  let title = stripHtml(rawTitle);
  title = title.replace(/\s*-\s*Google News$/i, "").trim();
  return title;
}

export function normalizeArticle(raw: any): NewsArticle | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const title = normalizeTitle(raw.title || raw.headline);
  if (!title) return null;

  const fallbackSlug = (raw.id || raw._id || title)
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const slug = String(raw.slug || raw.url_slug || fallbackSlug).trim();
  if (!slug) return null;

  const validImage = normalizeImageUrl(raw);
  const rawSummary = raw.dek || raw.summary || raw.description || "";
  const cleanSummary = stripHtml(rawSummary) || title;
  const rawContent = raw.content || raw.body || raw.article_text || `<p>${cleanSummary}</p>`;

  let sourceName = String(raw.source_name || raw.source || "TezKhabar Wire").trim();
  if (sourceName.toLowerCase() === "google news" && raw.source_domain) {
    sourceName = raw.source_domain.replace(/^www\./, "");
  }

  const pubDate = String(
    raw.published_at || raw.publishedAt || raw.created_at || raw.createdAt || new Date().toISOString()
  );

  let sources: NewsSource[] = [];
  if (Array.isArray(raw.sources)) {
    sources = raw.sources.map((s: any) => ({
      name: typeof s === "string" ? s : s.name || s.source || sourceName,
      url: s.url || s.link || undefined,
      domain: s.domain || undefined,
      published_at: s.published_at || undefined,
    }));
  }

  let keyFacts: string[] = [];
  if (Array.isArray(raw.key_facts)) keyFacts = raw.key_facts.map(stripHtml).filter(Boolean);
  else if (Array.isArray(raw.keyFacts)) keyFacts = raw.keyFacts.map(stripHtml).filter(Boolean);

  return {
    id: String(raw.id || raw._id || slug),
    slug: slug,
    title: title,
    dek: stripHtml(raw.dek || ""),
    summary: cleanSummary,
    description: cleanSummary,
    content: rawContent,
    category: String(raw.category || "india").toLowerCase(),
    subcategory: raw.subcategory || "India",
    badge: raw.badge || undefined,
    image: validImage,
    image_url: validImage,
    imageUrl: validImage,
    source: sourceName,
    source_name: sourceName,
    sourceName: sourceName,
    source_url: raw.source_url || raw.sourceUrl || raw.url || "#",
    sourceUrl: raw.source_url || raw.sourceUrl || raw.url || "#",
    source_domain: raw.source_domain || undefined,
    published_at: pubDate,
    publishedAt: pubDate,
    updated_at: raw.updated_at || raw.updatedAt || undefined,
    updatedAt: raw.updated_at || raw.updatedAt || undefined,
    created_at: raw.created_at || raw.createdAt || undefined,
    createdAt: raw.created_at || raw.createdAt || undefined,
    author: raw.author || sourceName,
    ai_generated: Boolean(raw.ai_generated),
    aiGenerated: Boolean(raw.ai_generated),
    content_status: String(raw.content_status || "published"),
    contentStatus: String(raw.content_status || "published"),
    confidence: String(raw.confidence || "developing"),
    canonical_source_url: raw.canonical_source_url || raw.source_url || undefined,
    canonical_url: raw.canonical_url || `${FRONTEND_URL}/news/${slug}`,
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
    if (Array.isArray(obj.items)) rawList = obj.items;
    else if (Array.isArray(obj.articles)) rawList = obj.articles;
    else if (Array.isArray(obj.news)) rawList = obj.news;
    else if (Array.isArray(obj.results)) rawList = obj.results;
    else if (Array.isArray(obj.data)) rawList = obj.data;
  }

  return rawList
    .map(normalizeArticle)
    .filter((art): art is NewsArticle => art !== null && Boolean(art.title && art.slug));
}

export async function fetchNews(limit = 15): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${API_BASE}/api/news?limit=${limit}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const payload = await res.json();
    return normalizeNewsResponse(payload);
  } catch (err) {
    console.error("[fetchNews Error]:", err);
    return [];
  }
}

export async function fetchNewsBySlug(slug: string): Promise<NewsArticle | null> {
  if (!slug) return null;
  const safeSlug = encodeURIComponent(slug.trim());

  try {
    let res = await fetch(`${API_BASE}/api/news/${safeSlug}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      res = await fetch(`${API_BASE}/api/articles/${safeSlug}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
    }

    if (!res.ok) return null;
    const data = await res.json();
    const rawArticle = data.article || data.data || data;
    return normalizeArticle(rawArticle);
  } catch (err) {
    console.error(`[fetchNewsBySlug Error] Slug: ${slug}:`, err);
    return null;
  }
}

export async function fetchCategoryNews(category: string, limit = 15): Promise<NewsArticle[]> {
  if (!category) return [];
  try {
    const res = await fetch(
      `${API_BASE}/api/news?category=${encodeURIComponent(category.toLowerCase())}&limit=${limit}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const payload = await res.json();
    return normalizeNewsResponse(payload);
  } catch {
    return [];
  }
}

export async function fetchRelatedNews(category: string, currentSlug: string, limit = 4): Promise<NewsArticle[]> {
  try {
    const list = await fetchCategoryNews(category, 10);
    return list.filter((a) => a.slug !== currentSlug).slice(0, limit);
  } catch {
    return [];
  }
}

export async function fetchTrending(limit = 10): Promise<NewsArticle[]> {
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

export const getLatestNews = fetchNews;
export const getArticleBySlug = fetchNewsBySlug;
export const getCategoryNews = fetchCategoryNews;
export const getTrendingNews = fetchTrending;
