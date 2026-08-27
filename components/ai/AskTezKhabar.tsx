"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";

interface AskTezKhabarProps {
  articleSlug: string;
  articleTitle: string;
}

export default function AskTezKhabar({ articleSlug, articleTitle }: AskTezKhabarProps) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const predefinedQueries = [
    "Why does this matter?",
    "Explain in simple Hindi",
    "What are the direct implications?",
  ];

  const handleAsk = async (text: string) => {
    if (!text) return;
    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch(`/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: articleSlug, query: text }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnswer(data.answer || "No response received from explainer engine.");
      } else {
        setAnswer("Explainer is temporarily unavailable. Please try again shortly.");
      }
    } catch {
      setAnswer("Unable to fetch explanation at this time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12 bg-brand-navy text-brand-cream p-6 rounded-md">
      <div className="flex items-center space-x-2 text-brand-peach mb-2">
        <Sparkles className="w-4 h-4" />
        <h3 className="text-xs uppercase tracking-widest font-bold">Ask TezKhabar Explainer</h3>
      </div>
      <p className="text-xs text-brand-sage mb-4">
        Need clarification on this story? Select a question or ask below.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {predefinedQueries.map((q) => (
          <button
            key={q}
            onClick={() => {
              setQuery(q);
              handleAsk(q);
            }}
            className="text-xs bg-brand-surfaceDark hover:bg-brand-blue/30 border border-brand-sage/20 px-3 py-1.5 rounded transition-colors text-left"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a clarifying question..."
          className="flex-1 bg-brand-surfaceDark text-xs text-brand-cream border border-brand-sage/30 rounded px-3 py-2 focus:outline-none focus:border-brand-peach"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-peach text-brand-navy px-4 py-2 rounded text-xs font-bold hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? "..." : <Send className="w-3.5 h-3.5" />}
        </button>
      </form>

      {answer && (
        <div className="mt-4 p-4 bg-brand-surfaceDark/80 border border-brand-sage/20 rounded text-xs text-brand-cream leading-relaxed">
          {answer}
        </div>
      )}
    </section>
  );
}
