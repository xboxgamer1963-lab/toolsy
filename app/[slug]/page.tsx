import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronRight, CircleHelp, ListChecks, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { Icon } from "@/components/Icon";
import { ToolCard } from "@/components/ToolCard";
import { toolComponents } from "@/components/tools";
import { site } from "@/lib/site";
import { categoryVars, getCategory, relatedTools, tools, toolsBySlug } from "@/lib/tools";

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
    <div className="themed" style={categoryVars(tool.category)}>
      <section className="page-hero">
        <div className="blobs" aria-hidden>
          <span className="blob b1" />
          <span className="blob b2" />
        </div>
        <div className="container narrow">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={14} aria-hidden />
            <Link href={`/category/${category.id}`}>{category.name}</Link>
            <ChevronRight size={14} aria-hidden />
            <span>{tool.name}</span>
          </nav>
          <div className="title-row">
            <span className="tile lg">
              <Icon name={tool.icon} size={34} />
            </span>
            <h1>{tool.name}</h1>
          </div>
          <p className="lead">{tool.intro}</p>
          <div className="badges">
            <span>
              <BadgeCheck size={18} /> Free
            </span>
            <span>
              <Lock size={18} /> No sign-up
            </span>
            <span>
              <ShieldCheck size={18} /> Runs in your browser
            </span>
          </div>
        </div>
      </section>

      <div className="container narrow">
        <div className="panel">
          <Component />
        </div>

        <AdSlot slot="top" />

        <article className="content">
          <h2>
            <ListChecks size={24} color="var(--accent)" aria-hidden /> How to use the {tool.name}
          </h2>
          <ol className="steps">
            {tool.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>

          <h2>
            <CircleHelp size={24} color="var(--accent)" aria-hidden /> Frequently asked questions
          </h2>
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
          <h2 style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={24} color="var(--accent)" aria-hidden /> More free tools
          </h2>
          <div className="tool-grid">
            {relatedTools(tool).map((t, i) => (
              <ToolCard key={t.slug} tool={t} index={i} />
            ))}
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
