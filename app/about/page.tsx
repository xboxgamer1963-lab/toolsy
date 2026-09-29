import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}: free, private online tools that run in your browser.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="container narrow content">
      <h1>About {site.name}</h1>
      <p>
        {site.name} is a collection of {tools.length} free online tools for everyday tasks — calculators,
        unit converters, PDF and image utilities, and text tools. We built it because too many simple tools
        are buried under sign-up walls, watermarks and upload limits.
      </p>
      <h2>Our principles</h2>
      <ul>
        <li>
          <strong>Free.</strong> Every tool is free to use. The site is supported by advertising.
        </li>
        <li>
          <strong>Private.</strong> Tools run entirely in your web browser. Files and text you enter are
          processed on your device and are never uploaded to our servers.
        </li>
        <li>
          <strong>Fast.</strong> No accounts, no waiting, no queues.
        </li>
      </ul>
      <p>
        Have a suggestion or found a bug? <Link href="/contact">Get in touch</Link>.
      </p>
    </div>
  );
}
