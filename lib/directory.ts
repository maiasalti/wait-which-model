// The Directory nav group's children. Order is the spec's tab order; a tab's
// href is also the URL prefix that marks it active. Models lives at "/" (the
// home page) and owns /models/[id] too, so it matches two prefixes.
export type DirectoryKey =
  | "models"
  | "image-models"
  | "video-models"
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
