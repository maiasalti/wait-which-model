# Data Gap Finder Protocol

**Trigger:** Maia says "execute data gap finder protocol" / "find data gaps" / "check recent models for missing data" (optionally scoped, e.g. "…for Anthropic's recent models").

**Goal:** find missing (`null`) fields on **recently released models only** (`releaseDate` within the last 6 months) and fill them with data verified against a **primary source** — the lab's own announcement/model card, or an authoritative first-party leaderboard (LMArena, official SWE-bench/ARC-AGI/HLE boards). This is a narrower, stricter sibling of the stats-filler protocol: recent models change status/rankings fastest and get the most visibility, so their data deserves the highest bar and the most frequent re-checking.

This protocol never fills a cell it can't verify against a primary source. **If no sufficiently reliable data point exists, the field stays `null` — report it as "not found," not a best guess.**

## Steps

### 1. Scope to recent models

```bash
node -e "
const m=require('./data/models.json');
const cutoff=new Date(); cutoff.setMonth(cutoff.getMonth()-6);
const cutoffStr=cutoff.toISOString().slice(0,10);
const keys=['mmluPro','gpqaDiamond','sweBench','aime','hle','lmarenaElo','arcAgi2'];
for(const x of m){
  if(x.releaseDate < cutoffStr) continue;
  const miss=keys.filter(k=>x.benchmarks[k]==null);
  const other=[['maxOutput',x.maxOutput],['inputPrice',x.pricing.inputPerMTok],['outputPrice',x.pricing.outputPerMTok],['knowledgeCutoff',x.knowledgeCutoff],['contextWindow',x.contextWindow]].filter(([,v])=>v==null).map(([k])=>k);
  if(miss.length+other.length) console.log(x.releaseDate+' '+x.id+': '+[...miss,...other].join(','));
}"
```

Read `data/stats-gaps.md` and skip cells already logged as confirmed-unavailable within the last 30 days — anything older is fair game to re-check, since a recent model's data situation can change fast (a leaderboard adds it, a lab publishes a delayed model card, etc.).

### 2. Research — primary sources only

Acceptable sources, in order:

1. The lab's own announcement post, model card, or API/pricing docs
2. LMArena leaderboard (for `lmarenaElo`)
3. The benchmark's own official leaderboard/results page (SWE-bench, ARC-AGI, HLE) if the lab or benchmark maintainers published the model's score there

**Not acceptable as a fill source, even if a number is mentioned:** news articles, blog posts, aggregator trackers (Artificial Analysis, llm-stats, Epoch AI), social media, or any secondary paraphrase of a primary source — even if you can't find the primary source itself. If a secondary source cites a figure but you can't trace it to one of the three primary types above, treat the cell as **not found**, not filled. (Note: this is a stricter bar than `STATS_FILLER_PROTOCOL.md`, which does accept vetted third-party trackers with a provenance note — use *this* protocol for recent models specifically because of the higher bar.)

**Rules of evidence (non-negotiable):**

- Never estimate, interpolate, average across sources, or infer from a related model's score.
- Match the exact model/version/mode in the record — a preview, different context length, or "with tools" variant is not the same data point unless the record itself is for that variant (note the caveat in `notes` if so).
- If two primary sources conflict, prefer the lab's own figure and note the discrepancy in `notes`; if you can't tell which is authoritative, leave it `null`.
- A model that predates a benchmark's public existence has no score — don't backfill guesses.

### 3. Record

- Fill only cells verified against a primary source, in the exact units `data/benchmarks.json` expects.
- For every gap you checked but could **not** verify to this standard, add/update a row in `data/stats-gaps.md`:
  `| model-id | field | YYYY-MM-DD | not found via primary source (checked: <what you checked>) |`
- If you find that an existing filled value is wrong or has since been corrected by the lab, fix it and call it out in your report — don't silently leave stale data.

### 4. Recompute frontier status if anything changed

If you filled any benchmark cell, newly-verified data can shift a recent model in or out of `"frontier"` — run the [Frontier Status Protocol](./FRONTIER_STATUS_PROTOCOL.md) (`node scripts/frontier-status.js`, review, then `--apply`) before reporting.

### 5. Validate & report

Run the integrity check and `npm run build` (see `AGENTS.md`). Report: cells filled with sources cited per cell, cells checked and confirmed not-yet-available (now logged), any corrections made to existing data, and any status changes from step 4. If nothing met the reliability bar, say so plainly rather than padding the report — an empty result is a valid, expected outcome of this protocol.

## Notes

- Prefer running via the `data-gap-finder` agent (`.claude/agents/data-gap-finder.md`).
- For older models, or when a secondary/tracker-sourced figure (with a provenance note) is acceptable, use `STATS_FILLER_PROTOCOL.md` instead — it has a wider net and a slightly lower bar by design.
- Never touches `strengths`/`weaknesses`/`status`/`news` — status is computed separately (`FRONTIER_STATUS_PROTOCOL.md`).
