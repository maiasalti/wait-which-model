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
- Benchmark scores for the keys in `data/benchmarks.json` (currently: mmluPro, gpqaDiamond, sweBench, aime, hle, lmarenaElo, arcAgi2)
- Which `tier` it belongs to — `flagship` (top-of-line), `balanced` (mid cost/capability, e.g. a "Sonnet"/"Medium"-class release), or `fast` (small/cheap/low-latency, e.g. "Haiku"/"Flash"/"Mini"-class)
- 2–4 strengths and 1–3 weaknesses from launch reception
- **Rules of evidence:** never invent a number — use `null` for anything unverified. If sources conflict, use the official figure and record the conflict in `notes`. Note in `notes` when a score is third-party or "with tools".

### 2. Update `data/models.json`

Add one record following **`protocols/MODEL_ENTRY_STYLE_GUIDE.md`** — it defines the exact field formats, naming, and the voice for strengths/weaknesses/notes so the new entry is indistinguishable in style from existing ones. Then:

- `id`: kebab-case of the name (e.g. `grok-5`)
- Set `status: "superseded"` as a placeholder — the [Frontier Status Protocol](./FRONTIER_STATUS_PROTOCOL.md) (step 5 below) computes the real value from `tier`, recency, and benchmarks, so don't hand-assign `"frontier"` here
- Update stale facts on existing models discovered during research (price cuts, context bumps) in the same pass

### 3. Update `data/news.json`

Prepend a `release`-category entry: `id` = `YYYY-MM-DD-<model-id>`, 1–2 sentence summary with the headline numbers, `modelIds` linking the new model, source = official announcement.

### 4. Update registries if needed

- New company → add to `data/companies.json` with `order` = next integer and a `color` that **passes the dataviz palette validator** against surface `#0B0E1A` in the fixed order (OKLCH L 0.48–0.67, chroma ≥ 0.1, adjacent-pair CVD ≥ 12 or ≥ 8 with the site's labels/tooltips)
- New benchmark everyone now reports → add to `data/benchmarks.json` (key, name, description, unit, higherIsBetter, max), and optionally backfill top models

### 5. Recompute frontier status

Run the [Frontier Status Protocol](./FRONTIER_STATUS_PROTOCOL.md) (`node scripts/frontier-status.js`, review the diff, then `--apply`) so `status` reflects the new model against current recency/tier/benchmark rules — this is what actually sets `"frontier"`, including demoting whatever it displaces.

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
