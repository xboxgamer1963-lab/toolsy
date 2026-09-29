"use client";

import { useEffect, useMemo, useState } from "react";
import { NumberField, Stat, Tabs, fmt, monthlyPayment, num, usd, usd0 } from "./shared";

// ───────────── Percentage ─────────────

export function PercentageCalculator() {
  const [mode, setMode] = useState<"of" | "is" | "change">("of");
  const [a, setA] = useState("20");
  const [b, setB] = useState("150");
  const x = num(a);
  const y = num(b);

  let labels: [string, string];
  let result: React.ReactNode;
  if (mode === "of") {
    labels = ["Percentage (%)", "Of number"];
    result = (
      <>
        {fmt(x)}% of {fmt(y)} = <strong>{fmt((x * y) / 100)}</strong>
      </>
    );
  } else if (mode === "is") {
    labels = ["Part", "Whole"];
    result = (
      <>
        {fmt(x)} is <strong>{fmt((x / y) * 100, 4)}%</strong> of {fmt(y)}
      </>
    );
  } else {
    labels = ["From", "To"];
    const change = ((y - x) / Math.abs(x)) * 100;
    result = (
      <>
        {fmt(x)} → {fmt(y)} is a{" "}
        <strong>
          {fmt(Math.abs(change), 4)}% {change >= 0 ? "increase" : "decrease"}
        </strong>
      </>
    );
  }

  return (
    <div>
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          ["of", "X% of Y"],
          ["is", "X is what % of Y"],
          ["change", "% change"],
        ]}
      />
      <div className="grid-2">
        <NumberField label={labels[0]} value={a} onChange={setA} />
        <NumberField label={labels[1]} value={b} onChange={setB} />
      </div>
      <div className="result-line">{Number.isFinite(x) && Number.isFinite(y) ? result : "Enter two numbers"}</div>
    </div>
  );
}

// ───────────── Mortgage ─────────────

export function MortgageCalculator() {
  const [price, setPrice] = useState("400000");
  const [downPct, setDownPct] = useState("20");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [tax, setTax] = useState("4800");
  const [insurance, setInsurance] = useState("1500");

  const P = num(price);
  const down = (P * num(downPct)) / 100;
  const loan = P - down;
  const n = num(years) * 12;
  const pi = monthlyPayment(loan, num(rate), n);
  const monthlyTax = (num(tax) || 0) / 12;
  const monthlyIns = (num(insurance) || 0) / 12;
  const total = pi + monthlyTax + monthlyIns;
  const totalInterest = pi * n - loan;

  const schedule = useMemo(() => {
    const rows: { year: number; principal: number; interest: number; balance: number }[] = [];
    const r = num(rate) / 100 / 12;
    let bal = loan;
    if (!Number.isFinite(pi) || !Number.isFinite(bal) || bal <= 0 || n > 600) return rows;
    for (let y = 1; y <= n / 12; y++) {
      let pp = 0;
      let ii = 0;
      for (let m = 0; m < 12 && bal > 0.005; m++) {
        const interest = bal * r;
        const principal = Math.min(pi - interest, bal);
        bal -= principal;
        pp += principal;
        ii += interest;
      }
      rows.push({ year: y, principal: pp, interest: ii, balance: Math.max(bal, 0) });
    }
    return rows;
  }, [loan, rate, pi, n]);

  return (
    <div>
      <div className="grid-3">
        <NumberField label="Home price" suffix="$" value={price} onChange={setPrice} />
        <NumberField label="Down payment" suffix="%" value={downPct} onChange={setDownPct} />
        <NumberField label="Interest rate" suffix="%" value={rate} onChange={setRate} />
        <label className="field">
          <span>Loan term</span>
          <select value={years} onChange={(e) => setYears(e.target.value)}>
            {[10, 15, 20, 25, 30, 40].map((y) => (
              <option key={y} value={y}>
                {y} years
              </option>
            ))}
          </select>
        </label>
        <NumberField label="Property tax / year" suffix="$" value={tax} onChange={setTax} />
        <NumberField label="Home insurance / year" suffix="$" value={insurance} onChange={setInsurance} />
      </div>

      <div className="stats">
        <Stat primary k="Total monthly payment" v={Number.isFinite(total) ? usd.format(total) : "—"} />
        <Stat k="Principal & interest" v={Number.isFinite(pi) ? usd.format(pi) : "—"} />
        <Stat k="Tax + insurance" v={usd.format(monthlyTax + monthlyIns)} />
        <Stat k="Loan amount" v={Number.isFinite(loan) ? usd0.format(loan) : "—"} />
        <Stat k="Down payment" v={Number.isFinite(down) ? usd0.format(down) : "—"} />
        <Stat k="Total interest" v={Number.isFinite(totalInterest) ? usd0.format(totalInterest) : "—"} />
      </div>

      {schedule.length > 0 && (
        <details style={{ marginTop: 16 }}>
          <summary>
            <strong>Yearly amortization schedule</strong>
          </summary>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{usd0.format(r.principal)}</td>
                    <td>{usd0.format(r.interest)}</td>
                    <td>{usd0.format(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

// ───────────── Loan ─────────────

export function LoanCalculator() {
  const [amount, setAmount] = useState("25000");
  const [rate, setRate] = useState("7.5");
  const [term, setTerm] = useState("5");
  const [unit, setUnit] = useState<"years" | "months">("years");

  const months = unit === "years" ? num(term) * 12 : num(term);
  const P = num(amount);
  const pay = monthlyPayment(P, num(rate), months);
  const totalPaid = pay * months;
  const ok = Number.isFinite(pay) && P > 0;

  return (
    <div>
      <div className="grid-3">
        <NumberField label="Loan amount" suffix="$" value={amount} onChange={setAmount} />
        <NumberField label="Interest rate (APR)" suffix="%" value={rate} onChange={setRate} />
        <div className="field">
          <span>Loan term</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="number" inputMode="decimal" value={term} onChange={(e) => setTerm(e.target.value)} />
            <select value={unit} onChange={(e) => setUnit(e.target.value as "years" | "months")} style={{ width: 120 }}>
              <option value="years">years</option>
              <option value="months">months</option>
            </select>
          </div>
        </div>
      </div>
      <div className="stats">
        <Stat primary k="Monthly payment" v={ok ? usd.format(pay) : "—"} />
        <Stat k="Total interest" v={ok ? usd.format(totalPaid - P) : "—"} />
        <Stat k="Total paid" v={ok ? usd.format(totalPaid) : "—"} />
        <Stat k="Number of payments" v={ok ? fmt(months) : "—"} />
      </div>
    </div>
  );
}

// ───────────── Compound interest ─────────────

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [monthly, setMonthly] = useState("500");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("20");
  const [freq, setFreq] = useState("12");

  const rows = useMemo(() => {
    const P = num(principal) || 0;
    const C = num(monthly) || 0;
    const r = num(rate) / 100;
    const n = num(freq);
    const Y = Math.min(Math.floor(num(years)), 100);
    const out: { year: number; contributions: number; interest: number; balance: number }[] = [];
    if (!Number.isFinite(r) || !(Y > 0)) return out;
    // Effective monthly growth equivalent to compounding n times per year.
    const m = Math.pow(1 + r / n, n / 12) - 1;
    let bal = P;
    let contributed = P;
    for (let y = 1; y <= Y; y++) {
      for (let k = 0; k < 12; k++) {
        bal = bal * (1 + m) + C;
        contributed += C;
      }
      out.push({ year: y, contributions: contributed, interest: bal - contributed, balance: bal });
    }
    return out;
  }, [principal, monthly, rate, years, freq]);

  const last = rows[rows.length - 1];

  return (
    <div>
      <div className="grid-3">
        <NumberField label="Initial deposit" suffix="$" value={principal} onChange={setPrincipal} />
        <NumberField label="Monthly contribution" suffix="$" value={monthly} onChange={setMonthly} />
        <NumberField label="Annual interest rate" suffix="%" value={rate} onChange={setRate} />
        <NumberField label="Years" value={years} onChange={setYears} step="1" min={1} />
        <label className="field">
          <span>Compounding</span>
          <select value={freq} onChange={(e) => setFreq(e.target.value)}>
            <option value="365">Daily</option>
            <option value="12">Monthly</option>
            <option value="4">Quarterly</option>
            <option value="1">Yearly</option>
          </select>
        </label>
      </div>
      <div className="stats">
        <Stat primary k="Future value" v={last ? usd0.format(last.balance) : "—"} />
        <Stat k="Total contributions" v={last ? usd0.format(last.contributions) : "—"} />
        <Stat k="Interest earned" v={last ? usd0.format(last.interest) : "—"} />
      </div>
      {rows.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Contributions</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year}>
                  <td>{r.year}</td>
                  <td>{usd0.format(r.contributions)}</td>
                  <td>{usd0.format(r.interest)}</td>
                  <td>{usd0.format(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ───────────── BMI ─────────────

function bmiCategory(bmi: number): [string, string] {
  if (bmi < 18.5) return ["Underweight", "#5aa9e6"];
  if (bmi < 25) return ["Healthy weight", "var(--good)"];
  if (bmi < 30) return ["Overweight", "var(--warn)"];
  return ["Obese", "var(--bad)"];
}

export function BmiCalculator() {
  const [units, setUnits] = useState<"us" | "metric">("us");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("9");
  const [lb, setLb] = useState("165");
  const [cm, setCm] = useState("175");
  const [kg, setKg] = useState("75");

  const bmi =
    units === "us"
      ? (703 * num(lb)) / Math.pow(num(ft) * 12 + (num(inch) || 0), 2)
      : num(kg) / Math.pow(num(cm) / 100, 2);
  const ok = Number.isFinite(bmi) && bmi > 0 && bmi < 200;
  const [cat, color] = ok ? bmiCategory(bmi) : ["", ""];
  // Scale 10–40 across the bar.
  const pos = ok ? Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100) : 0;

  const heightM = units === "us" ? (num(ft) * 12 + (num(inch) || 0)) * 0.0254 : num(cm) / 100;
  const lo = 18.5 * heightM * heightM;
  const hi = 24.9 * heightM * heightM;
  const range =
    units === "us" ? `${fmt(lo * 2.20462, 0)} – ${fmt(hi * 2.20462, 0)} lb` : `${fmt(lo, 1)} – ${fmt(hi, 1)} kg`;

  return (
    <div>
      <Tabs
        value={units}
        onChange={setUnits}
        options={[
          ["us", "US units"],
          ["metric", "Metric"],
        ]}
      />
      {units === "us" ? (
        <div className="grid-3">
          <NumberField label="Height" suffix="ft" value={ft} onChange={setFt} />
          <NumberField label="Height" suffix="in" value={inch} onChange={setInch} />
          <NumberField label="Weight" suffix="lb" value={lb} onChange={setLb} />
        </div>
      ) : (
        <div className="grid-2">
          <NumberField label="Height" suffix="cm" value={cm} onChange={setCm} />
          <NumberField label="Weight" suffix="kg" value={kg} onChange={setKg} />
        </div>
      )}
      {ok && (
        <>
          <div className="stats">
            <Stat primary k="Your BMI" v={bmi.toFixed(1)} />
            <Stat k="Category" v={<span style={{ color }}>{cat}</span>} />
            <Stat k="Healthy weight for your height" v={<span style={{ fontSize: "1.05rem" }}>{range}</span>} />
          </div>
          <div className="bmi-bar" aria-hidden>
            <span className="marker" style={{ left: `${pos}%` }} />
          </div>
          <div className="small muted" style={{ position: "relative", height: 20 }} aria-hidden>
            {[10, 18.5, 25, 30, 40].map((n) => (
              <span
                key={n}
                style={{
                  position: "absolute",
                  left: `${((n - 10) / 30) * 100}%`,
                  transform: n === 10 ? "none" : n === 40 ? "translateX(-100%)" : "translateX(-50%)",
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ───────────── Age ─────────────

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseISO(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3]);
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

export function AgeCalculator() {
  const [dob, setDob] = useState("1990-06-15");
  const [asOf, setAsOf] = useState("");

  // Set "today" on the client to avoid a server/client date mismatch.
  useEffect(() => setAsOf(toISO(new Date())), []);

  const birth = parseISO(dob);
  const ref = parseISO(asOf);
  let body: React.ReactNode = <p className="muted">Enter a date of birth.</p>;

  if (birth && ref) {
    if (birth > ref) {
      body = <p className="error">The date of birth must be before the &ldquo;age on&rdquo; date.</p>;
    } else {
      let y = ref.getFullYear() - birth.getFullYear();
      let m = ref.getMonth() - birth.getMonth();
      let d = ref.getDate() - birth.getDate();
      if (d < 0) {
        m -= 1;
        d += daysInMonth(ref.getFullYear(), (ref.getMonth() + 11) % 12);
      }
      if (m < 0) {
        y -= 1;
        m += 12;
      }
      const totalDays = Math.round((ref.getTime() - birth.getTime()) / 86400000);

      const bm = birth.getMonth();
      const bd = birth.getDate();
      const birthdayIn = (year: number) => {
        // Feb 29 birthdays fall on Mar 1 in non-leap years.
        if (bm === 1 && bd === 29 && daysInMonth(year, 1) === 28) return new Date(year, 2, 1);
        return new Date(year, bm, bd);
      };
      let next = birthdayIn(ref.getFullYear());
      if (next < ref) next = birthdayIn(ref.getFullYear() + 1);
      const untilNext = Math.round((next.getTime() - ref.getTime()) / 86400000);

      body = (
        <>
          <div className="result-line">
            Age: <strong>{y}</strong> years, <strong>{m}</strong> months, <strong>{d}</strong> days
          </div>
          <div className="stats">
            <Stat k="Total months" v={fmt(y * 12 + m)} />
            <Stat k="Total weeks" v={fmt(Math.floor(totalDays / 7))} />
            <Stat k="Total days" v={fmt(totalDays)} />
            <Stat
              primary
              k="Next birthday"
              v={untilNext === 0 ? "Today! 🎉" : `in ${untilNext} day${untilNext === 1 ? "" : "s"}`}
            />
          </div>
        </>
      );
    }
  }

  return (
    <div>
      <div className="grid-2">
        <label className="field">
          <span>Date of birth</span>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </label>
        <label className="field">
          <span>Age on</span>
          <input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
        </label>
      </div>
      {body}
    </div>
  );
}

// ───────────── Tip ─────────────

export function TipCalculator() {
  const [bill, setBill] = useState("85");
  const [pct, setPct] = useState("20");
  const [people, setPeople] = useState("2");

  const b = num(bill);
  const tip = (b * num(pct)) / 100;
  const total = b + tip;
  const n = Math.max(1, Math.floor(num(people)) || 1);
  const ok = Number.isFinite(total);

  return (
    <div>
      <div className="grid-3">
        <NumberField label="Bill amount" suffix="$" value={bill} onChange={setBill} />
        <NumberField label="Tip" suffix="%" value={pct} onChange={setPct} />
        <NumberField label="Number of people" value={people} onChange={setPeople} step="1" min={1} />
      </div>
      <div className="btn-row" style={{ marginTop: 12 }}>
        {[15, 18, 20, 22, 25].map((p) => (
          <button
            key={p}
            type="button"
            className={`btn small${String(p) === pct ? "" : " secondary"}`}
            onClick={() => setPct(String(p))}
          >
            {p}%
          </button>
        ))}
      </div>
      <div className="stats">
        <Stat k="Tip" v={ok ? usd.format(tip) : "—"} />
        <Stat k="Total" v={ok ? usd.format(total) : "—"} />
        <Stat primary k="Per person" v={ok ? usd.format(total / n) : "—"} />
        {n > 1 && <Stat k="Tip per person" v={ok ? usd.format(tip / n) : "—"} />}
      </div>
    </div>
  );
}

// ───────────── Discount ─────────────

export function DiscountCalculator() {
  const [price, setPrice] = useState("79.99");
  const [off, setOff] = useState("25");
  const [tax, setTax] = useState("0");

  const p = num(price);
  const saved = (p * num(off)) / 100;
  const sale = p - saved;
  const withTax = sale * (1 + (num(tax) || 0) / 100);
  const ok = Number.isFinite(sale);

  return (
    <div>
      <div className="grid-3">
        <NumberField label="Original price" suffix="$" value={price} onChange={setPrice} />
        <NumberField label="Discount" suffix="% off" value={off} onChange={setOff} />
        <NumberField label="Sales tax" suffix="%" value={tax} onChange={setTax} />
      </div>
      <div className="stats">
        <Stat primary k="Sale price" v={ok ? usd.format(sale) : "—"} />
        <Stat k="You save" v={ok ? usd.format(saved) : "—"} />
        {num(tax) > 0 && <Stat k="Final price with tax" v={ok ? usd.format(withTax) : "—"} />}
      </div>
    </div>
  );
}
