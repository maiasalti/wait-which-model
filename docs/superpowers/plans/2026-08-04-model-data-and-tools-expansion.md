# Model Data and Tools Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five data dimensions to the model schema, derive frontier reigns and benchmark coverage, restructure the model drawer so beginners see less, and ship three decision tools (shareable Compare, spec diff, cost calculator).

**Architecture:** All content stays file-driven — no backend. New scalar fields go on `Model` as nullable, so the 73 existing entries stay valid the moment types land. Anything the site *computes* (reigns) is derived by a Node script into a committed JSON artifact, exactly as `frontier-status.js` already writes computed status. Pure logic lives in dependency-free modules that take data as arguments; React components stay thin.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19.2.4, TypeScript, Tailwind, Recharts. Tests run on Node 25's built-in runner (`node --test`) — no new dependencies.

## Global Constraints

- **No new npm dependencies.** The project has 9 runtime deps; every task here is achievable with zero additions. PNG export is hand-drawn to canvas rather than pulling a DOM-to-image library.
- **Never add figures from memory.** Per `AGENTS.md`, all model data comes from web research; unverified values are `null`. Tasks in this plan write `null`, never invented numbers.
- **`npm run build` is the primary correctness check.** All routes are static; the build is where Next-specific breakage surfaces.
- **Test files must use relative imports, never `@/` aliases.** Node's test runner does not read `tsconfig.json` paths. Therefore: **pure logic modules must not import `lib/data.ts`** (which uses `@/` aliases and pulls in JSON). Pure functions take data as parameters.
- **Test command:** `node --test "lib/**/*.test.ts" "scripts/**/*.test.js"`. Directory arguments do **not** work (Node treats them as files); glob strings do. Verified 2026-08-04 on Node v25.9.0.
- **`status` remains computed, never hand-assigned** (except `deprecated`). This plan adds a second derivation but changes no existing status logic.
- **Every derivation must be documented on `/info`**, as content in `data/methodology.json`, not component copy.
- Company brand color is the only saturated hue system; series color always follows the company.

---

## File Structure

**New — pure logic (tested with `node --test`):**

| File | Responsibility |
|---|---|
| `scripts/lib/composite.js` | Benchmark normalisation + composite scoring. Shared by both derivation scripts so they cannot drift. |
| `scripts/frontier-reigns.js` | Derives reign spans → `data/frontier-reigns.json`. |
| `lib/reigns.ts` | Reign types + elapsed-days maths. No JSON imports. |
| `lib/compare-url.ts` | Serialise/parse Compare page state ↔ query string. |
| `lib/spec-diff.ts` | Diff field definitions, value extraction, better/worse verdicts. |
| `lib/cost-calc.ts` | Monthly cost maths + included/excluded partitioning. |

**New — components:**

| File | Responsibility |
|---|---|
| `components/Collapsible.tsx` | Server-safe `<details>` wrapper. No `"use client"`. |
| `components/model/ModelDeveloperDetails.tsx` | API strings, licence, retirement, lineage. |
| `components/SpecDiff.tsx` | Diff picker + table + export buttons. |
| `components/ReignChart.tsx` | Days-at-frontier bars. |
| `components/BenchmarkCoverage.tsx` | "n of 73 report this" panel. |
| `app/cost-calculator/page.tsx` | Cost calculator route. |

**New — docs:** `protocols/MODEL_SPECS_PROTOCOL.md`, `.claude/agents/spec-filler.md`, `data/spec-gaps.md`

**Modified:** `lib/types.ts`, `lib/data.ts`, `data/models.json`, `data/methodology.json`, `components/Nav.tsx`, `components/ModelDrawer.tsx`, `components/model/ModelStatsGrid.tsx`, `components/model/ModelBenchmarks.tsx`, `app/models/[id]/page.tsx`, `app/compare/page.tsx`, `app/info/page.tsx`, `AGENTS.md`, `package.json`

---

# PHASE 1 — Schema and reign derivation

### Task 1: Test infrastructure and schema types

**Files:**
- Modify: `package.json` (scripts block)
- Modify: `lib/types.ts`

**Interfaces:**
- Produces: `Speed`, `License`, `LicenseKind`, `ApiId` interfaces; `Model` gains `speed`, `license`, `apiIds`, `retirementDate`, `predecessorId`.

> **This task ships no unit tests, deliberately.** Node's test runner *strips*
> TypeScript types without checking them — verified 2026-08-04: a file with a
> deliberate type error passes `node --test`. A "type test" here would therefore
> pass even when the types are wrong, which is worse than no test. `npm run build`
> runs `tsc` and is the real check for a types-only change. The first genuine unit
> tests land in Task 3, against actual logic.

- [ ] **Step 1: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "node --test \"lib/**/*.test.ts\" \"scripts/**/*.test.js\""
```

Directory arguments do **not** work — Node treats them as test files and fails. Glob strings are required.

- [ ] **Step 2: Add the types**

In `lib/types.ts`, add after the `CostPerTask` interface:

```ts
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
```

Then add to the `Model` interface, after `knowledgeCutoff`:

```ts
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
```

- [ ] **Step 3: Write the one-shot data migration**

The types and the data must land in the same commit — the new fields are non-optional, so types alone would leave `models.json` failing to type-check and the build broken.

Create `scripts/add-spec-fields.js`:

```js
#!/usr/bin/env node
/** One-shot: adds the Phase 1 spec fields to every model as empty values.
 *  Inserted after knowledgeCutoff so field order stays readable in the diff. */
const fs = require("fs");
const path = require("path");

const MODELS_PATH = path.join(__dirname, "..", "data", "models.json");
const models = JSON.parse(fs.readFileSync(MODELS_PATH, "utf8"));

const updated = models.map((m) => {
  const out = {};
  for (const [k, v] of Object.entries(m)) {
    out[k] = v;
    if (k === "knowledgeCutoff") {
      out.speed = m.speed ?? { outputTokensPerSec: null, timeToFirstTokenSec: null };
      out.license = m.license ?? null;
      out.apiIds = m.apiIds ?? [];
      out.retirementDate = m.retirementDate ?? null;
      out.predecessorId = m.predecessorId ?? null;
    }
  }
  return out;
});

fs.writeFileSync(MODELS_PATH, JSON.stringify(updated, null, 2) + "\n");
console.log(`Added spec fields to ${updated.length} models.`);
```

- [ ] **Step 4: Run the migration**

Run: `node scripts/add-spec-fields.js`
Expected: `Added spec fields to 73 models.`

- [ ] **Step 5: Verify every model got every field**

Run:

```bash
node -e "const m=require('./data/models.json');const miss=m.filter(x=>!('speed'in x)||!('license'in x)||!('apiIds'in x)||!('retirementDate'in x)||!('predecessorId'in x));console.log(miss.length===0?'OK all '+m.length:'MISSING '+miss.map(x=>x.id))"
```

Expected: `OK all 73`

- [ ] **Step 6: Verify the build type-checks**

Run: `npm run build`
Expected: succeeds. This is the real check for this task — `next build` runs `tsc`, so a green build proves `models.json` satisfies the new `Model` shape.

- [ ] **Step 7: Verify the test runner is wired up**

Run: `npm test`
Expected: the runner starts and reports 0 tests (no test files exist yet). It must not error on the glob itself.

- [ ] **Step 8: Delete the one-shot script and commit**

The migration is not reusable — it exists to produce one diff. Delete it before committing so it never becomes dead weight.

```bash
rm scripts/add-spec-fields.js
git add package.json lib/types.ts data/models.json
git commit -m "Add speed, license, apiIds, retirement and lineage fields"
```

---

### Task 2: Integrity rules and documentation for the new fields

**Files:**
- Modify: `AGENTS.md` (integrity check + data-file description)

**Interfaces:**
- Consumes: the fields added in Task 1.
- Produces: an integrity check that enforces the lineage and licence invariants.

- [ ] **Step 1: Extend the integrity check in `AGENTS.md`**

Replace the integrity-check code block with:

```bash
node -e "const m=require('./data/models.json'),n=require('./data/news.json'),c=require('./data/companies.json');const cids=new Set(c.map(x=>x.id)),ids=new Set(m.map(x=>x.id));if(m.length!==ids.size)throw 'dup id';for(const x of m)if(!cids.has(x.company))throw 'unknown company '+x.company;for(const x of n)for(const i of x.modelIds)if(!ids.has(i))throw 'unknown modelId '+i;for(const x of m){if(x.predecessorId){if(!ids.has(x.predecessorId))throw 'unknown predecessorId '+x.predecessorId+' on '+x.id;if(x.predecessorId===x.id)throw 'self-predecessor '+x.id}if(!x.openWeights&&x.license)throw 'closed model with license '+x.id;if(x.retirementDate&&x.retirementDate<x.releaseDate)throw 'retirement before release '+x.id}for(const x of m){const seen=new Set();let cur=x.predecessorId;while(cur){if(seen.has(cur))throw 'predecessor cycle at '+x.id;seen.add(cur);cur=(m.find(y=>y.id===cur)||{}).predecessorId}}console.log('OK')"
```

Note the `license`/`openWeights` rule is **one-directional**: a closed-weight model carrying a licence record is a contradiction and fails; an open-weight model with `license: null` is merely unresearched and must pass.

- [ ] **Step 2: Run the integrity check**

Run the command from Step 1.
Expected: `OK`

- [ ] **Step 3: Prove each new rule actually fires**

A validation rule nobody has seen fail is not known to work. Temporarily corrupt the data, confirm the check throws, then restore it. Run each of these and confirm the check reports the matching error, then `git checkout data/models.json` after each:

```bash
# self-predecessor
node -e "const f='./data/models.json',m=require(f);m[0].predecessorId=m[0].id;require('fs').writeFileSync(f,JSON.stringify(m,null,2)+'\n')"
# → integrity check must throw: self-predecessor <id>
git checkout data/models.json

# closed model carrying a licence
node -e "const f='./data/models.json',m=require(f);const x=m.find(y=>!y.openWeights);x.license={spdx:'MIT',name:'MIT',kind:'permissive',url:null,commercialUse:true};require('fs').writeFileSync(f,JSON.stringify(m,null,2)+'\n')"
# → integrity check must throw: closed model with license <id>
git checkout data/models.json

# retirement before release
node -e "const f='./data/models.json',m=require(f);m[0].retirementDate='2000-01-01';require('fs').writeFileSync(f,JSON.stringify(m,null,2)+'\n')"
# → integrity check must throw: retirement before release <id>
git checkout data/models.json
```

Confirm `git status` is clean afterwards, then re-run the integrity check and confirm it prints `OK` again.

- [ ] **Step 4: Document the new fields in `AGENTS.md`**

In the `models.json` bullet under "Data files", extend the field list after `knowledgeCutoff` with:

```
speed: {outputTokensPerSec, timeToFirstTokenSec} (Artificial Analysis), license: {spdx, name, kind, url, commercialUse} | null (open-weight models only), apiIds: [{provider, id}], retirementDate, predecessorId (points backwards; successors are derived)
```

- [ ] **Step 5: Commit**

```bash
git add AGENTS.md
git commit -m "Add integrity rules for lineage, licence and retirement fields"
```

---

### Task 3: Extract composite scoring into a shared module

**Files:**
- Create: `scripts/lib/composite.js`
- Create: `scripts/lib/composite.test.js`
- Modify: `scripts/frontier-status.js`

**Interfaces:**
- Produces: `BENCHMARK_KEYS: string[]`, `MIN_BENCHMARKS: number`, `countBenchmarks(model): number`, `isRankable(model, min): boolean`, `compositeScores(cohort): Map<string, number>`.

- [ ] **Step 1: Write the failing test**

Create `scripts/lib/composite.test.js`:

```js
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { compositeScores, countBenchmarks, isRankable } = require("./composite.js");

const mk = (id, benchmarks) => ({ id, benchmarks });

test("countBenchmarks ignores nulls", () => {
  assert.equal(countBenchmarks(mk("a", { aime: 1, hle: null, sweBench: 2 })), 2);
});

test("isRankable enforces the minimum", () => {
  const m = mk("a", { aime: 1, hle: 2 });
  assert.equal(isRankable(m, 3), false);
  assert.equal(isRankable(m, 2), true);
});

test("compositeScores normalises to 0..1 within the cohort", () => {
  const cohort = [
    mk("low", { aime: 0, hle: 0, sweBench: 0 }),
    mk("high", { aime: 100, hle: 100, sweBench: 100 }),
  ];
  const s = compositeScores(cohort);
  assert.equal(s.get("low"), 0);
  assert.equal(s.get("high"), 1);
});

test("a single-member cohort scores 1 rather than dividing by zero", () => {
  const s = compositeScores([mk("only", { aime: 42, hle: 7, sweBench: 9 })]);
  assert.equal(s.get("only"), 1);
});

test("models are scored only on benchmarks they report", () => {
  const cohort = [
    mk("full", { aime: 100, hle: 0, sweBench: 50 }),
    mk("partial", { aime: 100, hle: null, sweBench: null }),
  ];
  const s = compositeScores(cohort);
  // "partial" reports only aime, where it ties the max, so it scores 1.
  assert.equal(s.get("partial"), 1);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `./composite.js`.

- [ ] **Step 3: Write the module**

Create `scripts/lib/composite.js`:

```js
/** Benchmark normalisation shared by frontier-status.js and frontier-reigns.js.
 *  Extracted so the two derivations cannot drift apart. */

const BENCHMARK_KEYS = [
  "mmluPro",
  "gpqaDiamond",
  "sweBench",
  "terminalBench",
  "aime",
  "hle",
  "lmarenaElo",
  "arcAgi2",
];

const MIN_BENCHMARKS = 3;

function countBenchmarks(model) {
  return BENCHMARK_KEYS.filter((k) => model.benchmarks[k] != null).length;
}

function isRankable(model, min = MIN_BENCHMARKS) {
  return countBenchmarks(model) >= min;
}

/** Min-max normalises each benchmark across the cohort, then averages each
 *  model over whichever benchmarks it reports. Note this means two models
 *  reporting different benchmark subsets are not compared on identical
 *  ground — a documented limitation, surfaced on /info. */
function compositeScores(cohort) {
  const ranges = {};
  for (const key of BENCHMARK_KEYS) {
    const vals = cohort.map((m) => m.benchmarks[key]).filter((v) => v != null);
    if (vals.length === 0) continue;
    ranges[key] = { min: Math.min(...vals), max: Math.max(...vals) };
  }

  const scores = new Map();
  for (const m of cohort) {
    const parts = [];
    for (const key of BENCHMARK_KEYS) {
      const v = m.benchmarks[key];
      if (v == null) continue;
      const r = ranges[key];
      parts.push(r.max === r.min ? 1 : (v - r.min) / (r.max - r.min));
    }
    scores.set(m.id, parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0);
  }
  return scores;
}

module.exports = { BENCHMARK_KEYS, MIN_BENCHMARKS, countBenchmarks, isRankable, compositeScores };
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 5 new tests.

- [ ] **Step 5: Rewire `frontier-status.js` to use the module**

In `scripts/frontier-status.js`:

1. Delete the local `const BENCHMARK_KEYS = [...]` array (the 10-line block after `MODELS_PATH`).
2. Delete the local `MIN_BENCHMARKS` constant.
3. Add after the `path` require:

```js
const {
  BENCHMARK_KEYS,
  MIN_BENCHMARKS,
  countBenchmarks,
  isRankable,
  compositeScores,
} = require("./lib/composite.js");
```

4. Replace the `rankable` filter with:

```js
    const rankable = candidates.filter((m) => isRankable(m));
```

5. Replace the `ranges` block and the `composite` Map construction (from `// Per-benchmark min/max…` through the closing of the composite loop) with:

```js
    const composite = compositeScores(rankable);
```

6. Replace the benchmark count inside the `!isRankable` reason string with `countBenchmarks(m)`.

- [ ] **Step 6: Verify the refactor changed no output**

Run: `node scripts/frontier-status.js`
Expected: `No status changes needed.` — identical to before the refactor. If it proposes changes, the refactor altered behaviour and must be fixed before continuing.

- [ ] **Step 7: Commit**

```bash
git add scripts/lib/composite.js scripts/lib/composite.test.js scripts/frontier-status.js
git commit -m "Extract composite scoring into a shared module"
```

---

### Task 4: Derive frontier reigns

**Files:**
- Create: `scripts/frontier-reigns.js`
- Create: `scripts/frontier-reigns.test.js`
- Create: `data/frontier-reigns.json` (generated)
- Modify: `AGENTS.md` (protocols table + data files)

**Interfaces:**
- Consumes: `scripts/lib/composite.js` from Task 3.
- Produces: `computeReigns(models): Reign[]` where `Reign = { modelId, tier, start, end, dethronedBy, composite }`; `data/frontier-reigns.json` is that array.

- [ ] **Step 1: Write the failing test**

Create `scripts/frontier-reigns.test.js`:

```js
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { computeReigns } = require("./frontier-reigns.js");

const mk = (id, releaseDate, tier, benchmarks) => ({ id, releaseDate, tier, benchmarks, status: "superseded" });
const THREE = (v) => ({ aime: v, hle: v, sweBench: v });

test("the first rankable model in a tier takes the crown", () => {
  const reigns = computeReigns([mk("a", "2024-01-01", "flagship", THREE(50))]);
  assert.equal(reigns.length, 1);
  assert.equal(reigns[0].modelId, "a");
  assert.equal(reigns[0].start, "2024-01-01");
  assert.equal(reigns[0].end, null);
  assert.equal(reigns[0].dethronedBy, null);
});

test("a later, better model dethrones the incumbent", () => {
  const reigns = computeReigns([
    mk("a", "2024-01-01", "flagship", THREE(50)),
    mk("b", "2024-06-01", "flagship", THREE(90)),
  ]);
  assert.equal(reigns.length, 2);
  const a = reigns.find((r) => r.modelId === "a");
  assert.equal(a.end, "2024-06-01");
  assert.equal(a.dethronedBy, "b");
  assert.equal(reigns.find((r) => r.modelId === "b").end, null);
});

test("a later but weaker model never takes the crown", () => {
  const reigns = computeReigns([
    mk("a", "2024-01-01", "flagship", THREE(90)),
    mk("b", "2024-06-01", "flagship", THREE(50)),
  ]);
  assert.deepEqual(reigns.map((r) => r.modelId), ["a"]);
  assert.equal(reigns[0].end, null);
});

test("models below the benchmark minimum cannot be crowned", () => {
  const reigns = computeReigns([
    mk("a", "2024-01-01", "flagship", THREE(50)),
    mk("sparse", "2024-06-01", "flagship", { aime: 100 }),
  ]);
  assert.deepEqual(reigns.map((r) => r.modelId), ["a"]);
});

test("tiers are ranked independently", () => {
  const reigns = computeReigns([
    mk("big", "2024-01-01", "flagship", THREE(90)),
    mk("small", "2024-02-01", "fast", THREE(10)),
  ]);
  assert.equal(reigns.length, 2);
  assert.equal(reigns.find((r) => r.modelId === "small").tier, "fast");
});

test("deprecated models still count — they held the frontier historically", () => {
  const dep = { ...mk("old", "2023-01-01", "flagship", THREE(50)), status: "deprecated" };
  const reigns = computeReigns([dep, mk("new", "2025-01-01", "flagship", THREE(90))]);
  assert.deepEqual(reigns.map((r) => r.modelId).sort(), ["new", "old"]);
});

test("reigns within a tier never overlap", () => {
  const reigns = computeReigns([
    mk("a", "2024-01-01", "flagship", THREE(10)),
    mk("b", "2024-06-01", "flagship", THREE(50)),
    mk("c", "2025-01-01", "flagship", THREE(90)),
  ]).filter((r) => r.tier === "flagship").sort((x, y) => x.start.localeCompare(y.start));
  for (let i = 0; i < reigns.length - 1; i++) {
    assert.equal(reigns[i].end, reigns[i + 1].start);
  }
});

test("no days field is stored — it would go stale daily", () => {
  const reigns = computeReigns([mk("a", "2024-01-01", "flagship", THREE(50))]);
  assert.equal("days" in reigns[0], false);
});

test("a same-day pair crowns only the stronger — no phantom zero-day reign", () => {
  // Both same-day models beat the incumbent. Judged one at a time, the weaker
  // one (sorting first by id) would be crowned and dethroned on the same date,
  // inventing a reign it never held.
  const reigns = computeReigns([
    mk("incumbent", "2024-01-01", "flagship", THREE(10)),
    mk("aaa", "2024-06-01", "flagship", THREE(50)),
    mk("zzz", "2024-06-01", "flagship", THREE(90)),
  ]);
  assert.deepEqual(reigns.map((r) => r.modelId), ["incumbent", "zzz"]);
  assert.equal(reigns.find((r) => r.modelId === "incumbent").dethronedBy, "zzz");
  for (const r of reigns) assert.notEqual(r.start, r.end);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `./frontier-reigns.js`.

- [ ] **Step 3: Write the script**

Create `scripts/frontier-reigns.js`:

```js
#!/usr/bin/env node
/**
 * Derives how long each model held the top of its tier, into
 * data/frontier-reigns.json.
 *
 * This is a RECONSTRUCTION, not an observed log: frontier-status.js keeps no
 * history, so reigns are inferred from release dates and benchmark scores. The
 * composite is min-max normalised across the tier cohort and averaged over
 * whichever benchmarks each model reports, so models reporting different
 * benchmark subsets are not compared on identical ground. /info says so.
 *
 * Re-run after any benchmark data changes — reigns depend on them.
 *
 * Usage:
 *   node scripts/frontier-reigns.js           # print the derived reigns
 *   node scripts/frontier-reigns.js --apply   # write data/frontier-reigns.json
 */
const fs = require("fs");
const path = require("path");
const { isRankable, compositeScores } = require("./lib/composite.js");

const MODELS_PATH = path.join(__dirname, "..", "data", "models.json");
const REIGNS_PATH = path.join(__dirname, "..", "data", "frontier-reigns.json");

/** @returns {{modelId,tier,start,end,dethronedBy,composite}[]} */
function computeReigns(models) {
  const byTier = new Map();
  for (const m of models) {
    if (!byTier.has(m.tier)) byTier.set(m.tier, []);
    byTier.get(m.tier).push(m);
  }

  const reigns = [];
  for (const [tier, group] of byTier) {
    // Every model that ever existed in the tier, including deprecated ones —
    // a retired model still held the frontier while it was alive.
    const rankable = group.filter((m) => isRankable(m));
    if (rankable.length === 0) continue;

    const scores = compositeScores(rankable);
    const ordered = rankable
      .slice()
      .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.id.localeCompare(b.id));

    // Group by release date so a same-day cohort is judged as a unit: only the
    // day's strongest contender can take the crown. Walking same-day models one
    // at a time would crown a weaker sibling and dethrone it the same day,
    // fabricating a zero-length reign it never actually held.
    const byDate = new Map();
    for (const m of ordered) {
      if (!byDate.has(m.releaseDate)) byDate.set(m.releaseDate, []);
      byDate.get(m.releaseDate).push(m);
    }

    let champion = null;
    for (const [releaseDate, cohort] of byDate) {
      // Strict `>` keeps the lowest id on a score tie, matching `ordered`.
      const best = cohort.reduce((a, b) => (scores.get(b.id) > scores.get(a.id) ? b : a));
      if (champion === null || scores.get(best.id) > scores.get(champion.modelId)) {
        if (champion) {
          champion.end = releaseDate;
          champion.dethronedBy = best.id;
        }
        champion = {
          modelId: best.id,
          tier,
          start: releaseDate,
          end: null,
          dethronedBy: null,
          composite: Number(scores.get(best.id).toFixed(4)),
        };
        reigns.push(champion);
      }
    }
  }
  return reigns;
}

function main() {
  const apply = process.argv.includes("--apply");
  const models = JSON.parse(fs.readFileSync(MODELS_PATH, "utf8"));
  const reigns = computeReigns(models);

  for (const r of reigns) {
    console.log(
      `  ${r.tier.padEnd(9)} ${r.modelId.padEnd(24)} ${r.start} → ${r.end ?? "current"}` +
        (r.dethronedBy ? `  (dethroned by ${r.dethronedBy})` : "")
    );
  }
  console.log(`\n${reigns.length} reign(s) across ${new Set(reigns.map((r) => r.tier)).size} tier(s).`);

  if (apply) {
    fs.writeFileSync(REIGNS_PATH, JSON.stringify(reigns, null, 2) + "\n");
    console.log(`Wrote ${path.relative(process.cwd(), REIGNS_PATH)}.`);
  } else {
    console.log("Run again with --apply to write data/frontier-reigns.json.");
  }
}

if (require.main === module) main();

module.exports = { computeReigns };
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 8 new tests.

- [ ] **Step 5: Generate the data file**

Run: `node scripts/frontier-reigns.js --apply`
Expected: a printed reign list, then `Wrote data/frontier-reigns.json.`

- [ ] **Step 6: Sanity-check the output against reality**

Run:

```bash
node -e "const r=require('./data/frontier-reigns.json');console.log('reigns',r.length);console.log('current champions:',r.filter(x=>x.end===null).map(x=>x.tier+'='+x.modelId).join(', '))"
```

Expected: one current champion per tier, and each should be a plausible recent model. If a 2023 model is still champion of a tier, the composite is wrong — stop and investigate before continuing.

Then check the file's structural invariants — every id resolves, and reigns within a tier never overlap:

```bash
node -e "const r=require('./data/frontier-reigns.json'),m=require('./data/models.json');const ids=new Set(m.map(x=>x.id));for(const x of r){if(!ids.has(x.modelId))throw 'unknown modelId '+x.modelId;if(x.dethronedBy&&!ids.has(x.dethronedBy))throw 'unknown dethronedBy '+x.dethronedBy}const byTier={};for(const x of r)(byTier[x.tier]=byTier[x.tier]||[]).push(x);for(const[t,list]of Object.entries(byTier)){list.sort((a,b)=>a.start.localeCompare(b.start));for(let i=0;i<list.length-1;i++)if(list[i].end!==list[i+1].start)throw 'overlap or gap in '+t+' at '+list[i].modelId;if(list[list.length-1].end!==null)throw 'no current champion in '+t}console.log('OK')"
```

Expected: `OK`

- [ ] **Step 7: Document in `AGENTS.md`**

Add a row to the protocols table:

```
| "recompute frontier reigns" / run automatically after any benchmark data change | `node scripts/frontier-reigns.js` (then `--apply`) — reigns are **derived**, never hand-edited | — |
```

Add to the Data files list:

```
- **frontier-reigns.json** — generated by `scripts/frontier-reigns.js`; `{ modelId, tier, start, end, dethronedBy, composite }`. A reconstruction from release dates and benchmark scores, not an observed history. Never hand-edit; re-run the script after any benchmark change. `days` is deliberately absent — it is computed at render so the file does not churn daily.
```

- [ ] **Step 8: Commit**

```bash
git add scripts/frontier-reigns.js scripts/frontier-reigns.test.js data/frontier-reigns.json AGENTS.md
git commit -m "Derive frontier reigns into a committed artifact"
```

---

# PHASE 2 — Collapsible drawer and model page

### Task 5: Server-safe Collapsible component

**Files:**
- Create: `components/Collapsible.tsx`

**Interfaces:**
- Produces: `<Collapsible title={string} meta?={string} defaultOpen?={boolean}>{children}</Collapsible>`

- [ ] **Step 1: Write the component**

Create `components/Collapsible.tsx`. **Do not add `"use client"`** — this is deliberate. `app/models/[id]/page.tsx` is a server component, and a `useState` accordion would force the whole page client-side. Native `<details>` also gives keyboard operation, screen-reader semantics and find-in-page expansion for free.

```tsx
import type { ReactNode } from "react";

/** Native <details> so the standalone model page stays a server component.
 *  `meta` is the muted right-hand note in the summary — used for the
 *  benchmark coverage count, which doubles as an honesty signal. */
export function Collapsible({
  title,
  meta,
  defaultOpen = false,
  children,
}: {
  title: string;
  meta?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-t border-line pt-3">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-2 transition-colors hover:text-ink">
        <span
          aria-hidden
          className="text-ink-3 transition-transform group-open:rotate-90"
        >
          ▸
        </span>
        <span>{title}</span>
        {meta && <span className="mono ml-auto text-[10px] normal-case tracking-normal text-ink-3">{meta}</span>}
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds. (The component is unused so far; this only checks it type-checks.)

- [ ] **Step 3: Commit**

```bash
git add components/Collapsible.tsx
git commit -m "Add server-safe Collapsible built on native details"
```

---

### Task 6: Add speed to the stats grid and coverage to benchmarks

**Files:**
- Modify: `components/model/ModelStatsGrid.tsx`
- Modify: `components/model/ModelBenchmarks.tsx`
- Modify: `lib/data.ts`
- Create: `lib/format.test.ts`

**Interfaces:**
- Consumes: `Model.speed` from Task 1.
- Produces: `formatSpeed(tps, ttft): string` exported from `lib/data.ts`; `ModelBenchmarks` exports `benchmarkCoverage(model): { reported: number; total: number }`.

- [ ] **Step 1: Write the failing test**

Create `lib/format.test.ts`. Note the relative import and that `formatSpeed` must be a **pure function taking primitives** so it is testable without the `@/`-aliased JSON in `lib/data.ts`.

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatSpeed } from "./format.ts";

test("formats both figures when present", () => {
  assert.equal(formatSpeed(120.4, 0.42), "120 tok/s · 0.42s to first answer token");
});

test("shows only what is known", () => {
  assert.equal(formatSpeed(120.4, null), "120 tok/s");
  assert.equal(formatSpeed(null, 0.42), "0.42s to first answer token");
});

test("unmeasured speed renders as a dash, not a zero", () => {
  assert.equal(formatSpeed(null, null), "—");
});

test("drops false precision on long reasoning latencies", () => {
  // Two decimals on a three-minute measurement claims accuracy that does not
  // exist; below 10s, hundredths are still meaningful.
  assert.equal(formatSpeed(83, 202.22), "83 tok/s · 202s to first answer token");
  assert.equal(formatSpeed(null, 9.99), "9.99s to first answer token");
  assert.equal(formatSpeed(null, 10.4), "10s to first answer token");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `./format.ts`.

- [ ] **Step 3: Create the pure formatter**

Create `lib/format.ts`:

```ts
/** Pure formatters with no data imports, so they are testable under
 *  `node --test` (which cannot resolve the `@/` path alias). */

/** "first answer token", not "first token": for a model with a thinking phase
 *  the measurement starts counting after reasoning completes, so at max effort
 *  it reaches minutes. "202s to first token" would read as broken inference.
 *
 *  Precision scales with magnitude — hundredths below 10s, whole seconds above.
 *  Two decimals on a three-minute measurement is false precision, since
 *  server and network variance at that scale dwarfs a hundredth of a second. */
export function formatSpeed(
  outputTokensPerSec: number | null,
  timeToFirstTokenSec: number | null
): string {
  const parts: string[] = [];
  if (outputTokensPerSec != null) parts.push(`${Math.round(outputTokensPerSec)} tok/s`);
  if (timeToFirstTokenSec != null) {
    const t =
      timeToFirstTokenSec < 10
        ? timeToFirstTokenSec.toFixed(2)
        : String(Math.round(timeToFirstTokenSec));
    parts.push(`${t}s to first answer token`);
  }
  return parts.length ? parts.join(" · ") : "—";
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 3 new tests.

- [ ] **Step 5: Re-export from `lib/data.ts`**

Add to the end of `lib/data.ts`:

```ts
export { formatSpeed } from "./format";
```

- [ ] **Step 6: Add the speed cell to the stats grid**

In `components/model/ModelStatsGrid.tsx`, add `formatSpeed` to the import from `@/lib/data`, then insert into `cells` immediately after the `Max output` entry:

```ts
    [
      // Effort is disclosed in the label exactly as the Cost per task cell
      // below already does, because the setting dominates the measurement.
      model.speed.effort ? `Speed (${model.speed.effort} effort)` : "Speed",
      formatSpeed(model.speed.outputTokensPerSec, model.speed.timeToFirstTokenSec),
    ],
```

Speed belongs in the always-visible grid — "how fast is it" is a question beginners actually ask, unlike API strings or licence terms.

- [ ] **Step 7: Add the coverage helper to ModelBenchmarks**

In `components/model/ModelBenchmarks.tsx`, add above the component:

```tsx
/** Reported-vs-total count, surfaced in the collapsed summary so a visitor
 *  knows data is missing before opening the section and finding dashes. */
export function benchmarkCoverage(model: Model): { reported: number; total: number } {
  return {
    reported: benchmarks.filter((b) => model.benchmarks[b.key] != null).length,
    total: benchmarks.length,
  };
}
```

Then delete the now-redundant `<h3>` heading block from the component's returned JSX (the `Benchmarks (launch-time reported)` heading) — the Collapsible summary replaces it in Task 7.

- [ ] **Step 8: Verify the build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 9: Commit**

```bash
git add lib/format.ts lib/format.test.ts lib/data.ts components/model/ModelStatsGrid.tsx components/model/ModelBenchmarks.tsx
git commit -m "Show speed in the stats grid and expose benchmark coverage"
```

---

### Task 7: Developer details section and collapsible restructure

**Files:**
- Create: `components/model/ModelDeveloperDetails.tsx`
- Modify: `components/ModelDrawer.tsx`
- Modify: `app/models/[id]/page.tsx`

**Interfaces:**
- Consumes: `Collapsible` (Task 5), `benchmarkCoverage` (Task 6), `Model.apiIds/license/retirementDate/predecessorId` (Task 1).
- Produces: `<ModelDeveloperDetails model={Model} />`.

- [ ] **Step 1: Write the developer details component**

Create `components/model/ModelDeveloperDetails.tsx`:

```tsx
import Link from "next/link";
import type { Model } from "@/lib/types";
import { formatDate, modelById } from "@/lib/data";

const LICENSE_KIND_LABEL: Record<string, string> = {
  permissive: "Permissive",
  copyleft: "Copyleft",
  restricted: "Restricted",
  proprietary: "Proprietary",
};

/** Everything a developer wants and a beginner does not. Lives behind a
 *  collapsed section so a non-technical visitor never encounters it. */
export function ModelDeveloperDetails({ model }: { model: Model }) {
  const predecessor = model.predecessorId ? modelById.get(model.predecessorId) : null;

  return (
    <div className="mono space-y-4 text-xs">
      <section>
        <h4 className="text-[10px] uppercase tracking-wider text-ink-3">API model strings</h4>
        {model.apiIds.length === 0 ? (
          <p className="mt-1 text-ink-3">Not published</p>
        ) : (
          <ul className="mt-1 space-y-1">
            {model.apiIds.map((a) => (
              <li key={`${a.provider}:${a.id}`} className="flex items-baseline gap-2">
                <span className="shrink-0 text-ink-3">{a.provider}</span>
                <code className="break-all text-ink">{a.id}</code>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-wider text-ink-3">Licence</h4>
        {model.license == null ? (
          <p className="mt-1 text-ink-3">
            {model.openWeights ? "Not researched" : "Proprietary — weights not released"}
          </p>
        ) : (
          <p className="mt-1 text-ink">
            {model.license.url ? (
              <a href={model.license.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                {model.license.name}
              </a>
            ) : (
              model.license.name
            )}
            <span className="text-ink-3">
              {" "}· {LICENSE_KIND_LABEL[model.license.kind] ?? model.license.kind}
              {model.license.commercialUse != null &&
                ` · commercial use ${model.license.commercialUse ? "permitted" : "restricted"}`}
            </span>
          </p>
        )}
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-wider text-ink-3">Retirement</h4>
        <p className="mt-1 text-ink">
          {model.retirementDate ? formatDate(model.retirementDate) : (
            <span className="text-ink-3">No retirement announced</span>
          )}
        </p>
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-wider text-ink-3">Lineage</h4>
        <p className="mt-1 text-ink">
          {predecessor ? (
            <>
              Replaces{" "}
              <Link href={`/models/${predecessor.id}`} className="underline hover:text-ink">
                {predecessor.name}
              </Link>
            </>
          ) : (
            <span className="text-ink-3">No recorded predecessor</span>
          )}
        </p>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Restructure the drawer**

In `components/ModelDrawer.tsx`, add imports:

```tsx
import { Collapsible } from "./Collapsible";
import { ModelDeveloperDetails } from "./model/ModelDeveloperDetails";
import { benchmarkCoverage } from "./model/ModelBenchmarks";
```

Replace the four component calls at the end of the `<aside>` with:

```tsx
        <ModelStatsGrid model={model} className="grid-cols-2" />

        <div>
          <Collapsible
            title="Benchmarks"
            meta={`${benchmarkCoverage(model).reported} of ${benchmarkCoverage(model).total} reported`}
          >
            <ModelBenchmarks model={model} />
          </Collapsible>
          <Collapsible title="Strengths & weaknesses">
            <ModelProsCons model={model} className="space-y-5" />
          </Collapsible>
          <Collapsible title="For developers">
            <ModelDeveloperDetails model={model} />
          </Collapsible>
          <Collapsible title="News">
            <ModelNewsList model={model} />
          </Collapsible>
        </div>
```

Every section is collapsed in the drawer — it is a narrow `max-w-md` column where density hurts most.

- [ ] **Step 3: Restructure the standalone page**

In `app/models/[id]/page.tsx`, add the same three imports (using `@/components/...` paths), then replace the three layout `<div>`s after `</header>` with:

```tsx
      <div className="mt-8 max-w-3xl">
        <ModelStatsGrid model={model} className="grid-cols-2 sm:grid-cols-3" />

        <div className="mt-8">
          <Collapsible
            title="Benchmarks"
            meta={`${benchmarkCoverage(model).reported} of ${benchmarkCoverage(model).total} reported`}
            defaultOpen
          >
            <ModelBenchmarks model={model} />
          </Collapsible>
          <Collapsible title="Strengths & weaknesses" defaultOpen>
            <ModelProsCons model={model} className="grid gap-6 sm:grid-cols-2" />
          </Collapsible>
          <Collapsible title="For developers">
            <ModelDeveloperDetails model={model} />
          </Collapsible>
          <Collapsible title="News">
            <ModelNewsList model={model} />
          </Collapsible>
        </div>
      </div>
```

The wide page opens benchmarks and strengths by default; the old two-column grid goes away, which also fixes the current mismatch of a short stats grid beside a tall benchmark list.

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build succeeds. Confirm the build output still lists `/models/[id]` as statically prerendered (`●` or `○`, not `ƒ`) — if it became dynamic, a client component leaked into the page.

- [ ] **Step 5: Check both surfaces in the browser**

Run: `npm run dev`, then visit:
- `http://localhost:3000/models/gpt-4` — sections present, benchmarks and strengths open, "For developers" and "News" closed.
- `http://localhost:3000/` and click a model card — drawer opens with all four sections closed.
- Confirm the benchmark summary shows a count like "2 of 8 reported" for a sparse model.

- [ ] **Step 6: Commit**

```bash
git add components/model/ModelDeveloperDetails.tsx components/ModelDrawer.tsx "app/models/[id]/page.tsx"
git commit -m "Collapse model detail sections and add developer details"
```

---

# PHASE 3 — Research backfill

### Task 8: Spec-filler protocol and agent

**Files:**
- Create: `protocols/MODEL_SPECS_PROTOCOL.md`
- Create: `.claude/agents/spec-filler.md`
- Create: `data/spec-gaps.md`
- Modify: `AGENTS.md` (protocols table)

**Interfaces:**
- Consumes: the Task 1 schema.
- Produces: a repeatable research workflow. No site code changes.

- [ ] **Step 1: Read the existing protocol to match its structure**

Run: `cat protocols/STATS_FILLER_PROTOCOL.md`

Match its section structure, tone, and validation steps. This task copies an established pattern rather than inventing one.

- [ ] **Step 2: Write the protocol**

Create `protocols/MODEL_SPECS_PROTOCOL.md` covering:

- **Scope:** the five Phase 1 fields only — `speed`, `license`, `apiIds`, `retirementDate`, `predecessorId`.
- **Priority order:** `status: "frontier"` first, then everything released in the last 12 months, then older models opportunistically.
- **Per-field sources**, primary only:

| Field | Accepted sources |
|---|---|
| `speed` | Artificial Analysis only (same source as `costPerTask`) |
| `license` | The model's own repo or model card — HuggingFace `LICENSE` file, official licence page |
| `apiIds` | Official API/model-list documentation, per provider |
| `retirementDate` | Official deprecation or model-lifecycle pages only |
| `predecessorId` | The release announcement itself must name what it replaces |

- **The `predecessorId` rule:** it is judgement, not a looked-up figure. Only set it when the lab's own announcement names the predecessor. Never infer lineage from model naming — "Foo 2" does not imply it replaces "Foo 1".
- **Never fabricate.** An unverifiable cell stays `null` and is logged to `data/spec-gaps.md` with the date and what was searched, so re-runs skip it.
- **Expect gaps.** Speed data is not expected to exist for retired models; `apiIds` will not exist for models with no public API.
- **Validation:** run the `AGENTS.md` integrity check, then `node scripts/frontier-reigns.js` (reigns do not depend on these fields, but the check confirms nothing else broke), then `npm run build`.

- [ ] **Step 3: Write the agent definition**

Create `.claude/agents/spec-filler.md` modelled on `.claude/agents/stats-filler.md` (read it first). Frontmatter `tools:` must be `WebSearch, WebFetch, Read, Edit, Write, Bash, Grep, Glob`. The description must trigger on "execute model specs protocol", "fill in model specs", "find missing licences/API strings/speed".

- [ ] **Step 4: Create the gap ledger**

Create `data/spec-gaps.md`:

```markdown
# Model spec gaps

Cells researched under `protocols/MODEL_SPECS_PROTOCOL.md` and found unverifiable
from primary sources. Re-runs skip everything listed here.

Format: `model-id · field · YYYY-MM-DD · what was searched`

<!-- entries appended by the spec-filler protocol -->
```

- [ ] **Step 5: Register in `AGENTS.md`**

Add a row to the protocols table:

```
| "execute model specs protocol" / "fill in model specs" | `protocols/MODEL_SPECS_PROTOCOL.md` | `.claude/agents/spec-filler.md` |
```

Add `spec-gaps.md` to the Data files list, and add spec-filler to the sentence listing which protocols require web research.

- [ ] **Step 6: Commit**

```bash
git add protocols/MODEL_SPECS_PROTOCOL.md .claude/agents/spec-filler.md data/spec-gaps.md AGENTS.md
git commit -m "Add model specs research protocol and agent"
```

- [ ] **Step 7: Run the first prioritised pass**

Invoke the spec-filler agent scoped to `status: "frontier"` models only (7 models). Review its diff carefully before accepting: every non-null value must have come from a primary source, and the integrity check must pass. Commit separately from the protocol.

---

# PHASE 4 — Compare URL state

### Task 9: Compare state serialisation

**Files:**
- Create: `lib/compare-url.ts`
- Create: `lib/compare-url.test.ts`

**Interfaces:**
- Consumes: `Filters` from `lib/types.ts`, `DEFAULT_FILTERS` from `lib/filter.ts`.
- Produces: `CompareState = { filters: Filters; picks: string[]; diffBaseline: string | null; diffOthers: string[] }`; `stateToQuery(state): string`; `queryToState(params: URLSearchParams): CompareState`.

- [ ] **Step 1: Write the failing test**

Create `lib/compare-url.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_COMPARE_STATE, stateToQuery, queryToState } from "./compare-url.ts";

test("default state serialises to an empty query", () => {
  assert.equal(stateToQuery(DEFAULT_COMPARE_STATE), "");
});

test("round-trips a fully populated state", () => {
  const state = {
    filters: {
      window: "1y" as const,
      companies: ["openai", "anthropic"],
      openWeightsOnly: true,
      frontierOnly: true,
      benchmark: "hle" as const,
      minScore: 40,
      maxInputPrice: 5,
      search: "opus",
    },
    picks: ["gpt-4", "claude-opus-4-8"],
    diffBaseline: "gpt-4",
    diffOthers: ["claude-opus-4-8"],
  };
  assert.deepEqual(queryToState(new URLSearchParams(stateToQuery(state))), state);
});

test("omits every parameter still at its default", () => {
  const q = stateToQuery({ ...DEFAULT_COMPARE_STATE, filters: { ...DEFAULT_COMPARE_STATE.filters, search: "gpt" } });
  assert.equal(q, "q=gpt");
});

test("an empty query yields the defaults", () => {
  assert.deepEqual(queryToState(new URLSearchParams("")), DEFAULT_COMPARE_STATE);
});

test("ignores junk values rather than throwing", () => {
  const s = queryToState(new URLSearchParams("window=banana&min=notanumber&bench=nope"));
  assert.equal(s.filters.window, DEFAULT_COMPARE_STATE.filters.window);
  assert.equal(s.filters.minScore, null);
  assert.equal(s.filters.benchmark, DEFAULT_COMPARE_STATE.filters.benchmark);
});

test("a baseline with no comparison models still round-trips", () => {
  const state = { ...DEFAULT_COMPARE_STATE, diffBaseline: "gpt-4", diffOthers: [] };
  assert.deepEqual(queryToState(new URLSearchParams(stateToQuery(state))), state);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `./compare-url.ts`.

- [ ] **Step 3: Write the module**

Create `lib/compare-url.ts`. Note it imports only types and `DEFAULT_FILTERS` — never `lib/data.ts` — so the test can resolve it without the `@/` alias.

```ts
import type { BenchmarkKey, Filters, TimeWindow } from "./types";
import { DEFAULT_FILTERS } from "./filter";

export interface CompareState {
  filters: Filters;
  picks: string[];
  diffBaseline: string | null;
  diffOthers: string[];
}

/** The Compare page opens with these four selected. They live here rather than
 *  in the component so they are the CANONICAL default: `stateToQuery` can then
 *  omit them, keeping an untouched Compare page on a clean bare URL instead of
 *  rewriting the address bar to `?picks=...` the moment it mounts. */
export const DEFAULT_PICKS = [
  "claude-fable-5",
  "claude-opus-4-8",
  "gpt-5-5",
  "gemini-3-1-pro",
];

export const DEFAULT_COMPARE_STATE: CompareState = {
  filters: DEFAULT_FILTERS,
  picks: DEFAULT_PICKS,
  diffBaseline: null,
  diffOthers: [],
};

const sameList = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const WINDOWS: TimeWindow[] = ["3m", "6m", "1y", "2y", "3y", "all"];
const BENCHMARKS: BenchmarkKey[] = [
  "mmluPro", "gpqaDiamond", "sweBench", "terminalBench",
  "aime", "hle", "lmarenaElo", "arcAgi2",
];

const num = (raw: string | null): number | null => {
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const list = (raw: string | null): string[] =>
  raw ? raw.split(",").filter(Boolean) : [];

/** Only non-default values are emitted, so an untouched Compare page keeps a
 *  clean bare URL and a shared link shows exactly what was changed. */
export function stateToQuery(state: CompareState): string {
  const p = new URLSearchParams();
  const f = state.filters;
  const d = DEFAULT_FILTERS;

  if (f.window !== d.window) p.set("window", f.window);
  if (f.companies.length) p.set("co", f.companies.join(","));
  if (f.openWeightsOnly) p.set("open", "1");
  if (f.frontierOnly) p.set("frontier", "1");
  if (f.benchmark !== d.benchmark) p.set("bench", f.benchmark);
  if (f.minScore != null) p.set("min", String(f.minScore));
  if (f.maxInputPrice != null) p.set("max", String(f.maxInputPrice));
  if (f.search) p.set("q", f.search);
  if (!sameList(state.picks, DEFAULT_PICKS)) p.set("picks", state.picks.join(","));
  if (state.diffBaseline) p.set("base", state.diffBaseline);
  if (state.diffOthers.length) p.set("vs", state.diffOthers.join(","));

  return p.toString();
}

/** Unrecognised values fall back to defaults rather than throwing — a shared
 *  link must never break the page, however mangled it arrives. */
export function queryToState(params: URLSearchParams): CompareState {
  const window = params.get("window");
  const bench = params.get("bench");

  return {
    filters: {
      window: WINDOWS.includes(window as TimeWindow)
        ? (window as TimeWindow)
        : DEFAULT_FILTERS.window,
      companies: list(params.get("co")),
      openWeightsOnly: params.get("open") === "1",
      frontierOnly: params.get("frontier") === "1",
      benchmark: BENCHMARKS.includes(bench as BenchmarkKey)
        ? (bench as BenchmarkKey)
        : DEFAULT_FILTERS.benchmark,
      minScore: num(params.get("min")),
      maxInputPrice: num(params.get("max")),
      search: params.get("q") ?? "",
    },
    // `has` not `get`: an absent param means "untouched, use defaults", while
    // an explicitly empty `picks=` means the user deselected everything and
    // wants that shared.
    picks: params.has("picks") ? list(params.get("picks")) : DEFAULT_PICKS,
    diffBaseline: params.get("base"),
    diffOthers: list(params.get("vs")),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 6 new tests.

- [ ] **Step 5: Commit**

```bash
git add lib/compare-url.ts lib/compare-url.test.ts
git commit -m "Add Compare page URL state serialisation"
```

---

### Task 10: Wire URL state into the Compare page

**Files:**
- Modify: `app/compare/page.tsx`
- Create: `app/compare/CompareClient.tsx`

**Interfaces:**
- Consumes: `stateToQuery`, `queryToState`, `DEFAULT_COMPARE_STATE` from Task 9.

- [ ] **Step 1: Understand the build constraint before writing code**

Next 16 **fails the production build** with *"Missing Suspense boundary with useSearchParams"* when a statically prerendered client component reads search params. `/compare` is exactly that. Confirmed in `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md:179`.

Critically: **this passes in `npm run dev` and only fails at build.** The dev server is not a valid check for this task.

The fix is to split the route into a server shell that wraps the client component in `<Suspense>`.

- [ ] **Step 2: Move the existing client component**

```bash
git mv app/compare/page.tsx app/compare/CompareClient.tsx
```

In `app/compare/CompareClient.tsx`, rename the default export:

```tsx
export default function CompareClient() {
```

- [ ] **Step 3: Create the server shell**

Create `app/compare/page.tsx`:

```tsx
import { Suspense } from "react";
import CompareClient from "./CompareClient";

/** The fallback is what every visitor actually sees first: /compare is
 *  statically prerendered, and search params do not exist at build time, so
 *  Next bakes THIS into the static HTML and swaps in the real page on
 *  hydration. A one-line "Loading…" would therefore collapse the layout on
 *  every single load and pop it back — a guaranteed layout shift, not an edge
 *  case. It has to reserve roughly the real page's height. */
function ComparePlaceholder() {
  return (
    <div className="min-h-[80vh] pt-10" aria-hidden>
      <div className="h-4 w-40 rounded bg-white/5" />
      <div className="mt-3 h-9 w-72 rounded bg-white/5" />
      <div className="mt-3 h-4 w-full max-w-2xl rounded bg-white/5" />
      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="h-96 w-full rounded border border-line lg:w-64 lg:shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <div className="h-72 rounded border border-line" />
          <div className="h-72 rounded border border-line" />
        </div>
      </div>
    </div>
  );
}

/** Server shell. CompareClient reads search params, which in Next 16 forces a
 *  Suspense boundary — without one the production build fails with "Missing
 *  Suspense boundary with useSearchParams". It builds fine in dev, so this
 *  must be verified with `npm run build`, not the dev server. */
export default function ComparePage() {
  return (
    <Suspense fallback={<ComparePlaceholder />}>
      <CompareClient />
    </Suspense>
  );
}
```

- [ ] **Step 4: Read initial state from the URL**

In `app/compare/CompareClient.tsx`, add imports:

```tsx
import { useSearchParams, useRouter } from "next/navigation";
import { DEFAULT_COMPARE_STATE, queryToState, stateToQuery } from "@/lib/compare-url";
```

Replace the `filters` and `picks` `useState` initialisers so they seed from the URL once:

```tsx
  const searchParams = useSearchParams();
  const router = useRouter();
  const initial = useMemo(
    () => queryToState(new URLSearchParams(searchParams.toString())),
    // Seed once on mount; later updates flow outward to the URL, not back in,
    // so the user's typing is never fought by a re-parse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [filters, setFilters] = useState<Filters>(initial.filters);
  // No fallback here — DEFAULT_PICKS in lib/compare-url.ts is the single
  // source of truth, so an untouched page serialises to a bare URL.
  const [picks, setPicks] = useState<string[]>(initial.picks);
```

- [ ] **Step 5: Push state changes back to the URL**

Add after the `picked` memo:

```tsx
  // `replace`, not `push`: filtering is not navigation, and every keystroke in
  // the search box would otherwise become a back-button entry.
  useEffect(() => {
    const q = stateToQuery({ ...DEFAULT_COMPARE_STATE, filters, picks });
    router.replace(q ? `?${q}` : "/compare", { scroll: false });
  }, [filters, picks, router]);
```

Add `useEffect` to the `react` import.

- [ ] **Step 6: Verify with a real build**

Run: `npm run build`
Expected: build succeeds and `/compare` is listed as static. If it fails with "Missing Suspense boundary", the shell in Step 3 is wrong.

- [ ] **Step 7: Verify the round trip in the browser**

Run `npm run dev`, then:
1. Visit `/compare`, change the window to 1 year, pick two companies, type in the search box.
2. Confirm the URL updates and the back button does **not** step through every keystroke.
3. Copy the URL, open it in a new tab, confirm the page restores identically.
4. Visit `/compare?window=banana` and confirm it loads with defaults rather than erroring.

- [ ] **Step 8: Commit**

```bash
git add app/compare/
git commit -m "Make Compare page state shareable via the URL"
```

---

# PHASE 5 — Spec diff

### Task 11: Diff field definitions and verdict logic

**Files:**
- Create: `lib/spec-diff.ts`
- Create: `lib/spec-diff.test.ts`

**Interfaces:**
- Produces: `DiffDirection`, `DiffField`, `DIFF_FIELDS: DiffField[]`, `verdict(baseline, other, direction): "better" | "worse" | "same" | "na"`.

- [ ] **Step 1: Write the failing test**

Create `lib/spec-diff.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { DIFF_FIELDS, verdict } from "./spec-diff.ts";

test("higher is better for benchmarks", () => {
  assert.equal(verdict(50, 80, "higher-better"), "better");
  assert.equal(verdict(80, 50, "higher-better"), "worse");
});

test("lower is better for price and latency", () => {
  assert.equal(verdict(10, 2, "lower-better"), "better");
  assert.equal(verdict(2, 10, "lower-better"), "worse");
});

test("equal values are same regardless of direction", () => {
  assert.equal(verdict(5, 5, "higher-better"), "same");
  assert.equal(verdict(5, 5, "lower-better"), "same");
});

test("a missing value on either side is not a comparison", () => {
  assert.equal(verdict(null, 5, "higher-better"), "na");
  assert.equal(verdict(5, null, "higher-better"), "na");
  assert.equal(verdict(null, null, "lower-better"), "na");
});

test("neutral fields never claim better or worse", () => {
  assert.equal(verdict(1, 2, "neutral"), "na");
});

test("every field declares a direction and a label", () => {
  for (const f of DIFF_FIELDS) {
    assert.ok(f.label.length > 0, `${f.key} needs a label`);
    assert.ok(["higher-better", "lower-better", "neutral"].includes(f.direction));
  }
});

test("field keys are unique", () => {
  const keys = DIFF_FIELDS.map((f) => f.key);
  assert.equal(new Set(keys).size, keys.length);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `./spec-diff.ts`.

- [ ] **Step 3: Write the module**

Create `lib/spec-diff.ts`:

```ts
import type { Model } from "./types";
import { formatSpeed } from "./format";

export type DiffDirection = "higher-better" | "lower-better" | "neutral";

export interface DiffField {
  key: string;
  label: string;
  direction: DiffDirection;
  /** Numeric value used for the delta, or null when not comparable. */
  value: (m: Model) => number | null;
  /** Human-readable cell text. */
  display: (m: Model) => string;
  /** True for figures Artificial Analysis measures at a reasoning-effort
   *  setting. Two models measured at different efforts are not comparable —
   *  the setting dominates the number — so the diff must suppress the delta
   *  and say why rather than presenting effort noise as a capability gap. */
  effortSensitive?: boolean;
}

/** Whether a delta between these two models is meaningful for this field.
 *  Effort-sensitive fields require both models measured at the same setting. */
export function comparable(field: DiffField, a: Model, b: Model): boolean {
  if (!field.effortSensitive) return true;
  return a.speed.effort != null && a.speed.effort === b.speed.effort;
}

/** "Better" follows each field's own direction — lower is better for price and
 *  latency, higher for benchmarks. Fields with no meaningful ordering are
 *  `neutral` and never render a verdict colour. */
export function verdict(
  baseline: number | null,
  other: number | null,
  direction: DiffDirection
): "better" | "worse" | "same" | "na" {
  if (direction === "neutral") return "na";
  if (baseline == null || other == null) return "na";
  if (baseline === other) return "same";
  const higher = other > baseline;
  return (direction === "higher-better") === higher ? "better" : "worse";
}

const dash = (v: number | null, suffix = "") => (v == null ? "—" : `${v}${suffix}`);

export const DIFF_FIELDS: DiffField[] = [
  {
    key: "contextWindow",
    label: "Context window",
    direction: "higher-better",
    value: (m) => m.contextWindow,
    display: (m) =>
      m.contextWindow == null
        ? "—"
        : m.contextWindow >= 1_000_000
          ? `${Math.round((m.contextWindow / 1_000_000) * 10) / 10}M`
          : `${Math.round(m.contextWindow / 1000)}K`,
  },
  {
    key: "maxOutput",
    label: "Max output",
    direction: "higher-better",
    value: (m) => m.maxOutput,
    display: (m) => (m.maxOutput == null ? "—" : `${Math.round(m.maxOutput / 1000)}K`),
  },
  {
    key: "inputPrice",
    label: "Input $/MTok",
    direction: "lower-better",
    value: (m) => m.pricing.inputPerMTok,
    display: (m) => dash(m.pricing.inputPerMTok, ""),
  },
  {
    key: "outputPrice",
    label: "Output $/MTok",
    direction: "lower-better",
    value: (m) => m.pricing.outputPerMTok,
    display: (m) => dash(m.pricing.outputPerMTok, ""),
  },
  {
    key: "costPerTask",
    label: "Cost per task",
    direction: "lower-better",
    value: (m) => m.costPerTask.usd,
    display: (m) => (m.costPerTask.usd == null ? "—" : `$${m.costPerTask.usd}`),
  },
  {
    key: "outputSpeed",
    label: "Output speed",
    direction: "higher-better",
    effortSensitive: true,
    value: (m) => m.speed.outputTokensPerSec,
    display: (m) => formatSpeed(m.speed.outputTokensPerSec, null),
  },
  {
    key: "ttft",
    label: "Time to first answer token",
    direction: "lower-better",
    effortSensitive: true,
    value: (m) => m.speed.timeToFirstTokenSec,
    display: (m) => formatSpeed(null, m.speed.timeToFirstTokenSec),
  },
  {
    key: "mmluPro", label: "MMLU-Pro", direction: "higher-better",
    value: (m) => m.benchmarks.mmluPro ?? null, display: (m) => dash(m.benchmarks.mmluPro ?? null, "%"),
  },
  {
    key: "gpqaDiamond", label: "GPQA Diamond", direction: "higher-better",
    value: (m) => m.benchmarks.gpqaDiamond ?? null, display: (m) => dash(m.benchmarks.gpqaDiamond ?? null, "%"),
  },
  {
    key: "sweBench", label: "SWE-bench Verified", direction: "higher-better",
    value: (m) => m.benchmarks.sweBench ?? null, display: (m) => dash(m.benchmarks.sweBench ?? null, "%"),
  },
  {
    key: "terminalBench", label: "Terminal-Bench 2.1", direction: "higher-better",
    value: (m) => m.benchmarks.terminalBench ?? null, display: (m) => dash(m.benchmarks.terminalBench ?? null, "%"),
  },
  {
    key: "aime", label: "AIME", direction: "higher-better",
    value: (m) => m.benchmarks.aime ?? null, display: (m) => dash(m.benchmarks.aime ?? null, "%"),
  },
  {
    key: "hle", label: "Humanity's Last Exam", direction: "higher-better",
    value: (m) => m.benchmarks.hle ?? null, display: (m) => dash(m.benchmarks.hle ?? null, "%"),
  },
  {
    key: "lmarenaElo", label: "LMArena Elo", direction: "higher-better",
    value: (m) => m.benchmarks.lmarenaElo ?? null, display: (m) => dash(m.benchmarks.lmarenaElo ?? null),
  },
  {
    key: "arcAgi2", label: "ARC-AGI-2", direction: "higher-better",
    value: (m) => m.benchmarks.arcAgi2 ?? null, display: (m) => dash(m.benchmarks.arcAgi2 ?? null, "%"),
  },
  {
    key: "openWeights", label: "Open weights", direction: "neutral",
    value: () => null, display: (m) => (m.openWeights ? "Yes" : "No"),
  },
  {
    key: "license", label: "Licence", direction: "neutral",
    value: () => null, display: (m) => m.license?.name ?? (m.openWeights ? "—" : "Proprietary"),
  },
  {
    key: "knowledgeCutoff", label: "Knowledge cutoff", direction: "neutral",
    value: () => null, display: (m) => m.knowledgeCutoff ?? "—",
  },
];

/** Rows where every selected model is blank add nothing but height. */
export function visibleFields(models: Model[]): DiffField[] {
  return DIFF_FIELDS.filter((f) => models.some((m) => f.display(m) !== "—"));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 7 new tests.

- [ ] **Step 5: Commit**

```bash
git add lib/spec-diff.ts lib/spec-diff.test.ts
git commit -m "Add spec diff field definitions and verdict logic"
```

---

### Task 12: Spec diff component

**Files:**
- Create: `components/SpecDiff.tsx`
- Modify: `app/compare/CompareClient.tsx`

**Interfaces:**
- Consumes: `DIFF_FIELDS`, `visibleFields`, `verdict` (Task 11); `CompareState` diff fields (Task 9).
- Produces: `<SpecDiff baseline diffOthers setBaseline setDiffOthers />`.

- [ ] **Step 1: Write the component**

Create `components/SpecDiff.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { Model } from "@/lib/types";
import { models } from "@/lib/data";
import { comparable, visibleFields, verdict } from "@/lib/spec-diff";
import { CompanyLogo } from "./CompanyLogo";

const MAX_OTHERS = 4;

const VERDICT_CLASS: Record<string, string> = {
  better: "text-emerald-400",
  worse: "text-rose-400",
  same: "text-ink-3",
  na: "text-ink-3",
};

export function SpecDiff({
  baselineId,
  otherIds,
  setBaselineId,
  setOtherIds,
}: {
  baselineId: string | null;
  otherIds: string[];
  setBaselineId: (id: string | null) => void;
  setOtherIds: (ids: string[]) => void;
}) {
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");

  const baseline = models.find((m) => m.id === baselineId) ?? null;

  // Sanitise the URL-seeded selection. Two things a hand-edited query can do:
  // name ids that match no model, and name the baseline again under `vs`.
  // The second is the nastier one — `?base=X&vs=X,Y` would put X into `shown`
  // twice, giving duplicate React keys, and the user could not clear it
  // because X's compare button is hidden while X is the baseline.
  const others = otherIds
    .filter((id) => id !== baselineId)
    .map((id) => models.find((m) => m.id === id))
    .filter((m): m is Model => m != null);

  // Cap on RESOLVED models, never on the raw id list: unresolvable ids would
  // otherwise fill the cap invisibly and make real selections silently no-op.
  const atCap = others.length >= MAX_OTHERS;

  // No useMemo here: `shown` and `otherIds` are rebuilt every render, so a memo
  // keyed on them would never hit while still costing a dependency comparison.
  // Both computations are trivial — 18 fields across at most 5 models.
  const selectable = models.filter(
    (m) => m.status === "frontier" || m.id === baselineId || otherIds.includes(m.id)
  );

  const shown = baseline ? [baseline, ...others] : others;
  const fields = visibleFields(shown);

  const toggleOther = (id: string) => {
    if (id === baselineId) return;
    if (otherIds.includes(id)) {
      setOtherIds(otherIds.filter((x) => x !== id));
      return;
    }
    if (atCap) return;
    // Write back the sanitised list, so any junk ids from a hand-edited URL
    // are flushed out of state (and therefore the URL) on first interaction.
    setOtherIds([...others.map((m) => m.id), id]);
  };

  return (
    <section>
      <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
        Spec comparison
      </h3>
      <p className="mt-1 text-xs text-ink-3">
        Pick a baseline, then the models to measure against it. Every other column
        shows the difference from the baseline.
      </p>

      <div className="mt-3">
        <p className="mono text-[10px] uppercase tracking-wider text-ink-3">Baseline</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {selectable.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setBaselineId(m.id === baselineId ? null : m.id);
                setOtherIds(otherIds.filter((x) => x !== m.id));
              }}
              aria-pressed={m.id === baselineId}
              className={`flex items-center gap-1.5 rounded border px-2 py-1 text-xs ${
                m.id === baselineId
                  ? "border-accent/60 bg-accent/15 text-ink"
                  : "border-line text-ink-2 hover:text-ink"
              }`}
            >
              <CompanyLogo companyId={m.company} size={12} />
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <p className="mono text-[10px] uppercase tracking-wider text-ink-3">
          Compare against ({others.length}/{MAX_OTHERS})
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {selectable
            .filter((m) => m.id !== baselineId)
            .map((m) => {
              const selected = otherIds.includes(m.id);
              // At the cap, unselected buttons must LOOK unavailable. Leaving
              // them interactive means a fifth click silently does nothing.
              const disabled = !selected && atCap;
              return (
                <button
                  key={m.id}
                  onClick={() => toggleOther(m.id)}
                  aria-pressed={selected}
                  disabled={disabled}
                  className={`rounded border px-2 py-1 text-xs ${
                    selected
                      ? "border-line-strong bg-surface-2 text-ink"
                      : disabled
                        ? "cursor-not-allowed border-line text-ink-3 opacity-40"
                        : "border-line text-ink-2 hover:text-ink"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 text-sm text-ink-3">Pick at least one model to compare.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="mono w-full min-w-[36rem] border-collapse text-xs">
            <thead>
              <tr>
                <th scope="col" className="border-b border-line py-2 text-left font-normal text-ink-3">
                  Field
                </th>
                {shown.map((m) => (
                  <th
                    key={m.id}
                    scope="col"
                    className="border-b border-line px-2 py-2 text-left font-normal"
                  >
                    <span className="text-ink">{m.name}</span>
                    {m.id === baselineId && (
                      <span className="ml-1 text-[10px] uppercase text-accent">baseline</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.key}>
                  <th scope="row" className="border-b border-line py-1.5 text-left font-normal text-ink-3">
                    {f.label}
                  </th>
                  {shown.map((m) => {
                    const isBaseline = m.id === baselineId;
                    const v = baseline ? verdict(f.value(baseline), f.value(m), f.direction) : "na";
                    const bv = baseline ? f.value(baseline) : null;
                    const mv = f.value(m);
                    // An effort-sensitive figure measured at a different
                    // setting is not a comparison — showing a delta would sell
                    // effort noise as a capability gap.
                    const ok = baseline ? comparable(f, baseline, m) : false;
                    const delta =
                      isBaseline || !ok || bv == null || mv == null || f.direction === "neutral"
                        ? null
                        : Math.round((mv - bv) * 100) / 100;
                    return (
                      <td key={m.id} className="border-b border-line px-2 py-1.5">
                        <span className="text-ink">{f.display(m)}</span>
                        {delta != null && delta !== 0 && (
                          <span className={`ml-1.5 ${VERDICT_CLASS[v]}`}>
                            {delta > 0 ? "+" : ""}
                            {delta}
                          </span>
                        )}
                        {f.effortSensitive && m.speed.effort && (
                          <span className="ml-1.5 text-[10px] text-ink-3">
                            ({m.speed.effort})
                          </span>
                        )}
                        {!isBaseline && !ok && f.effortSensitive && bv != null && mv != null && (
                          <span
                            role="img"
                            aria-label="Measured at a different reasoning effort — not comparable"
                            className="ml-1 text-[10px] text-ink-3"
                            title="Measured at a different reasoning effort — not comparable"
                          >
                            ⚠
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Mount it below head-to-head**

In `app/compare/CompareClient.tsx`, add state and imports:

```tsx
import { SpecDiff } from "@/components/SpecDiff";
```

```tsx
  const [diffBaseline, setDiffBaseline] = useState<string | null>(initial.diffBaseline);
  const [diffOthers, setDiffOthers] = useState<string[]>(initial.diffOthers);
```

Then, immediately after the closing `</section>` of the head-to-head block and before the closing `</div>`:

```tsx
          <hr className="border-line-strong" />

          <SpecDiff
            baselineId={diffBaseline}
            otherIds={diffOthers}
            setBaselineId={setDiffBaseline}
            setOtherIds={setDiffOthers}
          />
```

The head-to-head bar chart is **kept** — the diff is additive, below it, separated by the rule.

- [ ] **Step 3: Include diff state in the URL**

Update the `useEffect` from Task 10, Step 5:

```tsx
  useEffect(() => {
    const q = stateToQuery({ filters, picks, diffBaseline, diffOthers });
    router.replace(q ? `?${q}` : "/compare", { scroll: false });
  }, [filters, picks, diffBaseline, diffOthers, router]);
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Check in the browser**

Run `npm run dev` and visit `/compare`:
1. The two scatters and the head-to-head bars are all still present and unchanged.
2. Below the horizontal rule, pick a baseline and two comparison models.
3. Confirm deltas are green when better and red when worse — and specifically that a **lower** price shows green, not red.
4. Confirm the URL captures `base` and `vs`, and that reloading restores the selection.

- [ ] **Step 6: Commit**

```bash
git add components/SpecDiff.tsx app/compare/CompareClient.tsx
git commit -m "Add spec diff below head-to-head on the Compare page"
```

---

### Task 13: PNG export for the spec diff

**Files:**
- Create: `lib/diff-png.ts`
- Modify: `components/SpecDiff.tsx`

**Interfaces:**
- Consumes: `DiffField` (Task 11).
- Produces: `renderDiffPng(opts): HTMLCanvasElement`.

- [ ] **Step 1: Write the renderer**

Create `lib/diff-png.ts`. Hand-drawn to canvas rather than a DOM-to-image library, per the no-new-dependencies constraint. The table is a plain grid, so this is layout arithmetic rather than general HTML rendering.

```ts
/** Draws the diff table to a canvas at 2x for retina. Kept out of the component
 *  so the layout maths is readable and the component stays declarative. */
export interface DiffPngRow {
  label: string;
  cells: { text: string; tone: "plain" | "better" | "worse" }[];
}

const SCALE = 2;
const PAD = 24;
const ROW_H = 26;
const HEAD_H = 40;
// Sized to the longest text that actually occurs, not to a guess. The widest
// label is "Time to first answer token" and the widest value is of the form
// "202s to first answer token" — ~26 chars, which at 12px monospace is roughly
// 190px. `fillText`'s maxWidth SQUASHES rather than truncates, so a column too
// narrow does not clip, it renders visibly compressed. These leave headroom.
const LABEL_W = 215;
const COL_W = 230;

const COLORS = {
  bg: "#0B0E1A",
  line: "#1E2436",
  ink: "#E7EAF3",
  muted: "#8A93A6",
  better: "#34D399",
  worse: "#FB7185",
};

export function renderDiffPng(opts: {
  title: string;
  headers: string[];
  rows: DiffPngRow[];
}): HTMLCanvasElement {
  const { title, headers, rows } = opts;
  const w = PAD * 2 + LABEL_W + COL_W * headers.length;
  const h = PAD * 2 + HEAD_H + ROW_H * rows.length + 28;

  const canvas = document.createElement("canvas");
  canvas.width = w * SCALE;
  canvas.height = h * SCALE;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SCALE, SCALE);

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);

  ctx.font = "600 15px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = COLORS.ink;
  ctx.fillText(title, PAD, PAD + 6);

  const top = PAD + HEAD_H;
  ctx.font = "12px ui-monospace, SFMono-Regular, monospace";

  headers.forEach((label, i) => {
    ctx.fillStyle = COLORS.ink;
    ctx.fillText(label, PAD + LABEL_W + i * COL_W, top - 8, COL_W - 10);
  });

  rows.forEach((row, r) => {
    const y = top + r * ROW_H;
    ctx.strokeStyle = COLORS.line;
    ctx.beginPath();
    ctx.moveTo(PAD, y);
    ctx.lineTo(w - PAD, y);
    ctx.stroke();

    ctx.fillStyle = COLORS.muted;
    ctx.fillText(row.label, PAD, y + 17, LABEL_W - 10);

    row.cells.forEach((cell, i) => {
      ctx.fillStyle =
        cell.tone === "better" ? COLORS.better : cell.tone === "worse" ? COLORS.worse : COLORS.ink;
      ctx.fillText(cell.text, PAD + LABEL_W + i * COL_W, y + 17, COL_W - 10);
    });
  });

  ctx.fillStyle = COLORS.muted;
  ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("waitwhichmodel — deltas are measured against the baseline column", PAD, h - PAD + 6);

  return canvas;
}
```

- [ ] **Step 2: Add the export buttons**

In `components/SpecDiff.tsx`, add the import:

```tsx
import { renderDiffPng, type DiffPngRow } from "@/lib/diff-png";
```

Add inside the component, before the `return`:

```tsx
  const downloadPng = () => {
    const rows: DiffPngRow[] = fields.map((f) => ({
      label: f.label,
      cells: shown.map((m) => {
        const v = baseline ? verdict(f.value(baseline), f.value(m), f.direction) : "na";
        return {
          text: f.display(m),
          tone: m.id === baselineId || v === "na" || v === "same" ? "plain" : v,
        };
      }),
    }));
    const canvas = renderDiffPng({
      title: baseline ? `Spec comparison — baseline ${baseline.name}` : "Spec comparison",
      headers: shown.map((m) => m.name),
      rows,
    });
    const link = document.createElement("a");
    link.download = "spec-comparison.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  /** `navigator.clipboard` is undefined in non-secure contexts and older
   *  browsers, so an unguarded call throws synchronously; permission denial
   *  rejects. Either way the user needs to be told, rather than clicking a
   *  button that silently does nothing. */
  const copyLink = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(window.location.href);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied("idle"), 2500);
  };
```

Then add, immediately after the closing `</table>`'s wrapping `</div>`:

```tsx
          <div className="mt-3 flex gap-2">
            <button
              onClick={copyLink}
              aria-live="polite"
              className="mono rounded border border-line px-2.5 py-1.5 text-xs uppercase tracking-wider text-ink-2 hover:text-ink"
            >
              {copied === "ok"
                ? "Link copied"
                : copied === "fail"
                  ? "Copy failed — use the address bar"
                  : "Copy link"}
            </button>
            <button
              onClick={downloadPng}
              className="mono rounded border border-line px-2.5 py-1.5 text-xs uppercase tracking-wider text-ink-2 hover:text-ink"
            >
              Download PNG
            </button>
          </div>
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds. `document` is only touched inside event handlers, so there is no SSR access.

- [ ] **Step 4: Check the export in the browser**

Run `npm run dev`, configure a diff with a baseline and two models, click **Download PNG**. Open the file and confirm: readable text, correct columns, green/red matching the on-screen deltas, and no clipped labels.

- [ ] **Step 5: Commit**

```bash
git add lib/diff-png.ts components/SpecDiff.tsx
git commit -m "Add PNG and link export for the spec diff"
```

---

# PHASE 6 — Days at frontier and coverage

### Task 14: Reign types and elapsed-days maths

**Files:**
- Create: `lib/reigns.ts`
- Create: `lib/reigns.test.ts`
- Modify: `lib/data.ts`

**Interfaces:**
- Consumes: `data/frontier-reigns.json` (Task 4).
- Produces: `Reign` interface; `reignDays(reign, now): number`; `reigns` export from `lib/data.ts`.

- [ ] **Step 1: Write the failing test**

Create `lib/reigns.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { reignDays, type Reign } from "./reigns.ts";

const mk = (start: string, end: string | null): Reign => ({
  modelId: "m", tier: "flagship", start, end, dethronedBy: null, composite: 1,
});

test("a closed reign measures start to end", () => {
  assert.equal(reignDays(mk("2024-01-01", "2024-01-31"), new Date("2026-01-01")), 30);
});

test("an open reign measures start to today", () => {
  assert.equal(reignDays(mk("2024-01-01", null), new Date("2024-03-01")), 60);
});

test("a same-day dethroning is zero, not negative", () => {
  assert.equal(reignDays(mk("2024-01-01", "2024-01-01"), new Date("2026-01-01")), 0);
});

test("a future-dated reign clamps to zero rather than going negative", () => {
  assert.equal(reignDays(mk("2026-06-01", null), new Date("2026-01-01")), 0);
});

test("an open reign never counts a day it has not finished", () => {
  // Every other test passes a date-only string, which JS parses as exact UTC
  // midnight — so none of them can catch rounding. A live clock is never at
  // midnight, which is precisely when this matters.
  assert.equal(reignDays(mk("2026-08-05", null), new Date("2026-08-05T15:00:00Z")), 0);
  assert.equal(reignDays(mk("2026-08-05", null), new Date("2026-08-05T23:59:59Z")), 0);
  assert.equal(reignDays(mk("2026-08-05", null), new Date("2026-08-06T00:00:00Z")), 1);
  assert.equal(reignDays(mk("2026-06-09", null), new Date("2026-08-05T15:00:00Z")), 57);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `./reigns.ts`.

- [ ] **Step 3: Write the module**

Create `lib/reigns.ts`. It imports **no JSON** so the test can resolve it.

```ts
export interface Reign {
  modelId: string;
  tier: string;
  start: string;
  end: string | null;
  dethronedBy: string | null;
  composite: number;
}

const DAY = 86_400_000;

/** Elapsed days, computed rather than stored: an open reign grows daily, so a
 *  committed `days` in frontier-reigns.json would churn the file every day.
 *
 *  `floor`, not `round`. Both endpoints of a CLOSED reign are UTC midnight, so
 *  the difference is always whole and either works. But an OPEN reign is
 *  measured against the live clock, and rounding would count a day the model
 *  has not finished holding — every open reign would read one day too high
 *  from 12:00 UTC onwards, correcting itself at midnight. Dates are parsed as
 *  UTC so the count cannot shift with the viewer's timezone. */
export function reignDays(reign: Reign, now: Date): number {
  const start = Date.parse(`${reign.start}T00:00:00Z`);
  const end = reign.end ? Date.parse(`${reign.end}T00:00:00Z`) : now.getTime();
  return Math.max(0, Math.floor((end - start) / DAY));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 4 new tests.

- [ ] **Step 5: Export the data from `lib/data.ts`**

Add the import at the top of `lib/data.ts`:

```ts
import reignsJson from "@/data/frontier-reigns.json";
```

and with the other exports:

```ts
export const reigns = reignsJson as Reign[];
```

Add `Reign` to the type import from `./reigns`:

```ts
import type { Reign } from "./reigns";
```

- [ ] **Step 6: Commit**

```bash
git add lib/reigns.ts lib/reigns.test.ts lib/data.ts
git commit -m "Add reign types and elapsed-days maths"
```

---

### Task 15: Reign chart and coverage panel on /info

**Files:**
- Create: `components/ReignChart.tsx`
- Create: `components/BenchmarkCoverage.tsx`
- Modify: `app/info/page.tsx`
- Modify: `data/methodology.json`
- Modify: `lib/types.ts`

**Interfaces:**
- Consumes: `reigns`, `reignDays` (Task 14); `benchmarks`, `models` from `lib/data.ts`.

- [ ] **Step 1: Write the reign chart**

Create `components/ReignChart.tsx`:

```tsx
"use client";

import { useMemo } from "react";
import { companyColor, modelById, reigns } from "@/lib/data";
import { reignDays } from "@/lib/reigns";

const TIER_LABEL: Record<string, string> = {
  flagship: "Flagship",
  balanced: "Balanced",
  fast: "Fast",
};

export function ReignChart() {
  const now = useMemo(() => new Date(), []);
  const byTier = useMemo(() => {
    const groups = new Map<string, typeof reigns>();
    for (const r of reigns) {
      if (!groups.has(r.tier)) groups.set(r.tier, []);
      groups.get(r.tier)!.push(r);
    }
    for (const list of groups.values()) list.sort((a, b) => a.start.localeCompare(b.start));
    return groups;
  }, []);

  const longest = useMemo(
    () => Math.max(1, ...reigns.map((r) => reignDays(r, now))),
    [now]
  );

  return (
    <div className="space-y-8">
      {[...byTier.entries()].map(([tier, list]) => (
        <section key={tier}>
          <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
            {TIER_LABEL[tier] ?? tier}
          </h3>
          <ul className="mt-3 space-y-2">
            {list.map((r) => {
              const model = modelById.get(r.modelId);
              const days = reignDays(r, now);
              return (
                <li key={`${r.tier}-${r.modelId}`} className="flex items-center gap-3">
                  <span className="mono w-40 shrink-0 truncate text-xs text-ink-2">
                    {model?.name ?? r.modelId}
                  </span>
                  <span className="h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${Math.max(1.5, (days / longest) * 100)}%`,
                        background: model ? companyColor(model.company) : "#8A93A6",
                        opacity: r.end === null ? 1 : 0.75,
                      }}
                    />
                  </span>
                  <span className="mono w-24 shrink-0 text-right text-[10px] text-ink-3">
                    {days} days{r.end === null ? " · current" : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write the coverage panel**

Create `components/BenchmarkCoverage.tsx`:

```tsx
import { benchmarks, models } from "@/lib/data";

/** Coverage doubles as an honesty signal and a to-do list for the
 *  stats-filler protocol. */
export function BenchmarkCoverage() {
  const rows = benchmarks.map((b) => ({
    name: b.name,
    reported: models.filter((m) => m.benchmarks[b.key] != null).length,
  }));
  const total = models.length;

  return (
    <ul className="mono space-y-2 text-xs">
      {rows.map((r) => (
        <li key={r.name} className="flex items-center gap-3">
          <span className="w-44 shrink-0 truncate text-ink-2">{r.name}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
            <span
              className="block h-full rounded-full bg-accent"
              style={{ width: `${(r.reported / total) * 100}%` }}
            />
          </span>
          <span className="w-24 shrink-0 text-right text-[10px] text-ink-3">
            {r.reported} of {total}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Add the methodology copy**

In `lib/types.ts`, extend the `Methodology` interface:

```ts
  reigns: { summary: string; notes: string[] };
  coverage: { summary: string };
  costCalculator: { summary: string; notes: string[] };
  specDiff: { summary: string };
```

In `data/methodology.json`, add the matching keys. The `reigns.notes` array **must** include the reconstruction caveat verbatim in substance:

```json
  "reigns": {
    "summary": "How long each model held the top of its tier, derived from release dates and benchmark scores.",
    "notes": [
      "This is a reconstruction, not an observed record. The site recomputes frontier status from scratch and keeps no history, so reigns are inferred after the fact.",
      "A model takes the crown on its release date if its composite score beats the incumbent's, and holds it until a later release scores higher.",
      "Only models reporting at least three benchmarks can be crowned — one lucky score is not enough to claim a reign.",
      "The composite is min-max normalised across each tier and averaged over whichever benchmarks a model reports, so two models reporting different benchmark sets are not compared on identical ground.",
      "Deprecated models are included: a retired model still held the frontier while it was alive."
    ]
  },
  "coverage": {
    "summary": "Not every model reports every benchmark. A dash means the score was never published or could not be verified from a primary source — it does not mean zero."
  },
  "costCalculator": {
    "summary": "Monthly cost is tasks per day x 30 x the model's measured cost per task.",
    "notes": [
      "A task is one Artificial Analysis Intelligence Index task — one self-contained question or job.",
      "Cost per task is taken at medium reasoning effort wherever Artificial Analysis publishes one.",
      "A 30-day month is used regardless of the calendar month.",
      "Models with no measured cost-per-task figure are excluded and named beneath the results rather than silently dropped.",
      "Every figure is measured. Nothing here is estimated, so no uncertainty range is shown."
    ]
  },
  "specDiff": {
    "summary": "In the spec comparison on the Compare page, green means better than the baseline and red means worse — following each field's own direction. Lower is better for price and time to first answer token; higher is better for benchmarks, context window and output speed. Fields with no meaningful ordering, such as licence, never show a colour. Speed figures are measured at a reasoning-effort setting, and the setting dominates the result, so a delta is only shown when both models were measured at the same effort; otherwise the figures are shown side by side with a warning and no comparison."
  }
```

- [ ] **Step 4: Render the new sections on /info**

In `app/info/page.tsx`, add the imports:

```tsx
import { ReignChart } from "@/components/ReignChart";
import { BenchmarkCoverage } from "@/components/BenchmarkCoverage";
```

Then add these three sections before the page's closing `</div>`, matching the existing `<section className="mb-10">` pattern:

```tsx
      <section className="mb-10">
        <h2 className="text-lg font-semibold">How long models held the frontier</h2>
        <p className="mt-2 text-sm text-ink-2">{methodology.reigns.summary}</p>
        <div className="mt-6">
          <ReignChart />
        </div>
        <ul className="mt-6 space-y-3">
          {methodology.reigns.notes.map((n) => (
            <li key={n} className="flex gap-3 rounded border border-line p-3 text-sm text-ink-2">
              <span className="mono mt-0.5 shrink-0 text-ink-3">→</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold">Benchmark coverage</h2>
        <p className="mt-2 text-sm text-ink-2">{methodology.coverage.summary}</p>
        <div className="mt-4">
          <BenchmarkCoverage />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold">Cost calculator</h2>
        <p className="mt-2 text-sm text-ink-2">{methodology.costCalculator.summary}</p>
        <ul className="mt-4 space-y-3">
          {methodology.costCalculator.notes.map((n) => (
            <li key={n} className="flex gap-3 rounded border border-line p-3 text-sm text-ink-2">
              <span className="mono mt-0.5 shrink-0 text-ink-3">→</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink-2">{methodology.specDiff.summary}</p>
      </section>
```

- [ ] **Step 5: Refresh the review date**

In `data/methodology.json`, set `frontierDefinition.lastReviewed` to `2026-08-04`.

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: build succeeds. A TypeScript error here most likely means `Methodology` and `methodology.json` disagree.

- [ ] **Step 7: Check in the browser**

Run `npm run dev` and visit `/info`. Confirm the reign bars render per tier with company colours, the current champion's bar is full-opacity, the day counts look plausible, and the reconstruction caveat is visible.

- [ ] **Step 8: Commit**

```bash
git add components/ReignChart.tsx components/BenchmarkCoverage.tsx app/info/page.tsx data/methodology.json lib/types.ts
git commit -m "Add days-at-frontier chart and benchmark coverage to /info"
```

---

# PHASE 7 — Tools nav and Cost Calculator

### Task 16: Cost calculation logic

**Files:**
- Create: `lib/cost-calc.ts`
- Create: `lib/cost-calc.test.ts`

**Interfaces:**
- Produces: `monthlyCost(costPerTaskUsd, tasksPerDay): number`; `rankByCost(models, tasksPerDay): { included: CostRow[]; excluded: Model[] }` where `CostRow = { model: Model; monthly: number }`.

- [ ] **Step 1: Write the failing test**

Create `lib/cost-calc.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { monthlyCost, rankByCost, DAYS_PER_MONTH } from "./cost-calc.ts";
import type { Model } from "./types.ts";

const mk = (id: string, usd: number | null) =>
  ({ id, name: id, costPerTask: { usd, effort: null } }) as unknown as Model;

test("uses a fixed 30-day month", () => {
  assert.equal(DAYS_PER_MONTH, 30);
  assert.equal(monthlyCost(0.1, 100), 300);
});

test("zero tasks costs nothing", () => {
  assert.equal(monthlyCost(0.5, 0), 0);
});

test("ranks cheapest first", () => {
  const { included } = rankByCost([mk("pricey", 0.5), mk("cheap", 0.05)], 10);
  assert.deepEqual(included.map((r) => r.model.id), ["cheap", "pricey"]);
});

test("models with no measured figure are excluded, not treated as free", () => {
  const { included, excluded } = rankByCost([mk("known", 0.1), mk("unmeasured", null)], 10);
  assert.deepEqual(included.map((r) => r.model.id), ["known"]);
  assert.deepEqual(excluded.map((m) => m.id), ["unmeasured"]);
});

test("negative task counts are clamped rather than producing negative bills", () => {
  assert.equal(monthlyCost(0.1, -5), 0);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `./cost-calc.ts`.

- [ ] **Step 3: Write the module**

Create `lib/cost-calc.ts`:

```ts
import type { Model } from "./types";

/** A fixed 30-day month, so the same inputs always give the same answer
 *  regardless of which calendar month you ask in. Stated on /info. */
export const DAYS_PER_MONTH = 30;

export interface CostRow {
  model: Model;
  monthly: number;
}

export function monthlyCost(costPerTaskUsd: number, tasksPerDay: number): number {
  return Math.max(0, tasksPerDay) * DAYS_PER_MONTH * costPerTaskUsd;
}

/** A model with no measured cost-per-task is excluded and reported, never
 *  treated as free — a $0 row would be a lie by omission. */
export function rankByCost(
  all: Model[],
  tasksPerDay: number
): { included: CostRow[]; excluded: Model[] } {
  const included: CostRow[] = [];
  const excluded: Model[] = [];

  for (const m of all) {
    if (m.costPerTask.usd == null) excluded.push(m);
    else included.push({ model: m, monthly: monthlyCost(m.costPerTask.usd, tasksPerDay) });
  }
  included.sort((a, b) => a.monthly - b.monthly);
  return { included, excluded };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 5 new tests.

- [ ] **Step 5: Commit**

```bash
git add lib/cost-calc.ts lib/cost-calc.test.ts
git commit -m "Add cost calculator maths"
```

---

### Task 17: Cost Calculator page and Tools nav

**Files:**
- Create: `app/cost-calculator/page.tsx`
- Modify: `components/Nav.tsx`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `rankByCost` (Task 16), `methodology.costCalculator` (Task 15).

- [ ] **Step 1: Write the page**

Create `app/cost-calculator/page.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { models } from "@/lib/data";
import { rankByCost } from "@/lib/cost-calc";
import { CompanyLogo } from "@/components/CompanyLogo";

const usd = (v: number) =>
  v >= 100 ? `$${Math.round(v).toLocaleString()}` : `$${v.toFixed(2)}`;

export default function CostCalculatorPage() {
  const [tasksPerDay, setTasksPerDay] = useState(250);

  // Retired models are not something anyone is costing out a deployment against.
  const candidates = useMemo(
    () => models.filter((m) => m.status !== "deprecated"),
    []
  );
  const { included, excluded } = useMemo(
    () => rankByCost(candidates, tasksPerDay),
    [candidates, tasksPerDay]
  );

  return (
    <div className="pb-16 pt-10">
      <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">Tools</p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
        Cost Calculator
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-ink-2">
        What a month costs, by model. Every figure here is measured — nothing is
        estimated. See{" "}
        <Link href="/info" className="underline hover:text-ink">
          Methodology
        </Link>{" "}
        for exactly how it is calculated.
      </p>

      <div className="mt-8 max-w-md rounded border border-line p-4">
        <label htmlFor="tasks" className="mono text-[10px] uppercase tracking-wider text-ink-3">
          How many tasks per day?
        </label>
        <input
          id="tasks"
          type="number"
          min={0}
          value={tasksPerDay}
          onChange={(e) => setTasksPerDay(Math.max(0, Number(e.target.value) || 0))}
          className="mono mt-2 w-full rounded border border-line bg-surface px-3 py-2 text-lg text-ink"
        />
        <p className="mt-2 text-xs text-ink-3">
          A task is one Artificial Analysis Intelligence Index task — one
          self-contained question or job.
        </p>
      </div>

      <div className="mt-8 max-w-2xl">
        <h2 className="mono text-[10px] uppercase tracking-widest text-ink-3">
          Estimated monthly cost
        </h2>
        <ul className="mono mt-3">
          {included.map((row) => (
            <li key={row.model.id} className="flex items-center gap-3 border-b border-line py-2">
              <CompanyLogo companyId={row.model.company} size={13} />
              <Link href={`/models/${row.model.id}`} className="flex-1 truncate text-sm text-ink hover:underline">
                {row.model.name}
              </Link>
              <span className="text-[10px] text-ink-3">
                ${row.model.costPerTask.usd}/task
              </span>
              <span className="w-24 text-right text-sm text-ink">{usd(row.monthly)}</span>
            </li>
          ))}
        </ul>

        {excluded.length > 0 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-xs text-ink-3 hover:text-ink">
              {excluded.length} of {candidates.length} models have no measured
              cost-per-task figure and are excluded
            </summary>
            <p className="mt-2 text-xs text-ink-3">
              {excluded.map((m) => m.name).join(", ")}
            </p>
          </details>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Restructure the nav**

In `components/Nav.tsx`, replace the `TABS` array:

```tsx
const TABS = [
  { href: "/", label: "Models Directory" },
  { href: "/compare", label: "Compare" },
  { href: "/news", label: "News" },
  { href: "/info", label: "Info" },
];

// Both tools keep their own top-level URLs — "Tools" is a nav grouping only,
// so no existing link breaks and /which-model's OG image route is untouched.
const TOOLS = [
  { href: "/which-model", label: "Which Model?" },
  { href: "/cost-calculator", label: "Cost Calculator" },
];
```

Then render a Tools group inside the `<nav>`, after the Models Directory link and before Compare, using native `<details>` so it needs no extra client state:

```tsx
          <details className="group relative">
            <summary
              className={`flex cursor-pointer list-none items-center gap-1 px-3 py-4 text-sm transition-colors ${
                TOOLS.some((t) => pathname.startsWith(t.href))
                  ? "text-ink"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              Tools
              <span aria-hidden className="text-[10px] text-ink-3">▾</span>
              {TOOLS.some((t) => pathname.startsWith(t.href)) && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />
              )}
            </summary>
            <div className="absolute left-0 top-full z-50 min-w-[12rem] overflow-hidden rounded border border-line-strong bg-surface-2 shadow-xl">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="block px-3 py-2 text-sm text-ink-2 hover:bg-white/5 hover:text-ink"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </details>
```

- [ ] **Step 3: Add the route to the sitemap**

In `app/sitemap.ts`, add the new route to the `staticPages` list:

```ts
  const staticPages = ["", "/compare", "/news", "/info", "/which-model", "/cost-calculator"].map((path) => ({
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build succeeds and `/cost-calculator` appears as a static route.

- [ ] **Step 5: Check in the browser**

Run `npm run dev`:
1. The nav shows Tools; opening it lists both tools; visiting either underlines Tools.
2. `/which-model` still works at its original URL.
3. On `/cost-calculator`, change the task count and confirm costs and ordering update, cheapest first.
4. Confirm the excluded-models disclosure names them rather than hiding the gap.

- [ ] **Step 6: Commit**

```bash
git add app/cost-calculator/ components/Nav.tsx app/sitemap.ts
git commit -m "Add Cost Calculator under a Tools nav grouping"
```

---

## Final verification

- [ ] **Run the full test suite**

Run: `npm test`
Expected: all tests pass across `lib/` and `scripts/`.

- [ ] **Run the data integrity check**

Run the extended command from Task 2, Step 4.
Expected: `OK`

- [ ] **Recompute both derivations**

```bash
node scripts/frontier-status.js
node scripts/frontier-reigns.js
```

Expected: no unexpected status changes; reigns match the committed file. If either proposes changes, re-run with `--apply` and commit the result.

- [ ] **Run the production build**

Run: `npm run build`
Expected: succeeds; `/compare`, `/cost-calculator`, `/info` and `/models/[id]` all listed as static.

- [ ] **Run the linter**

Run: `npm run lint`
Expected: clean.
