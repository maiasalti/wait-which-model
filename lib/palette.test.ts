import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  CHROMA_FLOOR,
  CVD_TARGET,
  LIGHT_CONTRAST_MIN,
  cvdDeltaE,
  hexToOklch,
  lightPalette,
  lightVariant,
  minLightContrast,
} from "./palette.ts";

const companies = (
  JSON.parse(readFileSync(new URL("../data/companies.json", import.meta.url), "utf8")) as {
    id: string;
    color: string | null;
    order: number;
  }[]
)
  .filter((c) => c.color != null)
  .sort((a, b) => a.order - b.order);
const dark = companies.map((c) => c.color as string);

test("a colour that already clears the light floor is left unchanged", () => {
  assert.equal(lightVariant("#0F59E0"), "#0F59E0");
});

test("a too-light colour is darkened to the floor, keeping its hue", () => {
  const out = lightVariant("#69A600");
  assert.notEqual(out, "#69A600");
  assert.ok(minLightContrast(out) >= LIGHT_CONTRAST_MIN);
  const [, , h0] = hexToOklch("#69A600");
  const [, , h1] = hexToOklch(out);
  assert.ok(Math.abs(h0 - h1) < 0.05, "hue preserved");
});

test("the derived light palette clears contrast and chroma for every company", () => {
  const light = lightPalette(dark);
  light.forEach((hex, i) => {
    assert.ok(minLightContrast(hex) >= LIGHT_CONTRAST_MIN, `${companies[i].id} ${hex}`);
    assert.ok(hexToOklch(hex)[1] >= CHROMA_FLOOR, `${companies[i].id} chroma`);
  });
});

test("light-mode darkening never breaks an adjacent CVD pair that passed on dark", () => {
  const light = lightPalette(dark);
  for (let i = 0; i < light.length - 1; i++) {
    if (cvdDeltaE(dark[i], dark[i + 1]) < CVD_TARGET) continue;
    assert.ok(
      cvdDeltaE(light[i], light[i + 1]) >= CVD_TARGET,
      `${companies[i].id}<->${companies[i + 1].id}`
    );
  }
});
