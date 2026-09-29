import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Sparkles } from "lucide-react";
import { Icon } from "@/components/Icon";
import { adsense, site } from "@/lib/site";
import { categories, categoryVars, toolsIn } from "@/lib/tools";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

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
  themeColor: "#f8f7ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="logo">
              <span className="logo-mark" aria-hidden>
                <Sparkles size={18} strokeWidth={2.5} />
              </span>
              {site.name}
            </Link>
            <nav className="nav" aria-label="Categories">
              {categories.map((c) => (
                <Link key={c.id} href={`/category/${c.id}`} style={categoryVars(c.id)}>
                  <Icon name={c.icon} size={16} />
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
              <div className="footer-brand">
                <Link href="/" className="logo">
                  <span className="logo-mark" aria-hidden>
                    <Sparkles size={18} strokeWidth={2.5} />
                  </span>
                  {site.name}
                </Link>
                <p>{site.description}</p>
              </div>
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
            </div>
            <div className="footer-bottom">
              <span>
                © {new Date().getFullYear()} {site.name}. Free tools, no sign-up.
              </span>
              <span className="btn-row" style={{ gap: 16 }}>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
              </span>
            </div>
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
