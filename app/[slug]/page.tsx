import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { ToolCard } from "@/components/ToolCard";
import { toolComponents } from "@/components/tools";
import { site } from "@/lib/site";
import { getCategory, relatedTools, tools, toolsBySlug } from "@/lib/tools";

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsBySlug[slug];
  if (!tool) return {};
  return {
    title: { absolute: `${tool.title} | ${site.name}` },
    description: tool.description,
    alternates: { canonical: `/${tool.slug}` },
    openGraph: { title: tool.title, description: tool.description, url: `/${tool.slug}` },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = toolsBySlug[slug];
  const Component = toolComponents[slug];
  if (!tool || !Component) notFound();

  const category = getCategory(tool.category);
  const url = `${site.url}/${tool.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url,
      description: tool.description,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: category.name, item: `${site.url}/category/${category.id}` },
        { "@type": "ListItem", position: 3, name: tool.name, item: url },
      ],
    },
  ];

  return (
    <div className="container narrow">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> › <Link href={`/category/${category.id}`}>{category.name}</Link> ›{" "}
        {tool.name}
      </nav>

      <h1>{tool.name}</h1>
      <p className="lead">{tool.intro}</p>

      <div className="panel">
        <Component />
      </div>

      <AdSlot slot="top" />

      <article className="content">
        <h2>How to use the {tool.name}</h2>
        <ol>
          {tool.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <h2>Frequently asked questions</h2>
        <div className="faq">
          {tool.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </article>

      <AdSlot slot="bottom" />

      <section>
        <h2>Related tools</h2>
        <div className="tool-grid">
          {relatedTools(tool).map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
