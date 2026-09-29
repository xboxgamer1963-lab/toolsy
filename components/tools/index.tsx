import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Each tool is code-split so a page only ships the JavaScript for its own tool.
const calc = () => import("./calculators");
const conv = () => import("./converters");
const pdf = () => import("./pdf");
const image = () => import("./image");
const text = () => import("./text");

export const toolComponents: Record<string, ComponentType> = {
  "percentage-calculator": dynamic(() => calc().then((m) => m.PercentageCalculator)),
  "mortgage-calculator": dynamic(() => calc().then((m) => m.MortgageCalculator)),
  "loan-calculator": dynamic(() => calc().then((m) => m.LoanCalculator)),
  "compound-interest-calculator": dynamic(() => calc().then((m) => m.CompoundInterestCalculator)),
  "bmi-calculator": dynamic(() => calc().then((m) => m.BmiCalculator)),
  "age-calculator": dynamic(() => calc().then((m) => m.AgeCalculator)),
  "tip-calculator": dynamic(() => calc().then((m) => m.TipCalculator)),
  "discount-calculator": dynamic(() => calc().then((m) => m.DiscountCalculator)),

  "unit-converter": dynamic(() => conv().then((m) => m.UnitConverter)),
  "temperature-converter": dynamic(() => conv().then((m) => m.TemperatureConverter)),
  "time-zone-converter": dynamic(() => conv().then((m) => m.TimeZoneConverter)),

  "merge-pdf": dynamic(() => pdf().then((m) => m.MergePdf)),
  "split-pdf": dynamic(() => pdf().then((m) => m.SplitPdf)),
  "jpg-to-pdf": dynamic(() => pdf().then((m) => m.JpgToPdf)),

  "image-compressor": dynamic(() => image().then((m) => m.ImageCompressor)),
  "image-resizer": dynamic(() => image().then((m) => m.ImageResizer)),
  "image-converter": dynamic(() => image().then((m) => m.ImageConverter)),

  "word-counter": dynamic(() => text().then((m) => m.WordCounter)),
  "case-converter": dynamic(() => text().then((m) => m.CaseConverter)),
  "password-generator": dynamic(() => text().then((m) => m.PasswordGenerator)),
  "qr-code-generator": dynamic(() => text().then((m) => m.QrCodeGenerator)),
  "json-formatter": dynamic(() => text().then((m) => m.JsonFormatter)),
};
