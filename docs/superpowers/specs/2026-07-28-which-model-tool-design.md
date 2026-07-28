# Which Model Tool — Design

## Purpose

Add a new tab that helps any visitor — non-technical or technical — decide which model in the directory fits their task. They describe what they need, in whatever terms they naturally think in (plain qualitative language, or precise technical requirements like "needs 200K+ context and open weights"); an LLM reads the site's own model data and returns 1-3 recommendations with reasoning, grounded entirely in the directory — never in the LLM's own training-data opinions about models. It's a short back-and-forth, not a one-shot form: the user can push back, ask why, or add a requirement they forgot, and the recommendations update accordingly.

## Approach: context-stuffing, not RAG

`data/models.json` + `data/companies.json` + `data/benchmarks.json` total ~2,400 lines (~15-20K tokens) — small enough to pass the entire (filtered) dataset into the prompt on every request. No vector store, no embeddings, no retrieval step. This also means the tool is always current: the API route reads the JSON files fresh per request, so editing `models.json` via the existing protocols is the only "update" the tool ever needs — there is no separate copy of the model list to keep in sync.

## Nav & route

- `components/Nav.tsx`: add `{ href: "/which-model", label: "Which Model Tool" }` to `TABS`, positioned right after "Models Directory".
- New route: `app/which-model/page.tsx`.

## Page UI

Client component (`"use client"`, matches `FilterRail`/`ModelDrawer` pattern), chat-style rather than a one-shot form:

- Above the input, three short thought-provoking questions are always visible as a hint block (not form fields — nothing to fill in, just prompts to get the user thinking before they type), e.g.:
  1. "What's the task, and how demanding is it?"
  2. "How often or how long will you be using it — one-off, or constantly?"
  3. "Anything non-negotiable — budget, open weights, huge context, speed?"
  The user isn't required to address any of them; they're there to shape what the user types, not to be individually answered.
- A single free-text input, open to both plain descriptions and precise technical requirements — the system prompt (below) tells the LLM to handle either register.
- Conversation renders as a message thread: user messages as text, assistant turns as a mix of prose (clarifying questions, reasoning, follow-up answers) and, whenever the assistant recommends models, 1-3 cards reusing `ModelCard`'s existing styling inline in that turn — each card sourced from the real directory entry by id (local lookup, not LLM-restated data).
- The user can keep chatting after the first recommendation: ask "why did you pick that one," add a requirement ("actually, open-weights only"), or ask for alternatives. The assistant re-recommends (new card set) only when the conversation actually changes the answer.
- Empty/too-short input (e.g. <5 chars) is rejected client-side with an inline nudge, no network call.
- Conversation state lives in client React state only, for the current page session — refreshing the page starts over. No persistence, no new database (see "Out of scope").

## API route

`app/api/which-model/route.ts`, POST, Node runtime (needs `fs` to read the JSON data files — matches `lib/data.ts`'s existing loading approach, not Edge). Chat-shaped: the client sends the full message history (`{ role, content }[]`) each turn, matching the standard AI SDK chat pattern.

1. Load `models.json`, `companies.json`, `benchmarks.json` the same way `lib/data.ts` does today.
2. Filter out `status: "deprecated"` models — never recommend a dead model.
3. Build a system prompt: instructions to handle both qualitative and technical input, the filtered JSON serialized as context, and the constraint "only recommend by `id` from the provided list; never invent an id." Explicitly instruct the model to ask a clarifying question instead of guessing when the request is too vague to differentiate models, and to revise its recommendation when the user adds/changes a requirement rather than repeating itself.
4. Call `streamText` (AI SDK, `ai` package) with `model: 'deepseek/deepseek-v3'` (routes through Vercel AI Gateway via existing `VERCEL_OIDC_TOKEN` — no new API key) and the full message history. Give it one tool, `recommendModels`, with a zod schema:
   ```ts
   z.object({
     recommendations: z.array(z.object({
       modelId: z.string(),
       reasoning: z.string(),
     })).min(1).max(3),
   })
   ```
   The model calls this tool when (and only when) it's ready to recommend; ordinary conversational replies (clarifying questions, explaining prior reasoning) are plain streamed text with no tool call.
5. Server-side, whenever the tool is called, map each returned `modelId` against the live (already-loaded) model list. Any `modelId` that doesn't match a real entry is silently dropped rather than surfaced — defensive only, shouldn't happen since the schema is constrained to real ids in the prompt.
6. Stream the response back (AI SDK's data stream protocol handles interleaving text and tool calls); the client resolves each tool call's `modelId`s against local `models.json` data (already available client-side, same as the rest of the site) to render cards — the frontend never has to trust or re-fetch model specs from the LLM's output.

## Rate limiting

Simple per-IP limiter inside the API route (e.g. a small in-memory counter keyed by request IP, a few requests/minute) to protect the AI Gateway's $5/month free credit from bot/scraper abuse. In-memory is acceptable for this scale (no multi-region consistency requirement) — if traffic patterns later show it's insufficient, upgrade to a KV-backed counter, but not in v1.

## Error handling

- Gateway/provider errors (429 rate-limited, 402 budget exceeded, 503 unavailable) render a plain "try again in a bit" message client-side — never a stack trace or raw error JSON.
- Own rate limit exceeded → same friendly message, distinct enough copy that it's clear it's this site's limit, not the provider's.
- Network/unexpected errors → generic fallback message.

## Testing

- `npm run build` — confirms the new route/page don't break the static build (existing project convention per `AGENTS.md`).
- Manual pass through varied prompts covering both registers and a few follow-up turns each: qualitative ("cheap model for a chatbot I run all day"), technical ("need 200K+ context, open weights, sub-$1/M input"), too-vague-to-answer (confirms it asks a clarifying question instead of guessing), and a follow-up that changes a requirement mid-conversation (confirms it revises rather than repeats).

## Out of scope

- No structured filters (dropdowns/sliders for price, context length) — free text (qualitative or technical) only, per requirement.
- No new database or vector store — see "Approach" above.
- No persistence of conversations across page loads or sessions — client-side state only, resets on refresh.
- No change to `data/models.json` schema.
