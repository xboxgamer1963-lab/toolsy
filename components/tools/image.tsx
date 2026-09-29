"use client";

import { useEffect, useState } from "react";
import { FileDrop, Stat, baseName, downloadBlob, formatBytes } from "./shared";

type Format = "image/jpeg" | "image/png" | "image/webp";
const EXT: Record<Format, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

interface Loaded {
  file: File;
  img: HTMLImageElement;
  url: string;
}

function loadImage(file: File): Promise<Loaded> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ file, img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This file couldn't be read as an image."));
    };
    img.src = url;
  });
}

/** Draw an image to a canvas at the given size and encode it. */
export function renderImage(
  img: HTMLImageElement,
  width: number,
  height: number,
  type: Format,
  quality: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d")!;
  if (type === "image/jpeg") {
    // JPEG has no alpha channel — fill transparent areas with white.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Encoding failed."))), type, quality),
  );
}

function useImage() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (loaded) URL.revokeObjectURL(loaded.url);
  }, [loaded]);

  const onFiles = async (files: File[]) => {
    try {
      setError("");
      setLoaded(await loadImage(files[0]));
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return { loaded, error, onFiles, reset: () => setLoaded(null) };
}

function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!blob) return setUrl("");
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}

function Drop({ onFiles, error }: { onFiles: (f: File[]) => void; error: string }) {
  return (
    <>
      <FileDrop accept="image/*" onFiles={onFiles} label="Choose an image" hint="JPG, PNG, WebP, GIF… or drag and drop" />
      {error && <p className="error">{error}</p>}
    </>
  );
}

function FormatSelect({ value, onChange }: { value: Format; onChange: (f: Format) => void }) {
  return (
    <label className="field">
      <span>Output format</span>
      <select value={value} onChange={(e) => onChange(e.target.value as Format)}>
        <option value="image/jpeg">JPG</option>
        <option value="image/png">PNG</option>
        <option value="image/webp">WebP</option>
      </select>
    </label>
  );
}

function defaultFormat(file: File): Format {
  return file.type === "image/png" || file.type === "image/webp" ? (file.type as Format) : "image/jpeg";
}

// ───────────── Compressor ─────────────

export function ImageCompressor() {
  const { loaded, error, onFiles, reset } = useImage();
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [quality, setQuality] = useState(75);
  const [maxWidth, setMaxWidth] = useState("");
  const [out, setOut] = useState<Blob | null>(null);
  const outUrl = useObjectUrl(out);

  useEffect(() => {
    if (loaded) setFormat(loaded.file.type === "image/webp" ? "image/webp" : "image/jpeg");
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return setOut(null);
    let cancelled = false;
    const { img } = loaded;
    const mw = parseInt(maxWidth, 10);
    const scale = mw > 0 && mw < img.naturalWidth ? mw / img.naturalWidth : 1;
    const t = setTimeout(async () => {
      const blob = await renderImage(img, img.naturalWidth * scale, img.naturalHeight * scale, format, quality / 100);
      if (!cancelled) setOut(blob);
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [loaded, format, quality, maxWidth]);

  if (!loaded) return <Drop onFiles={onFiles} error={error} />;

  const saved = out ? 1 - out.size / loaded.file.size : 0;

  return (
    <div>
      <div className="grid-3">
        <FormatSelect value={format} onChange={setFormat} />
        <label className="field">
          <span>Quality: {quality}%</span>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            disabled={format === "image/png"}
            onChange={(e) => setQuality(+e.target.value)}
          />
        </label>
        <label className="field">
          <span>Max width (px, optional)</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(loaded.img.naturalWidth)}
            value={maxWidth}
            onChange={(e) => setMaxWidth(e.target.value)}
          />
        </label>
      </div>
      {format === "image/png" && (
        <p className="small muted">PNG is lossless, so quality doesn&apos;t apply. Choose JPG or WebP for smaller files.</p>
      )}
      <div className="stats">
        <Stat k="Original" v={formatBytes(loaded.file.size)} />
        <Stat k="Compressed" v={out ? formatBytes(out.size) : "…"} />
        <Stat
          primary
          k="Saved"
          v={out ? (saved > 0 ? `${Math.round(saved * 100)}%` : <span style={{ color: "var(--warn)" }}>0%</span>) : "…"}
        />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {outUrl && <img className="preview" src={outUrl} alt="Compressed preview" />}
      <div className="btn-row" style={{ marginTop: 16 }}>
        <button
          type="button"
          className="btn"
          disabled={!out}
          onClick={() => out && downloadBlob(out, `${baseName(loaded.file.name)}-compressed.${EXT[format]}`)}
        >
          Download
        </button>
        <button type="button" className="btn secondary" onClick={reset}>
          Choose another image
        </button>
      </div>
    </div>
  );
}

// ───────────── Resizer ─────────────

export function ImageResizer() {
  const { loaded, error, onFiles, reset } = useImage();
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    setW(String(loaded.img.naturalWidth));
    setH(String(loaded.img.naturalHeight));
    setFormat(defaultFormat(loaded.file));
  }, [loaded]);

  if (!loaded) return <Drop onFiles={onFiles} error={error} />;

  const { img, file } = loaded;
  const ratio = img.naturalWidth / img.naturalHeight;

  const setWidth = (v: string) => {
    setW(v);
    const n = parseFloat(v);
    if (lock && n > 0) setH(String(Math.round(n / ratio)));
  };
  const setHeight = (v: string) => {
    setH(v);
    const n = parseFloat(v);
    if (lock && n > 0) setW(String(Math.round(n * ratio)));
  };
  const setPct = (p: number) => {
    setW(String(Math.round((img.naturalWidth * p) / 100)));
    setH(String(Math.round((img.naturalHeight * p) / 100)));
  };

  const width = parseInt(w, 10);
  const height = parseInt(h, 10);
  const valid = width > 0 && height > 0 && width <= 16384 && height <= 16384;

  const download = async () => {
    setBusy(true);
    try {
      const blob = await renderImage(img, width, height, format, 0.92);
      downloadBlob(blob, `${baseName(file.name)}-${width}x${height}.${EXT[format]}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="small muted" style={{ marginTop: 0 }}>
        Original: {img.naturalWidth} × {img.naturalHeight} px · {formatBytes(file.size)}
      </p>
      <div className="grid-3">
        <label className="field">
          <span>Width (px)</span>
          <input type="number" inputMode="numeric" value={w} onChange={(e) => setWidth(e.target.value)} />
        </label>
        <label className="field">
          <span>Height (px)</span>
          <input type="number" inputMode="numeric" value={h} onChange={(e) => setHeight(e.target.value)} />
        </label>
        <FormatSelect value={format} onChange={setFormat} />
      </div>
      <div className="btn-row" style={{ marginTop: 12, alignItems: "center" }}>
        <label className="check">
          <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> Keep aspect ratio
        </label>
        {[25, 50, 75, 150, 200].map((p) => (
          <button key={p} type="button" className="btn small secondary" onClick={() => setPct(p)}>
            {p}%
          </button>
        ))}
      </div>
      {!valid && <p className="error">Enter a width and height between 1 and 16384 px.</p>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="preview" src={loaded.url} alt="Original preview" />
      <div className="btn-row" style={{ marginTop: 16 }}>
        <button type="button" className="btn" disabled={!valid || busy} onClick={download}>
          {busy ? "Resizing…" : `Download ${valid ? `${width} × ${height}` : ""}`}
        </button>
        <button type="button" className="btn secondary" onClick={reset}>
          Choose another image
        </button>
      </div>
    </div>
  );
}

// ───────────── Converter ─────────────

export function ImageConverter() {
  const { loaded, error, onFiles, reset } = useImage();
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loaded) setFormat(loaded.file.type === "image/jpeg" ? "image/png" : "image/jpeg");
  }, [loaded]);

  if (!loaded) return <Drop onFiles={onFiles} error={error} />;

  const convert = async () => {
    setBusy(true);
    try {
      const { img, file } = loaded;
      const blob = await renderImage(img, img.naturalWidth, img.naturalHeight, format, 0.92);
      downloadBlob(blob, `${baseName(file.name)}.${EXT[format]}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="small muted" style={{ marginTop: 0 }}>
        {loaded.file.name} · {loaded.file.type || "unknown type"} · {formatBytes(loaded.file.size)}
      </p>
      <div className="grid-2">
        <FormatSelect value={format} onChange={setFormat} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="preview" src={loaded.url} alt="Preview" />
      <div className="btn-row" style={{ marginTop: 16 }}>
        <button type="button" className="btn" disabled={busy} onClick={convert}>
          {busy ? "Converting…" : `Convert to ${EXT[format].toUpperCase()} & download`}
        </button>
        <button type="button" className="btn secondary" onClick={reset}>
          Choose another image
        </button>
      </div>
    </div>
  );
}
