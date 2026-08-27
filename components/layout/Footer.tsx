"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-brand-navy text-brand-cream border-t border-brand-surfaceDark mt-16 pt-12 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-brand-surfaceDark">
          <div className="space-y-3">
            <h2 className="font-hindi text-2xl font-bold">तेज़ खबर</h2>
            <p className="text-xs text-brand-sage leading-relaxed">
              Fast, contextual Indian news platform explaining national and global developments with journalistic rigor.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-brand-peach font-bold mb-3">Coverage</h3>
            <ul className="space-y-2 text-xs text-brand-sage">
              <li>
                <Link href="/category/india" className="hover:text-brand-cream">
                  National & India
                </Link>
              </li>
              <li>
                <Link href="/category/politics" className="hover:text-brand-cream">
                  Politics & Policy
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="hover:text-brand-cream">
                  Business & Markets
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="hover:text-brand-cream">
                  Technology & AI
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-brand-peach font-bold mb-3">Editorial</h3>
            <ul className="space-y-2 text-xs text-brand-sage">
              <li>
                <Link href="/about" className="hover:text-brand-cream">
                  About TezKhabar
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-brand-cream">
                  Editorial & AI Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-cream">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-cream">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-brand-peach font-bold mb-3">Editorial Brief</h3>
            <p className="text-xs text-brand-sage mb-3">Receive critical morning stories directly.</p>
            {subscribed ? (
              <p className="text-xs text-brand-peach font-semibold">Thank you for subscribing.</p>
            ) : (
              <form className="flex flex-col space-y-2" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-brand-surfaceDark text-brand-cream border border-brand-sage/30 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-brand-peach"
                />
                <button
                  type="submit"
                  className="bg-brand-peach text-brand-navy font-semibold text-xs px-3 py-1.5 rounded hover:bg-opacity-90 transition-opacity"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-sage">
          <p>© {new Date().getFullYear()} TezKhabar. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for speed, clarity, and journalistic trust.</p>
        </div>
      </div>
    </footer>
  );
}
