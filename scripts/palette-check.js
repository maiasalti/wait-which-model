#!/usr/bin/env node
/**
 * Validate the company colour palette in data/companies.json.
 *
 * The palette is categorical: colour carries company identity, in the fixed
 * `order` sequence. This checks the parts of that job which are computable, so
 * nobody has to eyeball whether a new company's colour is safe:
 *
 *   1. Lightness band     OKLCH L within 0.48–0.67 for the dark surface
 *   2. Chroma floor       OKLCH C >= 0.10 (below it a hue reads as grey)
 *   3. CVD separation     OKLab ΔE (x100) between ADJACENT colours in `order`,
 *                         under simulated protanopia/deuteranopia
 *   4. Normal-vision floor worst adjacent ΔE unsimulated — full-colour readers
 *                         must be able to tell neighbours apart too
 *   5. Contrast           WCAG ratio of each colour against the surface
 *
 * Adjacent-pair only is deliberate. Thirteen categorical hues cannot all be
 * mutually separable under CVD — that is a property of the colour space, not a
 * bug — so the site leans on secondary encoding everywhere colour appears: the
 * directory buttons carry brand logos, the charts carry labels and tooltips.
 * Run with --all to see the full pairwise picture anyway.
 *
 * Usage:  node scripts/palette-check.js [--all]
 * Exits 1 on any FAIL.
 *
 * Colour maths (Machado-Oliveira-Fernandes 2009 CVD transforms at severity 1.0,
 * OKLab) follows the dataviz skill's validator, so results agree with it.
 */

const fs = require("fs");
const path = require("path");

const SURFACE = "#0B0E1A"; // --surface in app/globals.css
const BAND = [0.48, 0.67];
const CHROMA_FLOOR = 0.1;
const CVD_TARGET = 8.0;
const NORMAL_FLOOR = 15.0;
const CONTRAST_MIN = 3.0;

const MACHADO = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};

const hex2srgb = (h) => {
  const s = h.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(s)) throw new Error(`not a hex colour: ${h}`);
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
};
const s2lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lin = (h) => hex2srgb(h).map(s2lin);
const relLum = (h) => { const [r, g, b] = lin(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

function oklabFromLin([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const oklch = (h) => { const [L, a, b] = oklabFromLin(lin(h)); return [L, Math.hypot(a, b)]; };

function simulate(h, kind) {
  const [r, g, b] = lin(h), M = MACHADO[kind], cl = (c) => Math.max(0, Math.min(1, c));
  return [
    cl(M[0][0] * r + M[0][1] * g + M[0][2] * b),
    cl(M[1][0] * r + M[1][1] * g + M[1][2] * b),
    cl(M[2][0] * r + M[2][1] * g + M[2][2] * b),
  ];
}
function deltaE(h1, h2, kind) {
  const a = oklabFromLin(kind ? simulate(h1, kind) : lin(h1));
  const b = oklabFromLin(kind ? simulate(h2, kind) : lin(h2));
  return 100 * Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}
const cvdMin = (a, b) => Math.min(deltaE(a, b, "protan"), deltaE(a, b, "deutan"));

const companies = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "companies.json"), "utf8")
).sort((a, b) => a.order - b.order);

const fails = [];
const say = (ok, check, detail) => {
  if (!ok) fails.push(check);
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${check.padEnd(22)} ${detail}`);
};

console.log(`\nCompany palette (dark, surface ${SURFACE}): ${companies.length} slots\n`);

const outOfBand = companies.filter((c) => { const [L] = oklch(c.color); return L < BAND[0] || L > BAND[1]; });
say(outOfBand.length === 0, "Lightness band",
  outOfBand.length ? outOfBand.map((c) => `${c.id} L=${oklch(c.color)[0].toFixed(3)}`).join(", ")
                   : `all ${companies.length} inside L ${BAND[0]}–${BAND[1]}`);

const lowChroma = companies.filter((c) => oklch(c.color)[1] < CHROMA_FLOOR);
say(lowChroma.length === 0, "Chroma floor",
  lowChroma.length ? lowChroma.map((c) => `${c.id} C=${oklch(c.color)[1].toFixed(3)}`).join(", ")
                   : `all ${companies.length} >= ${CHROMA_FLOOR}`);

let worstCvd = null, worstNormal = null;
for (let i = 0; i < companies.length - 1; i++) {
  const [a, b] = [companies[i], companies[i + 1]];
  const c = cvdMin(a.color, b.color), n = deltaE(a.color, b.color);
  if (!worstCvd || c < worstCvd.v) worstCvd = { v: c, a, b };
  if (!worstNormal || n < worstNormal.v) worstNormal = { v: n, a, b };
}
say(worstCvd.v >= CVD_TARGET, "CVD separation",
  `worst adjacent ${worstCvd.a.id}<->${worstCvd.b.id} ΔE ${worstCvd.v.toFixed(1)} (need >= ${CVD_TARGET})`);
say(worstNormal.v >= NORMAL_FLOOR, "Normal-vision floor",
  `worst adjacent ${worstNormal.a.id}<->${worstNormal.b.id} ΔE ${worstNormal.v.toFixed(1)} (need >= ${NORMAL_FLOOR})`);

const lowContrast = companies.filter((c) => contrast(c.color, SURFACE) < CONTRAST_MIN);
say(lowContrast.length === 0, "Contrast vs surface",
  lowContrast.length ? lowContrast.map((c) => `${c.id} ${contrast(c.color, SURFACE).toFixed(2)}:1`).join(", ")
                     : `all ${companies.length} >= ${CONTRAST_MIN}:1`);

if (process.argv.includes("--all")) {
  const pairs = [];
  for (let i = 0; i < companies.length; i++)
    for (let j = i + 1; j < companies.length; j++)
      pairs.push({ a: companies[i], b: companies[j], v: cvdMin(companies[i].color, companies[j].color) });
  pairs.sort((x, y) => x.v - y.v);
  console.log(`\n  All-pairs CVD (informational — these rely on logos/labels, not colour):`);
  for (const p of pairs.slice(0, 8))
    console.log(`    ${(p.a.id + "<->" + p.b.id).padEnd(34)} ΔE ${p.v.toFixed(1)}`);
}

console.log(fails.length ? `\n  FAILED: ${fails.join(", ")}\n` : `\n  All checks pass.\n`);
process.exit(fails.length ? 1 : 0);
