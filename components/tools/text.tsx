"use client";

import { Download, RefreshCw } from "lucide-react";
import QRCode from "qrcode";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CopyButton, Stat, Tabs, downloadBlob, fmt } from "./shared";

// ───────────── Word counter ─────────────

export function WordCounter() {
  const [text, setText] = useState("");

  const s = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const sentences = trimmed ? trimmed.split(/[.!?]+(?:\s|$)/).filter((x) => x.trim()).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((x) => x.trim()).length : 0;
    const freq = new Map<string, number>();
    for (const w of words) {
      const k = w.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, "");
      if (k.length > 3) freq.set(k, (freq.get(k) ?? 0) + 1);
    }
    const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    return {
      words: words.length,
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, "").length,
      sentences,
      paragraphs,
      reading: words.length / 238,
      speaking: words.length / 150,
      top,
    };
  }, [text]);

  const minutes = (m: number) => (m < 1 ? `${Math.ceil(m * 60)} sec` : `${Math.round(m)} min`);

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here…"
        aria-label="Text to count"
        style={{ minHeight: 240 }}
      />
      <div className="stats">
        <Stat primary k="Words" v={fmt(s.words)} />
        <Stat k="Characters" v={fmt(s.chars)} />
        <Stat k="Characters (no spaces)" v={fmt(s.charsNoSpace)} />
        <Stat k="Sentences" v={fmt(s.sentences)} />
        <Stat k="Paragraphs" v={fmt(s.paragraphs)} />
        <Stat k="Reading time" v={s.words ? minutes(s.reading) : "—"} />
        <Stat k="Speaking time" v={s.words ? minutes(s.speaking) : "—"} />
      </div>
      {s.top.length > 0 && (
        <>
          <h3>Top keywords</h3>
          <div className="btn-row">
            {s.top.map(([w, c]) => (
              <span key={w} className="stat small" style={{ padding: "6px 10px" }}>
                {w} <span className="muted">×{c}</span>
              </span>
            ))}
          </div>
        </>
      )}
      <div className="btn-row" style={{ marginTop: 16 }}>
        <CopyButton text={text} label="Copy text" />
        <button type="button" className="btn secondary" onClick={() => setText("")} disabled={!text}>
          Clear
        </button>
      </div>
    </div>
  );
}

// ───────────── Case converter ─────────────

const SMALL_WORDS = new Set(
  "a an and as at but by for from in into nor of on or over the to up via with".split(" "),
);

function words(s: string) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

const CASES: [string, (s: string) => string][] = [
  ["UPPERCASE", (s) => s.toUpperCase()],
  ["lowercase", (s) => s.toLowerCase()],
  [
    "Title Case",
    (s) =>
      s
        .toLowerCase()
        .replace(/\S+/g, (w, i: number) =>
          i !== 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1),
        ),
  ],
  [
    "Sentence case",
    (s) => s.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (m) => m.toUpperCase()),
  ],
  [
    "Capitalize Each Word",
    (s) => s.toLowerCase().replace(/(^|\s)(\p{L})/gu, (_m, a: string, b: string) => a + b.toUpperCase()),
  ],
  [
    "aLtErNaTiNg",
    (s) => {
      let i = 0;
      return s.replace(/\p{L}/gu, (c) => (i++ % 2 ? c.toUpperCase() : c.toLowerCase()));
    },
  ],
  [
    "camelCase",
    (s) =>
      words(s)
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join(""),
  ],
  ["PascalCase", (s) => words(s).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("")],
  ["snake_case", (s) => words(s).map((w) => w.toLowerCase()).join("_")],
  ["kebab-case", (s) => words(s).map((w) => w.toLowerCase()).join("-")],
  ["CONSTANT_CASE", (s) => words(s).map((w) => w.toUpperCase()).join("_")],
];

export function CaseConverter() {
  const [text, setText] = useState("");
  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        aria-label="Text to convert"
      />
      <div className="btn-row" style={{ marginTop: 12 }}>
        {CASES.map(([label, fn]) => (
          <button key={label} type="button" className="btn secondary small" onClick={() => setText(fn(text))}>
            {label}
          </button>
        ))}
      </div>
      <div className="btn-row" style={{ marginTop: 12 }}>
        <CopyButton text={text} />
        <button type="button" className="btn secondary" onClick={() => setText("")} disabled={!text}>
          Clear
        </button>
      </div>
    </div>
  );
}

// ───────────── Password generator ─────────────

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~",
};
const AMBIGUOUS = /[Il1O0o]/g;

function secureRandom(max: number): number {
  // Rejection sampling to avoid modulo bias.
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  do crypto.getRandomValues(buf);
  while (buf[0] >= limit);
  return buf[0] % max;
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: true, avoidAmbiguous: false });
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    const pools = (Object.keys(SETS) as (keyof typeof SETS)[])
      .filter((k) => opts[k])
      .map((k) => (opts.avoidAmbiguous ? SETS[k].replace(AMBIGUOUS, "") : SETS[k]));
    if (!pools.length) {
      setPassword("");
      return;
    }
    const all = pools.join("");
    // Guarantee at least one character from each selected set.
    const chars = pools.map((p) => p[secureRandom(p.length)]);
    while (chars.length < length) chars.push(all[secureRandom(all.length)]);
    for (let i = chars.length - 1; i > 0; i--) {
      const j = secureRandom(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    setPassword(chars.slice(0, length).join(""));
  }, [length, opts]);

  useEffect(generate, [generate]);

  const poolSize = (Object.keys(SETS) as (keyof typeof SETS)[])
    .filter((k) => opts[k])
    .reduce((n, k) => n + (opts.avoidAmbiguous ? SETS[k].replace(AMBIGUOUS, "") : SETS[k]).length, 0);
  const entropy = poolSize ? Math.round(length * Math.log2(poolSize)) : 0;
  const [strength, color] =
    entropy >= 100
      ? ["Very strong", "var(--good)"]
      : entropy >= 70
        ? ["Strong", "var(--good)"]
        : entropy >= 50
          ? ["Fair", "var(--warn)"]
          : ["Weak", "var(--bad)"];

  const toggle = (k: keyof typeof opts) => setOpts({ ...opts, [k]: !opts[k] });

  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: "1.35rem",
          padding: "14px 16px",
          background: "var(--surface-2)",
          borderRadius: 10,
          wordBreak: "break-all",
          minHeight: 58,
        }}
        aria-live="polite"
      >
        {password || <span className="muted">Select at least one character type</span>}
      </div>
      <p className="small" style={{ margin: "8px 0 16px" }}>
        Strength: <strong style={{ color }}>{strength}</strong> <span className="muted">(~{entropy} bits)</span>
      </p>
      <div className="btn-row">
        <CopyButton text={password} />
        <button type="button" className="btn secondary" onClick={generate}>
          <RefreshCw size={16} /> Generate new
        </button>
      </div>

      <label className="field" style={{ marginTop: 20 }}>
        <span>Length: {length}</span>
        <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(+e.target.value)} />
      </label>
      <div className="grid-2" style={{ marginTop: 12 }}>
        <label className="check">
          <input type="checkbox" checked={opts.upper} onChange={() => toggle("upper")} /> Uppercase (A–Z)
        </label>
        <label className="check">
          <input type="checkbox" checked={opts.lower} onChange={() => toggle("lower")} /> Lowercase (a–z)
        </label>
        <label className="check">
          <input type="checkbox" checked={opts.digits} onChange={() => toggle("digits")} /> Numbers (0–9)
        </label>
        <label className="check">
          <input type="checkbox" checked={opts.symbols} onChange={() => toggle("symbols")} /> Symbols (!@#…)
        </label>
        <label className="check">
          <input type="checkbox" checked={opts.avoidAmbiguous} onChange={() => toggle("avoidAmbiguous")} /> Avoid
          look-alikes (I, l, 1, O, 0)
        </label>
      </div>
    </div>
  );
}

// ───────────── QR code ─────────────

function escapeWifi(s: string) {
  return s.replace(/([\\;,":])/g, "\\$1");
}

export function QrCodeGenerator() {
  const [mode, setMode] = useState<"text" | "wifi">("text");
  const [text, setText] = useState("https://example.com");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [security, setSecurity] = useState("WPA");
  const [size, setSize] = useState(512);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [ecl, setEcl] = useState<"L" | "M" | "Q" | "H">("M");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  const content =
    mode === "text"
      ? text
      : ssid
        ? `WIFI:T:${security === "nopass" ? "nopass" : security};S:${escapeWifi(ssid)};${
            security === "nopass" ? "" : `P:${escapeWifi(wifiPass)};`
          };`
        : "";

  const options = useMemo(
    () => ({ width: size, margin: 2, errorCorrectionLevel: ecl, color: { dark: fg, light: bg } }),
    [size, ecl, fg, bg],
  );

  useEffect(() => {
    if (!content) {
      setDataUrl("");
      setError("");
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(content, options)
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setError("");
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setDataUrl("");
          setError(e.message.includes("too big") ? "That's too much data for a QR code." : e.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [content, options]);

  const downloadPng = async () => {
    const blob = await (await fetch(dataUrl)).blob();
    downloadBlob(blob, "qr-code.png");
  };
  const downloadSvg = async () => {
    const svg = await QRCode.toString(content, { ...options, type: "svg" });
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "qr-code.svg");
  };

  return (
    <div className="grid-2" style={{ alignItems: "start" }}>
      <div className="stack">
        <Tabs
          value={mode}
          onChange={setMode}
          options={[
            ["text", "URL / Text"],
            ["wifi", "Wi-Fi"],
          ]}
        />
        {mode === "text" ? (
          <label className="field">
            <span>URL or text</span>
            <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ minHeight: 110 }} />
          </label>
        ) : (
          <>
            <label className="field">
              <span>Network name (SSID)</span>
              <input type="text" value={ssid} onChange={(e) => setSsid(e.target.value)} />
            </label>
            <label className="field">
              <span>Security</span>
              <select value={security} onChange={(e) => setSecurity(e.target.value)}>
                <option value="WPA">WPA/WPA2/WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (open)</option>
              </select>
            </label>
            {security !== "nopass" && (
              <label className="field">
                <span>Password</span>
                <input type="text" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} />
              </label>
            )}
          </>
        )}
        <div className="grid-2">
          <label className="field">
            <span>Foreground</span>
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} />
          </label>
          <label className="field">
            <span>Background</span>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
          </label>
        </div>
        <div className="grid-2">
          <label className="field">
            <span>Size</span>
            <select value={size} onChange={(e) => setSize(+e.target.value)}>
              {[256, 512, 1024, 2048].map((s) => (
                <option key={s} value={s}>
                  {s} × {s} px
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Error correction</span>
            <select value={ecl} onChange={(e) => setEcl(e.target.value as typeof ecl)}>
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </label>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="Generated QR code" style={{ width: "100%", maxWidth: 300, borderRadius: 8 }} />
        ) : (
          <div className="dropzone" style={{ cursor: "default", aspectRatio: "1", maxWidth: 300, margin: "0 auto" }}>
            <span className="muted">{error || "Your QR code will appear here"}</span>
          </div>
        )}
        <div className="btn-row" style={{ justifyContent: "center", marginTop: 14 }}>
          <button type="button" className="btn" disabled={!dataUrl} onClick={downloadPng}>
            <Download size={17} /> PNG
          </button>
          <button type="button" className="btn secondary" disabled={!dataUrl} onClick={downloadSvg}>
            <Download size={17} /> SVG
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────── JSON formatter ─────────────

function locateError(input: string, message: string): string {
  const m = /position (\d+)/.exec(message);
  // Some browsers already report line/column.
  if (!m || /line \d+/.test(message)) return message;
  const pos = +m[1];
  const before = input.slice(0, pos);
  const line = before.split("\n").length;
  const col = pos - before.lastIndexOf("\n");
  return `${message} (line ${line}, column ${col})`;
}

export function JsonFormatter() {
  const [input, setInput] = useState('{"name":"Toolsy","tools":["json","qr"],"free":true}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState("2");

  const run = (minify: boolean) => {
    try {
      const parsed = JSON.parse(input);
      const space = indent === "tab" ? "\t" : Number(indent);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, space));
      setError("");
    } catch (e) {
      setOutput("");
      setError(locateError(input, (e as Error).message));
    }
  };

  return (
    <div className="stack">
      <label className="field">
        <span>Input JSON</span>
        <textarea className="mono" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </label>
      <div className="btn-row" style={{ alignItems: "center" }}>
        <button type="button" className="btn" onClick={() => run(false)}>
          Format
        </button>
        <button type="button" className="btn secondary" onClick={() => run(true)}>
          Minify
        </button>
        <select value={indent} onChange={(e) => setIndent(e.target.value)} style={{ width: 140 }} aria-label="Indent">
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="tab">Tabs</option>
        </select>
      </div>
      {error && <p className="error">✗ Invalid JSON: {error}</p>}
      {output && (
        <>
          <p className="small" style={{ color: "var(--good)", margin: 0 }}>
            ✓ Valid JSON
          </p>
          <label className="field">
            <span>Output</span>
            <textarea className="mono" value={output} readOnly spellCheck={false} />
          </label>
          <div className="btn-row">
            <CopyButton text={output} />
            <button
              type="button"
              className="btn secondary"
              onClick={() => downloadBlob(new Blob([output], { type: "application/json" }), "formatted.json")}
            >
              <Download size={17} /> Download .json
            </button>
          </div>
        </>
      )}
    </div>
  );
}
