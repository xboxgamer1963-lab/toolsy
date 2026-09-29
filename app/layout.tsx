import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import { adsense, site } from "@/lib/site";
import { categories, toolsIn } from "@/lib/tools";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
  twitter: { card: "summary" },
  // Lets AdSense verify site ownership during review.
  other: adsense.client ? { "google-adsense-account": adsense.client } : {},
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171b23" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="logo">
              <span className="logo-mark" aria-hidden>
                T
              </span>
              {site.name}
            </Link>
            <nav className="nav" aria-label="Categories">
              {categories.map((c) => (
                <Link key={c.id} href={`/category/${c.id}`}>
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container">
            <div className="footer-grid">
              {categories.map((c) => (
                <div key={c.id}>
                  <h4>{c.name}</h4>
                  <ul>
                    {toolsIn(c.id).map((t) => (
                      <li key={t.slug}>
                        <Link href={`/${t.slug}`}>{t.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <h4>{site.name}</h4>
                <ul>
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                  <li>
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms">Terms of Use</Link>
                  </li>
                </ul>
              </div>
            </div>
            <p style={{ marginTop: 24 }}>
              © {new Date().getFullYear()} {site.name}. Free tools, no sign-up.
            </p>
          </div>
        </footer>

        {adsense.client && (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`}
          />
        )}
      </body>
    </html>
  );
}
