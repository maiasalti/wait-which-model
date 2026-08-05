/** Draws the diff table to a canvas at 2x for retina. Kept out of the component
 *  so the layout maths is readable and the component stays declarative. */
export interface DiffPngRow {
  label: string;
  cells: { text: string; tone: "plain" | "better" | "worse" }[];
}

const SCALE = 2;
const PAD = 24;
const ROW_H = 26;
const HEAD_H = 40;
// Sized to the longest text that actually occurs, not to a guess. The widest
// label is "Time to first answer token" and the widest value is of the form
// "202s to first answer token" — ~26 chars, which at 12px monospace is roughly
// 190px. `fillText`'s maxWidth SQUASHES rather than truncates, so a column too
// narrow does not clip, it renders visibly compressed. These leave headroom.
const LABEL_W = 215;
const COL_W = 230;

const COLORS = {
  bg: "#0B0E1A",
  line: "#1E2436",
  ink: "#E7EAF3",
  muted: "#8A93A6",
  better: "#34D399",
  worse: "#FB7185",
};

export function renderDiffPng(opts: {
  title: string;
  headers: string[];
  rows: DiffPngRow[];
}): HTMLCanvasElement {
  const { title, headers, rows } = opts;
  const w = PAD * 2 + LABEL_W + COL_W * headers.length;
  const h = PAD * 2 + HEAD_H + ROW_H * rows.length + 28;

  const canvas = document.createElement("canvas");
  canvas.width = w * SCALE;
  canvas.height = h * SCALE;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SCALE, SCALE);

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);

  ctx.font = "600 15px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = COLORS.ink;
  ctx.fillText(title, PAD, PAD + 6);

  const top = PAD + HEAD_H;
  ctx.font = "12px ui-monospace, SFMono-Regular, monospace";

  headers.forEach((label, i) => {
    ctx.fillStyle = COLORS.ink;
    ctx.fillText(label, PAD + LABEL_W + i * COL_W, top - 8, COL_W - 10);
  });

  rows.forEach((row, r) => {
    const y = top + r * ROW_H;
    ctx.strokeStyle = COLORS.line;
    ctx.beginPath();
    ctx.moveTo(PAD, y);
    ctx.lineTo(w - PAD, y);
    ctx.stroke();

    ctx.fillStyle = COLORS.muted;
    ctx.fillText(row.label, PAD, y + 17, LABEL_W - 10);

    row.cells.forEach((cell, i) => {
      ctx.fillStyle =
        cell.tone === "better" ? COLORS.better : cell.tone === "worse" ? COLORS.worse : COLORS.ink;
      ctx.fillText(cell.text, PAD + LABEL_W + i * COL_W, y + 17, COL_W - 10);
    });
  });

  ctx.fillStyle = COLORS.muted;
  ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("waitwhichmodel — deltas are measured against the baseline column", PAD, h - PAD + 6);

  return canvas;
}
