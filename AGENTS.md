---
type: Agent Instructions
title: Wait Which Model?
description: A Next.js site tracking frontier AI models — a models directory, Compare charts, News, a public Info/methodology
  page, and the Which Model? and Cost Calculator tools — driven entirely by the JSON files in data/ (no backend) and kept
  current by protocol-driven, web-researched updates.
generated:
  by: human:maia
  at: '2026-08-14T02:42:48Z'
---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Wait Which Model?

A Next.js site tracking frontier AI models: **Models Directory** (`/`), **Compare** (`/compare`, interactive Recharts visualizations with a shared filter rail), **News** (`/news`), and **Info** (`/info`, public methodology page), plus a **Tools** dropdown grouping two utilities — **Which Model?** (`/which-model`, an AI-chat model recommender) and **Cost Calculator** (`/cost-calculator`, monthly-cost projection). All content is driven by the JSON files in `data/` — no backend.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (also the main correctness check; all routes are static)
- `npm test` — runs `node --test "lib/**/*.test.ts" "scripts/**/*.test.js"`, the unit tests for the pure `lib/*.ts` modules and `scripts/lib/*`

## Protocols (repeatable maintenance workflows)

| Maia says | Follow | Agent |
|---|---|---|
| "execute new model release protocol" | `protocols/NEW_MODEL_RELEASE_PROTOCOL.md` (entry formatting: `protocols/MODEL_ENTRY_STYLE_GUIDE.md`) | `.claude/agents/model-release.md` |
| "execute news scan protocol" / "news sweep" | `protocols/NEWS_SCAN_PROTOCOL.md` — **interview Maia first** (companies, period, categories, depth) via AskUserQuestion, then scan | `.claude/agents/news-scan.md` |
| "execute stats filler protocol" | `protocols/STATS_FILLER_PROTOCOL.md` | `.claude/agents/stats-filler.md` |
| "execute data gap finder protocol" / "find data gaps" | `protocols/DATA_GAP_FINDER_PROTOCOL.md` — models released in the last 6 months only, primary sources only (official/LMArena/official leaderboards); no third-party trackers, no fabrication — returns nothing rather than guess | `.claude/agents/data-gap-finder.md` |
| "execute model specs protocol" / "fill in model specs" | `protocols/MODEL_SPECS_PROTOCOL.md` — fills `speed`, `license`, `apiIds`, `retirementDate`, `predecessorId` from primary sources only; `predecessorId` requires an explicit replacement claim in the lab's own announcement, never inferred from naming | `.claude/agents/spec-filler.md` |
| "recompute frontier status" / run automatically after the release and data-gap protocols | `protocols/FRONTIER_STATUS_PROTOCOL.md` — `node scripts/frontier-status.js` (then `--apply`); **`status` is computed, never hand-assigned** except `deprecated` | — |
| "recompute frontier reigns" / run automatically after any benchmark data change | `node scripts/frontier-reigns.js` (then `--apply`) — reigns are **derived**, never hand-edited | — |
| _(automatic)_ **daily sweep** | `protocols/DAILY_SWEEP_PROTOCOL.md` — launchd, weekdays 10:30. Runs health + new-model scan daily, stats Tue/Thu, news Mon. Opens a **PR**; never writes to `main`. Aborts on a dirty working tree. | `scripts/daily-sweep.sh` |

Model-release, news-scan, stats-filler, data-gap-finder, and spec-filler require **web research — never add figures from memory**; unverified values are `null`. The news scan covers ALL frontier-lab news (funding, policy, research…), not just releases.

## Data files (`data/`)

- **models.json** — `{ id, name, company (companies.json id), releaseDate "YYYY-MM-DD", status: frontier|superseded|unknown|deprecated, tier: flagship|balanced|fast, modality: text|multimodal, contextWindow, maxOutput, pricing: {inputPerMTok, outputPerMTok}, costPerTask: {usd, effort}, openWeights, knowledgeCutoff, benchmarks: {mmluPro, gpqaDiamond, sweBench, sweBenchPro, terminalBench, aime, hle, lmarenaElo, gdpvalAA, arcAgi2}, strengths[], weaknesses[], notes, speed: {outputTokensPerSec, timeToFirstTokenSec, effort} (Artificial Analysis), license: {spdx, name, kind, url, commercialUse} | null (open-weight models only), apiIds: [{provider, id}], retirementDate, predecessorId (points backwards; successors are derived) }`. Numbers are launch-time reported scores; null = unpublished/unverified. `costPerTask` is Artificial Analysis' cost per Intelligence Index task (USD), taken at whatever reasoning effort AA publishes for that model — the effort varies model to model and is unrecorded for many of them, so figures at different efforts aren't strictly comparable — it's the headline cost figure on the model card, while per-token `pricing` moved to the drawer. `status` is computed by `scripts/frontier-status.js` (see `protocols/FRONTIER_STATUS_PROTOCOL.md`), not hand-assigned — except `deprecated`, which stays manual.
- **companies.json** — `{ id, name, country, founded, website, color, order }`. Colors are a CVD-validated categorical palette for dark surface `#0B0E1A` in `order` sequence — don't change casually; new colors must pass `node scripts/palette-check.js` (OKLCH L 0.48–0.67, chroma ≥ 0.1, adjacent-pair CVD ΔE ≥ 8, adjacent normal-vision ΔE ≥ 15, contrast ≥ 3:1).
- **benchmarks.json** — chart/tooltip metadata per benchmark key. Adding a key takes four edits: this file, the `BenchmarkKey` union in `lib/types.ts`, the URL allowlist in `lib/compare-url.ts` (a test pins it to this file), and a `null` on every models.json record; the spec-diff table (`lib/spec-diff.ts`, with its direction test) and the Which Model prompt (`app/api/which-model/route.ts`) name keys too. `retired: true` keeps a key's scores and drawer bars but drops it from Compare's picker, the head-to-head chart and the composite behind status/reigns (`scripts/lib/composite.js` reads this file). Currently retired: `mmluPro`, `aime`.
- **news.json** — `{ id "YYYY-MM-DD-slug", date, title, summary, category: release|benchmark|company|research|policy, companies[] (ids or plain names), modelIds[], sourceName, sourceUrl }`. Permanent record — append/correct, never delete.
- **methodology.json** — content for the public `/info` page (frontier definition, tiers, status meanings, benchmark notes, data-currency blurb). Edit this, not the page component, when the definition or wording changes; keep `frontierDefinition.lastReviewed` current.
- **stats-gaps.md** — ledger of model stat cells researched but unverifiable (kept by the stats-filler protocol so re-runs skip them).
- **spec-gaps.md** — ledger of `speed`/`license`/`apiIds`/`retirementDate`/`predecessorId` cells researched but unverifiable (kept by the spec-filler protocol so re-runs skip them).
- **frontier-reigns.json** — generated by `scripts/frontier-reigns.js`; `{ modelId, tier, start, end, dethronedBy, composite }`. A reconstruction from release dates and benchmark scores, not an observed history. Never hand-edit; re-run the script after any benchmark change. `days` is deliberately absent — it is computed at render so the file does not churn daily.

Integrity check after any data edit (also in the protocols):

```bash
node -e "const m=require('./data/models.json'),n=require('./data/news.json'),c=require('./data/companies.json'),r=require('./data/frontier-reigns.json');const cids=new Set(c.map(x=>x.id)),ids=new Set(m.map(x=>x.id));if(m.length!==ids.size)throw 'dup id';for(const x of m)if(!cids.has(x.company))throw 'unknown company '+x.company;for(const x of n)for(const i of x.modelIds)if(!ids.has(i))throw 'unknown modelId '+i;for(const x of m){if(x.predecessorId){if(!ids.has(x.predecessorId))throw 'unknown predecessorId '+x.predecessorId+' on '+x.id;if(x.predecessorId===x.id)throw 'self-predecessor '+x.id}if(!x.openWeights&&x.license)throw 'closed model with license '+x.id;if(x.retirementDate&&x.retirementDate<x.releaseDate)throw 'retirement before release '+x.id}for(const x of m){const seen=new Set();let cur=x.predecessorId;while(cur){if(seen.has(cur))throw 'predecessor cycle at '+x.id;seen.add(cur);cur=(m.find(y=>y.id===cur)||{}).predecessorId}}for(const x of r)if(!ids.has(x.modelId))throw 'unknown reign modelId '+x.modelId;const byTier={};for(const x of r){(byTier[x.tier]=byTier[x.tier]||[]).push(x)}for(const t in byTier){const list=byTier[t].slice().sort((a,b)=>a.start.localeCompare(b.start));for(let i=1;i<list.length;i++){if(list[i-1].end===null||list[i-1].end>list[i].start)throw 'overlapping reigns in tier '+t}}console.log('OK')"
```

The check also resolves every `frontier-reigns.json` `modelId` against `models.json` and verifies reigns within a tier never overlap (sorted by `start`, each reign's `end` must be null only for the last one and never later than the next reign's `start`).

## Notifications

Subscribers (a Resend **Segment**, id in `RESEND_SEGMENT_ID`) get one email per push to `main` that adds a model to `data/models.json`. Two halves, nothing shared but the segment:

- **Sign-up:** `components/SubscribeForm` in the footer → `app/api/subscribe/route.ts` → Resend `POST /contacts`. Needs `RESEND_API_KEY` + `RESEND_SEGMENT_ID` in Vercel (production only — previews deliberately return 503 "not_configured"). Pure parsing in `lib/subscribe.ts`.
- **Sender:** `.github/workflows/notify-new-models.yml` (push to main, `paths: data/models.json`) runs `scripts/notify-new-models.js`: diffs model ids between `github.event.before` and `github.sha`, waits up to 10 min for the site to serve each new `/models/<id>`, then Resend `POST /broadcasts` with `send: true`. Pure helpers (`newModelIds`, `buildEmail`) in `scripts/lib/notify.js`, tested under `npm test`. Secrets are GitHub repository secrets of the same names.
- Subject is `NEW model release: <every added model name, comma-separated>`. Deleting or editing a model never notifies. Re-running a workflow run by hand **resends** — don't. Three merges within a few minutes can drop the middle one's email (GitHub queues one pending run per concurrency group).
- Dry run: `BEFORE_SHA=<sha> AFTER_SHA=<sha> node scripts/notify-new-models.js --dry-run`. Manual selection: `MODEL_IDS=<comma-separated ids>` skips the diff and announces exactly those ids (e.g. re-announcing after a failed run) — `MODEL_IDS=claude-fable-5-1,gemini-3-8-flash AFTER_SHA=origin/main node scripts/notify-new-models.js --dry-run`. Design: `docs/superpowers/specs/2026-09-03-model-release-notifications-design.md`.

## Code layout

- `lib/types.ts` (schema types) · `lib/data.ts` (JSON loaders + formatters) · `lib/filter.ts` (shared filter/highlight logic for Compare) · `lib/format.ts` (pure display formatters, e.g. `formatSpeed`) · `lib/compare-url.ts` (encodes/decodes Compare's filter + picks state to and from the URL) · `lib/spec-diff.ts` (the Compare spec-diff table's field definitions, direction/verdict/comparable logic) · `lib/diff-png.ts` (renders the spec-diff table to a canvas PNG for export) · `lib/cost-calc.ts` (Cost Calculator's monthly-cost maths) · `lib/reigns.ts` (day-count maths for the frontier reigns chart)
- Pure `lib/*.ts` modules are unit-tested under `node --test` (see `npm test`): local VALUE imports between them carry the literal `.ts` extension (e.g. `import { formatSpeed } from "./format.ts"`) because Node's test runner resolves relative specifiers literally, with no bundler to paper over a missing extension; type-only imports don't need it. Modules that import JSON via the `@/` alias (e.g. `lib/data.ts`) are unreachable from `node --test`, which can't resolve that alias, and stay extensionless.
- `components/` — `Nav` (top nav, incl. the Tools dropdown) + `FrontierSparkline` (header strip: SWE-bench frontier over time), `ModelCard`/`ModelDrawer` (directory), `FilterRail` + `charts.tsx` (Compare: timeline scatter, cost-vs-performance scatter, head-to-head bars), `SpecDiff` (Compare: baseline-relative spec table, PNG export, shareable URL), `ReignChart` (Info: how long each model held its tier), `BenchmarkCoverage` (Info: reported-vs-total benchmark counts), `Collapsible` (native `<details>` wrapper used by the model page's collapsed sections), `components/model/*` (`ModelStatsGrid`, `ModelBenchmarks`, `ModelProsCons`, `ModelDeveloperDetails`, `ModelNewsList`, `benchmarkCoverage.ts` — the pieces shared by the standalone model page and the drawer)
- Design tokens live in `app/globals.css` (dark "observatory" theme; Space Grotesk display + IBM Plex Mono for data). Company brand color is the only saturated hue system — series color always follows the company.
- Pages: **Models Directory** (`/`), **Compare** (`/compare`), **News** (`/news`), and **Info** (`/info`) sit as top-level nav tabs; **Which Model?** (`/which-model`, a recommender) and **Cost Calculator** (`/cost-calculator`) are grouped under a "Tools" dropdown in `Nav` — both keep their own top-level URL, "Tools" is a nav grouping only. Each model also has its own page at `/models/[id]`, plus a parallel-route modal (`app/@modal`) so the same content opens as a drawer when navigated to from within the directory.
