import { ImageResponse } from "next/og";

// Generated at build time into a static PNG, so the unfurl costs nothing at request
// time. Mirrors the "observatory" tokens in app/globals.css (bg, ink, ink-2, accent)
// rather than importing them — Satori resolves no CSS variables.
export const alt =
  "Which model should I use? A plain-language AI model recommender from Wait Which Model?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0b0e1a";
const INK = "#edf0f8";
const INK_2 = "#9aa4c0";
const INK_3 = "#5f6884";
const ACCENT = "#8fa3d9";
const LINE = "rgba(190, 205, 240, 0.16)";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: BG,
          backgroundImage: `radial-gradient(900px 500px at 78% -10%, rgba(143, 163, 217, 0.18), transparent)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 10,
              backgroundColor: ACCENT,
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              color: ACCENT,
              textTransform: "uppercase",
            }}
          >
            waitwhichmodel.fyi
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.05,
              color: INK,
              letterSpacing: -2,
            }}
          >
            Which model should I use?
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 31,
              lineHeight: 1.4,
              color: INK_2,
              maxWidth: 900,
            }}
          >
            Describe what you&apos;re working on in plain words. Get up to three
            recommendations, and what each one trades off.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            paddingTop: 30,
            borderTop: `1px solid ${LINE}`,
            fontSize: 24,
            color: INK_3,
          }}
        >
          <div style={{ display: "flex" }}>No jargon</div>
          <div style={{ display: "flex", color: LINE }}>/</div>
          <div style={{ display: "flex" }}>No leaderboards</div>
          <div style={{ display: "flex", color: LINE }}>/</div>
          <div style={{ display: "flex" }}>No signup</div>
        </div>
      </div>
    ),
    size,
  );
}
