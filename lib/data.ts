import modelsJson from "@/data/models.json";
import companiesJson from "@/data/companies.json";
import benchmarksJson from "@/data/benchmarks.json";
import newsJson from "@/data/news.json";
import type { BenchmarkMeta, Company, Model, NewsItem } from "./types";

export const models = (modelsJson as Model[]).slice().sort(
  (a, b) => b.releaseDate.localeCompare(a.releaseDate)
);

export const companies = (companiesJson as Company[]).slice().sort(
  (a, b) => a.order - b.order
);

export const benchmarks = benchmarksJson as BenchmarkMeta[];

export const news = (newsJson as NewsItem[]).slice().sort(
  (a, b) => b.date.localeCompare(a.date)
);

export const companyById = new Map(companies.map((c) => [c.id, c]));
export const modelById = new Map(models.map((m) => [m.id, m]));
export const benchmarkByKey = new Map(benchmarks.map((b) => [b.key, b]));

export function companyColor(companyId: string): string {
  return companyById.get(companyId)?.color ?? "#8A93A6";
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

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return d ? `${months[m - 1]} ${d}, ${y}` : `${months[m - 1] ?? ""} ${y}`;
}
