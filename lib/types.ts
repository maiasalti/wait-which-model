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
}

export type Highlight =
  | { kind: "none" }
  | { kind: "models"; ids: string[] }
  | { kind: "company"; companyId: string };
