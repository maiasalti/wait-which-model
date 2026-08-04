# Model data and tools expansion

**Date:** 2026-08-04
**Status:** draft

## Problem

The directory tracks 73 models on quality and cost, and nothing else. Three gaps follow
from that:

1. **Missing dimensions.** No speed data, so "fast" is asserted by `tier` rather than
   measured. `openWeights: true` flattens MIT, Apache-2.0 and Llama-style community
   licences into one boolean. No API model strings, so a developer who lands on a model
   page cannot copy the one string they came for. No retirement dates, so `deprecated`
   says a model is dead but not when. No lineage, so `superseded` never says by what.
2. **No historical view.** `scripts/frontier-status.js` recomputes status from scratch on
   every run and keeps no history, so the site cannot answer "how long did this model hold
   the frontier" — the single most interesting question the dataset could answer.
3. **Dead ends in the UI.** The Compare page's filter state is unshareable. There is no
   pairwise spec comparison. Pricing is displayed but never turned into a decision.

Adding all of (1) makes the model drawer worse before it makes it better: it is already a
dense wall of figures, and doubling the field count would push it past what a non-expert
visitor can absorb.

## Goal

Add the five data dimensions, derive frontier reigns and benchmark coverage from data that
already exists, ship three UI features that turn the dataset into decisions — and
restructure the model drawer so a beginner sees *less* than they do today, not more.

## Non-goals

- Backfilling every new field for all 73 models. Coverage is prioritised (see Phase 3).
- Per-field source provenance. Considered and deferred; it is a larger project.
- Changing `/which-model`'s URL, behaviour or OG image.

---

## Phase overview

| # | Phase | Depends on | Ships |
|---|---|---|---|
| 1 | Schema + reign derivation | — | Types, null-filled fields, `frontier-reigns.js`, `frontier-reigns.json` |
| 2 | Collapsible drawer + coverage | 1 | `<details>` sections, "For developers", coverage counts |
| 3 | Research backfill | 1 | New protocol + agent, prioritised data fill |
| 4 | Compare URL state | — | Shareable `/compare` links |
| 5 | Spec diff | 4 | Diff table below head-to-head, URL + PNG export |
| 6 | Days-at-frontier chart | 1 | Reign chart + coverage panel on `/info` |
| 7 | Tools nav + Cost Calculator | — | `/cost-calculator`, "Tools" nav grouping |

Phases 1–2 visibly improve the model page before any research runs. Phase 3 is the long
pole and can proceed in the background while 4–7 land.

---

## Phase 1 — Schema and reign derivation

### New fields on `Model`

All nullable or empty-defaulted, so the 73 existing entries stay schema-valid the moment
the types land.

```ts
/** Artificial Analysis-measured serving speed, same source as costPerTask.
 *  Null where AA publishes no measurement — retired models, and weights-only
 *  releases with no hosted endpoint to measure. */
export interface Speed {
  outputTokensPerSec: number | null;
  timeToFirstTokenSec: number | null;
}

export type LicenseKind = "permissive" | "copyleft" | "restricted" | "proprietary";

/** Null for closed-weight models — the licence question only has a meaningful
 *  answer when there are weights to license. `kind` is the field the UI filters
 *  and colours on; `spdx` is null for bespoke licences like Llama's. */
export interface License {
  spdx: string | null;
  name: string;
  kind: LicenseKind;
  url: string | null;
  commercialUse: boolean | null;
}

interface Model {
  // …existing fields…
  speed: Speed;
  license: License | null;
  apiIds: { provider: string; id: string }[];
  retirementDate: string | null;   // YYYY-MM-DD, announced shutdown
  predecessorId: string | null;    // model this one replaces
}
```

**`apiIds` is provider-tagged** rather than a bare string array because the same model is
served under different strings on the first-party API, Bedrock and Vertex, and a developer
needs the one matching their provider. Empty array is the honest default: "we have not
researched this", identical in rendering to "none published".

**`predecessorId` points backwards.** Successors are derived by inverting the map. This is
deliberate: a newly added model wires itself into the lineage with one field and no
existing entry is edited, which keeps the new-model-release protocol a pure append. It
also represents fan-out correctly — GPT-4o and GPT-4.5 can both name GPT-4 as predecessor,
which a forward `successorId` could not express without becoming an array.

Validation to add to the integrity check: every non-null `predecessorId` resolves to a
known model id, no model is its own predecessor, and the predecessor chain is acyclic.

### Frontier reigns

No schema field. `scripts/frontier-reigns.js` derives reigns and writes
`data/frontier-reigns.json`, mirroring how `frontier-status.js` writes computed status —
the derivation stays diffable in git and the site does zero computation at render.

```
For each tier, over ALL models in that tier regardless of current status
(deprecated models still held the frontier historically):

  rankable = models with >= MIN_BENCHMARKS (3) non-null benchmarks
  sort rankable by releaseDate asc, tie-broken by id asc for determinism

  champion = null
  for m in rankable:
      if champion is null or composite(m) > composite(champion):
          if champion: champion.end = m.releaseDate; champion.dethronedBy = m.id
          champion = m, with start = m.releaseDate
  final champion: end = null  (still reigning)
```

Output record: `{ modelId, tier, start, end, dethronedBy, composite }`.

**`days` is deliberately not stored.** The current champion's reign grows every day, so a
committed `days` would be stale within 24 hours and produce a spurious git diff on every
run. The site computes elapsed days from `start` and `end ?? today`.

**Shared scoring.** The composite function is extracted from `frontier-status.js` into
`scripts/lib/composite.js` (CommonJS, matching the existing scripts) and required by both,
so the two derivations cannot drift apart.

**Known limitation, to be stated on `/info` rather than hidden.** The composite is min-max
normalised across the tier cohort and averaged over whichever benchmarks each model
reports. Two models reporting different benchmark subsets are therefore not compared on
identical ground, and adding a new top scorer rescales the axis. This is acceptable for
the status script's narrow recency window; across a three-year reign history it makes the
result a *reconstruction*, not an observed record. `/info` and the chart caption must both
say so. The `MIN_BENCHMARKS >= 3` gate is what keeps a model with one lucky score from
taking a crown it never held.

Add `frontier-reigns.js` to the protocols table in `AGENTS.md`, run alongside
`frontier-status.js` — reigns depend on benchmark data, so any stats fill invalidates them.

---

## Phase 2 — Collapsible drawer and model page

`ModelDrawer` and `app/models/[id]/page.tsx` already share `ModelStatsGrid`,
`ModelBenchmarks`, `ModelProsCons` and `ModelNewsList`, so this is one change that fixes
both surfaces.

### Structure

```
[ always visible ]  stats grid — plus speed
▸ Benchmarks — 6 of 8 reported
▸ Strengths & weaknesses
▸ For developers
▸ News
```

Speed joins the always-visible grid because "how fast is it" is a question beginners
actually ask; API strings, licence, retirement date and lineage go behind **For developers**
where a non-technical visitor never encounters them.

### Native `<details>`, not React state

A new `<Collapsible>` wrapper renders `<details><summary>`. This is not a style
preference: `app/models/[id]/page.tsx` is currently a **server component**, and a
`useState` accordion would force the whole page client-side. Native `<details>` keeps it
server-rendered, and gives keyboard operation, screen-reader semantics and
find-in-page expansion for free.

`defaultOpen` maps to the native `open` attribute, so the same components serve both
surfaces with different densities:

| Surface | Open by default |
|---|---|
| Drawer (narrow, `max-w-md`) | nothing — every section collapsed |
| `/models/[id]` (wide, two-column) | Benchmarks, Strengths & weaknesses |

The existing two-column grid on the full page pairs the stats grid with benchmarks; with
benchmarks collapsible the layout becomes a single column of sections, which also fixes
the current awkwardness of a short stats grid next to a tall benchmark list.

### Benchmark coverage in the summary

The Benchmarks summary reads **"Benchmarks — 6 of 8 reported"**. The count is the honesty
signal and the affordance in one: it tells the visitor there is missing data before they
open the section and find dashes.

`ModelBenchmarks` keeps rendering unreported benchmarks as dashes; nothing is hidden.

---

## Phase 3 — Research backfill

Adds `protocols/MODEL_SPECS_PROTOCOL.md` and `.claude/agents/spec-filler.md`, following
the existing stats-filler pattern exactly: **web research only, never figures from
memory, unverifiable cells stay null and are logged** to a ledger
(`data/spec-gaps.md`) so re-runs skip them.

Per-field sourcing rules:

| Field | Primary sources |
|---|---|
| `speed` | Artificial Analysis (same source as `costPerTask`) |
| `license` | The model's own repo/model card — HuggingFace `LICENSE`, official licence page |
| `apiIds` | Official API/model-list documentation for each provider |
| `retirementDate` | Official deprecation/lifecycle pages only |
| `predecessorId` | The release announcement's own framing of what it replaces |

`predecessorId` is judgement, not a looked-up figure — the rule is that the lab's own
announcement must name the predecessor. Where a release does not claim to replace
anything, it stays null rather than being inferred from naming.

**Prioritised order:** `status: frontier` first, then everything released in the last 12
months, then the rest opportunistically. Older models keep nulls and degrade gracefully
everywhere, which Phase 2's rendering already guarantees. Speed data in particular is not
expected to exist for retired models.

---

## Phase 4 — Compare URL state

Encode `Filters` plus both pick sets into the query string; `router.replace(url, { scroll:
false })` on change so filtering never pollutes browser history.

**Build-breaking constraint.** Next 16 fails the production build with *"Missing Suspense
boundary with useSearchParams"* when a statically prerendered client component reads
search params. `/compare` is exactly that. The page must therefore be split: a thin server
shell wrapping the existing client component in `<Suspense>`. Verified in
`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md:179`
— and it passes in dev and only fails at build, so this must be built with `npm run build`
as the check, not the dev server.

Serialisation keeps URLs short and readable by omitting any parameter still at its default,
so an untouched Compare page has a clean bare URL.

---

## Phase 5 — Spec diff

Added **below** the existing head-to-head section, separated by a horizontal rule. The
head-to-head bar chart stays exactly as it is.

The diff carries its own model selection, independent of both the FilterRail (which drives
the two scatters) and head-to-head's picks. Its picker sits inline above the diff table,
mirroring how head-to-head's picker already works at `app/compare/page.tsx:88-110`.

> **Assumption to confirm at review:** the separator and the diff's picker both live in
> the main column. An earlier instruction described putting the new filters in the rail
> below the existing ones; that was written when the diff was going to *replace*
> head-to-head. Now that it is additive and below, the main column is the consistent
> home. Say if the rail is still preferred.

### Table

One row per field, one column per model. A **baseline** model is chosen from the picks;
its column shows raw values, every other column shows the value plus a delta against the
baseline, coloured by whether the delta is better or worse — using each field's own
direction, since lower is better for price and latency but higher is better for
benchmarks. Fields where both models are null are hidden entirely to keep the table short.

### Export

- **Shareable URL** — picks and baseline in the query string, reusing Phase 4's plumbing.
- **PNG** — drawn to a canvas at 2× DPI and downloaded. Hand-drawn text rows rather than a
  DOM-to-image library, which keeps the dependency count at zero; the table is a plain
  grid so this is layout arithmetic, not general HTML rendering.

---

## Phase 6 — Days at frontier

Consumes `data/frontier-reigns.json` from Phase 1. A horizontal bar per model, spanning
its reign, grouped by tier and coloured by company — reusing the existing company-colour
convention. Current champions render with an open-ended bar.

Caption states plainly that reigns are reconstructed from benchmark data, not observed.

`/info` additionally gains a **benchmark coverage panel**: one row per benchmark with
"n of 73 models report this". This is generated from `models.json` at render, needs no new
data, and doubles as a public to-do list for the stats-filler protocol.

Copy for both lives in `methodology.json`, per the existing convention that `/info` wording
is data, not component code.

---

## Phase 7 — Tools nav and Cost Calculator

### Nav

"Tools" becomes a nav grouping over `/which-model` ("Which Model?") and
`/cost-calculator` ("Cost Calculator"). **Both keep their own top-level URLs** — nothing
moves, no redirects, and `/which-model`'s OG image route is untouched.

### Calculator

Asking a human for tokens-per-day is asking a question nobody can answer. The calculator
instead asks what they are doing and how much of it:

```
WHAT ARE YOU DOING?
 [ Everyday chat ] [•Coding agent•] [ Summarising docs ]
 [ Classification ] [ Custom ]

HOW MUCH?
  8  ▾ hours of coding per day
  22 ▾ working days per month

▾ ASSUMPTIONS (editable)
  Input per session ......  40,000 tok
  Output per session .....   8,000 tok
  Sessions per hour ......       3

ESTIMATED MONTHLY COST
  Model A ........  $84 – $126
  …
  (range reflects ±25% on the assumptions above)
```

Each preset selects a token profile and a natural unit of volume. Cost is
`(inputTok × inputPerMTok + outputTok × outputPerMTok) / 1e6`, ranked ascending, over
models with pricing published; models without pricing are listed as excluded rather than
silently dropped.

**The presets are the one place this feature could quietly fabricate data.** A claim that a
coding session consumes 40,000 input tokens is not a researched figure, and presenting it
as one would violate the same rule the data protocols enforce. Three mitigations, all
required:

1. The assumptions panel is always present and every number in it is editable.
2. Output is a **range**, not a point estimate — ±25%, labelled as reflecting assumption
   uncertainty.
3. `methodology.json` gains a calculator section stating the profiles are illustrative
   starting points, not measurements.

State is URL-encoded, so a configured estimate is shareable like everything else.

---

## Validation

Every phase ends with `npm run build`, which is the project's main correctness check and —
per Phase 4 — the only place the Suspense constraint surfaces.

The `data/` integrity check in `AGENTS.md` is extended for the new fields:

```
predecessorId resolves to a known model id
no model is its own predecessor; no cycles in the predecessor chain
license is null whenever openWeights is false
retirementDate, when present, is a valid date >= releaseDate
every frontier-reigns.json modelId resolves; reigns within a tier never overlap
```

The `license`/`openWeights` rule is deliberately one-directional. A closed-weight model
carrying a licence record is a genuine contradiction and must fail. An open-weight model
with `license: null` is merely unresearched — the normal state between Phase 1 and Phase 3
— so the reverse must not be enforced. Coverage of open-weight licences belongs in the
Phase 3 gap ledger, not the integrity check.

## Risks

- **Reign reconstruction is a judgement call presented as a chart.** Mitigated by the
  `MIN_BENCHMARKS` gate and explicit captions, but it will still read as more
  authoritative than it is. Accepted knowingly.
- **Phase 3 may return little for older models.** Speed and API strings for 2023 models
  may simply not be published anywhere. The UI treats nulls as normal, so partial
  coverage is a working state rather than a broken one.
- **Phase 2 changes the full model page's layout**, not just its density. Worth a visual
  check before moving on.
