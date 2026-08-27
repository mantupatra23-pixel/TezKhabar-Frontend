export interface NewsSource {
  name: string;
  url?: string;
  stance?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  image?: string;
  category: string;
  source?: string;
  sourceUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  keyFacts?: string[];
  sources?: NewsSource[];
  isBreaking?: boolean;
}

export type CategorySlug =
  | "india"
  | "politics"
  | "business"
  | "technology"
  | "ai"
  | "finance"
  | "sports"
  | "entertainment";
