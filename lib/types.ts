export type ModelStatus = "frontier" | "superseded" | "unknown" | "deprecated";

export type ModelTier = "flagship" | "balanced" | "fast";

export type BenchmarkKey =
  | "mmluPro"
  | "gpqaDiamond"
  | "sweBench"
  | "terminalBench"
  | "aime"
  | "hle"
  | "lmarenaElo"
  | "arcAgi2";

export interface Pricing {
  inputPerMTok: number | null;
  outputPerMTok: number | null;
}

export type ReasoningEffort = "low" | "medium" | "high" | "xhigh" | "max";

/** Artificial Analysis' "cost per Intelligence Index task": the weighted average
 *  USD a model burns on one task of the AA Intelligence Index, across input,
 *  cache read/write, reasoning and answer tokens. `effort` records which
 *  reasoning setting the figure was measured at — medium wherever AA publishes
 *  one, otherwise whatever setting they measured; null when the model has no
 *  effort levels. */
export interface CostPerTask {
  usd: number | null;
  effort: ReasoningEffort | null;
}

/** Artificial Analysis-measured serving speed, same source as costPerTask.
 *  Null where AA publishes no measurement — retired models, and weights-only
 *  releases with no hosted endpoint to measure.
 *
 *  `effort` mirrors CostPerTask's field of the same name, and for the same
 *  reason: AA measures each model at a reasoning-effort setting, and the
 *  setting dominates the result. Two models from the same lab measured at
 *  different efforts differ by 30x on time-to-first-token — effort noise, not
 *  speed. Without this field the UI would present that noise as capability.
 *
 *  `timeToFirstTokenSec` is time to first ANSWER token: for a model with a
 *  thinking phase it is measured after reasoning completes, so at max effort
 *  it can run to minutes. The UI must say "first answer token", never just
 *  "first token", which would read as stalled inference. */
export interface Speed {
  outputTokensPerSec: number | null;
  timeToFirstTokenSec: number | null;
  effort: ReasoningEffort | null;
}

export type LicenseKind = "permissive" | "copyleft" | "restricted" | "proprietary";

/** Null for closed-weight models — the licence question only has a meaningful
 *  answer when there are weights to license. `kind` is what the UI groups on;
 *  `spdx` is null for bespoke licences like Llama's. */
export interface License {
  spdx: string | null;
  name: string;
  kind: LicenseKind;
  url: string | null;
  commercialUse: boolean | null;
}

/** The same model is served under different strings on the first-party API,
 *  Bedrock and Vertex, so each id carries the provider it belongs to. */
export interface ApiId {
  provider: string;
  id: string;
}

export interface Model {
  id: string;
  name: string;
  company: string;
  releaseDate: string; // YYYY-MM-DD
  status: ModelStatus;
  tier: ModelTier;
  modality: "text" | "multimodal";
  contextWindow: number | null;
  maxOutput: number | null;
  pricing: Pricing;
  costPerTask: CostPerTask;
  openWeights: boolean;
  /** Can a person actually obtain and use this model today?
   *  - `general`   — yes: a public API, a consumer app, or a mainstream host
   *  - `restricted` — gated: preview, waitlist, vetted partners, subscription-only,
   *                   or an app with no API you can build on
   *  - `self-host`  — only by running the weights on hardware you provide
   *  Not rendered anywhere in the UI — it exists so the recommender stops
   *  suggesting models a visitor could not go and use. */
  availability: "general" | "restricted" | "self-host";
  knowledgeCutoff: string | null;
  speed: Speed;
  license: License | null;
  apiIds: ApiId[];
  /** Announced shutdown date, YYYY-MM-DD. Null when no retirement is announced. */
  retirementDate: string | null;
  /** The model this one replaces. Points BACKWARDS so a new model wires itself
   *  into the lineage with one field and no existing entry is edited; successors
   *  are derived by inverting the map. Also represents fan-out correctly — two
   *  models may both name the same predecessor. */
  predecessorId: string | null;
  benchmarks: Partial<Record<BenchmarkKey, number | null>>;
  strengths: string[];
  weaknesses: string[];
  notes: string;
}

export interface Company {
  id: string;
  name: string;
  country: string;
  founded: number;
  website: string;
  color: string;
  order: number;
}

export interface BenchmarkMeta {
  key: BenchmarkKey;
  name: string;
  description: string;
  unit: string;
  higherIsBetter: boolean;
  max: number | null;
}

export type NewsCategory = "release" | "benchmark" | "company" | "research" | "policy";

export interface NewsItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  summary: string;
  category: NewsCategory;
  companies: string[];
  modelIds: string[];
  sourceName: string;
  sourceUrl: string;
}

export type TimeWindow = "3m" | "6m" | "1y" | "2y" | "3y" | "all";

export interface Filters {
  window: TimeWindow;
  companies: string[]; // empty = all
  openWeightsOnly: boolean;
  frontierOnly: boolean;
  benchmark: BenchmarkKey;
  minScore: number | null;
  maxInputPrice: number | null;
  search: string;
}

export interface Methodology {
  frontierDefinition: {
    summary: string;
    criteria: string[];
    lastReviewed: string;
  };
  tiers: { key: ModelTier; label: string; description: string }[];
  statusMeanings: { key: ModelStatus; label: string; description: string }[];
  costPerTask: {
    summary: string;
    notes: string[];
    furtherReading: { title: string; author: string; url: string; blurb: string };
  };
  dataGaps: { summary: string };
  sourcing: { summary: string };
  currency: { summary: string };
  reigns: { summary: string; caveat: string; notes: string[] };
  coverage: { summary: string };
  costCalculator: { summary: string; notes: string[] };
  specDiff: { summary: string };
}

export type Highlight =
  | { kind: "none" }
  | { kind: "models"; ids: string[] }
  | { kind: "company"; companyId: string };
