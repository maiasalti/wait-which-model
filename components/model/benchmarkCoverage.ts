import type { Model } from "@/lib/types";
import { benchmarks } from "@/lib/data";

/** Reported-vs-total count, surfaced in the collapsed summary so a visitor
 *  knows data is missing before opening the section and finding dashes.
 *
 *  Lives in its own server-safe module (no "use client") rather than in
 *  ModelBenchmarks.tsx: that file is a client component (it owns the
 *  quick-compare picker's state), so a plain function exported from it
 *  becomes an opaque client reference — callable as JSX, but not invocable
 *  from a Server Component. The standalone model page is a Server
 *  Component and needs to call this directly to build the collapsible's
 *  `meta` string, so the function has to live outside the client
 *  boundary. */
export function benchmarkCoverage(model: Model): { reported: number; total: number } {
  return {
    reported: benchmarks.filter((b) => model.benchmarks[b.key] != null).length,
    total: benchmarks.length,
  };
}
