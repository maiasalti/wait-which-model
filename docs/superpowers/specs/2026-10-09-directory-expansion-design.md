---
type: Design Spec
title: Directory expansion
description: Design for turning the Models Directory into a "Directory" nav group with six child tabs (Models, Image models,
  Video models, Harnesses, Agents, Frontier Features), each backed by its own data file, protocol section and weekly sweep slot.
tags:
- docs
- superpowers
- specs
generated:
  by: human:maia
  at: '2026-10-09T00:00:00Z'
---

# Directory expansion

**Date:** 2026-10-09
**Status:** approved in conversation, awaiting spec review

## Problem

The site tracks one kind of thing: language models that the public can access. Maia wants it to
cover the rest of what frontier AI ships:

- image generation models;
- video generation models;
- the harnesses that run models;
- autonomous agents sold as products;
- the product features the five frontier labs launch.

Today there is nowhere to put any of these. Squeezing them into `models.json` would leak them into
frontier status, reigns, Compare and the Which Model recommender, none of which make sense for
them.

## Goal

1. **Directory nav group.** A "Directory" group in the nav with six child tabs:
   - **Models** (the existing directory, still the home page at `/`);
   - **Image models**;
   - **Video models**;
   - **Harnesses**;
   - **Agents**;
   - **Frontier Features**.
2. **Rich catalog.** Each new tab is a filterable directory with a detail page per entry, showing
   specs, pricing, links and type-specific leaderboard scores.
3. **Sourcing.** Every entry is sourced from primary sources, as models are. Unverified values are
   `null`.
4. **Upkeep.** The daily sweep keeps each new directory current on a weekly rotation.

## Non-goals

- **No frontier logic.** No frontier status, reigns or composite for the new types.
- **No new UI elsewhere.** No Compare, charts, Cost Calculator or Which Model integration for the
  new types.
- **No email.** Subscriber emails stay models-only.
- **No old-link changes.** Every existing URL keeps working unchanged.

## Decisions (from the 2026-10-07 to 10-09 conversation)

| Question | Decision |
|---|---|
| Depth | Rich catalog, with no frontier status, reigns or Compare. |
| Harness vs agent | **Harness:** software that wraps a model the user can choose or swap, e.g. Claude Code, Codex CLI, Cursor, Cline, OpenHands, Aider.<br>**Agent:** a product sold as an autonomous worker, running on a model the vendor picks, e.g. Devin, Manus, ChatGPT agent, Jules. |
| Inclusion | Everything credible: any officially released product with a primary source. Category leaders carry a **Notable** label. |
| Sweep cadence | Models stay daily. Each new type gets one weekday a week. |
| Frontier Features scope | Only Anthropic, OpenAI, Google DeepMind, xAI and Meta (`anthropic`, `openai`, `google`, `xai`, `meta`). |
| Frontier Features layout | One newest-first timeline across all five labs, grouped by month, with company filter chips. |

## Architecture

### Data: one file per type

| File | Type |
|---|---|
| `data/image-models.json` | Image generation models |
| `data/video-models.json` | Video generation models |
| `data/harnesses.json` | Harnesses |
| `data/agents.json` | Agents |
| `data/features.json` | Frontier lab product features |

**Rejected alternatives:**
- One `entities.json` with a `kind` field: it mixes five schemas in one file.
- Adding the new types to `models.json`: they would leak into status, reigns, Compare and the
  recommender.

**Shared base fields** (every type):

```
id            kebab-case, unique within its file
name
company       a companies.json id
releaseDate   "YYYY-MM-DD" (features use launchDate instead)
notable       boolean
description   one or two sentences, what it is
strengths[]   same style rules as models
weaknesses[]
links         { official, docs | null }
notes         sourcing caveats, conflicts, figures that don't fit a field
```

**Type-specific fields:**

- **Image models**
  - `pricing: { perImageUsd, notes }`
  - `maxResolution` (string, e.g. "4096x4096")
  - `capabilities[]`: any of `text-to-image`, `editing`, `inpainting`, `text-rendering`,
    `reference-images`
  - `openWeights`, `license` (same shape as models)
  - `apiIds[]` (same shape as models)
  - `scores: { aaImageArenaElo, lmarenaImageElo }`
- **Video models**
  - `pricing: { perSecondUsd, notes }`
  - `maxDurationSec`
  - `maxResolution`
  - `nativeAudio` (boolean)
  - `capabilities[]`: any of `text-to-video`, `image-to-video`, `video-editing`, `extension`
  - `openWeights`, `license`, `apiIds[]`
  - `scores: { aaVideoArenaElo, lmarenaVideoElo }`
- **Harnesses**
  - `interface[]`: any of `cli`, `ide`, `desktop`, `web`
  - `openSource` (boolean), `license`, `repo` (URL or null)
  - `supportedModels`: `"any"`, `"vendor"`, or an array of models.json ids
  - `pricing: { model: "free" | "subscription" | "byo-key" | "usage", notes }`
  - `scores: [{ benchmark: "terminalBench", modelId, score }]`
    - Recorded per harness+model pairing, because a harness score is meaningless without the
      model it ran.
- **Agents**
  - `domain`: one of `coding`, `browser`, `research`, `general`
  - `underlyingModels[]`: models.json ids, only where the vendor names them
  - `access`: one of `ga`, `beta`, `waitlist`
  - `pricing: { plan, notes }`
  - Domain benchmark figures go in `notes`. There are no tracked score keys at first.
- **Frontier Features**
  - `launchDate` (in place of `releaseDate`)
  - `surface`: one of `app`, `api`, `dev-tool`, `hardware`
  - `availability`: one of `ga`, `beta`, `preview`, `waitlist`, `region-limited`
  - `plans[]` (e.g. "Pro", "Max", "Free")
  - `modelIds[]`
  - `retiredDate` (or null)
  - `notable` is always false and isn't shown, because every entry is already a frontier lab's.

Type definitions live in `lib/types.ts`. Loaders sit next to the existing ones in `lib/data.ts`.

### Companies and colours

- **Every developer joins `companies.json`.** Its schema gains `notable: boolean`.
- **Palette slots:** every company already in `companies.json` keeps its colour and is marked
  `notable: true`. New companies get a slot in the CVD-validated palette only if they have a Notable
  entry, and `scripts/palette-check.js` checks only coloured companies.
- **Everyone else** gets `color: null` and renders as a neutral grey dot plus logo or name.
- **Why:** the palette can't stretch to dozens more companies. Its newest adjacent pair already
  sits at the colour-blind separation minimum (ΔE 8.4 against 8).

### Notable rule

An entry is **Notable** when, at the time it is checked, either:
1. it places in the top 10 of its category's main leaderboard (Artificial Analysis or LMArena image
   or video arena, Terminal-Bench for harnesses); or
2. its developer is one of the five frontier labs named for Frontier Features (Anthropic, OpenAI,
   Google DeepMind, xAI, Meta).

Every sweep re-evaluates the flag. The rule lives in the protocol, so no one has to make the call by
judgement.

### Routes and nav

| URL | Page |
|---|---|
| `/` | Models directory (unchanged) |
| `/models/[id]` | Model page (unchanged) |
| `/image-models`, `/image-models/[id]` | Image model directory and detail |
| `/video-models`, `/video-models/[id]` | Video model directory and detail |
| `/harnesses`, `/harnesses/[id]` | Harness directory and detail |
| `/agents`, `/agents/[id]` | Agent directory and detail |
| `/features`, `/features/[id]` | Frontier Features timeline and detail |

- **"Directory" is a grouping only**, like "Tools" is now, with no URL of its own. On desktop it
  replaces the "Models Directory" tab.
- **Sub-tab strip:** every directory page carries a strip of the six child tabs.
- **Drawer:** each `/<type>/[id]` gets the same `app/@modal` interception the model drawer uses.
- **Hidden until filled:** a child tab appears only once its data file has at least one entry, so
  nothing empty ever ships.
- **Rejected:** `/directory/...` nesting. It would need redirects for every `/models/<id>` link,
  including links in sent emails.

### Components

Each type plugs a small config into a generic directory:

- **`components/directory/DirectoryShell`**: the sub-tab strip, search, company filter, Notable
  toggle and sort (newest by default).
- **`components/directory/EntryCard`** and **`EntryDetail`**: the shared base fields.
- **Per-type field renderers**: `ImageModelFields`, `VideoModelFields`, `HarnessFields`,
  `AgentFields`, `FeatureFields`.
- **`components/directory/FeatureTimeline`**: month-grouped, newest first, with company chips.
- **Generic filter and sort logic** in a pure, unit-tested `lib/directory.ts`.

The Models directory keeps its own page and components. It only gains the sub-tab strip.

### Cross-links

- **Runs on:** harnesses and agents with model ids show "Runs on…" chips that link to
  `/models/<id>`.
- **Used by:** model pages gain a derived "Used by" section listing the harnesses, agents and
  features that reference them. It is never stored.

### News

- **`refs`:** `news.json` gains an optional `refs: [{ type, id }]`, where `type` is one of
  `image-model`, `video-model`, `harness`, `agent`, `feature`.
- **`modelIds` is unchanged**, so nothing that reads it breaks.
- **Detail pages** list related news through `refs`.
- **News scan:** `NEWS_SCAN_PROTOCOL.md` starts tagging `refs`.

### Integrity

A new `scripts/integrity.js` replaces the AGENTS.md one-liner, which stays as a pointer. It runs
under `npm test`, with tests, and covers:

- everything the one-liner checks now;
- unique ids within each new file;
- known company ids;
- every `modelIds`, `underlyingModels`, `supportedModels` array and `scores[].modelId` resolving to
  models.json;
- `refs` resolving to their type's file;
- feature companies within the allowed five;
- `color: null` only on non-notable companies;
- no `license` on closed entries.

## Sweeps, protocols, agents

**Rotation** (`scripts/daily-sweep.sh` and the cadence table in `DAILY_SWEEP_PROTOCOL.md`):

| Day | Jobs |
|---|---|
| Mon | health · models · news · **image** |
| Tue | health · models · stats · **video** |
| Wed | health · models · **agents** |
| Thu | health · models · stats · **harnesses** |
| Fri | health · models · **features** |

- **Each category job:**
  1. adds entries released since that file's newest date;
  2. re-evaluates `notable`;
  3. re-checks that type's null cells, skipping cells already in its gap ledger.
- **`stats`** stays models-only.
- **`health`** runs `scripts/integrity.js`.
- **New guard:** the sweep refuses to run when the checkout isn't on `main`. This closes the hole
  that let the 2026-10-01 sweep take over a working branch.

**Protocols:**
- **`protocols/DIRECTORY_RELEASE_PROTOCOL.md`**: a shared core plus one section per type with its
  sources and fields. The core covers primary sources only, no figures from memory, null when
  unverified, the Notable rule and gap ledgers.
- **`protocols/DIRECTORY_ENTRY_STYLE_GUIDE.md`**.
- **Gap ledgers:** `data/directory-gaps.md`, one section per type.

**Agent:** `.claude/agents/directory-release.md`, one agent that takes the type as an argument.

**AGENTS.md:**
- the protocol table gains "execute directory release protocol for <type>";
- the data-file and code-layout sections gain the new files.

## Build order

Each stage is its own PR.

1. **Framework.**
   - Directory nav group and sub-tab strip.
   - Generic components and `lib/directory.ts`.
   - Companies `notable` and `color: null` support.
   - `scripts/integrity.js`.
   - The sweep's on-`main` guard.
   - No new data yet, so the new tabs stay hidden.
2. **Frontier Features.**
   - Schema, timeline page, detail page and drawer.
   - Protocol section and the Fri job.
   - First data fill: all five labs, newest first, including the features Maia named (Claude
     Design, Projects, Deep Research, Claude Motion, OpenAI Dots, Meta Muse). Each must be found
     on the lab's own pages, and anything that can't be isn't added.
3. **Image and video models.** Schemas, pages, protocol sections, the Mon/Tue jobs, and a first data
   fill of Notable entries.
4. **Harnesses and agents.** Schemas, pages, "Runs on" and "Used by" links, protocol sections, the
   Wed/Thu jobs, and a first data fill of Notable entries.
5. **Docs**, updated at every stage: AGENTS.md, the `/info` methodology (`methodology.json`), and
   the sitemap (new detail pages).

**First fills:** they start with Notable entries. The weekly sweep then works down the long tail of
"everything credible", one type per weekday, so no single run gets out of hand.

## Testing

- **`lib/directory.ts`:** filter, sort and month-grouping, under `node --test`.
- **`scripts/integrity.js`:** fixtures that each break one rule.
- **Sweep guard:** the `daily-sweep.sh` job selection by weekday moves into a testable helper and
  is tested.
- **`npm run build`:** every route is static, so the build prerenders every detail page.
- **Browser check per stage:** each tab, filters, the drawer from the grid, a cold load of a detail
  page, and the mobile sub-tab strip.

## Risks

- **First-fill size.** "Everything credible" is large. Mitigation: fill Notable entries first, and
  let the sweep work down the rest with gap ledgers so nothing is researched twice.
- **Sweep run length and permission gates.** Unattended runs can't use WebFetch (see memory). Each
  category job reports unfetchable sources in the PR body instead of guessing.
- **Harness scores are pairings.** A Terminal-Bench figure without its model would mislead, so the
  schema requires `modelId` on every harness score.
