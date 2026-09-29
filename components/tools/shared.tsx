"use client";

import { Check, CloudUpload, Copy } from "lucide-react";
import { useRef, useState } from "react";

export const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function fmt(n: number, maxDigits = 6): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: maxDigits });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** Parse a user-typed number, tolerating commas and "$" / "%". */
export function num(value: string): number {
  const n = parseFloat(value.replace(/[,$%\s]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

export function NumberField({
  label,
  value,
  onChange,
  step = "any",
  min,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
  min?: number;
  suffix?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {suffix ? ` (${suffix})` : ""}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function Stat({ k, v, primary }: { k: string; v: React.ReactNode; primary?: boolean }) {
  return (
    <div className={`stat${primary ? " primary" : ""}`}>
      <div className="k">{k}</div>
      {/* Re-keying on the value replays the pop animation whenever the result changes. */}
      <div className="v" key={typeof v === "string" ? v : undefined}>
        {v}
      </div>
    </div>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div className="tabs" role="group">
      {options.map(([id, label]) => (
        <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn secondary"
      disabled={!text}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check size={17} /> : <Copy size={17} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

export function FileDrop({
  accept,
  multiple,
  onFiles,
  label,
  hint,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label: string;
  hint?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div
      className={`dropzone${over ? " over" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => input.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          input.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
    >
      <span className="tile">
        <CloudUpload size={28} />
      </span>
      <strong>{label}</strong>
      <span className="muted small">{hint ?? "or drag and drop here"}</span>
      <span className="btn small choose">Browse files</span>
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/** Monthly payment for a fixed-rate amortizing loan. */
export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  if (months <= 0) return NaN;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}
