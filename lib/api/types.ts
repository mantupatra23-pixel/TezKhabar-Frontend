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

/**
 * Normalizes varied backend response shapes into the strict NewsArticle schema.
 */
export function normalizeArticle(raw: any): NewsArticle {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid article payload received from backend");
  }

  const title = String(raw.title || raw.headline || "Untitled Story").trim();
  
  // Safe slug generation fallback if backend doesn't provide slug
  const fallbackSlug = (raw.id || raw._id || title)
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const slug = String(raw.slug || raw.url_slug || fallbackSlug);

  // Normalize image fields
  const image =
    raw.image ||
    raw.image_url ||
    raw.imageUrl ||
    raw.thumbnail ||
    raw.cover_image ||
    undefined;

  // Normalize sources array
  let sources: NewsSource[] = [];
  if (Array.isArray(raw.sources)) {
    sources = raw.sources.map((s: any) => ({
      name: typeof s === "string" ? s : s.name || s.source || "Unknown Source",
      url: s.url || s.link || undefined,
      stance: s.stance || undefined,
    }));
  }

  // Normalize key summary points
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
    category: String(raw.category || "India").toLowerCase(),
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
