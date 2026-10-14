import modelsJson from "@/data/models.json";
import companiesJson from "@/data/companies.json";
import benchmarksJson from "@/data/benchmarks.json";
import newsJson from "@/data/news.json";
import methodologyJson from "@/data/methodology.json";
import reignsJson from "@/data/frontier-reigns.json";
import imageModelsJson from "@/data/image-models.json";
import videoModelsJson from "@/data/video-models.json";
import worldModelsJson from "@/data/world-models.json";
import harnessesJson from "@/data/harnesses.json";
import agentsJson from "@/data/agents.json";
import featuresJson from "@/data/features.json";
import type {
  AnyEntry,
  BenchmarkMeta,
  Company,
  DirectoryEntries,
  EntryKind,
  Methodology,
  Model,
  NewsItem,
  NewsRefType,
} from "./types";
import type { Reign } from "./reigns";
import { companiesWithEntries, sortEntries, type DirectoryKey } from "./directory";
import { resolveColor } from "./format";

export const models = (modelsJson as Model[]).slice().sort(
  (a, b) => b.releaseDate.localeCompare(a.releaseDate)
);

export const companies = (companiesJson as Company[]).slice().sort(
  (a, b) => a.order - b.order
);

/** Companies with at least one model. Model-scoped UI (directory chips,
 *  Compare's rail, location list) uses this, not `companies`, because the
 *  shared company list will also hold image, video and harness developers. */
export const modelCompanies = companiesWithEntries(companies, models);

// The JSON imports widen string unions to string, hence the casts; the
// integrity script is what holds the files to their schema.
export const entries: { [K in EntryKind]: DirectoryEntries[K][] } = {
  "image-models": sortEntries(imageModelsJson as unknown as DirectoryEntries["image-models"][], "newest"),
  "video-models": sortEntries(videoModelsJson as unknown as DirectoryEntries["video-models"][], "newest"),
  "world-models": sortEntries(worldModelsJson as unknown as DirectoryEntries["world-models"][], "newest"),
  harnesses: sortEntries(harnessesJson as unknown as DirectoryEntries["harnesses"][], "newest"),
  agents: sortEntries(agentsJson as unknown as DirectoryEntries["agents"][], "newest"),
  features: sortEntries(featuresJson as unknown as DirectoryEntries["features"][], "newest"),
};

export function entryById<K extends EntryKind>(kind: K, id: string): DirectoryEntries[K] | undefined {
  return (entries[kind] as DirectoryEntries[K][]).find((e) => e.id === id);
}

/** Entry counts that decide which Directory tabs are visible. */
export const directoryCounts: Record<DirectoryKey, number> = {
  models: models.length,
  "image-models": entries["image-models"].length,
  "video-models": entries["video-models"].length,
  "world-models": entries["world-models"].length,
  harnesses: entries.harnesses.length,
  agents: entries.agents.length,
  features: entries.features.length,
};

/** news.refs[].type for each directory. */
export const REF_TYPE: Record<EntryKind, NewsRefType> = {
  "image-models": "image-model",
  "video-models": "video-model",
  "world-models": "world-model",
  harnesses: "harness",
  agents: "agent",
  features: "feature",
};

export const benchmarks = benchmarksJson as BenchmarkMeta[];

/** Benchmarks still worth comparing on. Retired keys stay in `benchmarks` (older
 *  models' drawers and the coverage table still show them) but are dropped from
 *  Compare's picker, the head-to-head chart and the URL allowlist. */
export const activeBenchmarks = benchmarks.filter((b) => !b.retired);

export const methodology = methodologyJson as Methodology;

export const news = (newsJson as NewsItem[]).slice().sort(
  (a, b) => b.date.localeCompare(a.date)
);

export const reigns = reignsJson as Reign[];

export const companyById = new Map(companies.map((c) => [c.id, c]));
export const modelById = new Map(models.map((m) => [m.id, m]));
export const benchmarkByKey = new Map(benchmarks.map((b) => [b.key, b]));

export function companyColor(companyId: string): string {
  return resolveColor(companyById.get(companyId)?.color);
}

export function companyName(companyId: string): string {
  return companyById.get(companyId)?.name ?? companyId;
}

export function formatContext(tokens: number | null): string {
  if (tokens == null) return "—";
  if (tokens >= 1_000_000) {
    const m = Math.round((tokens / 1_000_000) * 10) / 10;
    return `${m}M`;
  }
  return `${Math.round(tokens / 1000)}K`;
}

export function formatPrice(v: number | null | undefined): string {
  if (v == null) return "—";
  return v < 1 ? `$${v.toFixed(2)}` : `$${v % 1 === 0 ? v : v.toFixed(2)}`;
}

/** Cost per task spans two orders of magnitude ($0.02 → $2.75), so sub-$0.10
 *  figures keep a third decimal rather than all collapsing to "$0.02". */
export function formatCostPerTask(v: number | null | undefined): string {
  if (v == null) return "—";
  return v < 0.1 ? `$${v.toFixed(3)}` : `$${v.toFixed(2)}`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return d ? `${months[m - 1]} ${d}, ${y}` : `${months[m - 1] ?? ""} ${y}`;
}

export { formatSpeed } from "./format";

export function newsForEntry(kind: EntryKind, id: string): NewsItem[] {
  const type = REF_TYPE[kind];
  return news.filter((n) => n.refs?.some((r) => r.type === type && r.id === id));
}

/** Model ids an entry names: harness supportedModels (when a list), agent
 *  underlyingModels, feature modelIds. */
export function entryModelIds(e: AnyEntry): string[] {
  if ("underlyingModels" in e) return e.underlyingModels;
  if ("modelIds" in e) return e.modelIds;
  if ("supportedModels" in e && Array.isArray(e.supportedModels)) return e.supportedModels;
  return [];
}

/** Derived "Used by" for a model page: harnesses, agents and features that
 *  reference it. Never stored, so it can't drift from the entries. */
export function usedBy(modelId: string): { kind: EntryKind; entry: AnyEntry }[] {
  const out: { kind: EntryKind; entry: AnyEntry }[] = [];
  for (const kind of ["harnesses", "agents", "features"] as const)
    for (const e of entries[kind])
      if (entryModelIds(e).includes(modelId) || ("scores" in e && e.scores.some((s) => s.modelId === modelId)))
        out.push({ kind, entry: e });
  return out;
}
