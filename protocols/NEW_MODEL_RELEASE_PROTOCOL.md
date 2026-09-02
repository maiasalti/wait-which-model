---
type: Protocol
title: New Model Release Protocol
description: Add a newly released frontier model to data/models.json with web-verified, sourced data so it appears correctly
  in Directory, Compare and News; frontier status is then computed, never assigned.
tags:
- protocols
generated:
  by: human:maia
  at: '2026-08-05T06:05:55Z'
---

# New Model Release Protocol

**Trigger:** Maia says "execute new model release protocol" (optionally naming the model, e.g. "…for Grok 5"). If no model is named, first web-search for frontier model releases since the newest `releaseDate` in `data/models.json` and confirm with Maia which to add — or add all of them.

**Goal:** add a newly released frontier model to the website so it appears correctly in all three tabs (Directory, Compare, News) with verified, sourced data.

## Scope — what's worth adding

Notable models from major labs (Anthropic, OpenAI, Google DeepMind, Meta, xAI, Mistral, DeepSeek, Alibaba/Qwen, Moonshot, and any credible new lab), across any tier (flagship / balanced / fast). Skip minor checkpoint bumps unless they change benchmarks or pricing meaningfully.

Note: adding a model here does **not** mean it's `"frontier"` — that status is computed, not assigned. See [Frontier Status Protocol](./FRONTIER_STATUS_PROTOCOL.md), run as step 5 below.

## Steps

### 1. Research (web, always — never from memory)

Search for and read, in order of preference: the lab's official announcement/model card, then reputable trackers (Artificial Analysis, llm-stats, LMArena) and coverage. Collect:

- Exact name, company, announcement date (`YYYY-MM-DD`)
- API pricing: USD per million input / output tokens (base tier; note fast/long-context surcharges in `notes`)
- Context window and max output tokens
- Knowledge cutoff (null if unpublished), modality, open weights or not
- `availability` — can a person actually go and use it today? `general` (public API, consumer app, or a mainstream host), `restricted` (preview/waitlist/vetted-partner/subscription/app-only), or `self-host` (weights only, no practical hosted option). Check for an aggregator listing before assuming `self-host` — an open-weights model any host serves is `general`
- Benchmark scores for the keys in `data/benchmarks.json` (currently: mmluPro, gpqaDiamond, sweBench, aime, hle, lmarenaElo, arcAgi2)
- Which `tier` it belongs to — `flagship` (top-of-line), `balanced` (mid cost/capability, e.g. a "Sonnet"/"Medium"-class release), or `fast` (small/cheap/low-latency, e.g. "Haiku"/"Flash"/"Mini"-class)
- 2–4 strengths and 1–3 weaknesses from launch reception
- `speed` — `{ outputTokensPerSec, timeToFirstTokenSec, effort }` from Artificial Analysis' model page. AA measures each model at a specific reasoning-effort setting and the setting dominates the numbers, so always record which one in `effort` (`low`/`medium`/`high`/`xhigh`/`max`, or `null` if the model has no effort levels) — use AA's medium-effort variant whenever it publishes a cost for one, otherwise whichever variant does. `timeToFirstTokenSec` is time to first *answer* token (after any thinking phase, so it can run to minutes at high effort) — never label it just "first token" in prose, that reads as stalled inference. Both null if AA hasn't measured the model.
- `license` — **must be `null` for any `openWeights: false` model**; the integrity check fails a closed-weight model that carries a license record. For an open-weights model, source `{ spdx, name, kind, url, commercialUse }` from the official repo/model card (e.g. Hugging Face) — `spdx` is null for a bespoke license like Llama's.
- `apiIds` — official per-provider model strings: the lab's own API docs (provider `"anthropic"`/`"openai"`/`"google"`/etc.), then Bedrock (`"aws-bedrock"`) and Vertex (`"google-vertex"`) model-card pages if the model is hosted there. `[]` if not researched — don't guess a provider string from the model name.
- `retirementDate` — an announced shutdown date only, from the lab's official lifecycle/deprecation page (e.g. Anthropic's `model-deprecations` doc). A "tentative not sooner than" floor on an active model is **not** a retirement announcement — leave `null` until a lab actually schedules one. Third-party trackers (Artificial Analysis, OpenRouter) marking a model "deprecated" in their own UI once a successor ships is not an official retirement either.
- `predecessorId` — points **backwards** to the model this one replaces, only when a primary source **explicitly** states the replacement (Anthropic's system cards often say "its predecessor, X"; a "what's new" or migration-guide page saying "drop-in replacement for X" also counts). Naming similarity or "builds on X" / "significant upgrade from X" phrasing is **not** evidence — that describes lineage, not supersession. If no explicit statement exists, leave `null` and log it to `data/spec-gaps.md` (`model-id · predecessorId · YYYY-MM-DD · what was searched`) so re-runs skip it. Check whether the new model's release retroactively resolves an existing gap logged for an *older* entry (a later model's `predecessorId` naming this one) — if so, set it and delete that gap line.
- **Rules of evidence:** never invent a number — use `null` for anything unverified. If sources conflict, use the official figure and record the conflict in `notes` (e.g. two official docs disagreeing on `maxOutput`). Note in `notes` when a score is third-party or "with tools". Log any unverifiable benchmark/spec cell to `data/stats-gaps.md` (numeric/pricing fields) or `data/spec-gaps.md` (the five fields above) so future runs skip re-researching it.

### 2. Update `data/models.json`

Add one record following **`protocols/MODEL_ENTRY_STYLE_GUIDE.md`** — it defines the exact field formats, naming, and the voice for strengths/weaknesses/notes so the new entry is indistinguishable in style from existing ones. `lib/types.ts` is the authoritative schema (the `Model` interface); every field it declares is required on the object, `null`/`[]`/`""` where genuinely unresearched, or the build's `tsc` step fails. Then:

- `id`: kebab-case of the name (e.g. `grok-5`)
- Set `status: "unknown"` as a placeholder — the [Frontier Status Protocol](./FRONTIER_STATUS_PROTOCOL.md) (step 5 below) computes the real value from `tier`, recency, and benchmarks, so don't hand-assign `"frontier"` here
- `license` must be `null` on a closed-weight (`openWeights: false`) entry — see the research rules above
- Update stale facts on existing models discovered during research (price cuts, context bumps) in the same pass

### 3. Update `data/news.json`

Prepend a `release`-category entry: `id` = `YYYY-MM-DD-<model-id>`, 1–2 sentence summary with the headline numbers, `modelIds` linking the new model, source = official announcement.

### 4. Update registries if needed

- New company → add to `data/companies.json` with `order` = next integer and a `color`, then run **`node scripts/palette-check.js`** (add `--all` to see the full pairwise picture) until it exits 0. It enforces, against surface `#0B0E1A` in the fixed `order` sequence: OKLCH L 0.48–0.67, chroma ≥ 0.1, adjacent-pair CVD ΔE ≥ 8, adjacent normal-vision ΔE ≥ 15, contrast ≥ 3:1. Only *adjacent* pairs are gated — that many categorical hues can't all be mutually separable under CVD, so everywhere color appears it's backed by secondary encoding (brand logos on the directory buttons, labels and tooltips in the charts). Pick the smallest shift off the brand hue that clears the bar rather than the largest margin
- New benchmark everyone now reports → add to `data/benchmarks.json` (key, name, description, unit, higherIsBetter, max), and optionally backfill top models

### 5. Recompute frontier status and reigns

Run the [Frontier Status Protocol](./FRONTIER_STATUS_PROTOCOL.md) (`node scripts/frontier-status.js`, review the diff, then `--apply`) so `status` reflects the new model against current recency/tier/benchmark rules — this is what actually sets `"frontier"`, including demoting whatever it displaces.

Then run `node scripts/frontier-reigns.js` and, if the diff looks right, `--apply`. A new model with benchmark data can change the frontier-reign history (e.g. filling a gap between two existing reigns, as a same-tier release inserted between them does), so this must be re-derived and committed alongside the status change, not left stale.

### 6. Validate

```bash
node -e "
const m=require('./data/models.json'),n=require('./data/news.json'),c=require('./data/companies.json');
const cids=new Set(c.map(x=>x.id)), ids=new Set(m.map(x=>x.id));
if(m.length!==ids.size) throw 'duplicate model id';
for(const x of m) if(!cids.has(x.company)) throw 'unknown company '+x.company;
for(const x of n) for(const i of x.modelIds) if(!ids.has(i)) throw 'unknown modelId '+i;
console.log('OK', m.length, 'models,', n.length, 'news');
"
npm run build
```

### 7. Verify in the browser

Run `npm run dev` and confirm: the model card renders in the Directory (correct company dot, chips, drawer detail), it appears in both Compare scatters when its benchmark/pricing exist, and the release entry shows in News linked to the model. Screenshot if anything looks off.

### 8. Report

Summarize to Maia: what was added, key figures, which models changed frontier/superseded status and why, any data marked null/conflicting, and anything needing follow-up.

## Notes

- Prefer running this via the `model-release` agent (`.claude/agents/model-release.md`) so research happens in an isolated context.
- If research surfaces significant *non-release* news, don't fold it in here — suggest running the [news scan protocol](./NEWS_SCAN_PROTOCOL.md).
