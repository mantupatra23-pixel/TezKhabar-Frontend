interface FallbackProps {
  category?: string;
  className?: string;
}

export default function CategoryFallback({ category = "India", className = "h-48" }: FallbackProps) {
  const cat = (category || "India").toLowerCase();

  const getStyle = () => {
    switch (cat) {
      case "politics":
        return "bg-brand-navy text-brand-peach border-brand-peach/30";
      case "business":
      case "finance":
        return "bg-brand-navy text-brand-sage border-brand-sage/30";
      case "technology":
      case "ai":
        return "bg-brand-surfaceDark text-brand-blue border-brand-blue/30";
      case "sports":
        return "bg-brand-navy text-brand-peach border-brand-peach/30";
      case "entertainment":
        return "bg-brand-sage text-brand-navy border-brand-navy/20";
      default:
        return "bg-brand-navy text-brand-cream border-brand-sage/20";
    }
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center p-6 border ${getStyle()} ${className}`}>
      <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">TezKhabar Wire</span>
      <span className="font-serif text-lg sm:text-xl font-bold mt-1 uppercase tracking-wider text-center line-clamp-1">
        {category}
      </span>
    </div>
  );
}
