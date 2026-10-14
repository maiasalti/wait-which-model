export type ModelStatus = "frontier" | "superseded" | "unknown" | "deprecated";

export type ModelTier = "flagship" | "balanced" | "fast";

export type BenchmarkKey =
  | "mmluPro"
  | "gpqaDiamond"
  | "sweBench"
  | "sweBenchPro"
  | "terminalBench"
  | "aime"
  | "hle"
  | "lmarenaElo"
  | "gdpvalAA"
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

export type ModelType = "llm" | "system-one";

export const MODEL_TYPE_LABEL: Record<ModelType, string> = {
  llm: "LLM",
  "system-one": "System One",
};

export interface Model {
  id: string;
  name: string;
  company: string;
  releaseDate: string; // YYYY-MM-DD
  status: ModelStatus;
  tier: ModelTier;
  modality: "text" | "multimodal";
  /** What kind of model this is. `llm` is the default, a text-generating
   *  language model. `system-one` is a typed-decision model (TypeSafe's Jev
   *  and its open counterparts): state plus typed questions in, calibrated
   *  probabilities out, no generated text — so generative benchmarks never
   *  apply and the recommender must not suggest it for chat work. */
  type: ModelType;
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
  /** Null when no primary source gives it (directory-only developers). */
  country: string | null;
  founded: number | null;
  website: string;
  /** Null for companies without a palette slot (non-notable); render
   *  through companyColor(), which falls back to neutral grey. */
  color: string | null;
  /** Has a Notable entry (or is an existing tracked lab). Only notable
   *  companies may hold a palette colour. */
  notable: boolean;
  order: number;
}

export interface BenchmarkMeta {
  key: BenchmarkKey;
  name: string;
  description: string;
  unit: string;
  higherIsBetter: boolean;
  max: number | null;
  /** Labs stopped reporting it. Scores stay on the models that have them (drawer
   *  bars, coverage table), but the key is dropped from Compare's picker, the
   *  head-to-head chart, the URL allowlist and the composite behind frontier
   *  status and reigns. */
  retired?: boolean;
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
  /** Directory entries the item is about, beside modelIds (which stays
   *  models-only so nothing that reads it breaks). */
  refs?: NewsRef[];
}

export type NewsRefType = "image-model" | "video-model" | "world-model" | "harness" | "agent" | "feature";

export interface NewsRef {
  type: NewsRefType;
  id: string;
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

// ── Directory entries (data/<kind>.json). None of these feed frontier status,
// reigns, Compare or the recommender; they are catalog records only.

export interface EntryLinks {
  official: string;
  docs: string | null;
}

interface EntryBase {
  id: string;
  name: string;
  company: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  links: EntryLinks;
  notes: string;
}

interface ReleasedEntry extends EntryBase {
  /** YYYY-MM-DD, or null when no primary source gives the day (sorts last). */
  releaseDate: string | null;
  /** Top 10 on the type's main leaderboard, or a frontier lab's (see the protocol). */
  notable: boolean;
}

export type ImageCapability = "text-to-image" | "editing" | "inpainting" | "text-rendering" | "reference-images";

export interface ImageModelEntry extends ReleasedEntry {
  pricing: { perImageUsd: number | null; notes: string };
  maxResolution: string | null;
  capabilities: ImageCapability[];
  openWeights: boolean;
  license: License | null;
  apiIds: ApiId[];
  scores: { aaImageArenaElo: number | null; lmarenaImageElo: number | null };
}

export type VideoCapability = "text-to-video" | "image-to-video" | "video-editing" | "extension";

export interface VideoModelEntry extends ReleasedEntry {
  pricing: { perSecondUsd: number | null; notes: string };
  maxDurationSec: number | null;
  maxResolution: string | null;
  nativeAudio: boolean | null;
  capabilities: VideoCapability[];
  openWeights: boolean;
  license: License | null;
  apiIds: ApiId[];
  scores: { aaVideoArenaElo: number | null; lmarenaVideoElo: number | null };
}

export type WorldModelAccess = "ga" | "beta" | "waitlist" | "research-preview" | "research-only";

export interface WorldModelEntry extends ReleasedEntry {
  /** The user can move or act inside the world in real time. */
  interactive: boolean | null;
  inputs: ("text" | "image" | "video" | "actions")[];
  output: "video-stream" | "3d-scene" | "simulation-video";
  /** How long one world/session stays coherent. */
  maxSessionSec: number | null;
  maxResolution: string | null;
  fps: number | null;
  access: WorldModelAccess;
  openWeights: boolean;
  license: License | null;
  apiIds: ApiId[];
  pricing: { notes: string };
}

export interface HarnessScore {
  benchmark: "terminalBench";
  /** A harness score is meaningless without the model it ran, so this is required. */
  modelId: string;
  score: number;
  /** Leaderboard version the score was read from, e.g. "4.0"; versions aren't comparable. */
  version: string;
}

export interface HarnessEntry extends ReleasedEntry {
  interface: ("cli" | "ide" | "desktop" | "web")[];
  openSource: boolean;
  license: License | null;
  repo: string | null;
  /** "any" model, the vendor's own models, or specific models.json ids. */
  supportedModels: "any" | "vendor" | string[];
  pricing: { model: "free" | "subscription" | "byo-key" | "usage"; notes: string };
  scores: HarnessScore[];
}

export type Access = "ga" | "beta" | "waitlist";

export interface AgentEntry extends ReleasedEntry {
  domain: "coding" | "browser" | "research" | "general";
  /** models.json ids, only where the vendor names them. */
  underlyingModels: string[];
  access: Access;
  pricing: { plan: string | null; notes: string };
}

export interface FeatureEntry extends EntryBase {
  launchDate: string; // YYYY-MM-DD
  surface: "app" | "api" | "dev-tool" | "hardware";
  availability: "ga" | "beta" | "preview" | "waitlist" | "region-limited";
  plans: string[];
  modelIds: string[];
  retiredDate: string | null;
}

export interface DirectoryEntries {
  "image-models": ImageModelEntry;
  "video-models": VideoModelEntry;
  "world-models": WorldModelEntry;
  harnesses: HarnessEntry;
  agents: AgentEntry;
  features: FeatureEntry;
}

export type EntryKind = keyof DirectoryEntries;
export type AnyEntry = DirectoryEntries[EntryKind];
