import Link from "next/link";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/${tool.slug}`} className="tool-card">
      <span className="icon" aria-hidden>
        {tool.icon}
      </span>
      <div>
        <strong>{tool.name}</strong>
        <span>{tool.short}</span>
      </div>
    </Link>
  );
}
