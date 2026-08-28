import HomeFeed from "@/components/news/HomeFeed";

export default function HomePage() {
  return (
    <div>
      {/* 2-Tone Background: Upper Sage Section */}
      <section className="bg-brand-sage pt-6 pb-10 border-b border-brand-navy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-navy/70">
              India's Editorial Wire
            </span>
          </div>
          <HomeFeed />
        </div>
      </section>
    </div>
  );
}
