"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Lock, Search, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { categories, categoryVars, tools, toolsIn } from "@/lib/tools";
import { Icon } from "./Icon";
import { ToolCard } from "./ToolCard";

export function ToolBrowser() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const matches = query
    ? tools.filter((t) => `${t.name} ${t.short} ${t.category}`.toLowerCase().includes(query))
    : [];

  return (
    <>
      <div className="search">
        <Search size={22} aria-hidden />
        <input
          type="search"
          placeholder="Search tools… try “pdf”, “mortgage” or “qr”"
          aria-label="Search tools"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="badges">
        <span>
          <BadgeCheck size={18} /> 100% free
        </span>
        <span>
          <Lock size={18} /> No sign-up
        </span>
        <span>
          <ShieldCheck size={18} /> Files stay on your device
        </span>
        <span>
          <Zap size={18} /> Instant results
        </span>
      </div>

      {query ? (
        <section>
          <div className="section-head">
            <h2>
              {matches.length} result{matches.length === 1 ? "" : "s"} for “{q.trim()}”
            </h2>
          </div>
          {matches.length ? (
            <div className="tool-grid">
              {matches.map((t, i) => (
                <ToolCard key={t.slug} tool={t} index={i} />
              ))}
            </div>
          ) : (
            <p className="empty">No tools match that yet — try a different word.</p>
          )}
        </section>
      ) : (
        <>
          <nav className="chips" aria-label="Jump to category">
            {categories.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="chip"
                style={{ ...categoryVars(c.id), "--i": i } as React.CSSProperties}
              >
                <span className="tile">
                  <Icon name={c.icon} size={15} />
                </span>
                {c.name}
                <span className="count">{toolsIn(c.id).length}</span>
              </a>
            ))}
          </nav>

          {categories.map((c) => (
            <section key={c.id} id={c.id} className="cat-section" style={categoryVars(c.id)}>
              <div className="section-head">
                <span className="tile">
                  <Icon name={c.icon} size={22} />
                </span>
                <div>
                  <h2>{c.name}</h2>
                  <p>{c.description}</p>
                </div>
                <Link href={`/category/${c.id}`} className="view-all">
                  View all <ArrowRight size={16} />
                </Link>
              </div>
              <div className="tool-grid">
                {toolsIn(c.id).map((t, i) => (
                  <ToolCard key={t.slug} tool={t} index={i} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </>
  );
}
