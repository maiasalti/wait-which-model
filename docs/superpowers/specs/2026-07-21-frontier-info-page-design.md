# Frontier Info Page — Design

## Purpose

Add a public "Info" tab explaining, in plain language, what "frontier" means on this site, how it compares to how the term is used elsewhere, why some data is missing, and how the data stays current. Also tighten and ground the site's own "frontier" classification criteria against real external usage, re-audit all existing models against the tightened criteria, and make sure the definition doesn't go stale over time.

## Scope

1. Research how "frontier model" is actually used externally right now (AI policy bodies, industry trackers, labs' own usage) — never from memory.
2. Write a grounded, tightened definition of "frontier" for this site, reconciled against that research.
3. Re-audit all current entries in `data/models.json` against the tightened definition; correct `status` where it disagrees with the current value.
4. Add a new public "Info" page/tab with user-facing content (see Content below) — no mention of internal files, protocols, or process.
5. Extend `protocols/NEW_MODEL_RELEASE_PROTOCOL.md` so the definition gets re-checked (and updated if stale) every time a new model is added, instead of drifting silently.

## Data model

New `data/methodology.json` — single source of truth for the Info page's content, following the site's existing JSON-data-file convention (see `CLAUDE.md`/`AGENTS.md`: `data/*.json`, no backend). The protocol edits this file directly; the page renders it directly. No duplicated prose anywhere else, so the displayed page can never drift from what the protocol actually enforces.

Shape:

```json
{
  "frontierDefinition": {
    "summary": "plain-language definition, user-facing",
    "criteria": ["...", "..."],
    "comparisons": [
      { "source": "e.g. a policy body / tracker / lab", "definition": "short paraphrase", "url": "..." }
    ],
    "lastReviewed": "YYYY-MM-DD"
  },
  "dataGaps": {
    "summary": "plain-language explanation of null = unverified, never invented"
  },
  "sourcing": {
    "summary": "plain-language explanation: launch-time reported scores, official announcements + trackers, refreshed as models ship"
  }
}
```

## Page

New `app/info/page.tsx` — static server-rendered page (no client state needed, matching how simple/static content is handled elsewhere on the site). Added as a 4th tab in `components/Nav.tsx`'s `TABS` array, after "News".

Sections, rendered from `methodology.json`, in user-facing language throughout (no file paths, no "protocol," no internal process references):

1. **What counts as a frontier model** — the site's criteria in plain language.
2. **Comparison table** — `frontierDefinition.comparisons` rendered as a table: source name, how they define it, link. Gives visitors a sense of where the site's definition sits relative to others.
3. **Why some numbers are missing** — `dataGaps.summary`.
4. **How this data is kept current** — `sourcing.summary`.

Visual style matches the rest of the site (dark "observatory" theme, mono labels for section headers, same type scale as the Directory/Compare intros).

## Re-audit

One-time pass (part of this implementation, not deferred): after the grounded definition is written, go through all current `data/models.json` entries and check `status` against the new criteria. Correct any that now disagree (e.g. a model that should be `superseded` but is still marked `frontier`, or vice versa). Record nothing extra in the data file beyond the corrected `status` — the reasoning lives in the methodology definition, not per-model.

## Keeping it current

Extend `protocols/NEW_MODEL_RELEASE_PROTOCOL.md` with a step, folded into the existing release flow (no new standalone trigger phrase): on every release, check `methodology.json.frontierDefinition.lastReviewed`. If it's been more than 6 months, or the new model doesn't cleanly fit the existing criteria, re-research current external usage, update `criteria`/`comparisons`/`lastReviewed`, and flag if any other existing models now look miscategorized under the revised criteria.

## Out of scope

- No markdown rendering / new dependencies — content is plain JSX + a data-driven table, consistent with the rest of the site.
- No change to `data/models.json` schema — only `status` values may change during the re-audit, per existing allowed values (`frontier`/`superseded`/`deprecated`).
- No automated/scheduled staleness check — the 6-month check happens opportunistically at release time, per the protocol update above.
