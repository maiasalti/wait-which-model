<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Wait Which Model?

A Next.js site tracking frontier AI models: **Models Directory** (`/`), **Compare** (`/compare`, interactive Recharts visualizations with a shared filter rail), **News** (`/news`), and **Info** (`/info`, public methodology page). All content is driven by the JSON files in `data/` — no backend.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (also the main correctness check; all routes are static)

## Protocols (repeatable maintenance workflows)

| Maia says | Follow | Agent |
|---|---|---|
| "execute new model release protocol" | `protocols/NEW_MODEL_RELEASE_PROTOCOL.md` (entry formatting: `protocols/MODEL_ENTRY_STYLE_GUIDE.md`) | `.claude/agents/model-release.md` |
| "execute news scan protocol" / "news sweep" | `protocols/NEWS_SCAN_PROTOCOL.md` — **interview Maia first** (companies, period, categories, depth) via AskUserQuestion, then scan | `.claude/agents/news-scan.md` |
| "execute stats filler protocol" | `protocols/STATS_FILLER_PROTOCOL.md` | `.claude/agents/stats-filler.md` |
| "execute data gap finder protocol" / "find data gaps" | `protocols/DATA_GAP_FINDER_PROTOCOL.md` — models released in the last 6 months only, primary sources only (official/LMArena/official leaderboards); no third-party trackers, no fabrication — returns nothing rather than guess | `.claude/agents/data-gap-finder.md` |
| "recompute frontier status" / run automatically after the release and data-gap protocols | `protocols/FRONTIER_STATUS_PROTOCOL.md` — `node scripts/frontier-status.js` (then `--apply`); **`status` is computed, never hand-assigned** except `deprecated` | — |

Model-release, news-scan, stats-filler, and data-gap-finder require **web research — never add figures from memory**; unverified values are `null`. The news scan covers ALL frontier-lab news (funding, policy, research…), not just releases.

## Data files (`data/`)

- **models.json** — `{ id, name, company (companies.json id), releaseDate "YYYY-MM-DD", status: frontier|superseded|unknown|deprecated, tier: flagship|balanced|fast, modality: text|multimodal, contextWindow, maxOutput, pricing: {inputPerMTok, outputPerMTok}, openWeights, knowledgeCutoff, benchmarks: {mmluPro, gpqaDiamond, sweBench, aime, hle, lmarenaElo, arcAgi2}, strengths[], weaknesses[], notes }`. Numbers are launch-time reported scores; null = unpublished/unverified. `status` is computed by `scripts/frontier-status.js` (see `protocols/FRONTIER_STATUS_PROTOCOL.md`), not hand-assigned — except `deprecated`, which stays manual.
- **companies.json** — `{ id, name, country, founded, website, color, order }`. Colors are a CVD-validated categorical palette for dark surface `#0B0E1A` in `order` sequence — don't change casually; new colors must pass the dataviz palette validator (OKLCH L 0.48–0.67, chroma ≥ 0.1).
- **benchmarks.json** — chart/tooltip metadata per benchmark key. Adding a key here is all the site needs to chart it (plus scores in models.json; the head-to-head bar chart lists % keys in `PCT_KEYS` in `components/charts.tsx`).
- **news.json** — `{ id "YYYY-MM-DD-slug", date, title, summary, category: release|benchmark|company|research|policy, companies[] (ids or plain names), modelIds[], sourceName, sourceUrl }`. Permanent record — append/correct, never delete.
- **methodology.json** — content for the public `/info` page (frontier definition, tiers, status meanings, benchmark notes, data-currency blurb). Edit this, not the page component, when the definition or wording changes; keep `frontierDefinition.lastReviewed` current.
- **stats-gaps.md** — ledger of model stat cells researched but unverifiable (kept by the stats-filler protocol so re-runs skip them).

Integrity check after any data edit (also in the protocols):

```bash
node -e "const m=require('./data/models.json'),n=require('./data/news.json'),c=require('./data/companies.json');const cids=new Set(c.map(x=>x.id)),ids=new Set(m.map(x=>x.id));if(m.length!==ids.size)throw 'dup id';for(const x of m)if(!cids.has(x.company))throw 'unknown company '+x.company;for(const x of n)for(const i of x.modelIds)if(!ids.has(i))throw 'unknown modelId '+i;console.log('OK')"
```

## Code layout

- `lib/types.ts` (schema types) · `lib/data.ts` (JSON loaders + formatters) · `lib/filter.ts` (shared filter/highlight logic for Compare)
- `components/` — `Nav` + `FrontierSparkline` (header strip: SWE-bench frontier over time), `ModelCard`/`ModelDrawer` (directory), `FilterRail` + `charts.tsx` (Compare: timeline scatter, cost-vs-performance scatter, head-to-head bars)
- Design tokens live in `app/globals.css` (dark "observatory" theme; Space Grotesk display + IBM Plex Mono for data). Company brand color is the only saturated hue system — series color always follows the company.
