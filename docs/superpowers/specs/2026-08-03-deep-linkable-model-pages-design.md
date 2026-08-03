# Deep-linkable model pages

**Date:** 2026-08-03
**Status:** approved

## Problem

Clicking a model card on the directory (`/`) opens `ModelDrawer` from `useState` in
`app/page.tsx`. The drawer is pure client state, so the URL never changes. Sharing what you
are looking at sends the recipient to the bare homepage, and no individual model is
indexable or linkable.

## Goal

Every model gets its own URL that survives being pasted into Slack, X, or iMessage, unfurls
with a card specific to that model, and is crawlable. The directory's browsing feel does not
change.

## Design

### Routes

| Path | Purpose |
|---|---|
| `app/models/[id]/page.tsx` | Standalone page. `generateStaticParams()` over `models.json` prerenders one per model. `generateMetadata()` sets per-model title and description. Unknown id → `notFound()`. |
| `app/models/[id]/opengraph-image.tsx` | Build-time PNG per model, via the Satori pattern already used in `app/which-model/opengraph-image.tsx`. |
| `app/@modal/(.)models/[id]/page.tsx` | Intercepting route. Renders the drawer over the still-mounted directory. |
| `app/@modal/default.tsx` | Returns `null` so the slot is empty on every other route. |

`app/layout.tsx` takes a `modal` prop alongside `children` and renders it after `<main>`.

Interception is what preserves browsing state: `app/page.tsx` stays mounted while the modal
slot fills, so search, company filters, status, location, open-weights, sort, and scroll
position are all untouched. A cold visit or hard refresh bypasses the interceptor and gets
the real page.

### Card becomes a link

`ModelCard` changes from `<button onClick={() => onOpen(model)}>` to
`<Link href={`/models/${model.id}`}>`. The `onOpen` prop and the `selected` state in
`app/page.tsx` are removed. Side benefit: cards become right-clickable and
open-in-new-tab-able, which they are not today.

### Shared content components

The drawer body is extracted to `components/model/` so the drawer and the page cannot drift:

- `ModelStatsGrid` — the status/location/modality/context/max-output/price/cost/open-weights cells
- `ModelBenchmarks` — the bar list **and** the quick-compare search, owning its own compare state
- `ModelProsCons` — strengths and weaknesses
- `ModelNewsList` — related news from `news.modelIds`

`ModelDrawer` composes them in one column. `app/models/[id]/page.tsx` composes them two-up.
Moving compare state inside `ModelBenchmarks` is what lets both surfaces use it without
threading props.

### Page layout

Full-width, matching the approved sketch: back-to-directory link, company + name + release
line, then stats grid and benchmark bars side by side, strengths and weaknesses two-up
below, related news last. Single column below `sm`.

### OG card

Dark observatory treatment matching `which-model`. Company name in its `companies.json`
brand color, model name large, status badge, then a four-stat row: SWE-bench, GPQA,
cost per task, context window.

**Nulls render as `—`, never hidden**, so a card can never imply a figure exists. Qwen3.7
Flash has zero benchmarks and is the test case for that path.

The subtitle is built **only from real schema fields**:

```
Flagship · Multimodal · Open weights · Released 6 July 2026
```

An earlier sketch used `295B-A21B MoE · Apache 2.0`. Parameter counts and licenses are not
fields in `models.json` — they exist only as prose inside `notes`. Deriving them would mean
parsing free text and would silently produce wrong cards. Putting them on the card requires
adding real schema fields first, which is deliberately out of scope here.

### Sitemap

`app/sitemap.ts` lists the directory, compare, news, info, which-model, and all model URLs.
Without it the pages exist but nothing points a crawler at them.

## Edge cases

- Unknown model id → `notFound()`
- Escape / backdrop click in the drawer → `router.back()`
- Cold load of `/models/<id>` renders the page, not a drawer, so there is no broken-back state
- Models with no benchmarks, no `costPerTask`, or no related news must render without gaps
- `metadataBase` in `app/layout.tsx` already resolves relative OG paths to absolute URLs

## Verification

- Build emits 73 model routes and 73 images
- `og:image` and `og:title` on a rendered page resolve to absolute URLs
- Drawer ↔ page transitions both directions; back button restores filters
- Sparse model (Qwen3.7 Flash) renders dashes rather than empty space

## Cost

73 Satori renders add meaningfully to build time — likely tens of seconds. Accepted.
