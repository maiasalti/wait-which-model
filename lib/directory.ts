// The Directory nav group's children. Order is the spec's tab order; a tab's
// href is also the URL prefix that marks it active. Models lives at "/" (the
// home page) and owns /models/[id] too, so it matches two prefixes.
export type DirectoryKey =
  | "models"
  | "image-models"
  | "video-models"
  | "world-models"
  | "harnesses"
  | "agents"
  | "features";

export interface DirectoryTab {
  key: DirectoryKey;
  label: string;
  href: string;
}

export const DIRECTORY_TABS: readonly DirectoryTab[] = [
  { key: "models", label: "Models", href: "/" },
  { key: "image-models", label: "Image models", href: "/image-models" },
  { key: "video-models", label: "Video models", href: "/video-models" },
  { key: "world-models", label: "World models", href: "/world-models" },
  { key: "harnesses", label: "Harnesses", href: "/harnesses" },
  { key: "agents", label: "Agents", href: "/agents" },
  { key: "features", label: "Frontier Features", href: "/features" },
];

/** A tab ships only once its data file has an entry, so no empty page is
 *  ever reachable from the nav. Models is the home page and always shows. */
export function visibleDirectoryTabs(counts: Record<DirectoryKey, number>): DirectoryTab[] {
  return DIRECTORY_TABS.filter((t) => t.key === "models" || counts[t.key] > 0);
}

const under = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(prefix + "/");

export function activeDirectoryTab(pathname: string): DirectoryKey | null {
  if (pathname === "/" || under(pathname, "/models")) return "models";
  const tab = DIRECTORY_TABS.find((t) => t.href !== "/" && under(pathname, t.href));
  return tab?.key ?? null;
}

/** Companies that have at least one entry in a given directory, in the
 *  companies' own order. companies.json is shared across every directory, so
 *  without this an image-only lab would appear as a filter chip on Models. */
export function companiesWithEntries<C extends { id: string }>(
  companies: C[],
  entries: { company: string }[]
): C[] {
  const present = new Set(entries.map((e) => e.company));
  return companies.filter((c) => present.has(c.id));
}

// ── Filter, sort and grouping for the generic directories. Entries carry
// releaseDate, except features, which carry launchDate.

export interface Dated {
  id: string;
  name: string;
  company: string;
  description: string;
  releaseDate?: string;
  launchDate?: string;
  notable?: boolean;
}

export const entryDate = (e: Dated): string => e.releaseDate ?? e.launchDate ?? "";

export interface EntryQuery {
  search: string;
  companyIds: string[];
  notableOnly: boolean;
}

export function filterEntries<E extends Dated>(
  entries: E[],
  q: EntryQuery,
  companyName: (id: string) => string = (id) => id
): E[] {
  const needle = q.search.trim().toLowerCase();
  return entries.filter(
    (e) =>
      (!needle ||
        e.name.toLowerCase().includes(needle) ||
        e.description.toLowerCase().includes(needle) ||
        companyName(e.company).toLowerCase().includes(needle)) &&
      (q.companyIds.length === 0 || q.companyIds.includes(e.company)) &&
      (!q.notableOnly || e.notable === true)
  );
}

export type EntrySort = "newest" | "oldest" | "name";

export function sortEntries<E extends Dated>(entries: E[], sort: EntrySort): E[] {
  const out = entries.slice();
  if (sort === "name") return out.sort((a, b) => a.name.localeCompare(b.name));
  // Ties break on name so the order is stable across builds.
  out.sort((a, b) => entryDate(b).localeCompare(entryDate(a)) || a.name.localeCompare(b.name));
  return sort === "oldest" ? out.reverse() : out;
}

/** Newest-first month buckets ("2026-10") for the features timeline. Input
 *  order within a month is kept, so sort first. */
export function groupByMonth<E extends Dated>(entries: E[]): { month: string; entries: E[] }[] {
  const groups: { month: string; entries: E[] }[] = [];
  for (const e of entries) {
    const month = entryDate(e).slice(0, 7);
    const last = groups[groups.length - 1];
    if (last?.month === month) last.entries.push(e);
    else groups.push({ month, entries: [e] });
  }
  return groups;
}
