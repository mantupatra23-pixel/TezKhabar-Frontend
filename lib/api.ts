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
 * Safe fetch with 30s timeout for Render backend cold-starts
 */
async function safeFetch(url: string, options: RequestInit = {}, timeoutMs = 30000): Promise<Response | null> {
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
    return null;
  }
}

export function normalizeArticle(raw: any): NewsArticle {
  if (!raw || typeof raw !== "object") {
    return {
      id: "unknown",
      slug: "news-update",
      title: "TezKhabar News Wire",
      description: "",
      content: "",
      category: "india",
      source: "TezKhabar",
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
  const image = raw.image || raw.image_url || raw.imageUrl || raw.thumbnail || undefined;

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
    publishedAt: raw.published_at || raw.publishedAt || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updated_at || raw.updatedAt || undefined,
    author: raw.author || raw.byline || undefined,
    keyFacts: keyFacts.length > 0 ? keyFacts : undefined,
    sources: sources.length > 0 ? sources : undefined,
    isBreaking: Boolean(raw.is_breaking || raw.isBreaking || raw.breaking),
  };
}

export async function getLatestNews(limit = 20): Promise<NewsArticle[]> {
  try {
    let res = await safeFetch(`${API_BASE}/api/news?limit=${limit}`);
    if (!res || !res.ok) res = await safeFetch(`${API_BASE}/news?limit=${limit}`);
    if (!res || !res.ok) return [];

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.articles || data.results || data.data || [];
    return list.map(normalizeArticle);
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  if (!slug) return null;
  try {
    let res = await safeFetch(`${API_BASE}/api/news/${slug}`);
    if (!res || !res.ok) res = await safeFetch(`${API_BASE}/news/${slug}`);
    if (!res || !res.ok) res = await safeFetch(`${API_BASE}/api/articles/${slug}`);
    if (!res || !res.ok) return null;

    const data = await res.json();
    return normalizeArticle(data.article || data.data || data);
  } catch {
    return null;
  }
}

export async function getCategoryNews(category: string, limit = 20): Promise<NewsArticle[]> {
  if (!category) return [];
  try {
    let res = await safeFetch(`${API_BASE}/api/news?category=${category.toLowerCase()}&limit=${limit}`);
    if (!res || !res.ok) return [];

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.articles || data.results || data.data || [];
    return list.map(normalizeArticle);
  } catch {
    return [];
  }
}

export async function getTrendingNews(limit = 10): Promise<NewsArticle[]> {
  try {
    let res = await safeFetch(`${API_BASE}/api/trending?limit=${limit}`);
    if (!res || !res.ok) return [];

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.articles || data.trending || data.results || [];
    return list.map(normalizeArticle);
  } catch {
    return [];
  }
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  if (!query) return [];
  try {
    const res = await safeFetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
    if (!res || !res.ok) return [];

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.articles || data.results || [];
    return list.map(normalizeArticle);
  } catch {
    return [];
  }
}
