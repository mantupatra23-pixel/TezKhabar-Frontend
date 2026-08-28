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
    <nav className="flex items-center overflow-x-auto no-scrollbar py-2 text-xs font-semibold">
      <div className="flex space-x-2 shrink-0">
        <Link
          href="/"
          className={`px-3 py-1 rounded transition-colors uppercase tracking-wider ${
            pathname === "/"
              ? "bg-brand-navy text-brand-cream"
              : "text-brand-navy hover:bg-brand-navy/10"
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
              className={`px-3 py-1 rounded transition-colors uppercase tracking-wider ${
                isActive
                  ? "bg-brand-navy text-brand-cream"
                  : "text-brand-navy hover:bg-brand-navy/10"
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
