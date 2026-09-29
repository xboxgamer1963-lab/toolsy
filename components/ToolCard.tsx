import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryVars, type Tool } from "@/lib/tools";
import { Icon } from "./Icon";

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="tool-card"
      style={{ ...categoryVars(tool.category), "--i": index } as React.CSSProperties}
    >
      <span className="tile">
        <Icon name={tool.icon} size={22} />
      </span>
      <div>
        <strong>{tool.name}</strong>
        <span className="desc">{tool.short}</span>
      </div>
      <ArrowRight className="arrow" size={18} aria-hidden />
    </Link>
  );
}
