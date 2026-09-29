import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolCard } from "@/components/ToolCard";
import { categories, toolsIn, type CategoryId } from "@/lib/tools";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const c = categories.find((x) => x.id === category);
  if (!c) return {};
  return {
    title: c.title,
    description: `${c.description} ${toolsIn(c.id)
      .map((t) => t.name)
      .join(", ")}. Free, no sign-up.`,
    alternates: { canonical: `/category/${c.id}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const c = categories.find((x) => x.id === category);
  if (!c) notFound();

  return (
    <div className="container">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> › {c.name}
      </nav>
      <h1>
        {c.icon} {c.title}
      </h1>
      <p className="lead">{c.description}</p>
      <div className="tool-grid">
        {toolsIn(c.id as CategoryId).map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </div>
  );
}
