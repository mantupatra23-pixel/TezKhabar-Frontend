"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import CategoryNav from "./CategoryNav";

export default function Header() {
  return (
    <header className="bg-brand-sage border-b border-brand-navy/15 text-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-brand-navy/10">
          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-bold tracking-widest uppercase text-brand-navy/70 hidden sm:inline border-r border-brand-navy/20 pr-3">
              Edition: India
            </span>
            <span className="text-xs text-brand-navy/80 font-medium hidden sm:inline">
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Link href="/" className="flex items-baseline space-x-1.5 group">
              <span className="font-hindi text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-navy group-hover:opacity-90">
                तेज़ खबर
              </span>
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest bg-brand-navy text-brand-cream px-1.5 py-0.5 rounded">
                Editorial
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 text-brand-navy hover:bg-brand-navy/10 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <CategoryNav />
      </div>
    </header>
  );
}
