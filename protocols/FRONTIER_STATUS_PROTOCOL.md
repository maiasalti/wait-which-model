# Frontier Status Protocol

**Trigger:** run automatically as the last step of the [new model release protocol](./NEW_MODEL_RELEASE_PROTOCOL.md) and the [news scan protocol](./NEWS_SCAN_PROTOCOL.md). Can also be run standalone whenever Maia asks to "recompute frontier status" or "audit frontier statuses."

**Goal:** keep `status` in `data/models.json` an accurate, mechanically-derived signal of "genuinely near the top of current capability" — not a manually-remembered label that quietly goes stale.

## The rule

A model qualifies as `"frontier"` one of two ways:

### A. Major-lab recency override

If the model is from OpenAI, Anthropic, Google, or Meta, and is the single most recent release in its `(company, tier)` group, released within the last 3 months, it's automatically `"frontier"` — **no benchmark data required.** These labs' newest flagship releases are trusted to be near-SOTA the moment they ship, and a model must never lose frontier status just because benchmark numbers haven't been published yet (labs frequently delay SWE-bench/AIME figures by weeks). This is a deliberate trade-off: it accepts that a major lab's newest release might occasionally be a modest bump, in exchange for never wrongly demoting a genuinely frontier model for a data-availability gap.

### B. General rule (everyone else, and major-lab models outside the window above)

Within its `tier` (`flagship` / `balanced` / `fast`):

1. **Recency** — released within the last 9 months. Older models age out automatically, even with no successor.
2. **Capability bar** — its composite benchmark score is within 15% of the best composite score among other recent, rankable models in the same tier (models covered by the override in A are excluded from this comparison pool). Being newest isn't sufficient; a new release with weaker benchmarks than the current leader doesn't qualify.
3. **Verified data** — has at least 3 non-null benchmark scores. A recent model below that threshold becomes `"unknown"` rather than being guessed into `"frontier"` or `"superseded"` — it genuinely can't be judged yet. Run the stats-filler or data-gap-finder protocol on it, then re-run this script.

Everything within the recency window that clears the data bar but not the capability bar becomes `"superseded"`. Everything outside the recency window becomes `"superseded"` regardless of data completeness — age alone is disqualifying, so an old model with no benchmarks doesn't get `"unknown"`, it's just old. `"deprecated"` is never touched by this — it's a manual signal set only when a lab officially retires a model (e.g. pulls it from their API).

**`"unknown"` vs `"superseded"`:** `unknown` means "too new/undercovered to judge" — it's an honest admission of missing data, not a verdict. `superseded` means "we have enough to judge, and it doesn't clear the bar" (or it's simply aged out). Don't conflate them: a brand-new model with zero benchmarks is `unknown`, not `superseded`, even though both render outside the "Frontier" filter.

The composite score normalizes each benchmark key (0–1) across the tier's rankable candidate set for that run (excluding override-qualified models), then averages whichever keys a model has non-null values for. This keeps the comparison relative to the current field rather than all of history.

**Why the override exists:** the general rule alone punished models with incomplete benchmark data even when they were clearly strong (e.g. GPT-5.6 missed the capability bar by 0.008 on a 5-of-7 benchmark subset purely because OpenAI hadn't published its SWE-bench/AIME scores yet). Rather than loosen the bar for everyone — which would let a smaller lab's untested new release qualify just for being newest — the override is scoped narrowly to labs whose flagship releases are reliably frontier-caliber on reputation alone.

## Steps

1. Every model must have a `tier` (`flagship` | `balanced` | `fast`) set — see `protocols/MODEL_ENTRY_STYLE_GUIDE.md` for how to classify a new one.
2. Run the script, review the printed diff:
   ```bash
   node scripts/frontier-status.js
   ```
3. If the changes look right, apply them:
   ```bash
   node scripts/frontier-status.js --apply
   ```
4. For anything that moved to `"unknown"`, run the stats-filler or data-gap-finder protocol on those model IDs, then re-run this script.
5. Re-run the data integrity check and `npm run build` (per the release protocol's validate step).
6. Report to Maia: what changed status and why, and what's still blocked on missing benchmark data.

## Tuning

`RECENCY_MONTHS` (9), `CAPABILITY_THRESHOLD` (0.85), `MAJOR_LABS` (`openai`, `anthropic`, `google`, `meta`), and `MAJOR_LAB_RECENCY_MONTHS` (3) are constants at the top of `scripts/frontier-status.js`. If Maia asks to loosen/tighten the definition or change which labs get the recency override, change them there — this file and the script are the single source of truth for the rule; don't hand-edit `status` values outside of this process (except `"deprecated"`, which stays manual).
