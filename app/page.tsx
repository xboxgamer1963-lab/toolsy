import { Gauge, MonitorSmartphone, ShieldCheck, Sparkles } from "lucide-react";
import { ToolBrowser } from "@/components/ToolBrowser";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools";

const features = [
  {
    icon: ShieldCheck,
    colors: ["#10b981", "#06b6d4"],
    title: "Private by design",
    text: "Every tool runs in your browser. Your PDFs, photos and text are never uploaded anywhere.",
  },
  {
    icon: Gauge,
    colors: ["#f59e0b", "#f43f5e"],
    title: "Lightning fast",
    text: "No queues, no waiting for servers. Results update instantly as you type.",
  },
  {
    icon: Sparkles,
    colors: ["#8b5cf6", "#ec4899"],
    title: "Free, no sign-up",
    text: "No accounts, no watermarks, no daily limits. Just open a tool and use it.",
  },
  {
    icon: MonitorSmartphone,
    colors: ["#3b82f6", "#6366f1"],
    title: "Works everywhere",
    text: "Designed for phones, tablets and desktops — on any modern browser.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  };

  return (
    <>
      <section className="hero">
        <div className="blobs" aria-hidden>
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
        </div>
        <div className="container">
          <span className="eyebrow">
            <span className="dot">
              <Sparkles size={13} strokeWidth={2.5} />
            </span>
            {tools.length} free tools · no sign-up
          </span>
          <h1>
            Everyday tools that <span className="gradient-text">just work</span>
          </h1>
          <p className="sub">
            Calculators, converters, PDF, image and text tools — fast, free, and private. Nothing to install and
            nothing to upload.
          </p>
          <ToolBrowser />
        </div>
      </section>

      <section className="container">
        <div className="section-head" style={{ justifyContent: "center", textAlign: "center" }}>
          <h2>
            Why people love <span className="gradient-text">{site.name}</span>
          </h2>
        </div>
        <div className="features">
          {features.map(({ icon: I, colors, title, text }) => (
            <div
              key={title}
              className="feature"
              style={{ "--c1": colors[0], "--c2": colors[1] } as React.CSSProperties}
            >
              <span className="tile">
                <I size={22} aria-hidden />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
