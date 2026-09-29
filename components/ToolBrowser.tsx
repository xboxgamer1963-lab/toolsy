"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, tools, toolsIn } from "@/lib/tools";
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
        <input
          type="search"
          placeholder="Search tools… e.g. pdf, mortgage, qr"
          aria-label="Search tools"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {query ? (
        <section>
          <h2>
            {matches.length} result{matches.length === 1 ? "" : "s"}
          </h2>
          <div className="tool-grid">
            {matches.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      ) : (
        categories.map((c) => (
          <section key={c.id}>
            <div className="section-head">
              <h2>
                {c.icon} {c.name}
              </h2>
              <Link href={`/category/${c.id}`} className="small">
                View all →
              </Link>
            </div>
            <div className="tool-grid">
              {toolsIn(c.id).map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
