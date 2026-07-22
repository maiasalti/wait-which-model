# Frontier Status Protocol

**Trigger:** run automatically as the last step of the [new model release protocol](./NEW_MODEL_RELEASE_PROTOCOL.md) and the [news scan protocol](./NEWS_SCAN_PROTOCOL.md). Can also be run standalone whenever Maia asks to "recompute frontier status" or "audit frontier statuses."

**Goal:** keep `status` in `data/models.json` an accurate, mechanically-derived signal of "genuinely near the top of current capability" — not a manually-remembered label that quietly goes stale.

## The rule

A model is `"frontier"` only if, within its `tier` (`flagship` / `balanced` / `fast`):

1. **Recency** — released within the last 9 months. Older models age out automatically, even with no successor.
2. **Capability bar** — its composite benchmark score is within 10% of the best composite score among other recent, rankable models in the same tier. Being newest isn't sufficient; a new release with weaker benchmarks than the current leader doesn't qualify.
3. **Verified data** — has at least 3 non-null benchmark scores. Models below that threshold are left at their current status and flagged as "needs benchmark data" instead of being guessed — run the stats-filler protocol on them first, then re-run this one.

Everything that doesn't meet the bar becomes `"superseded"`. `"deprecated"` is never touched by this — it's a manual signal set only when a lab officially retires a model (e.g. pulls it from their API).

The composite score normalizes each benchmark key (0–1) across the tier's rankable candidate set for that run, then averages whichever keys a model has non-null values for. This keeps the comparison relative to the current field rather than all of history.

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
4. For anything printed under "insufficient benchmark data to rank," run the stats-filler protocol on those model IDs, then re-run this script.
5. Re-run the data integrity check and `npm run build` (per the release protocol's validate step).
6. Report to Maia: what changed status and why, and what's still blocked on missing benchmark data.

## Tuning

`RECENCY_MONTHS` (9) and `CAPABILITY_THRESHOLD` (0.9) are constants at the top of `scripts/frontier-status.js`. If Maia asks to loosen/tighten the definition, change them there — this file and the script are the single source of truth for the rule; don't hand-edit `status` values outside of this process (except `"deprecated"`, which stays manual).
