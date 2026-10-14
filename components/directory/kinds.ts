import type {
  AgentEntry,
  AnyEntry,
  EntryKind,
  FeatureEntry,
  HarnessEntry,
  ImageModelEntry,
  VideoModelEntry,
  WorldModelEntry,
} from "@/lib/types";
import { modelById } from "@/lib/data";

/** One labelled figure. `value` null renders as an em dash, so a card never
 *  implies a figure the data doesn't have. */
export interface Fact {
  label: string;
  value: string | null;
}

/** What makes each directory different. Everything else (shell, card, detail
 *  page, drawer) is generic and reads only this. */
export interface KindConfig<E extends AnyEntry = AnyEntry> {
  kind: EntryKind;
  href: string;
  title: string;
  /** Lowercase noun for search placeholders and empty states. */
  plural: string;
  intro: string;
  /** Up to three figures on the card. */
  cardFacts: (e: E) => Fact[];
  /** Every figure, for the detail page's grid. */
  detailFacts: (e: E) => Fact[];
  /** Short uppercase tags under the card's company line (open weights, beta…). */
  badges: (e: E) => string[];
  /** Small outlined chips at the foot of the card (capabilities, scores…). */
  chips: (e: E) => string[];
}

const usd = (v: number | null, unit: string) =>
  v == null ? null : `$${v < 0.1 ? v.toFixed(3) : v.toFixed(2)}${unit}`;
const yesNo = (v: boolean | null) => (v == null ? null : v ? "Yes" : "No");
const list = (xs: string[]) => (xs.length ? xs.join(", ") : null);
const human = (s: string) => s.replace(/-/g, " ");
const seconds = (v: number | null) =>
  v == null ? null : v >= 120 ? `${Math.round(v / 60)} min` : `${v} s`;

const ACCESS: Record<string, string> = {
  ga: "Generally available",
  beta: "Beta",
  waitlist: "Waitlist",
  preview: "Preview",
  "research-preview": "Research preview",
  "research-only": "Research only",
  "region-limited": "Region-limited",
};
export const accessLabel = (a: string) => ACCESS[a] ?? a;

const licenseFact = (e: { openWeights?: boolean; openSource?: boolean; license: { name: string } | null }): Fact => ({
  label: "Licence",
  value: e.license?.name ?? (e.openWeights || e.openSource ? null : "Proprietary"),
});

const image: KindConfig<ImageModelEntry> = {
  kind: "image-models",
  href: "/image-models",
  title: "Image models",
  plural: "image models",
  intro: "Text-to-image and image-editing models, with arena Elo where Artificial Analysis or LMArena rank them.",
  cardFacts: (e) => [
    { label: "$ / image", value: usd(e.pricing.perImageUsd, "") },
    { label: "Max res", value: e.maxResolution },
    { label: "AA Elo", value: e.scores.aaImageArenaElo?.toString() ?? null },
  ],
  detailFacts: (e) => [
    { label: "Price per image", value: usd(e.pricing.perImageUsd, "") },
    { label: "Max resolution", value: e.maxResolution },
    { label: "AA arena Elo", value: e.scores.aaImageArenaElo?.toString() ?? null },
    { label: "LMArena Elo", value: e.scores.lmarenaImageElo?.toString() ?? null },
    { label: "Capabilities", value: list(e.capabilities.map(human)) },
    licenseFact(e),
  ],
  badges: (e) => (e.openWeights ? ["Open weights"] : []),
  chips: (e) => e.capabilities.map(human),
};

const video: KindConfig<VideoModelEntry> = {
  kind: "video-models",
  href: "/video-models",
  title: "Video models",
  plural: "video models",
  intro: "Text- and image-to-video models: clip length, resolution, native audio, and arena Elo where ranked.",
  cardFacts: (e) => [
    { label: "$ / sec", value: usd(e.pricing.perSecondUsd, "") },
    { label: "Max length", value: seconds(e.maxDurationSec) },
    { label: "AA Elo", value: e.scores.aaVideoArenaElo?.toString() ?? null },
  ],
  detailFacts: (e) => [
    { label: "Price per second", value: usd(e.pricing.perSecondUsd, "") },
    { label: "Max clip length", value: seconds(e.maxDurationSec) },
    { label: "Max resolution", value: e.maxResolution },
    { label: "Native audio", value: yesNo(e.nativeAudio) },
    { label: "AA arena Elo", value: e.scores.aaVideoArenaElo?.toString() ?? null },
    { label: "LMArena Elo", value: e.scores.lmarenaVideoElo?.toString() ?? null },
    { label: "Capabilities", value: list(e.capabilities.map(human)) },
    licenseFact(e),
  ],
  badges: (e) => [...(e.openWeights ? ["Open weights"] : []), ...(e.nativeAudio ? ["Audio"] : [])],
  chips: (e) => e.capabilities.map(human),
};

const OUTPUT: Record<WorldModelEntry["output"], string> = {
  "video-stream": "Live video stream",
  "3d-scene": "3D scene",
  "simulation-video": "Simulation video",
};

const world: KindConfig<WorldModelEntry> = {
  kind: "world-models",
  href: "/world-models",
  title: "World models",
  plural: "world models",
  intro: "Models that generate a world you can explore or act in, or simulate one consistently enough to train robots and agents on.",
  cardFacts: (e) => [
    { label: "Output", value: OUTPUT[e.output] },
    { label: "Session", value: seconds(e.maxSessionSec) },
    { label: "Access", value: accessLabel(e.access) },
  ],
  detailFacts: (e) => [
    { label: "Output", value: OUTPUT[e.output] },
    { label: "Interactive", value: yesNo(e.interactive) },
    { label: "Inputs", value: list(e.inputs) },
    { label: "Max session", value: seconds(e.maxSessionSec) },
    { label: "Resolution", value: e.maxResolution },
    { label: "Frame rate", value: e.fps == null ? null : `${e.fps} fps` },
    { label: "Access", value: accessLabel(e.access) },
    licenseFact(e),
  ],
  badges: (e) => [...(e.interactive ? ["Interactive"] : []), ...(e.openWeights ? ["Open weights"] : [])],
  chips: (e) => e.inputs.map((i) => `${i} in`),
};

const PRICING_MODEL: Record<HarnessEntry["pricing"]["model"], string> = {
  free: "Free",
  subscription: "Subscription",
  "byo-key": "Bring your own key",
  usage: "Usage-based",
};

const supported = (s: HarnessEntry["supportedModels"]) =>
  s === "any" ? "Any model" : s === "vendor" ? "Vendor's own models" : `${s.length} listed models`;

/** Best Terminal-Bench pairing, with the model it ran, because a harness score
 *  without its model is meaningless. */
export function bestHarnessScore(e: HarnessEntry): string | null {
  const best = e.scores.slice().sort((a, b) => b.score - a.score)[0];
  if (!best) return null;
  return `${best.score}% (v${best.version}) · ${modelById.get(best.modelId)?.name ?? best.modelId}`;
}

const harness: KindConfig<HarnessEntry> = {
  kind: "harnesses",
  href: "/harnesses",
  title: "Harnesses",
  plural: "harnesses",
  intro: "Software that runs a model you choose: coding CLIs, IDEs and agent frameworks. Terminal-Bench scores are per harness and model pairing.",
  cardFacts: (e) => [
    { label: "Interface", value: list(e.interface.map((i) => i.toUpperCase())) },
    { label: "Pricing", value: PRICING_MODEL[e.pricing.model] },
    { label: "Models", value: supported(e.supportedModels) },
  ],
  detailFacts: (e) => [
    { label: "Interface", value: list(e.interface.map((i) => i.toUpperCase())) },
    { label: "Pricing", value: PRICING_MODEL[e.pricing.model] },
    { label: "Models", value: supported(e.supportedModels) },
    { label: "Best Terminal-Bench", value: bestHarnessScore(e) },
    { label: "Open source", value: yesNo(e.openSource) },
    licenseFact(e),
  ],
  badges: (e) => (e.openSource ? ["Open source"] : []),
  chips: (e) => {
    const best = e.scores.slice().sort((a, b) => b.score - a.score)[0];
    return best ? [`TB ${best.score}%`] : [];
  },
};

const DOMAIN: Record<AgentEntry["domain"], string> = {
  coding: "Coding",
  browser: "Browser",
  research: "Research",
  general: "General",
};

const agent: KindConfig<AgentEntry> = {
  kind: "agents",
  href: "/agents",
  title: "Agents",
  plural: "agents",
  intro: "Products sold as an autonomous worker, running on a model the vendor picks.",
  cardFacts: (e) => [
    { label: "Domain", value: DOMAIN[e.domain] },
    { label: "Access", value: accessLabel(e.access) },
    { label: "Plan", value: e.pricing.plan },
  ],
  detailFacts: (e) => [
    { label: "Domain", value: DOMAIN[e.domain] },
    { label: "Access", value: accessLabel(e.access) },
    { label: "Plan", value: e.pricing.plan },
  ],
  badges: (e) => (e.access === "ga" ? [] : [accessLabel(e.access)]),
  chips: (e) => e.underlyingModels.map((id) => modelById.get(id)?.name ?? id),
};

const SURFACE: Record<FeatureEntry["surface"], string> = {
  app: "App",
  api: "API",
  "dev-tool": "Developer tool",
  hardware: "Hardware",
};
export const surfaceLabel = (s: FeatureEntry["surface"]) => SURFACE[s];

const feature: KindConfig<FeatureEntry> = {
  kind: "features",
  href: "/features",
  title: "Frontier Features",
  plural: "features",
  intro: "What Anthropic, OpenAI, Google DeepMind, xAI and Meta ship around their models: app features, API capabilities, developer tools and hardware.",
  cardFacts: (e) => [
    { label: "Surface", value: SURFACE[e.surface] },
    { label: "Availability", value: accessLabel(e.availability) },
    { label: "Plans", value: list(e.plans) },
  ],
  detailFacts: (e) => [
    { label: "Surface", value: SURFACE[e.surface] },
    { label: "Availability", value: accessLabel(e.availability) },
    { label: "Plans", value: list(e.plans) },
    { label: "Retired", value: e.retiredDate },
  ],
  badges: (e) => [...(e.availability === "ga" ? [] : [accessLabel(e.availability)]), ...(e.retiredDate ? ["Retired"] : [])],
  chips: (e) => e.plans,
};

// Cast at the boundary: each config is typed against its own entry, and the
// generic components only ever pair a config with entries of its own kind.
export const KINDS = {
  "image-models": image,
  "video-models": video,
  "world-models": world,
  harnesses: harness,
  agents: agent,
  features: feature,
} as unknown as Record<EntryKind, KindConfig>;
