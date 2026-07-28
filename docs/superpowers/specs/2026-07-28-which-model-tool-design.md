# Which Model Tool — Design

## Purpose

Add a new tab that helps a non-technical visitor decide which model in the directory fits their task. They describe what they need in plain, qualitative language (no context-length numbers, no price ceilings); an LLM reads the site's own model data and returns 1-3 recommendations with reasoning, grounded entirely in the directory — never in the LLM's own training-data opinions about models.

## Approach: context-stuffing, not RAG

`data/models.json` + `data/companies.json` + `data/benchmarks.json` total ~2,400 lines (~15-20K tokens) — small enough to pass the entire (filtered) dataset into the prompt on every request. No vector store, no embeddings, no retrieval step. This also means the tool is always current: the API route reads the JSON files fresh per request, so editing `models.json` via the existing protocols is the only "update" the tool ever needs — there is no separate copy of the model list to keep in sync.

## Nav & route

- `components/Nav.tsx`: add `{ href: "/which-model", label: "Which Model Tool" }` to `TABS`, positioned right after "Models Directory".
- New route: `app/which-model/page.tsx`.

## Page UI

Client component (`"use client"`, matches `FilterRail`/`ModelDrawer` pattern):

- One large textarea. Placeholder: something like *"Describe what you need — the task, how long or how often you'll use it, anything that matters to you."* Explicitly no numeric inputs (context window, price ceiling) — qualitative only, per requirement.
- Submit button; disabled + loading state while the request is in flight.
- Result: 1-3 cards, visually reusing `ModelCard`'s existing styling, each showing the model's real directory data (via local lookup by id, not LLM-restated data) plus a short reasoning blurb written by the LLM underneath.
- Empty/too-short input (e.g. <10 chars) is rejected client-side with an inline nudge, no network call.

## API route

`app/api/which-model/route.ts`, POST, Node runtime (needs `fs` to read the JSON data files — matches `lib/data.ts`'s existing loading approach, not Edge).

1. Load `models.json`, `companies.json`, `benchmarks.json` the same way `lib/data.ts` does today.
2. Filter out `status: "deprecated"` models — never recommend a dead model.
3. Build a system prompt: instructions + the filtered JSON serialized as context + the constraint "only recommend by `id` from the provided list; never invent an id."
4. Call `generateObject` (AI SDK, `ai` package) with `model: 'deepseek/deepseek-v3'` (routes through Vercel AI Gateway via existing `VERCEL_OIDC_TOKEN` — no new API key). Schema (zod):
   ```ts
   z.object({
     recommendations: z.array(z.object({
       modelId: z.string(),
       reasoning: z.string(),
     })).min(1).max(3),
   })
   ```
5. Server-side, map each returned `modelId` against the live (already-loaded) model list. Any `modelId` that doesn't match a real entry is silently dropped rather than surfaced — defensive only, shouldn't happen since the schema is constrained to real ids in the prompt.
6. Return `{ recommendations: [{ model: <full Model object>, reasoning }] }` — the frontend never has to trust or re-fetch model data from the LLM's output.

## Rate limiting

Simple per-IP limiter inside the API route (e.g. a small in-memory counter keyed by request IP, a few requests/minute) to protect the AI Gateway's $5/month free credit from bot/scraper abuse. In-memory is acceptable for this scale (no multi-region consistency requirement) — if traffic patterns later show it's insufficient, upgrade to a KV-backed counter, but not in v1.

## Error handling

- Gateway/provider errors (429 rate-limited, 402 budget exceeded, 503 unavailable) render a plain "try again in a bit" message client-side — never a stack trace or raw error JSON.
- Own rate limit exceeded → same friendly message, distinct enough copy that it's clear it's this site's limit, not the provider's.
- Network/unexpected errors → generic fallback message.

## Testing

- `npm run build` — confirms the new route/page don't break the static build (existing project convention per `AGENTS.md`).
- Manual pass through several varied qualitative prompts (e.g. "cheap model for a chatbot I run all day", "best coding agent, cost isn't a concern", "need to process huge legal documents") to sanity-check that recommendations and reasoning are sensible and grounded in real directory data.

## Out of scope

- No multi-turn chat / conversation memory — single description in, 1-3 recommendations out, per requirement.
- No structured filters (dropdowns/sliders for price, context length) — qualitative free text only, per requirement.
- No new database or vector store — see "Approach" above.
- No change to `data/models.json` schema.
