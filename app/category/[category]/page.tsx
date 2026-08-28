import CategoryView from "@/components/news/CategoryView";

export function generateStaticParams() {
  return [
    { category: "india" },
    { category: "politics" },
    { category: "business" },
    { category: "technology" },
    { category: "ai" },
    { category: "finance" },
    { category: "sports" },
    { category: "entertainment" },
  ];
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  return <CategoryView category={params.category} />;
}
