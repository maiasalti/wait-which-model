export type ModelStatus = "frontier" | "superseded" | "deprecated";

export type ModelTier = "flagship" | "balanced" | "fast";

export type BenchmarkKey =
  | "mmluPro"
  | "gpqaDiamond"
  | "sweBench"
  | "aime"
  | "hle"
  | "lmarenaElo"
  | "arcAgi2";

export interface Pricing {
  inputPerMTok: number | null;
  outputPerMTok: number | null;
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
  openWeights: boolean;
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
  dataGaps: { summary: string };
  sourcing: { summary: string };
  currency: { summary: string };
}

export type Highlight =
  | { kind: "none" }
  | { kind: "models"; ids: string[] }
  | { kind: "company"; companyId: string };
