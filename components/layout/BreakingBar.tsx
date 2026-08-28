import Link from "next/link";

export default function BreakingBar() {
  return (
    <div className="bg-brand-peach text-brand-navy border-b border-brand-navy/10 px-4 py-2 text-xs font-medium">
      <div className="max-w-7xl mx-auto flex items-center space-x-3">
        <span className="bg-brand-navy text-brand-cream px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] shrink-0">
          Breaking
        </span>
        <div className="overflow-hidden whitespace-nowrap text-ellipsis">
          <span className="text-brand-navy font-semibold">
            TezKhabar Live Wire: Real-time multi-source editorial coverage across India
          </span>
        </div>
      </div>
    </div>
  );
}
