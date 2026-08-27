"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CATEGORIES = [
  { label: "India", slug: "india" },
  { label: "Politics", slug: "politics" },
  { label: "Business", slug: "business" },
  { label: "Technology", slug: "technology" },
  { label: "AI", slug: "ai" },
  { label: "Finance", slug: "finance" },
  { label: "Sports", slug: "sports" },
  { label: "Entertainment", slug: "entertainment" },
];

export default function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center overflow-x-auto no-scrollbar py-2 text-sm font-medium border-t border-brand-sage/30">
      <div className="flex space-x-2 shrink-0">
        <Link
          href="/"
          className={`px-3 py-1 rounded text-xs uppercase tracking-wider transition-colors ${
            pathname === "/"
              ? "bg-brand-navy text-brand-cream font-bold"
              : "text-brand-navy hover:bg-brand-sage/50"
          }`}
        >
          Top Stories
        </Link>
        {CATEGORIES.map((cat) => {
          const isActive = pathname === `/category/${cat.slug}`;
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`px-3 py-1 rounded text-xs uppercase tracking-wider transition-colors ${
                isActive
                  ? "bg-brand-navy text-brand-cream font-bold"
                  : "text-brand-navy hover:bg-brand-sage/50"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
