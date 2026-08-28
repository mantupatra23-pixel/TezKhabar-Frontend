import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="bg-white border border-brand-sage rounded-lg p-8 shadow-sm">
        <span className="text-xs uppercase font-bold tracking-widest text-brand-peach bg-brand-navy px-2.5 py-1 rounded">
          TezKhabar Notice
        </span>
        <h1 className="font-serif text-3xl font-bold text-brand-navy mt-4 mb-2">
          Story Not Found
        </h1>
        <p className="text-sm text-brand-navy/80 mb-1">
          Ye story ab available nahi hai ya update ho chuki hai.
        </p>
        <p className="text-xs text-brand-blue mb-6">
          Please browse our latest reports on the homepage.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-navy text-brand-cream px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-colors"
        >
          ← Back to Top Stories
        </Link>
      </div>
    </div>
  );
}
