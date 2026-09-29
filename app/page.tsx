import { ToolBrowser } from "@/components/ToolBrowser";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  };

  return (
    <div className="container">
      <section className="hero">
        <h1>Free online tools that just work</h1>
        <p>
          {tools.length} fast, free calculators, converters, PDF, image and text tools. No sign-up, no
          watermarks — and your files never leave your device.
        </p>
      </section>
      <ToolBrowser />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
