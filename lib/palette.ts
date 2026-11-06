/**
 * Colour maths for the company palette's light-mode variants.
 *
 * The palette in data/companies.json is tuned for the dark surface (#0B0E1A).
 * On the light theme some of those hues fall under 3:1 against the page, so
 * each colour gets a light-mode variant: the same OKLCH hue and chroma, with
 * lightness lowered just far enough to clear the contrast floor against every
 * light surface. Colours that already clear it are left untouched.
 *
 * Pure and dependency-free so `node --test` and scripts/palette-check.js can
 * both use it.
 */

/** Light-theme surfaces a company colour can sit on — keep in sync with the
 *  light tokens in app/globals.css (`--bg`, `--surface`, `--surface-2`). */
export const LIGHT_SURFACES = ["#F5F6FA", "#FFFFFF", "#ECEFF6"] as const;

/** WCAG contrast floor for graphical marks (dots, logos, bars). */
export const LIGHT_CONTRAST_MIN = 3.0;

type Rgb = [number, number, number];

function hexToSrgb(hex: string): Rgb {
  const s = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(s)) throw new Error(`not a hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255) as Rgb;
}

const toLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLin = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function srgbToHex(rgb: Rgb): string {
  return (
    "#" +
    rgb
      .map((c) => Math.round(Math.max(0, Math.min(1, c)) * 255).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToSrgb(hex).map(toLin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Worst-case contrast of `hex` against every light surface. */
export function minLightContrast(hex: string): number {
  return Math.min(...LIGHT_SURFACES.map((s) => contrastRatio(hex, s)));
}

export function hexToOklch(hex: string): [number, number, number] {
  const [r, g, b] = hexToSrgb(hex).map(toLin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}

/** OKLCH → linear sRGB, unclamped (components outside 0–1 mean out of gamut). */
function oklchToLin(L: number, C: number, h: number): Rgb {
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-5 && v <= 1 + 1e-5);

/** OKLCH → hex. Out-of-gamut colours keep L and h and lose only as much chroma
 *  as needed to fit in sRGB (binary search, so no more than necessary). */
export function oklchToHex(L: number, C: number, h: number): string {
  let c = C;
  if (!inGamut(oklchToLin(L, C, h))) {
    let lo = 0;
    let hi = C;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLin(L, mid, h))) lo = mid;
      else hi = mid;
    }
    c = lo;
  }
  return srgbToHex(oklchToLin(L, c, h).map(fromLin) as Rgb);
}

/** The light-mode variant of a dark-tuned palette colour: unchanged if it
 *  already reaches the contrast floor on every light surface, otherwise the
 *  same hue and chroma at the highest OKLCH lightness that does. */
export function lightVariant(hex: string, min = LIGHT_CONTRAST_MIN): string {
  if (minLightContrast(hex) >= min) return hex.toUpperCase();
  const [L0, C, h] = hexToOklch(hex);
  // Binary-search the largest lightness that passes (contrast falls as L rises).
  let lo = 0;
  let hi = L0;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (minLightContrast(oklchToHex(mid, C, h)) >= min) lo = mid;
    else hi = mid;
  }
  // `lo` passes by construction; rounding to 8-bit can nudge it either way,
  // so step down until the quantised hex is safely over the floor.
  let L = lo;
  let out = oklchToHex(L, C, h);
  while (minLightContrast(out) < min && L > 0) {
    L -= 0.002;
    out = oklchToHex(L, C, h);
  }
  return out;
}

// --- CVD separation -------------------------------------------------------
// Machado-Oliveira-Fernandes 2009 at severity 1.0 plus OKLab ΔE (x100), the
// same maths as scripts/palette-check.js uses for the dark palette.

const MACHADO = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
} as const;

function oklabFromLin([r, g, b]: Rgb): Rgb {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function simulate(hex: string, kind: keyof typeof MACHADO): Rgb {
  const [r, g, b] = hexToSrgb(hex).map(toLin);
  const M = MACHADO[kind];
  const cl = (c: number) => Math.max(0, Math.min(1, c));
  return M.map((row) => cl(row[0] * r + row[1] * g + row[2] * b)) as Rgb;
}

export function deltaE(a: string, b: string, kind?: keyof typeof MACHADO): number {
  const A = oklabFromLin(kind ? simulate(a, kind) : (hexToSrgb(a).map(toLin) as Rgb));
  const B = oklabFromLin(kind ? simulate(b, kind) : (hexToSrgb(b).map(toLin) as Rgb));
  return 100 * Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
}

/** Worst of protanopia / deuteranopia ΔE between two colours. */
export const cvdDeltaE = (a: string, b: string) => Math.min(deltaE(a, b, "protan"), deltaE(a, b, "deutan"));

export const CVD_TARGET = 8.0;

/** OKLCH chroma below which a hue reads as grey (same floor as the dark palette). */
export const CHROMA_FLOOR = 0.1;

/** The whole light-mode palette, from the dark palette in `order` sequence.
 *
 *  Step 1 takes each colour's `lightVariant`. Darkening can pull an adjacent
 *  pair together under colour-vision deficiency (a red and a green differ
 *  mostly in lightness there), so step 2 repairs any adjacent pair that met
 *  the CVD target on dark but no longer does: it darkens one side of the pair
 *  further — whichever needs the smaller lightness drop — until the target is
 *  met again. Darkening only ever raises contrast, so step 1's guarantee holds. */
export function lightPalette(dark: readonly string[]): string[] {
  const out = dark.map((c) => lightVariant(c));
  const darkenUntil = (i: number, j: number): { hex: string; drop: number } | null => {
    const [L0, C, h] = hexToOklch(out[i]);
    for (let drop = 0.005; drop <= 0.2; drop += 0.005) {
      const hex = oklchToHex(L0 - drop, C, h);
      if (cvdDeltaE(hex, out[j]) >= CVD_TARGET) return { hex, drop };
    }
    return null;
  };
  for (let pass = 0; pass < 3; pass++) {
    let changed = false;
    for (let i = 0; i < out.length - 1; i++) {
      const j = i + 1;
      if (cvdDeltaE(out[i], out[j]) >= CVD_TARGET) continue;
      if (cvdDeltaE(dark[i], dark[j]) < CVD_TARGET) continue; // not a regression
      const a = darkenUntil(i, j);
      const b = darkenUntil(j, i);
      const pick = a && (!b || a.drop <= b.drop) ? { k: i, ...a } : b ? { k: j, ...b } : null;
      if (pick) {
        out[pick.k] = pick.hex;
        changed = true;
      }
    }
    if (!changed) break;
  }
  // Step 3: 8-bit rounding at the new lightness can shave a hair of chroma off
  // a colour that sat right on the floor. Nudge it back over without losing
  // contrast, so a palette colour never turns greyish in light mode.
  for (let i = 0; i < out.length; i++) {
    if (hexToOklch(dark[i])[1] < CHROMA_FLOOR) continue;
    const [L, C, h] = hexToOklch(out[i]);
    for (let c = C; c < CHROMA_FLOOR + 0.01 && hexToOklch(out[i])[1] < CHROMA_FLOOR; c += 0.0005) {
      const hex = oklchToHex(L, c, h);
      if (minLightContrast(hex) >= LIGHT_CONTRAST_MIN) out[i] = hex;
    }
  }
  return out;
}
