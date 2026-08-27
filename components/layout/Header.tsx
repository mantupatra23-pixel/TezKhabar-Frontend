import Link from "next/link";
import { Search } from "lucide-react";
import CategoryNav from "./CategoryNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-brand-cream border-b border-brand-sage/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-brand-sage/40">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-navy/70 border-r border-brand-sage pr-3 hidden sm:inline">
              Edition: India
            </span>
            <span className="text-xs text-brand-blue font-medium hidden sm:inline">
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Link href="/" className="flex items-baseline space-x-1 group">
              <span className="font-hindi text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy group-hover:text-brand-navy/90">
                तेज़ खबर
              </span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-brand-navy text-brand-cream px-1.5 py-0.5 rounded-sm">
                Editorial
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/search"
              aria-label="Search articles"
              className="p-2 text-brand-navy hover:bg-brand-sage/40 rounded transition-colors"
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
