# Model Specs Protocol

**Trigger:** Maia says "execute model specs protocol" / "fill in model specs" (optionally scoped, e.g. "…for frontier models" or "…for licences only").

**Goal:** find and fill five spec fields in `data/models.json` — `speed`, `license`, `apiIds`, `retirementDate`, `predecessorId` — with verified, sourced values. Never guess, and never infer product lineage from naming.

## Steps

### 1. Inventory the gaps

```bash
node -e "
const m=require('./data/models.json');
for(const x of m){
  const miss=[];
  if(x.speed.outputTokensPerSec==null || x.speed.timeToFirstTokenSec==null) miss.push('speed');
  if(x.openWeights && x.license==null) miss.push('license');
  if(x.apiIds.length===0) miss.push('apiIds');
  if(!x.retirementDate) miss.push('retirementDate?');
  if(!x.predecessorId) miss.push('predecessorId?');
  if(miss.length) console.log(x.releaseDate+' '+x.status+' '+x.id+': '+miss.join(','));
}"
```

`retirementDate?` and `predecessorId?` are marked with a `?` deliberately: unlike `speed`/`license`/`apiIds`, most models will legitimately never get a value for these two (no model has been retired; no model has an announced predecessor), and that's not a gap to chase — see step 2.

Then read `data/spec-gaps.md` and **skip cells already marked confirmed-unavailable** (unless Maia asks to re-check, or the model had a recent lifecycle update — a new deprecation notice, a new sibling release — that could have changed things).

### 2. Prioritize

1. `status: "frontier"` models first
2. everything released in the last 12 months
3. older models opportunistically

Within a model, research `speed`, `license`, and `apiIds` first — every in-scope model is expected to eventually resolve to a definite answer, even if that answer is "confirmed unavailable" (logged, not left silently blank). Only look into `retirementDate` and `predecessorId` where the sources in step 3 are likely to actually say something — don't spend a research pass hunting for a retirement date on a model that's currently `frontier`, or a predecessor for a company's first release.

### 3. Research (web, always)

**Per-field sources, primary only:**

| Field | Accepted sources |
|---|---|
| `speed` | Artificial Analysis only (same source as `costPerTask`) |
| `license` | The model's own repo or model card — Hugging Face `LICENSE` file, official licence page |
| `apiIds` | Official API/model-list documentation, per provider |
| `retirementDate` | Official deprecation or model-lifecycle pages only |
| `predecessorId` | The release announcement itself must name what it replaces |

No exceptions: a secondary source repeating a figure it attributes to one of these does not count — trace it back to the primary page, or leave the field unresolved.

**`license` — closed-weight models never get one.** `license` is `null` for every `openWeights: false` model, full stop — the licence question only has a meaning when there are weights to license. Do not set `license` on a closed model even if you find licence-shaped text for its API terms of service; that's not what this field is for. The integrity check in `AGENTS.md` throws if a closed model carries a non-null `license`, so this isn't optional.

**The `predecessorId` rule — this is judgement, not a looked-up figure.** Only set `predecessorId` when the lab's own release announcement, blog post, or model card **explicitly names what the new model replaces or supersedes** ("replaces GPT-4", "successor to Claude 3 Opus", "deprecates and replaces X"). Naming similarity is **not** evidence — "Foo 2" following "Foo 1" does not imply Foo 2 replaces Foo 1; a version bump, a new tier launching alongside an old one staying available, or a completely unrelated codename tells you nothing on its own. If you cannot point to a sentence in a primary source that makes the replacement claim, leave `predecessorId` `null`. A careless run inventing lineage from naming patterns is exactly the failure mode this rule exists to prevent — when in doubt, it stays `null`.

**Rules of evidence:**

- Official source only, per the table above — no aggregators, trackers, or secondary paraphrase count as a fill source for these fields, even when a matching primary page can't be found.
- Never invent, interpolate, estimate, or infer from a sibling/related model.
- Match the exact model/version/variant in the record — a preview or differently-quantized release is not the same data point.
- If two primary sources conflict (e.g. a provider's docs list two ids for the same deployment), record both `apiIds` entries rather than picking one; for `speed`/`license`/`retirementDate`, prefer the more authoritative primary source and note the discrepancy in `notes`.
- **No verified source = the field stays `null` (or `[]` for `apiIds`). Never fabricate.**

**Expect gaps.** This is normal, not a failure to fix harder: Artificial Analysis does not measure `speed` for retired models or for weights-only releases with no hosted endpoint; `apiIds` will be empty for models with no public API (research previews, self-host-only releases); `retirementDate` and `predecessorId` will stay `null` for the large majority of models, including every currently-`frontier` one.

### 4. Record

- `speed: { outputTokensPerSec, timeToFirstTokenSec }` — fill both from the same Artificial Analysis measurement. If AA publishes only one of the two for a model, fill that one and leave the other `null` — don't derive or estimate the missing half.
- `license: { spdx, name, kind, url, commercialUse } | null` — `spdx` is `null` for bespoke licences with no SPDX identifier (e.g. Llama's own license); `kind` is one of `"permissive" | "copyleft" | "restricted" | "proprietary"`, classified by actually reading what the licence permits, not guessed from its name; `commercialUse` is `null` (not `false`) if the terms are ambiguous or require a separate commercial agreement rather than flatly prohibiting it. Only ever set on `openWeights: true` models.
- `apiIds`: array of `{provider, id}`, one entry per provider whose docs list the model — append to the array rather than overwriting existing entries; leave it `[]` (not `null`) when no provider lists a public id.
- `retirementDate: "YYYY-MM-DD" | null`.
- `predecessorId: model-id | null` — must be an existing `models.json` id; per the `predecessorId` rule above, only set from an explicit primary-source replacement claim.
- For every cell you researched but could **not** verify, append a line to `data/spec-gaps.md` in the ledger's own format:
  `model-id · field · YYYY-MM-DD · what was searched (e.g. "no AA coverage", "no licence file on HF repo", "no public API id in any provider's docs", "no announced retirement", "no primary-source lineage claim")`
  This ledger is what makes re-runs cheap — keep it honest and current.
- If research reveals an existing filled value is wrong or stale (a licence changed, a model was since retired), correct it and note the change in your report.

### 5. Validate & verify

Run the integrity check (see `AGENTS.md` — it now also checks `predecessorId` references, cycles, self-reference, closed-model licences, and `retirementDate` ordering), then:

```bash
node scripts/frontier-reigns.js
```

(reigns do not depend on these fields, but the check confirms nothing else broke), then `npm run build`.

### 6. Report

Summarize: cells filled (per field, with the specific primary source per cell), `predecessorId`/`retirementDate` links established and the exact sentence that justified each, cells confirmed unavailable (now in `data/spec-gaps.md`), and remaining gaps worth a future re-check.

## Notes

- Prefer running via the `spec-filler` agent (`.claude/agents/spec-filler.md`).
- This protocol never changes benchmark scores, pricing, `strengths`/`weaknesses`/`status`/`news`, or any field outside the five listed above — hand those to the stats-filler, data-gap-finder, release, or news-scan protocols.
- `predecessorId` and `retirementDate` staying `null` on most models forever is the expected steady state, not an incomplete run.
