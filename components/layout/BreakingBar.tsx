import Link from "next/link";

export default function BreakingBar() {
  // In production, fetch live ticker from backend
  const breakingNews = [
    { title: "Parliament discusses key digital privacy frameworks in ongoing monsoon session", slug: "parliament-digital-privacy-discussion" },
  ];

  if (!breakingNews.length) return null;

  return (
    <div className="bg-brand-navy text-brand-cream border-b border-brand-navy/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center space-x-3">
        <span className="bg-brand-peach text-brand-navy px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 text-[11px]">
          Breaking
        </span>
        <div className="overflow-hidden whitespace-nowrap text-ellipsis">
          <Link href={`/news/${breakingNews[0].slug}`} className="hover:underline text-brand-cream/95">
            {breakingNews[0].title}
          </Link>
        </div>
      </div>
    </div>
  );
}
