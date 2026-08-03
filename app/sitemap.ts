import type { MetadataRoute } from "next";
import { models } from "@/lib/data";

const BASE = "https://www.waitwhichmodel.fyi";

/** Without this the per-model pages exist but nothing points a crawler at them,
 *  since they are only reachable by clicking a card. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/compare", "/news", "/info", "/which-model"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const modelPages = models.map((m) => ({
    url: `${BASE}/models/${m.id}`,
    // The data changes when a stats or news pass touches the model, which the
    // release date approximates well enough for crawl scheduling.
    lastModified: new Date(m.releaseDate),
    changeFrequency: "monthly" as const,
    priority: m.status === "frontier" ? 0.7 : 0.5,
  }));

  return [...staticPages, ...modelPages];
}
