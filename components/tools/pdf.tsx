"use client";

import { ArrowDown, ArrowUp, FileText, X } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { renderImage } from "./image";
import { FileDrop, baseName, downloadBlob, formatBytes } from "./shared";

function pdfBlob(bytes: Uint8Array) {
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

function readError(e: unknown): string {
  const msg = (e as Error)?.message ?? "";
  if (/encrypt/i.test(msg)) return "This PDF is password-protected. Remove the password first, then try again.";
  return "Sorry, this file couldn't be read as a PDF.";
}

interface Item {
  id: string;
  file: File;
}

let nextId = 0;
const toItems = (files: File[]) => files.map((file) => ({ id: String(nextId++), file }));

function FileList({ items, setItems }: { items: Item[]; setItems: (i: Item[]) => void }) {
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setItems(next);
  };
  return (
    <ul className="file-list">
      {items.map((it, i) => (
        <li key={it.id}>
          <span className="muted small" style={{ width: 20 }}>
            {i + 1}.
          </span>
          <FileText size={18} color="var(--accent)" aria-hidden />
          <span className="name">{it.file.name}</span>
          <span className="muted small">{formatBytes(it.file.size)}</span>
          <button type="button" className="btn small secondary" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
            <ArrowUp size={15} />
          </button>
          <button
            type="button"
            className="btn small secondary"
            disabled={i === items.length - 1}
            onClick={() => move(i, 1)}
            aria-label="Move down"
          >
            <ArrowDown size={15} />
          </button>
          <button
            type="button"
            className="btn small secondary"
            onClick={() => setItems(items.filter((x) => x.id !== it.id))}
            aria-label="Remove"
          >
            <X size={15} />
          </button>
        </li>
      ))}
    </ul>
  );
}

// ───────────── Merge ─────────────

export function MergePdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const merge = async () => {
    setBusy(true);
    setError("");
    try {
      const out = await PDFDocument.create();
      for (const { file } of items) {
        let src: PDFDocument;
        try {
          src = await PDFDocument.load(await file.arrayBuffer());
        } catch (e) {
          throw new Error(`${file.name}: ${readError(e)}`);
        }
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      downloadBlob(pdfBlob(await out.save()), "merged.pdf");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <FileDrop
        accept="application/pdf,.pdf"
        multiple
        onFiles={(f) => setItems([...items, ...toItems(f)])}
        label={items.length ? "Add more PDFs" : "Choose PDF files"}
      />
      <FileList items={items} setItems={setItems} />
      {error && <p className="error">{error}</p>}
      <button type="button" className="btn" disabled={items.length < 2 || busy} onClick={merge}>
        {busy ? "Merging…" : items.length < 2 ? "Add at least 2 PDFs" : `Merge ${items.length} PDFs`}
      </button>
    </div>
  );
}

// ───────────── Split ─────────────

/** Parse "1-3, 5, 8-" into zero-based page indices. */
export function parseRanges(input: string, pageCount: number): number[] | string {
  const out: number[] = [];
  for (const raw of input.split(",")) {
    const part = raw.trim();
    if (!part) continue;
    const m = /^(\d*)\s*-\s*(\d*)$/.exec(part);
    let a: number;
    let b: number;
    if (m) {
      a = m[1] ? +m[1] : 1;
      b = m[2] ? +m[2] : pageCount;
    } else if (/^\d+$/.test(part)) {
      a = b = +part;
    } else {
      return `"${part}" isn't a valid page or range.`;
    }
    if (a < 1 || b > pageCount || a > b) return `"${part}" is outside pages 1–${pageCount}.`;
    for (let i = a; i <= b; i++) out.push(i - 1);
  }
  return out.length ? out : "Enter at least one page.";
}

export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<PDFDocument | null>(null);
  const [ranges, setRanges] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onFiles = async ([f]: File[]) => {
    setError("");
    try {
      const d = await PDFDocument.load(await f.arrayBuffer());
      setFile(f);
      setDoc(d);
      setRanges(`1-${Math.min(d.getPageCount(), 3)}`);
    } catch (e) {
      setError(readError(e));
    }
  };

  if (!file || !doc) {
    return (
      <>
        <FileDrop accept="application/pdf,.pdf" onFiles={onFiles} label="Choose a PDF file" />
        {error && <p className="error">{error}</p>}
      </>
    );
  }

  const count = doc.getPageCount();
  const parsed = parseRanges(ranges, count);

  const extract = async () => {
    if (typeof parsed === "string") return;
    setBusy(true);
    try {
      const out = await PDFDocument.create();
      const pages = await out.copyPages(doc, parsed);
      pages.forEach((p) => out.addPage(p));
      downloadBlob(pdfBlob(await out.save()), `${baseName(file.name)}-pages.pdf`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack">
      <p className="small muted" style={{ margin: 0 }}>
        {file.name} · {count} page{count === 1 ? "" : "s"} · {formatBytes(file.size)}
      </p>
      <label className="field">
        <span>Pages to extract</span>
        <input type="text" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="e.g. 1-3, 5, 8-10" />
      </label>
      <div className="btn-row">
        <button type="button" className="btn small secondary" onClick={() => setRanges("1")}>
          First page
        </button>
        <button
          type="button"
          className="btn small secondary"
          onClick={() => setRanges(Array.from({ length: count }, (_, i) => i + 1).filter((n) => n % 2).join(", "))}
        >
          Odd pages
        </button>
        <button
          type="button"
          className="btn small secondary"
          disabled={count < 2}
          onClick={() => setRanges(Array.from({ length: count }, (_, i) => i + 1).filter((n) => n % 2 === 0).join(", "))}
        >
          Even pages
        </button>
      </div>
      {typeof parsed === "string" ? (
        <p className="error">{parsed}</p>
      ) : (
        <p className="small muted">
          New PDF will have {parsed.length} page{parsed.length === 1 ? "" : "s"}.
        </p>
      )}
      <div className="btn-row">
        <button type="button" className="btn" disabled={typeof parsed === "string" || busy} onClick={extract}>
          {busy ? "Extracting…" : "Extract pages"}
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={() => {
            setFile(null);
            setDoc(null);
          }}
        >
          Choose another PDF
        </button>
      </div>
    </div>
  );
}

// ───────────── Images to PDF ─────────────

const PAGE_SIZES: Record<string, [number, number] | null> = {
  letter: [612, 792],
  a4: [595.28, 841.89],
  fit: null,
};

function loadImg(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`${file.name} couldn't be read as an image.`));
    };
    img.src = url;
  });
}

export function JpgToPdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [size, setSize] = useState("letter");
  const [margin, setMargin] = useState("36");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const pdf = await PDFDocument.create();
      const m = Math.max(0, parseFloat(margin) || 0);
      for (const { file } of items) {
        const img = await loadImg(file);
        // Re-encode through canvas so every browser-readable format works.
        const blob = await renderImage(img, img.naturalWidth, img.naturalHeight, "image/jpeg", 0.92);
        const jpg = await pdf.embedJpg(await blob.arrayBuffer());
        const fixed = PAGE_SIZES[size];
        if (!fixed) {
          const page = pdf.addPage([jpg.width + 2 * m, jpg.height + 2 * m]);
          page.drawImage(jpg, { x: m, y: m, width: jpg.width, height: jpg.height });
          continue;
        }
        // Rotate the page to landscape for wide images.
        const [pw, ph] = jpg.width > jpg.height ? [fixed[1], fixed[0]] : fixed;
        const page = pdf.addPage([pw, ph]);
        const scale = Math.min((pw - 2 * m) / jpg.width, (ph - 2 * m) / jpg.height, 1);
        const w = jpg.width * scale;
        const h = jpg.height * scale;
        page.drawImage(jpg, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
      }
      downloadBlob(pdfBlob(await pdf.save()), items.length === 1 ? `${baseName(items[0].file.name)}.pdf` : "images.pdf");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <FileDrop
        accept="image/*"
        multiple
        onFiles={(f) => setItems([...items, ...toItems(f)])}
        label={items.length ? "Add more images" : "Choose images"}
        hint="JPG, PNG, WebP… or drag and drop"
      />
      <FileList items={items} setItems={setItems} />
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <label className="field">
          <span>Page size</span>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="letter">US Letter (8.5 × 11 in)</option>
            <option value="a4">A4</option>
            <option value="fit">Same as image</option>
          </select>
        </label>
        <label className="field">
          <span>Margin</span>
          <select value={margin} onChange={(e) => setMargin(e.target.value)}>
            <option value="0">None</option>
            <option value="18">Small (0.25 in)</option>
            <option value="36">Medium (0.5 in)</option>
            <option value="72">Large (1 in)</option>
          </select>
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <button type="button" className="btn" disabled={!items.length || busy} onClick={create}>
        {busy ? "Creating PDF…" : `Create PDF${items.length ? ` (${items.length} image${items.length === 1 ? "" : "s"})` : ""}`}
      </button>
    </div>
  );
}
