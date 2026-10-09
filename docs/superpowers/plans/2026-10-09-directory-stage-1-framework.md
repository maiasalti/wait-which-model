---
type: Implementation Plan
title: Directory expansion, Stage 1 (framework)
description: Builds the Directory nav group, sub-tab registry, nullable company colours, a tested integrity script, and the
  sweep's on-main guard plus testable weekday job selection. No new data; the new tabs stay hidden.
tags:
- docs
- superpowers
- plans
generated:
  by: human:maia
  at: '2026-10-09T00:00:00Z'
---

# Directory expansion, Stage 1 (framework): implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task by task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lay the groundwork every later directory stage plugs into, without shipping any new
data:
- a "Directory" nav group;
- a sub-tab registry;
- nullable company colours;
- a tested integrity script;
- a safer, testable sweep.

**Architecture:**
- **Pure logic in tested modules:** `lib/directory.ts` holds the tab registry, the visibility rule
  and pathname matching. `scripts/integrity.js` holds data integrity. `scripts/lib/sweep-jobs.js`
  holds weekday job selection and the branch guard.
- **Thin UI:** the components only render what those modules decide.
- **No visible change yet:** every new tab's count is `0` in Stage 1, so only "Models" shows.

**Tech stack:**
- Next.js 16.2 App Router, React 19, TypeScript, Tailwind v4;
- `node --test` for `lib/*.test.ts` and `scripts/**/*.test.js`;
- bash for `scripts/daily-sweep.sh`.

**Spec:** `docs/superpowers/specs/2026-10-09-directory-expansion-design.md` (Stage 1 of its
build order).

## Global constraints

- **Read the Next docs first.** Before touching any Next API, read the relevant guide in
  `node_modules/next/dist/docs/` (AGENTS.md: "This is NOT the Next.js you know").
- **Import extensions.** Local VALUE imports between pure `lib/*.ts` modules carry the literal `.ts`
  extension. Modules that import JSON through `@/` (e.g. `lib/data.ts`) are not reachable from
  `node --test` and stay extensionless.
- **Old URLs keep working.** `/` stays the Models directory and `/models/[id]` is untouched.
- **Tab order:** Models, Image models, Video models, Harnesses, Agents, Frontier Features.
- **Hidden until filled:** a child tab appears only once its data file has at least one entry.
- **Colours:** every company already in `companies.json` keeps its colour and gets
  `notable: true`. `color: null` is allowed only when `notable` is `false`.
- **Feature companies:** limited to `anthropic`, `openai`, `google`, `xai`, `meta`.
- **Sweep guard:** the sweep refuses to run unless the checkout is on `main`.
- **Rotation:** Mon image · Tue video · Wed agents · Thu harnesses · Fri features. Each job is
  enabled only once its stage ships.
- **No new data files in Stage 1.**

## Review focus

1. **Company chips must not grow.** Once a stage adds an image-only company, the Models
   directory's company chips, location list and "N labs" count must still show only companies
   that have a model. (Task 2 tests `companiesWithEntries`.)
2. **Null colours must render grey.** A `null` colour must never reach CSS as the string `"null3D"`;
   it must render grey. (Task 2 tests `resolveColor`.)
3. **Tab matching by whole path segment.** `/agentsfoo` must not light up Agents, and
   `/models/x` must light up Models. (Task 1 tests.)
4. **Sweep on a working branch.** It must exit without switching branches and log a `SKIP` line.
   This is the 2026-10-01 takeover. (Task 5 tests `branchGuard`.)
5. **Missing directory files.** Integrity must pass when a directory data file doesn't exist,
   because none exist until their stage ships. (Task 4 tests.)

## File map

| File | Responsibility |
|---|---|
| `lib/directory.ts` (new) | Tab registry, visibility, pathname → tab, companies-with-entries |
| `lib/directory.test.ts` (new) | Tests for the above |
| `lib/format.ts` (modify) | Add `resolveColor` |
| `lib/format.test.ts` (modify) | Test `resolveColor` |
| `lib/types.ts` (modify) | `Company.color: string \| null`, `Company.notable: boolean` |
| `lib/data.ts` (modify) | `modelCompanies`, `directoryCounts`, `companyColor` through `resolveColor` |
| `data/companies.json` (modify) | `"notable": true` on every record |
| `scripts/palette-check.js` (modify) | Skip companies with `color: null` |
| `app/page.tsx`, `components/FilterRail.tsx`, `components/CompanySelect.tsx`, `components/charts.tsx` (modify) | Use `modelCompanies`; read colours through `companyColor` |
| `components/Nav.tsx` (modify) | "Directory" group replaces the "Models Directory" tab |
| `components/directory/DirectoryTabs.tsx` (new) | Sub-tab strip, rendered only when 2+ tabs are visible |
| `scripts/integrity.js` (new) | `checkData(data)` plus CLI |
| `scripts/integrity.test.js` (new) | Fixture tests plus a real-data test |
| `scripts/lib/sweep-jobs.js` (new) | `jobsFor(dow, enabled)`, `branchGuard(branch)` plus CLI |
| `scripts/lib/sweep-jobs.test.js` (new) | Tests |
| `scripts/daily-sweep.sh` (modify) | Branch guard, job selection through the helper, integrity through the script |
| `AGENTS.md`, `protocols/DAILY_SWEEP_PROTOCOL.md` (modify) | Docs |

---

### Task 1: Directory tab registry (`lib/directory.ts`)

**Files:**
- Create: `lib/directory.ts`
- Test: `lib/directory.test.ts`

**Interfaces:**
- Produces:
  - `type DirectoryKey = "models" | "image-models" | "video-models" | "harnesses" | "agents" | "features"`
  - `interface DirectoryTab { key: DirectoryKey; label: string; href: string }`
  - `const DIRECTORY_TABS: readonly DirectoryTab[]`
  - `visibleDirectoryTabs(counts: Record<DirectoryKey, number>): DirectoryTab[]`
  - `activeDirectoryTab(pathname: string): DirectoryKey | null`
  - `companiesWithEntries<C extends { id: string }>(companies: C[], entries: { company: string }[]): C[]`

- [ ] **Step 1: Write the failing test** in `lib/directory.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DIRECTORY_TABS,
  activeDirectoryTab,
  companiesWithEntries,
  visibleDirectoryTabs,
} from "./directory.ts";

const ZERO = { models: 0, "image-models": 0, "video-models": 0, harnesses: 0, agents: 0, features: 0 };

test("tabs are in the spec's order", () => {
  assert.deepEqual(
    DIRECTORY_TABS.map((t) => t.label),
    ["Models", "Image models", "Video models", "Harnesses", "Agents", "Frontier Features"]
  );
});

test("models is always visible; others only once their file has an entry", () => {
  assert.deepEqual(visibleDirectoryTabs(ZERO).map((t) => t.key), ["models"]);
  assert.deepEqual(
    visibleDirectoryTabs({ ...ZERO, models: 120, features: 3 }).map((t) => t.key),
    ["models", "features"]
  );
});

test("home and model pages belong to the Models tab", () => {
  assert.equal(activeDirectoryTab("/"), "models");
  assert.equal(activeDirectoryTab("/models/claude-sonnet-5-5"), "models");
});

test("matches whole path segments only", () => {
  assert.equal(activeDirectoryTab("/agents"), "agents");
  assert.equal(activeDirectoryTab("/agents/devin"), "agents");
  assert.equal(activeDirectoryTab("/agentsfoo"), null);
  assert.equal(activeDirectoryTab("/compare"), null);
  assert.equal(activeDirectoryTab("/modelsx"), null);
});

test("companiesWithEntries keeps order and drops companies with nothing listed", () => {
  const cs = [{ id: "a" }, { id: "b" }, { id: "c" }];
  assert.deepEqual(
    companiesWithEntries(cs, [{ company: "c" }, { company: "a" }]).map((c) => c.id),
    ["a", "c"]
  );
});
```

- [ ] **Step 2: Run it to make sure it fails.**
  - Run: `node --test lib/directory.test.ts`
  - Expected: FAIL, `Cannot find module` for `./directory.ts`.

- [ ] **Step 3: Implement** `lib/directory.ts`:

```ts
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
```

- [ ] **Step 4: Run it to make sure it passes.**
  - Run: `node --test lib/directory.test.ts`
  - Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/directory.ts lib/directory.test.ts
git commit -m "Add directory tab registry and pathname matching"
```

---

### Task 2: Nullable company colours and model-scoped company lists

**Files:**
- Modify: `lib/format.ts`, `lib/format.test.ts`
- Modify: `lib/types.ts` (the `Company` interface, about line 126)
- Modify: `lib/data.ts`
- Modify: `data/companies.json`
- Modify: `scripts/palette-check.js` (the `companies` load, about line 83)
- Modify: `app/page.tsx` (lines 4, 35, 103, 119–134)
- Modify: `components/FilterRail.tsx` (lines 3, 68, 199)
- Modify: `components/CompanySelect.tsx` (lines 4, 45, 86)
- Modify: `components/charts.tsx` (line 18, line 220, and `s.company.color` at 366 and 442)

**Interfaces:**
- Consumes: `companiesWithEntries` (Task 1).
- Produces:
  - `resolveColor(color: string | null | undefined): string` in `lib/format.ts`
  - `modelCompanies: Company[]` in `lib/data.ts`
  - `directoryCounts: Record<DirectoryKey, number>` in `lib/data.ts`
  - `Company.notable: boolean`, `Company.color: string | null`

- [ ] **Step 1: Write the failing test.** Append to `lib/format.test.ts`, and add `resolveColor` to
  its import from `./format.ts`:

```ts
test("a company without a palette slot renders neutral grey", () => {
  assert.equal(resolveColor(null), "#8A93A6");
  assert.equal(resolveColor(undefined), "#8A93A6");
  assert.equal(resolveColor("#D97757"), "#D97757");
});
```

- [ ] **Step 2: Run it to make sure it fails.**
  - Run: `node --test lib/format.test.ts`
  - Expected: FAIL, `resolveColor` is not exported.

- [ ] **Step 3: Implement.** In `lib/format.ts`:

```ts
/** Only notable companies get a palette slot; everyone else is null in
 *  companies.json and renders in this neutral grey, never as the string
 *  "null" inside a CSS colour. */
export const NEUTRAL_COMPANY_COLOR = "#8A93A6";

export function resolveColor(color: string | null | undefined): string {
  return color ?? NEUTRAL_COMPANY_COLOR;
}
```

- [ ] **Step 4: Run it to make sure it passes.**
  - Run: `node --test lib/format.test.ts`
  - Expected: all pass.

- [ ] **Step 5: Update the schema and data.**

  In `lib/types.ts`, change the `Company` interface:

  ```ts
  export interface Company {
    id: string;
    name: string;
    country: string;
    founded: number;
    website: string;
    /** Null for companies without a palette slot (non-notable); render
     *  through companyColor(), which falls back to neutral grey. */
    color: string | null;
    /** Has a Notable entry (or is an existing tracked lab). Only notable
     *  companies may hold a palette colour. */
    notable: boolean;
    order: number;
  }
  ```

  Add `"notable": true` after `"color"` on every record in `data/companies.json`:

  ```bash
  node -e "const fs=require('fs');const f='data/companies.json';const out=JSON.parse(fs.readFileSync(f)).map(c=>{const o={};for(const [k,v] of Object.entries(c)){o[k]=v;if(k==='color')o.notable=true}return o});fs.writeFileSync(f,JSON.stringify(out,null,2)+'\n')"
  git diff --stat data/companies.json
  ```

  - Expected: one `+    "notable": true,` per company and nothing else.
  - Verify with `git diff data/companies.json | grep '^-' | grep -v '^---' | wc -l`, which should
    print 0.

- [ ] **Step 6: Update `lib/data.ts`.**

  Add the imports:

  ```ts
  import { companiesWithEntries, type DirectoryKey } from "./directory";
  import { resolveColor } from "./format";
  ```

  Replace `companyColor` with:

  ```ts
  export function companyColor(companyId: string): string {
    return resolveColor(companyById.get(companyId)?.color);
  }
  ```

  Add after `models` and `companies`:

  ```ts
  /** Companies with at least one model. Model-scoped UI (directory chips,
   *  Compare's rail, location list) uses this, not `companies`, because the
   *  shared company list will also hold image, video and harness developers. */
  export const modelCompanies = companiesWithEntries(companies, models);

  /** Entry counts that decide which Directory tabs are visible. Each later
   *  stage replaces its 0 with its file's length when it adds a loader. */
  export const directoryCounts: Record<DirectoryKey, number> = {
    models: models.length,
    "image-models": 0,
    "video-models": 0,
    harnesses: 0,
    agents: 0,
    features: 0,
  };
  ```

- [ ] **Step 7: Point the model-scoped consumers at `modelCompanies`.**
  - **`app/page.tsx`:**
    - import `modelCompanies` instead of `companies`;
    - `LOCATIONS` comes from `modelCompanies`;
    - the subtitle reads `{modelCompanies.length} labs`;
    - the chip map is `modelCompanies.map`;
    - in the chip style, replace `c.color` with `companyColor(c.id)` (import `companyColor`), e.g.
      ``background: `${companyColor(c.id)}${active ? "3D" : "14"}` ``.
  - **`components/FilterRail.tsx`:** import `modelCompanies` and use it at both `companies.map`
    sites (lines 68 and 199). Read any `c.color` through `companyColor(c.id)`.
  - **`components/CompanySelect.tsx`:** import `modelCompanies` and use it at lines 45 and 86.
  - **`components/charts.tsx`:**
    - line 220: `return modelCompanies` (add it to the import);
    - lines 366 and 442: `logoShape(companyColor(s.company.id), …)`;
    - line 272 already filters to present companies, so leave it.
  - **Don't touch** `app/news/page.tsx`. News spans every company, so it keeps the full list.

- [ ] **Step 8: Teach `palette-check.js` to skip unslotted companies.** At line 83, filter after
  parsing:

```js
const companies = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "companies.json"), "utf8")
)
  // Non-notable companies hold no palette slot (color: null) and render grey;
  // the CVD rules apply only to the colours actually in the palette.
  .filter((c) => c.color != null)
  .sort((a, b) => a.order - b.order);
```

- [ ] **Step 9: Verify.**
  - Run: `node scripts/palette-check.js`. Expected: exit 0, same output as before.
  - Run: `npm test`. Expected: all pass.
  - Run: `npm run build`. Expected: success. Type errors at any remaining `.color` use mean a site
    was missed; route it through `companyColor(id)`.
  - Run: `grep -rn "\.color\b" app components | grep -v "style={{"`. Every hit should read a model
    or series colour that already comes from `companyColor`.

- [ ] **Step 10: Commit**

```bash
git add lib/format.ts lib/format.test.ts lib/types.ts lib/data.ts data/companies.json scripts/palette-check.js app/page.tsx components/FilterRail.tsx components/CompanySelect.tsx components/charts.tsx
git commit -m "Allow companies without a palette slot; scope model UI to model companies"
```

---

### Task 3: Directory nav group and sub-tab strip

**Files:**
- Modify: `components/Nav.tsx`
- Create: `components/directory/DirectoryTabs.tsx`
- Modify: `app/page.tsx` (render `<DirectoryTabs />` above the header `<section>`)

**Interfaces:**
- Consumes: `visibleDirectoryTabs` and `activeDirectoryTab` (Task 1); `directoryCounts` (Task 2).
- Produces: `<DirectoryTabs />`, which renders nothing when fewer than 2 tabs are visible. Later
  stages drop it into each directory page.

- [ ] **Step 1: Create `components/directory/DirectoryTabs.tsx`:**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeDirectoryTab, visibleDirectoryTabs } from "@/lib/directory";
import { directoryCounts } from "@/lib/data";

/** The strip of Directory children shown at the top of each directory page.
 *  With only Models filled there is nothing to switch to, so it renders
 *  nothing rather than a lone tab. */
export function DirectoryTabs() {
  const pathname = usePathname();
  const tabs = visibleDirectoryTabs(directoryCounts);
  if (tabs.length < 2) return null;
  const active = activeDirectoryTab(pathname);

  return (
    <nav aria-label="Directory" className="-mx-1 mt-6 flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={active === t.key ? "page" : undefined}
          className={`relative shrink-0 px-3 py-2 text-sm ${
            active === t.key ? "text-ink" : "text-ink-2 hover:text-ink"
          }`}
        >
          {t.label}
          {active === t.key && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />}
        </Link>
      ))}
    </nav>
  );
}
```

  It uses `overflow-x-auto` and `shrink-0` so six tabs scroll sideways on a phone instead of
  wrapping.

- [ ] **Step 2: Restructure `components/Nav.tsx`.**
  - Turn the existing Tools `<details>` dropdown into a local `NavGroup` component with props
    `label`, `items: { href; label }[]`, `active: boolean` and `detailsRef`. Keep the existing
    close-on-navigate, outside-click and Escape behaviour; make the close handler loop over both
    refs.
  - `TABS` becomes Compare, News and Info.
  - Render order: `NavGroup` "Directory", `NavGroup` "Tools", then `TABS`.
    - Directory items: `visibleDirectoryTabs(directoryCounts).map(t => ({ href: t.href, label: t.label }))`.
    - Directory is active when `activeDirectoryTab(pathname) !== null`.
    - Tools items and its active rule are unchanged: `TOOLS.some(t => pathname.startsWith(t.href))`.
  - The site-title link stays `href="/"`.
  - Keep the `// Both tools keep their own top-level URLs…` comment, and add one line above the
    Directory group:
    `// "Directory" is a grouping like "Tools": its children keep flat URLs (/, /agents…).`

- [ ] **Step 3: Render the strip on the Models page.** In `app/page.tsx`, import
  `DirectoryTabs` from `@/components/directory/DirectoryTabs` and render `<DirectoryTabs />` as the
  first child of the top-level `<div>`. In Stage 1 it renders nothing.

- [ ] **Step 4: Verify the build, then check in the browser.**
  - Run `npm run build`. Expected: success.
  - Run `npm run dev`, then open `/`:
    - The nav shows **Directory ▾** (open: "Models" only), **Tools ▾**, Compare, News, Info.
    - Directory is underlined on `/` and on a cold load of `/models/claude-sonnet-5-5`.
    - It is not underlined on `/compare`.
    - The two dropdowns close each other's menus, close on Escape, and close on outside click.
  - Temporarily set `features: 1` in `directoryCounts`, reload, and check:
    - the strip shows "Models · Frontier Features";
    - at a 375px-wide viewport the strip scrolls sideways.
  - **Revert the temporary change.**

- [ ] **Step 5: Commit**

```bash
git add components/Nav.tsx components/directory/DirectoryTabs.tsx app/page.tsx
git commit -m "Add Directory nav group and sub-tab strip"
```

---

### Task 4: `scripts/integrity.js`

**Files:**
- Create: `scripts/integrity.js`, `scripts/integrity.test.js`
- Modify: `AGENTS.md` (the "Integrity check after any data edit" block, about line 54)
- Modify: `scripts/daily-sweep.sh` (the `bash -c "$(grep '^node -e' AGENTS.md | head -1)"` line, about line 181)

**Interfaces:**
- Produces:
  - `checkData(data) → string[]` (empty means OK)
  - `loadData(dir) → data`
  - `ALLOWED_FEATURE_COMPANIES` (exported)
  - the CLI `node scripts/integrity.js`, which exits 0 and prints `OK …` when clean, and otherwise
    exits 1 and prints one error per line
- `data` shape:
  `{ models, news, companies, reigns, directory: { "image-models"?, "video-models"?, harnesses?, agents?, features? } }`.
  A missing directory file means the key is absent.

- [ ] **Step 1: Write the failing tests** in `scripts/integrity.test.js`:

```js
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { checkData, loadData } = require("./integrity.js");

const base = () => ({
  companies: [
    { id: "anthropic", color: "#D97757", notable: true },
    { id: "tiny-lab", color: null, notable: false },
  ],
  models: [{ id: "m1", company: "anthropic", releaseDate: "2026-01-01", openWeights: false, license: null, predecessorId: null, retirementDate: null }],
  news: [{ id: "n1", modelIds: ["m1"] }],
  reigns: [],
  directory: {},
});

test("clean data passes", () => assert.deepEqual(checkData(base()), []));

test("missing directory files are fine (none exist until their stage ships)", () => {
  assert.deepEqual(checkData({ ...base(), directory: {} }), []);
});

test("the existing model rules still hold", () => {
  const d = base();
  d.models.push({ ...d.models[0] });
  d.models.push({ ...d.models[0], id: "m2", company: "nope" });
  d.models.push({ ...d.models[0], id: "m3", predecessorId: "m3" });
  d.models.push({ ...d.models[0], id: "m4", license: { spdx: "MIT" } });
  d.models.push({ ...d.models[0], id: "m5", retirementDate: "2025-01-01" });
  const errs = checkData(d).join("\n");
  for (const s of ["duplicate model id m1", "unknown company nope", "self-predecessor m3", "closed model with license m4", "retirement before release m5"])
    assert.match(errs, new RegExp(s));
});

test("predecessor cycles are caught", () => {
  const d = base();
  d.models = [
    { ...d.models[0], id: "a", predecessorId: "b" },
    { ...d.models[0], id: "b", predecessorId: "a" },
  ];
  assert.match(checkData(d).join("\n"), /predecessor cycle/);
});

test("overlapping reigns in a tier are caught", () => {
  const d = base();
  d.reigns = [
    { modelId: "m1", tier: "flagship", start: "2026-01-01", end: "2026-06-01" },
    { modelId: "m1", tier: "flagship", start: "2026-03-01", end: null },
  ];
  assert.match(checkData(d).join("\n"), /overlapping reigns in tier flagship/);
});

test("a null colour is only allowed on a non-notable company", () => {
  const d = base();
  d.companies[0].color = null;
  assert.match(checkData(d).join("\n"), /notable company anthropic has no colour/);
});

test("directory entries: unique ids, known companies, resolvable model refs", () => {
  const d = base();
  d.directory.harnesses = [
    { id: "h1", company: "anthropic", supportedModels: ["m1", "ghost"], scores: [{ benchmark: "terminalBench", modelId: "ghost2", score: 50 }] },
    { id: "h1", company: "nobody", supportedModels: "any", scores: [] },
  ];
  d.directory.agents = [{ id: "a1", company: "tiny-lab", underlyingModels: ["ghost3"] }];
  const errs = checkData(d).join("\n");
  for (const s of ["duplicate harnesses id h1", "harnesses h1: unknown company nobody", "harnesses h1: unknown model ghost$", "harnesses h1: unknown model ghost2", "agents a1: unknown model ghost3"])
    assert.match(errs, new RegExp(s, "m"));
});

test("features are limited to the five frontier labs", () => {
  const d = base();
  d.directory.features = [{ id: "f1", company: "tiny-lab", modelIds: [] }];
  assert.match(checkData(d).join("\n"), /features f1: company tiny-lab is not one of/);
});

test("news refs must resolve to their type's file", () => {
  const d = base();
  d.directory.agents = [{ id: "a1", company: "anthropic", underlyingModels: [] }];
  d.news[0].refs = [{ type: "agent", id: "a1" }, { type: "agent", id: "a2" }, { type: "widget", id: "x" }];
  const errs = checkData(d).join("\n");
  assert.match(errs, /news n1: unknown agent a2/);
  assert.match(errs, /news n1: unknown ref type widget/);
  assert.doesNotMatch(errs, /a1/);
});

test("duplicate news ids are caught", () => {
  const d = base();
  d.news.push({ id: "n1", modelIds: [] });
  assert.match(checkData(d).join("\n"), /duplicate news id n1/);
});

test("the repo's real data passes", () => {
  assert.deepEqual(checkData(loadData(path.join(__dirname, "..", "data"))), []);
});
```

- [ ] **Step 2: Run it to make sure it fails.**
  - Run: `node --test scripts/integrity.test.js`
  - Expected: FAIL, `Cannot find module './integrity.js'`.

- [ ] **Step 3: Implement `scripts/integrity.js`:**

```js
#!/usr/bin/env node
/**
 * Data integrity for every file in data/. Replaces the one-liner that used to
 * live in AGENTS.md (which the daily sweep grepped out and eval'd). Pure
 * checkData() is unit-tested; the CLI is what protocols and the sweep run.
 *
 *   node scripts/integrity.js     → "OK …" and exit 0, or one error per line and exit 1
 */
const fs = require("fs");
const path = require("path");

const ALLOWED_FEATURE_COMPANIES = ["anthropic", "openai", "google", "xai", "meta"];

// Directory file key → the `type` news refs use for it.
const DIRECTORY_FILES = {
  "image-models": "image-model",
  "video-models": "video-model",
  harnesses: "harness",
  agents: "agent",
  features: "feature",
};

function checkData({ models, news, companies, reigns, directory = {} }) {
  const errors = [];
  const err = (s) => errors.push(s);
  const companyIds = new Set(companies.map((c) => c.id));
  const modelIds = new Set(models.map((m) => m.id));

  for (const c of companies)
    if (c.color == null && c.notable !== false) err(`notable company ${c.id} has no colour`);

  const seen = new Set();
  for (const m of models) {
    if (seen.has(m.id)) err(`duplicate model id ${m.id}`);
    seen.add(m.id);
    if (!companyIds.has(m.company)) err(`unknown company ${m.company} on ${m.id}`);
    if (m.predecessorId) {
      if (m.predecessorId === m.id) err(`self-predecessor ${m.id}`);
      else if (!modelIds.has(m.predecessorId)) err(`unknown predecessorId ${m.predecessorId} on ${m.id}`);
    }
    if (!m.openWeights && m.license) err(`closed model with license ${m.id}`);
    if (m.retirementDate && m.retirementDate < m.releaseDate) err(`retirement before release ${m.id}`);
  }
  const byId = new Map(models.map((m) => [m.id, m]));
  // Same walk as the old one-liner: follow predecessors until one repeats.
  for (const m of models) {
    const chain = new Set();
    let cur = m.predecessorId;
    while (cur) {
      if (chain.has(cur)) { err(`predecessor cycle at ${m.id}`); break; }
      chain.add(cur);
      cur = byId.get(cur)?.predecessorId;
    }
  }

  for (const r of reigns) if (!modelIds.has(r.modelId)) err(`unknown reign modelId ${r.modelId}`);
  const tiers = {};
  for (const r of reigns) (tiers[r.tier] ||= []).push(r);
  for (const [tier, list] of Object.entries(tiers)) {
    list.sort((a, b) => a.start.localeCompare(b.start));
    for (let i = 1; i < list.length; i++)
      if (list[i - 1].end === null || list[i - 1].end > list[i].start) err(`overlapping reigns in tier ${tier}`);
  }

  const entryIds = {};
  for (const [file, entries] of Object.entries(directory)) {
    const ids = new Set();
    for (const e of entries) {
      if (ids.has(e.id)) err(`duplicate ${file} id ${e.id}`);
      ids.add(e.id);
      if (!companyIds.has(e.company)) err(`${file} ${e.id}: unknown company ${e.company}`);
      if (file === "features" && !ALLOWED_FEATURE_COMPANIES.includes(e.company))
        err(`${file} ${e.id}: company ${e.company} is not one of ${ALLOWED_FEATURE_COMPANIES.join(", ")}`);
      const refs = [
        ...(e.modelIds ?? []),
        ...(e.underlyingModels ?? []),
        ...(Array.isArray(e.supportedModels) ? e.supportedModels : []),
        ...(e.scores ?? []).map((s) => s.modelId).filter(Boolean),
      ];
      for (const id of refs) if (!modelIds.has(id)) err(`${file} ${e.id}: unknown model ${id}`);
      if (e.openWeights === false && e.license) err(`${file} ${e.id}: closed entry with license`);
    }
    entryIds[DIRECTORY_FILES[file]] = ids;
  }

  const newsIds = new Set();
  for (const n of news) {
    if (newsIds.has(n.id)) err(`duplicate news id ${n.id}`);
    newsIds.add(n.id);
    for (const id of n.modelIds ?? []) if (!modelIds.has(id)) err(`unknown modelId ${id} in news ${n.id}`);
    for (const ref of n.refs ?? []) {
      if (!Object.values(DIRECTORY_FILES).includes(ref.type)) err(`news ${n.id}: unknown ref type ${ref.type}`);
      else if (!entryIds[ref.type]?.has(ref.id)) err(`news ${n.id}: unknown ${ref.type} ${ref.id}`);
    }
  }
  return errors;
}

function loadData(dir) {
  const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const directory = {};
  for (const file of Object.keys(DIRECTORY_FILES)) {
    const p = path.join(dir, `${file}.json`);
    if (fs.existsSync(p)) directory[file] = read(`${file}.json`);
  }
  return {
    models: read("models.json"),
    news: read("news.json"),
    companies: read("companies.json"),
    reigns: read("frontier-reigns.json"),
    directory,
  };
}

function main() {
  const data = loadData(path.join(__dirname, "..", "data"));
  const errors = checkData(data);
  if (errors.length) {
    for (const e of errors) console.error(e);
    process.exit(1);
  }
  const extra = Object.entries(data.directory).map(([k, v]) => `${v.length} ${k}`).join(", ");
  console.log(`OK ${data.models.length} models, ${data.news.length} news${extra ? ", " + extra : ""}`);
}

if (require.main === module) main();

module.exports = { checkData, loadData, ALLOWED_FEATURE_COMPANIES };
```

- [ ] **Step 4: Run the tests to make sure they pass.**
  - Run: `node --test scripts/integrity.test.js`
  - Expected: 11 pass.
  - If "the repo's real data passes" fails, the script has found a real data problem. Report it;
    don't loosen the rule.
  - Run: `node scripts/integrity.js`. Expected: `OK <n> models, <n> news`.

- [ ] **Step 5: Point AGENTS.md and the sweep at the script.**
  - **AGENTS.md:** replace the fenced `node -e "…"` block under "Integrity check after any data
    edit" with:

    ````md
    ```bash
    node scripts/integrity.js
    ```
    ````

  - **AGENTS.md:** rewrite the paragraph after it to list what the script checks:
    - every rule the old one-liner checked;
    - duplicate news ids;
    - notable companies having a colour;
    - directory files (unique ids, known companies, model refs, feature companies limited to the
      five labs);
    - news `refs`;
    - plus that `scripts/integrity.test.js` runs it against the real data under `npm test`.
  - **`scripts/daily-sweep.sh`:** replace
    `bash -c "$(grep '^node -e' AGENTS.md | head -1)" > /tmp/sweep-integrity.log 2>&1 || FAILED="$FAILED integrity"`
    with
    `node scripts/integrity.js > /tmp/sweep-integrity.log 2>&1 || FAILED="$FAILED integrity"`.
  - **The sweep prompt's `health` line:** change "run the integrity check in AGENTS.md" to
    "run 'node scripts/integrity.js'".
  - **Protocols, agents and commands** that say "the integrity check in AGENTS.md" still resolve,
    because AGENTS.md now names the command. Leave them unchanged.

- [ ] **Step 6: Verify.**
  - Run: `npm test`. Expected: all pass, including the new file.
  - Run: `grep -n "node -e" AGENTS.md scripts/daily-sweep.sh`. Expected: no integrity one-liner
    remains.

- [ ] **Step 7: Commit**

```bash
git add scripts/integrity.js scripts/integrity.test.js AGENTS.md scripts/daily-sweep.sh
git commit -m "Move the integrity check into a tested script covering directory files"
```

---

### Task 5: Sweep branch guard and testable job selection

**Files:**
- Create: `scripts/lib/sweep-jobs.js`, `scripts/lib/sweep-jobs.test.js`
- Modify: `scripts/daily-sweep.sh` (Guard 2 area about line 45; job block lines 62–68)
- Modify: `protocols/DAILY_SWEEP_PROTOCOL.md` (cadence table and guards)

**Interfaces:**
- Produces:
  - `ROTATION`: `{ 1: "image-models", 2: "video-models", 3: "agents", 4: "harnesses", 5: "features" }`
  - `ENABLED_DIRECTORY_JOBS: string[]`, empty in Stage 1. Each later stage adds its key.
  - `jobsFor(dow: number, enabled: string[]): string[]`
  - `branchGuard(branch: string): string | null`, which returns a skip reason, or null to proceed.
  - CLI:
    - `node scripts/lib/sweep-jobs.js jobs <dow>` prints space-separated jobs.
    - `node scripts/lib/sweep-jobs.js guard <branch>` prints the reason and exits 3, or prints
      nothing and exits 0.

- [ ] **Step 1: Write the failing test** `scripts/lib/sweep-jobs.test.js`:

```js
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { jobsFor, branchGuard, ROTATION } = require("./sweep-jobs.js");

test("base cadence is unchanged when no directory job is enabled", () => {
  assert.deepEqual(jobsFor(1, []), ["health", "models", "news"]);
  assert.deepEqual(jobsFor(2, []), ["health", "models", "stats"]);
  assert.deepEqual(jobsFor(3, []), ["health", "models"]);
  assert.deepEqual(jobsFor(4, []), ["health", "models", "stats"]);
  assert.deepEqual(jobsFor(5, []), ["health", "models"]);
});

test("each directory job runs on its weekday once enabled", () => {
  assert.deepEqual(ROTATION, { 1: "image-models", 2: "video-models", 3: "agents", 4: "harnesses", 5: "features" });
  assert.deepEqual(jobsFor(5, ["features"]), ["health", "models", "features"]);
  assert.deepEqual(jobsFor(1, ["features"]), ["health", "models", "news"]);
  assert.deepEqual(jobsFor(1, ["image-models", "features"]), ["health", "models", "news", "image-models"]);
});

test("weekends get no jobs", () => {
  assert.deepEqual(jobsFor(6, ["features"]), []);
  assert.deepEqual(jobsFor(7, []), []);
});

test("the sweep only runs from main", () => {
  assert.equal(branchGuard("main"), null);
  assert.match(branchGuard("data/kolibri-phonon-2"), /not on main/);
  assert.match(branchGuard("HEAD"), /not on main/); // detached
});
```

- [ ] **Step 2: Run it to make sure it fails.**
  - Run: `node --test scripts/lib/sweep-jobs.test.js`
  - Expected: FAIL, `Cannot find module`.

- [ ] **Step 3: Implement `scripts/lib/sweep-jobs.js`:**

```js
/**
 * Which jobs the daily sweep runs, and whether it may run at all. Pulled out of
 * daily-sweep.sh so the schedule is tested rather than eyeballed.
 * Cadence: protocols/DAILY_SWEEP_PROTOCOL.md.
 */

// One directory per weekday, each scanned weekly (spec 2026-10-09).
const ROTATION = { 1: "image-models", 2: "video-models", 3: "agents", 4: "harnesses", 5: "features" };

// A directory's job switches on in the stage that ships its protocol and data.
const ENABLED_DIRECTORY_JOBS = [];

function jobsFor(dow, enabled) {
  if (dow < 1 || dow > 5) return [];
  const jobs = ["health", "models"];
  if (dow === 2 || dow === 4) jobs.push("stats");
  if (dow === 1) jobs.push("news");
  if (enabled.includes(ROTATION[dow])) jobs.push(ROTATION[dow]);
  return jobs;
}

/** The sweep checks out its own branch and later restores the starting one.
 *  Started from a working branch, it took over that session's edits
 *  (2026-10-01), so it only ever starts from main. */
function branchGuard(branch) {
  return branch === "main" ? null : `checkout is on ${branch}, not on main — refusing to switch branches under someone's work`;
}

if (require.main === module) {
  const [cmd, arg] = process.argv.slice(2);
  if (cmd === "jobs") console.log(jobsFor(Number(arg), ENABLED_DIRECTORY_JOBS).join(" "));
  else if (cmd === "guard") {
    const reason = branchGuard(arg);
    if (reason) { console.log(reason); process.exit(3); }
  } else { console.error("usage: sweep-jobs.js jobs <dow> | guard <branch>"); process.exit(2); }
}

module.exports = { ROTATION, ENABLED_DIRECTORY_JOBS, jobsFor, branchGuard };
```

- [ ] **Step 4: Run the tests to make sure they pass.**
  - Run: `node --test scripts/lib/sweep-jobs.test.js`
  - Expected: 4 pass.

- [ ] **Step 5: Wire it into `scripts/daily-sweep.sh`.**

  Directly after Guard 2's closing `fi`, add Guard 3:

```bash
# ── Guard 3: only from main ──────────────────────────────────────────────────
# Started on a working branch, the sweep checked out its own branch, committed
# that session's edits as "Daily sweep 2026-10-01" and opened a PR with them.
GUARD_REASON="$(node scripts/lib/sweep-jobs.js guard "$(git rev-parse --abbrev-ref HEAD)")"
if [ -n "$GUARD_REASON" ]; then
  if [ "$DRY_RUN" = 0 ]; then log "SKIP  $GUARD_REASON"; fi
  say "$GUARD_REASON; a real run would stop here"
  exit 0
fi
```

  Replace the three `JOBS=` lines (62–68, keeping the section header) with:

```bash
# Every weekday: health + new-model scan. Tue/Thu: stats. Mon: news. Plus one
# directory per weekday once its stage ships — see scripts/lib/sweep-jobs.js.
JOBS="$(node scripts/lib/sweep-jobs.js jobs "$DOW")"
```

- [ ] **Step 6: Verify the sweep by hand.**
  - On a scratch branch with a clean tree: `git switch -c tmp/guard-test && scripts/daily-sweep.sh --dry-run`
    - Expected: prints `checkout is on tmp/guard-test, not on main …; a real run would stop here`.
    - Check that no line was added to `logs/daily-sweep.log`.
  - On main: `git switch main && scripts/daily-sweep.sh --dry-run`
    - Expected: `jobs for today (dow=N): …`, matching `jobsFor(N, [])`.
  - Clean up with `git branch -D tmp/guard-test`.

- [ ] **Step 7: Update `protocols/DAILY_SWEEP_PROTOCOL.md`.**
  - Add the directory column to the cadence table:
    - Mon image-models, Tue video-models, Wed agents, Thu harnesses, Fri features.
    - Mark each "(from Stage N)".
    - Say the job only runs once listed in `ENABLED_DIRECTORY_JOBS`.
  - Add a guard bullet: "It refuses to run unless the checkout is on `main` (Guard 3), so it can
    never take over a working branch."
  - Merge the protocol's two separate "## Guards" headings into one.

- [ ] **Step 8: Commit**

```bash
git add scripts/lib/sweep-jobs.js scripts/lib/sweep-jobs.test.js scripts/daily-sweep.sh protocols/DAILY_SWEEP_PROTOCOL.md
git commit -m "Sweep: refuse to run off main; move weekday job selection into a tested helper"
```

---

### Task 6: Docs and whole-stage verification

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Update `AGENTS.md`.**
  - **Intro and Pages:**
    - "Models Directory (`/`)" becomes a **Directory** nav group (like Tools, a grouping only).
    - Its children are Models (`/`), Image models, Video models, Harnesses, Agents and Frontier
      Features.
    - Each child appears once its data file has entries.
  - **companies.json:**
    - add `notable`;
    - `color` may be `null` only for non-notable companies, and those render neutral grey;
    - `palette-check.js` checks coloured companies only.
  - **Code layout:**
    - `lib/directory.ts`: tab registry, visibility, pathname matching, `companiesWithEntries`.
    - `components/directory/DirectoryTabs`.
    - `scripts/integrity.js`.
    - `scripts/lib/sweep-jobs.js`.
  - **Protocols table (daily sweep row):**
    - add "Refuses to run unless on `main`."
    - add "Directory jobs rotate by weekday (`scripts/lib/sweep-jobs.js`)."

- [ ] **Step 2: Run the whole-stage checks.**
  - Run: `npm test && node scripts/integrity.js && node scripts/palette-check.js && npm run build`
  - Expected: all pass.
  - Browser (`npm run dev`):
    - `/`: the directory looks exactly as before, chips and counts unchanged. The nav shows
      Directory ▾ and Tools ▾.
    - `/models/<id>`: both a cold load and the drawer from the grid still work.
    - `/compare`: the filter rail lists the same companies as before.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "Document the Directory framework"
```

---

## Later stages (separate plans)

Each gets its own plan, written once this stage has merged, so it builds on real code:

- **Stage 2, Frontier Features:**
  - `data/features.json` and its `lib/data.ts` loader (replacing the `features: 0` count);
  - generic `EntryCard`/`EntryDetail` and the `FeatureTimeline` page, with month grouping in
    `lib/directory.ts`;
  - the `/features/[id]` page and `@modal` drawer;
  - the `DIRECTORY_RELEASE_PROTOCOL.md` core and its features section, the style guide, and the
    `directory-release` agent;
  - `ENABLED_DIRECTORY_JOBS = ["features"]` and the sweep prompt's job line;
  - news `refs` rendering;
  - the sitemap;
  - the first data fill.
- **Stage 3:** image and video models.
- **Stage 4:** harnesses and agents, plus "Runs on" and "Used by" links.
- **Stage 5:** docs (`/info` methodology), and folding any remaining doc work into each stage.
