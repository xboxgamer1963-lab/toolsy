"use client";

import { useEffect, useMemo, useState } from "react";
import { fmt, num } from "./shared";

// ───────────── Unit converter ─────────────

type UnitDef = [id: string, label: string, toBase: number];

const UNITS: Record<string, { label: string; units: UnitDef[]; from: string; to: string }> = {
  length: {
    label: "Length",
    from: "in",
    to: "cm",
    units: [
      ["mm", "Millimeters", 0.001],
      ["cm", "Centimeters", 0.01],
      ["m", "Meters", 1],
      ["km", "Kilometers", 1000],
      ["in", "Inches", 0.0254],
      ["ft", "Feet", 0.3048],
      ["yd", "Yards", 0.9144],
      ["mi", "Miles", 1609.344],
      ["nmi", "Nautical miles", 1852],
    ],
  },
  weight: {
    label: "Weight",
    from: "lb",
    to: "kg",
    units: [
      ["mg", "Milligrams", 0.000001],
      ["g", "Grams", 0.001],
      ["kg", "Kilograms", 1],
      ["t", "Metric tons", 1000],
      ["oz", "Ounces", 0.028349523125],
      ["lb", "Pounds", 0.45359237],
      ["st", "Stone", 6.35029318],
      ["ton", "US tons", 907.18474],
    ],
  },
  volume: {
    label: "Volume",
    from: "gal",
    to: "l",
    units: [
      ["ml", "Milliliters", 0.001],
      ["l", "Liters", 1],
      ["m3", "Cubic meters", 1000],
      ["tsp", "Teaspoons (US)", 0.00492892159375],
      ["tbsp", "Tablespoons (US)", 0.01478676478125],
      ["floz", "Fluid ounces (US)", 0.0295735295625],
      ["cup", "Cups (US)", 0.2365882365],
      ["pt", "Pints (US)", 0.473176473],
      ["qt", "Quarts (US)", 0.946352946],
      ["gal", "Gallons (US)", 3.785411784],
      ["ft3", "Cubic feet", 28.316846592],
    ],
  },
  area: {
    label: "Area",
    from: "ft2",
    to: "m2",
    units: [
      ["cm2", "Square centimeters", 0.0001],
      ["m2", "Square meters", 1],
      ["ha", "Hectares", 10000],
      ["km2", "Square kilometers", 1e6],
      ["in2", "Square inches", 0.00064516],
      ["ft2", "Square feet", 0.09290304],
      ["yd2", "Square yards", 0.83612736],
      ["ac", "Acres", 4046.8564224],
      ["mi2", "Square miles", 2589988.110336],
    ],
  },
  speed: {
    label: "Speed",
    from: "mph",
    to: "kmh",
    units: [
      ["ms", "Meters per second", 1],
      ["kmh", "Kilometers per hour", 1 / 3.6],
      ["mph", "Miles per hour", 0.44704],
      ["fts", "Feet per second", 0.3048],
      ["kn", "Knots", 1852 / 3600],
    ],
  },
  data: {
    label: "Data",
    from: "GB",
    to: "MB",
    units: [
      ["b", "Bits", 1 / 8],
      ["B", "Bytes", 1],
      ["KB", "Kilobytes", 1e3],
      ["MB", "Megabytes", 1e6],
      ["GB", "Gigabytes", 1e9],
      ["TB", "Terabytes", 1e12],
      ["KiB", "Kibibytes", 1024],
      ["MiB", "Mebibytes", 1024 ** 2],
      ["GiB", "Gibibytes", 1024 ** 3],
      ["TiB", "Tebibytes", 1024 ** 4],
    ],
  },
};

export function UnitConverter() {
  const [kind, setKind] = useState("length");
  const def = UNITS[kind];
  const [from, setFrom] = useState(def.from);
  const [to, setTo] = useState(def.to);
  const [value, setValue] = useState("1");

  const changeKind = (k: string) => {
    setKind(k);
    setFrom(UNITS[k].from);
    setTo(UNITS[k].to);
  };

  const factor = (id: string) => def.units.find((u) => u[0] === id)?.[2] ?? NaN;
  const label = (id: string) => def.units.find((u) => u[0] === id)?.[1] ?? id;
  const v = num(value);
  const base = v * factor(from);
  const result = base / factor(to);

  return (
    <div>
      <div className="tabs" role="group">
        {Object.entries(UNITS).map(([k, d]) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => changeKind(k)}>
            {d.label}
          </button>
        ))}
      </div>
      <div className="grid-3">
        <label className="field">
          <span>Value</span>
          <input type="number" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <label className="field">
          <span>From</span>
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {def.units.map(([id, l]) => (
              <option key={id} value={id}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>To</span>
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {def.units.map(([id, l]) => (
              <option key={id} value={id}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="btn-row" style={{ marginTop: 10 }}>
        <button
          type="button"
          className="btn small secondary"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          ⇄ Swap units
        </button>
      </div>
      <div className="result-line">
        {Number.isFinite(result) ? (
          <>
            {fmt(v)} {label(from).toLowerCase()} = <strong>{fmt(result, 8)}</strong> {label(to).toLowerCase()}
          </>
        ) : (
          "Enter a number"
        )}
      </div>
      {Number.isFinite(base) && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Unit</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {def.units.map(([id, l, f]) => (
                <tr key={id}>
                  <td>{l}</td>
                  <td>{fmt(base / f, 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ───────────── Temperature ─────────────

type Scale = "f" | "c" | "k";

const toC: Record<Scale, (v: number) => number> = {
  c: (v) => v,
  f: (v) => ((v - 32) * 5) / 9,
  k: (v) => v - 273.15,
};
const fromC: Record<Scale, (c: number) => number> = {
  c: (c) => c,
  f: (c) => (c * 9) / 5 + 32,
  k: (c) => c + 273.15,
};

const round = (n: number) => String(Math.round(n * 100) / 100);

export function TemperatureConverter() {
  const [vals, setVals] = useState<Record<Scale, string>>({ f: "72", c: round(toC.f(72)), k: round(toC.f(72) + 273.15) });

  const update = (scale: Scale, raw: string) => {
    const v = num(raw);
    if (!Number.isFinite(v)) {
      setVals({ f: "", c: "", k: "", [scale]: raw } as Record<Scale, string>);
      return;
    }
    const c = toC[scale](v);
    const next = { f: round(fromC.f(c)), c: round(c), k: round(fromC.k(c)) };
    next[scale] = raw;
    setVals(next);
  };

  const fields: [Scale, string][] = [
    ["f", "Fahrenheit (°F)"],
    ["c", "Celsius (°C)"],
    ["k", "Kelvin (K)"],
  ];

  const common = [-40, 0, 32, 50, 68, 72, 98.6, 212, 350];

  return (
    <div>
      <div className="grid-3">
        {fields.map(([s, label]) => (
          <label key={s} className="field">
            <span>{label}</span>
            <input
              type="number"
              inputMode="decimal"
              value={vals[s]}
              onChange={(e) => update(s, e.target.value)}
              style={{ fontSize: "1.3rem", fontWeight: 600 }}
            />
          </label>
        ))}
      </div>
      <h3>Common temperatures</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>°F</th>
              <th>°C</th>
            </tr>
          </thead>
          <tbody>
            {common.map((f) => (
              <tr key={f}>
                <td>{f}°F</td>
                <td>{round(toC.f(f))}°C</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ───────────── Time zones ─────────────

const PRESET_ZONES: [string, string][] = [
  ["America/New_York", "Eastern (New York)"],
  ["America/Chicago", "Central (Chicago)"],
  ["America/Denver", "Mountain (Denver)"],
  ["America/Phoenix", "Arizona (Phoenix)"],
  ["America/Los_Angeles", "Pacific (Los Angeles)"],
  ["America/Anchorage", "Alaska (Anchorage)"],
  ["Pacific/Honolulu", "Hawaii (Honolulu)"],
  ["UTC", "UTC"],
  ["Europe/London", "London"],
  ["Europe/Paris", "Paris / Berlin"],
  ["Asia/Kolkata", "India (Kolkata)"],
  ["Asia/Shanghai", "China (Shanghai)"],
  ["Asia/Tokyo", "Tokyo"],
  ["Australia/Sydney", "Sydney"],
];

/** Offset of `zone` from UTC in minutes at the given instant. */
function zoneOffset(zone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return (asUTC - date.getTime()) / 60000;
}

/** Interpret a wall-clock "YYYY-MM-DDTHH:mm" in `zone` and return the real instant. */
function wallTimeToInstant(local: string, zone: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local);
  if (!m) return null;
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  // Two passes handle DST transitions correctly.
  let t = guess - zoneOffset(zone, new Date(guess)) * 60000;
  t = guess - zoneOffset(zone, new Date(t)) * 60000;
  return new Date(t);
}

function offsetLabel(mins: number) {
  const sign = mins >= 0 ? "+" : "−";
  const a = Math.abs(mins);
  const h = Math.floor(a / 60);
  const m = a % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
}

function zoneName(z: string) {
  return PRESET_ZONES.find((p) => p[0] === z)?.[1] ?? z.replace(/_/g, " ");
}

function ZoneSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (z: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {placeholder && <option value="">{placeholder}</option>}
      {value && !options.includes(value) && <option value={value}>{zoneName(value)}</option>}
      {options.map((z) => (
        <option key={z} value={z}>
          {zoneName(z)}
        </option>
      ))}
    </select>
  );
}

export function TimeZoneConverter() {
  const [local, setLocal] = useState("");
  const [fromZone, setFromZone] = useState("America/New_York");
  const [targets, setTargets] = useState<string[]>([
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Asia/Kolkata",
  ]);
  const [adding, setAdding] = useState("");
  const [allZones, setAllZones] = useState<string[]>([]);

  useEffect(() => {
    // Defaults depend on the visitor's clock and zone, so set them on the client.
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) setFromZone(tz);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setLocal(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:00`);
    try {
      setAllZones(Intl.supportedValuesOf("timeZone"));
    } catch {
      setAllZones(PRESET_ZONES.map((p) => p[0]));
    }
  }, []);

  const zoneOptions = useMemo(() => {
    const presets = PRESET_ZONES.map((p) => p[0]);
    return [...presets, ...allZones.filter((z) => !presets.includes(z))];
  }, [allZones]);

  const instant = local ? wallTimeToInstant(local, fromZone) : null;

  const render = (zone: string) => {
    if (!instant) return "—";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(instant);
  };

  return (
    <div>
      <div className="grid-2">
        <label className="field">
          <span>Date & time</span>
          <input type="datetime-local" value={local} onChange={(e) => setLocal(e.target.value)} />
        </label>
        <label className="field">
          <span>In time zone</span>
          <ZoneSelect value={fromZone} onChange={setFromZone} options={zoneOptions} />
        </label>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time zone</th>
              <th>Local time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {targets.map((z) => (
              <tr key={z}>
                <td>
                  {zoneName(z)}{" "}
                  <span className="muted small">{instant ? offsetLabel(zoneOffset(z, instant)) : ""}</span>
                </td>
                <td>
                  <strong>{render(z)}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn small secondary"
                    aria-label={`Remove ${zoneName(z)}`}
                    onClick={() => setTargets(targets.filter((t) => t !== z))}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid-2" style={{ marginTop: 14, alignItems: "end" }}>
        <label className="field">
          <span>Add a time zone</span>
          <ZoneSelect value={adding} onChange={setAdding} options={zoneOptions} placeholder="Choose a zone…" />
        </label>
        <div>
          <button
            type="button"
            className="btn"
            disabled={!adding || targets.includes(adding)}
            onClick={() => setTargets([...targets, adding])}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
