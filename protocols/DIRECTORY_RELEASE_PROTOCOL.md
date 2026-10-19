---
type: Protocol
title: Directory Release Protocol
description: Add and maintain entries in the six non-model directories (image, video and world models, harnesses, agents,
  Frontier Features) from primary sources only, with a rule-based Notable flag and a gap ledger so re-runs skip dead ends.
tags:
- protocols
generated:
  by: human:maia
  at: '2026-10-14T00:00:00Z'
---

# Directory Release Protocol

**Trigger:** Maia says "execute directory release protocol for <directory>", or the daily sweep's
directory job for the day (see `DAILY_SWEEP_PROTOCOL.md`). `<directory>` is one of
`image-models`, `video-models`, `world-models`, `harnesses`, `agents`, `features`. Each has its
own file, `data/<directory>.json`.

**Not in scope:** language models (that's `NEW_MODEL_RELEASE_PROTOCOL.md`). Nothing here feeds
frontier status, reigns, Compare, the Cost Calculator, Which Model or subscriber emails.

## Core rules (every directory)

1. **Primary sources only.** The developer's own site, blog, docs, pricing page, changelog, model
   card, repo or Hugging Face page, or an official leaderboard (Artificial Analysis arenas,
   LMArena, tbench.ai). A news article may *lead* you to an entry; its facts must then be confirmed
   on the developer's own page.
2. **Never from memory.** Unverified values are `null` (or `[]`). No primary source showing the
   product exists → don't add it.
3. **Gap ledger.** Every cell researched and found unverifiable goes in `data/directory-gaps.md`
   under its directory: `entry-id · field · YYYY-MM-DD · what was searched`. Re-runs skip those.
4. **Companies.** Reuse a `data/companies.json` id where one fits. A new developer gets a record
   with `notable` true only if it has a Notable entry; a notable company needs a palette colour
   that passes `node scripts/palette-check.js`, everyone else gets `"color": null` and renders grey.
5. **News refs.** When `news.json` covers an entry, tag the item with
   `refs: [{ "type": "<image-model|video-model|world-model|harness|agent|feature>", "id": "…" }]`.
   `modelIds` stays models-only.
6. **Validate:** `node scripts/integrity.js`, `npm test`, `npm run build`.

## Notable rule

An entry is `notable: true` when, at the time it's checked, **either**:

1. it places in the top 10 of its directory's main leaderboard (below), **or**
2. its developer is `anthropic`, `openai`, `google`, `xai` or `meta`.

| Directory | Main leaderboard | Extra clause |
|---|---|---|
| image-models | Artificial Analysis text-to-image arena **or** LMArena text-to-image | — |
| video-models | Artificial Analysis text-to-video arena **or** LMArena video | — |
| world-models | none exists yet | publicly usable (`access` `ga` or `beta`) counts as clause 1 |
| harnesses | Terminal-Bench (tbench.ai), the version it shows as primary | — |
| agents | none shared | a vendor-published result that placed top-3 on an official public leaderboard (SWE-bench, GAIA, BrowseComp, OSWorld) at publication |
| features | n/a: every entry is a frontier lab's, so there is no `notable` field | — |

Every run re-evaluates the flag for every entry in the directory, both ways. Say in `notes` which
clause applies when it isn't the frontier-lab one.

## Shared fields

`id` (kebab-case, unique in its file) · `name` · `company` · `releaseDate` (`features`:
`launchDate`) · `notable` (not on features) · `description` (one or two sentences: what it is) ·
`strengths[]` (2–4) · `weaknesses[]` (0–3) · `links: { official, docs | null }` · `notes`.

Writing: strengths and weaknesses are short noun phrases in the `MODEL_ENTRY_STYLE_GUIDE.md`
register, concrete and sourced ("Native 48 kHz audio", not "Great audio"). `notes` holds sourcing
caveats, conflicts between sources, and figures that have no field.

## Per-directory fields

Types are in `lib/types.ts`; this is what to research for each.

- **image-models:** `pricing.perImageUsd` (cheapest standard-quality square image on the
  developer's own API), `maxResolution`, `capabilities[]` (`text-to-image`, `editing`,
  `inpainting`, `text-rendering`, `reference-images`), `openWeights`, `license`, `apiIds`,
  `scores.aaImageArenaElo`, `scores.lmarenaImageElo`.
- **video-models:** `pricing.perSecondUsd`, `maxDurationSec` (one generation, before extension),
  `maxResolution`, `nativeAudio`, `capabilities[]` (`text-to-video`, `image-to-video`,
  `video-editing`, `extension`), `openWeights`, `license`, `apiIds`, `scores.aaVideoArenaElo`,
  `scores.lmarenaVideoElo`.
- **world-models** (a generated world you can explore or act in, or a physically consistent
  simulation, e.g. Genie, Marble, Cosmos; not a plain video model): `interactive`, `inputs[]`
  (`text`, `image`, `video`, `actions`), `output` (`video-stream`, `3d-scene`,
  `simulation-video`), `maxSessionSec`, `maxResolution`, `fps`, `access` (`ga`, `beta`,
  `waitlist`, `research-preview`, `research-only`), `openWeights`, `license`, `apiIds`,
  `pricing.notes`.
- **harnesses** (wraps a model the *user* picks): `interface[]` (`cli`, `ide`, `desktop`, `web`),
  `openSource`, `license`, `repo`, `supportedModels` (`"any"`, `"vendor"`, or models.json ids),
  `pricing.model` (`free`, `subscription`, `byo-key`, `usage`), `scores[]` of
  `{ benchmark: "terminalBench", modelId, score }`, only from tbench.ai, one per harness+model
  pairing, only where the model is in `models.json` (otherwise the figure goes in `notes`).
- **agents** (an autonomous worker on a model the *vendor* picks): `domain` (`coding`, `browser`,
  `research`, `general`), `underlyingModels[]` (models.json ids the vendor names), `access`
  (`ga`, `beta`, `waitlist`), `pricing.plan`. Benchmark claims go in `notes` with their source.
- **features** (Anthropic, OpenAI, Google DeepMind, xAI, Meta only): `launchDate`, `surface`
  (`app`, `api`, `dev-tool`, `hardware`), `availability` (`ga`, `beta`, `preview`, `waitlist`,
  `region-limited`), `plans[]` as the lab names them, `modelIds[]` the launch post names,
  `retiredDate`.

## Sweep job

Run for one directory per weekday (rotation in `scripts/lib/sweep-jobs.js`):

1. **New entries:** search for releases since the newest date in the file; add those that pass
   the core rules. Leaderboard directories: re-read the leaderboard's current top 10 first.
2. **Notable:** re-evaluate every entry's flag against the rule above.
3. **Gaps:** re-check null cells not already in `data/directory-gaps.md`; log the ones that stay
   null.
4. **Report** what changed, what couldn't be verified, and any source the run couldn't fetch.
   Unattended runs can't use WebFetch, so name unfetchable pages rather than guess at them.
