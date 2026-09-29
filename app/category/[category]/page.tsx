import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/components/Icon";
import { ToolCard } from "@/components/ToolCard";
import { categories, categoryVars, toolsIn } from "@/lib/tools";

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
    <div className="themed" style={categoryVars(c.id)}>
      <section className="page-hero compact">
        <div className="blobs" aria-hidden>
          <span className="blob b1" />
          <span className="blob b2" />
        </div>
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={14} aria-hidden />
            <span>{c.name}</span>
          </nav>
          <div className="title-row">
            <span className="tile lg">
              <Icon name={c.icon} size={34} />
            </span>
            <h1>{c.title}</h1>
          </div>
          <p className="lead">{c.description}</p>
        </div>
      </section>
      <div className="container">
        <div className="tool-grid">
          {toolsIn(c.id).map((t, i) => (
            <ToolCard key={t.slug} tool={t} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
