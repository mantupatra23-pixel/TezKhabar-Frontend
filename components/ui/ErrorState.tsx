"use client";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Coverage Temporarily Unavailable",
  message = "We encountered a network delay communicating with the news wire. Please retry.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="bg-brand-creamLight border border-brand-sage/80 rounded-md p-8 text-center my-8 max-w-xl mx-auto">
      <h3 className="font-serif text-lg font-bold text-brand-navy mb-2">{title}</h3>
      <p className="text-xs text-brand-blue mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-brand-navy text-brand-cream px-4 py-2 rounded text-xs font-bold hover:bg-brand-surfaceDark transition-colors"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}
