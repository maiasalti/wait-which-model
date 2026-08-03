import { ImageResponse } from "next/og";
import {
  companyColor,
  companyName,
  formatContext,
  formatCostPerTask,
  formatDate,
  modelById,
  models,
} from "@/lib/data";

// One static PNG per model, generated at build time so unfurls cost nothing at
// request time. Mirrors the "observatory" tokens in app/globals.css rather than
// importing them — Satori resolves no CSS variables.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0b0e1a";
const INK = "#edf0f8";
const INK_2 = "#9aa4c0";
const INK_3 = "#5f6884";
const ACCENT = "#8fa3d9";
const LINE = "rgba(190, 205, 240, 0.16)";

export function generateStaticParams() {
  return models.map((m) => ({ id: m.id }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = modelById.get(id);
  return [
    {
      id: "card",
      size,
      contentType,
      alt: model
        ? `${model.name} by ${companyName(model.company)} — stats and benchmarks on Wait Which Model?`
        : "Wait Which Model?",
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = modelById.get(id);
  // generateStaticParams only ever yields real ids, so this is a type guard
  // rather than a reachable state — but a silent blank card is worse than a loud
  // failure, so fail rather than render an empty PNG.
  if (!model) throw new Error(`No model with id "${id}" for OG image`);

  const brand = companyColor(model.company);

  // Built only from real schema fields. Parameter counts and licences live in
  // prose inside `notes`, so deriving them would mean parsing free text and
  // could silently render a wrong card.
  const subtitle = [
    model.tier,
    model.modality,
    model.openWeights ? "Open weights" : "Closed weights",
    `Released ${formatDate(model.releaseDate)}`,
  ].join("  ·  ");

  // Nulls stay as "—" rather than being dropped, so the card can never imply a
  // figure exists. Models with nothing measured show four dashes, which is true.
  const stats: [string, string][] = [
    [
      "SWE-bench",
      model.benchmarks.sweBench != null ? `${model.benchmarks.sweBench}%` : "—",
    ],
    [
      "GPQA",
      model.benchmarks.gpqaDiamond != null ? `${model.benchmarks.gpqaDiamond}%` : "—",
    ],
    ["Cost / task", formatCostPerTask(model.costPerTask.usd)],
    ["Context", formatContext(model.contextWindow)],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          backgroundColor: BG,
          backgroundImage: `radial-gradient(900px 500px at 82% -12%, ${brand}33, transparent)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: ACCENT }}
          />
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              color: ACCENT,
              textTransform: "uppercase",
            }}
          >
            waitwhichmodel.fyi
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{ width: 14, height: 14, borderRadius: 14, backgroundColor: brand }}
            />
            <div
              style={{
                fontSize: 26,
                letterSpacing: 3,
                color: brand,
                textTransform: "uppercase",
              }}
            >
              {companyName(model.company)}
            </div>
            <div
              style={{
                marginLeft: 8,
                padding: "4px 14px",
                borderRadius: 4,
                border: `1px solid ${LINE}`,
                fontSize: 20,
                letterSpacing: 2,
                color: INK_3,
                textTransform: "uppercase",
              }}
            >
              {model.status}
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: model.name.length > 22 ? 76 : 92,
              lineHeight: 1.03,
              color: INK,
              letterSpacing: -2,
            }}
          >
            {model.name}
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: 25,
              color: INK_2,
              textTransform: "capitalize",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 64,
            paddingTop: 28,
            borderTop: `1px solid ${LINE}`,
          }}
        >
          {stats.map(([label, value]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 19,
                  letterSpacing: 2,
                  color: INK_3,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
              <div style={{ marginTop: 8, fontSize: 40, color: INK }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
