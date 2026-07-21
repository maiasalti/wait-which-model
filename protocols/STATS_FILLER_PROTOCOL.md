# Stats Filler Protocol

**Trigger:** Maia says "execute stats filler protocol" (optionally scoped, e.g. "…for the 2026 models" or "…for SWE-bench only").

**Goal:** find and fill missing (`null`) stats in `data/models.json` — benchmark scores AND spec fields (pricing, context window, max output, knowledge cutoff) — with verified, sourced values. Never guess.

## Steps

### 1. Inventory the gaps

```bash
node -e "
const m=require('./data/models.json');
const keys=['mmluPro','gpqaDiamond','sweBench','aime','hle','lmarenaElo','arcAgi2'];
for(const x of m){
  const miss=keys.filter(k=>x.benchmarks[k]==null);
  const other=[['maxOutput',x.maxOutput],['inputPrice',x.pricing.inputPerMTok],['outputPrice',x.pricing.outputPerMTok],['knowledgeCutoff',x.knowledgeCutoff],['contextWindow',x.contextWindow]].filter(([,v])=>v==null).map(([k])=>k);
  if(miss.length+other.length) console.log(x.id+': '+[...miss,...other].join(','));
}"
```

Then read `data/stats-gaps.md` and **skip cells already marked confirmed-unavailable** (unless Maia asks to re-check, or the model had a recent update that could have changed things).

### 2. Prioritize

1. Spec fields (pricing, context, max output, cutoff) — cheap to verify, high display value
2. Benchmark gaps on `frontier`-status models — they drive the Compare charts
3. Benchmark gaps on `superseded` models
4. `deprecated` models last — many genuinely predate the benchmarks

### 3. Research (web, always)

Efficient order of attack:

- **Leaderboard sweeps first** — one page fills many cells: LMArena leaderboard (Elo), Artificial Analysis model pages, Epoch AI benchmark database, official SWE-bench / ARC-AGI / HLE leaderboards, Vellum/llm-stats trackers
- **Then per-model searches** for remaining cells: official model cards and announcement posts, then reputable evals
- Batch by benchmark, not only by model — "ARC-AGI-2 leaderboard all models" beats 40 individual searches

**Rules of evidence:**

- Official lab-reported figure > independent leaderboard/eval > secondary press. Take the best available; never average sources yourself
- If only a third-party figure exists, it's acceptable — append provenance to the model's `notes` (e.g. "MMLU-Pro is Artificial Analysis-measured, not lab-reported")
- If sources conflict materially, use the more authoritative one and record the conflict in `notes`
- Match the variant: the score must be for the model/version/mode in the record (note "extended thinking"/"with tools" caveats in `notes`). A different checkpoint's score is not a fill
- A model that predates a benchmark (e.g. GPT-4 on ARC-AGI-2) usually has no score — only fill if someone actually ran it; otherwise mark unavailable
- **Never invent, interpolate, or estimate. No verified source = stays `null`.**

### 4. Record

- Fill values in `data/models.json` (numbers only, same units as `data/benchmarks.json`)
- For every cell you researched but could NOT verify, add/update a row in `data/stats-gaps.md`:
  `| model-id | field | YYYY-MM-DD | why (never evaluated / no public figure / conflicting) |`
  This ledger is what makes re-runs cheap — keep it honest and current
- If research reveals an existing *filled* value is wrong, correct it and note the change in your report

### 5. Validate & verify

Run the integrity check and `npm run build` (see `AGENTS.md`). Spot-check one updated model in the UI (`npm run dev`): drawer shows the new values, and the model now appears in Compare charts for newly filled benchmarks.

### 6. Report

Summarize: cells filled (per field), sources used, values corrected, cells confirmed unavailable (now in the ledger), and remaining gaps worth a future re-check.

## Notes

- Prefer running via the `stats-filler` agent (`.claude/agents/stats-filler.md`)
- This protocol never changes non-stat fields (strengths, weaknesses, status, news) — hand those to the release or news-scan protocols
