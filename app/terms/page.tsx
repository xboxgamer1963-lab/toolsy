import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${site.name}.`,
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <div className="container narrow content">
      <h1>Terms of Use</h1>
      <p className="muted">Last updated: September 29, 2026</p>
      <p>By using {site.name} you agree to these terms.</p>
      <h2>Use of the tools</h2>
      <p>
        The tools are provided free of charge for personal and commercial use. You are responsible for the files
        and content you process and for making sure you have the right to use them.
      </p>
      <h2>No professional advice</h2>
      <p>
        Calculators (including financial and health calculators) provide estimates for informational purposes
        only and are not financial, legal, tax or medical advice. Verify important figures with a qualified
        professional.
      </p>
      <h2>Disclaimer</h2>
      <p>
        The tools are provided "as is" without warranties of any kind. We are not liable for any loss or damage
        arising from their use, including data loss or inaccurate results.
      </p>
      <h2>Changes</h2>
      <p>We may update these terms at any time. Continued use of the site means you accept the updated terms.</p>
    </div>
  );
}
