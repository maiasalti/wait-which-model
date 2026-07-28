# Which Model Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Which Model Tool" tab — a short chat where a visitor (technical or not) describes what they need and an LLM, grounded entirely in this site's own `data/*.json`, recommends 1-3 models with reasoning.

**Architecture:** A client chat page (`app/which-model/page.tsx`, using `@ai-sdk/react`'s `useChat`) talks to a Node API route (`app/api/which-model/route.ts`) that calls `streamText` with the full (non-deprecated) model directory stuffed into the system prompt, via Groq to `openai/gpt-oss-120b`. The model recommends by calling a single server-executed tool, `recommendModels`, whose `execute` resolves each returned id against the real, already-loaded model data — the LLM never restates specs, it only picks ids and writes reasoning.

**Tech Stack:** Next.js 16 App Router, `ai` (AI SDK core, already `^7.0.40`), `@ai-sdk/react` (`^4.0.43`), `zod` (`^4.4.3`), `@ai-sdk/groq` (`^4.0.15`) authenticated by `GROQ_API_KEY`.

> **Provider change, mid-execution (2026-07-28):** this plan was written against Vercel AI Gateway. The gateway returned `403 customer_verification_required` — Vercel gates even its free credits behind a credit card on file. The project owner chose Groq's free tier instead. Task 2's provider wiring was changed accordingly in fix round 1; the rest of the plan is unaffected, since everything downstream only talks to `/api/which-model`.

## Global Constraints

- No context-length or price-ceiling form inputs — free text only, qualitative or technical (spec: Page UI).
- Never invent a model id or restate model specs from the LLM's own knowledge — every recommendation resolves against real `data/models.json` entries (spec: Purpose, API route).
- Never recommend a `status: "deprecated"` model (spec: API route step 2).
- No new database, vector store, or persistence — conversation state is client-only, resets on refresh (spec: Out of scope).
- Gateway/provider errors and this site's own rate limit must render plain, friendly text client-side — never a stack trace or raw error body (spec: Error handling).
- Visual style matches the rest of the site — dark "observatory" theme, existing `bg-surface`/`border-line`/`text-ink*`/`mono` Tailwind tokens from `app/globals.css`, and reuse of `ModelCard`/`ModelDrawer` for result cards (spec: Page UI).
- `npm run build` is this project's correctness check (no test runner is configured — see `package.json` scripts and `AGENTS.md`); every task ends by running it.

**Prerequisite (manual, one-time, cannot be scripted):** a free Groq API key must exist in `.env.local` as `GROQ_API_KEY` (create one at https://console.groq.com/keys). Without it, the route builds fine but every live request fails auth. Task 2's manual verification step surfaces this clearly if it's missing.

---

### Task 1: Confirm AI SDK dependencies are installed and committed

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `ai`, `@ai-sdk/react`, `zod` available as project dependencies for Tasks 2 and 4.

- [ ] **Step 1: Verify the packages are present**

Run: `cd "/Users/maia/Desktop/Data Projects/frontier-models-website" && grep -E '"ai"|"@ai-sdk/react"|"zod"' package.json`

Expected output includes all three:
```
    "@ai-sdk/react": "^4.0.43",
    "ai": "^7.0.40",
    "zod": "^4.4.3"
```

If any are missing, run `npm install ai zod @ai-sdk/react` first, then re-check.

- [ ] **Step 2: Confirm the build still works with the new dependencies present**

Run: `npm run build`
Expected: build succeeds (no new routes reference the packages yet, so this just confirms nothing broke).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add ai, @ai-sdk/react, zod for the Which Model Tool"
```

---

### Task 2: API route — system prompt, rate limiter, streaming tool call

**Files:**
- Create: `app/api/which-model/route.ts`

**Interfaces:**
- Consumes: `models`, `modelById`, `benchmarks` from `lib/data.ts` (`lib/data.ts:8`, `lib/data.ts:25`, `lib/data.ts:16`); `Model` type from `lib/types.ts`.
- Produces: `POST /api/which-model` — accepts `{ messages: UIMessage[] }`, returns a UI message stream (via `createUIMessageStreamResponse`) that the `useChat` hook in Task 4 consumes directly, or a plain-text `429` response when rate-limited.

- [ ] **Step 1: Write the route file**

```ts
// app/api/which-model/route.ts
import { z } from "zod";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  tool,
  toUIMessageStream,
  type InferUITools,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { benchmarks, models, modelById } from "@/lib/data";
import type { Model } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const RATE_LIMIT = 8;
const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count += 1;
  return false;
}

const DIRECTORY = models
  .filter((m) => m.status !== "deprecated")
  .map((m) => ({
    id: m.id,
    name: m.name,
    company: m.company,
    releaseDate: m.releaseDate,
    status: m.status,
    tier: m.tier,
    modality: m.modality,
    contextWindow: m.contextWindow,
    maxOutput: m.maxOutput,
    pricing: m.pricing,
    openWeights: m.openWeights,
    knowledgeCutoff: m.knowledgeCutoff,
    benchmarks: m.benchmarks,
    strengths: m.strengths,
    weaknesses: m.weaknesses,
    notes: m.notes,
  }));

const BENCHMARK_LEGEND = benchmarks.map((b) => ({
  key: b.key,
  name: b.name,
  description: b.description,
  unit: b.unit,
  higherIsBetter: b.higherIsBetter,
}));

const SYSTEM_PROMPT = `You are the model recommender for "Wait Which Model?", a directory of frontier AI models. A visitor describes what they need — in casual, non-technical language, or in precise technical requirements (context window, price ceiling, open weights, latency, and so on) — and you help them pick.

Rules:
- Only recommend models by "id" from the DIRECTORY below. Never invent a model or use outside knowledge about a model's specs or quality, even if you recognize it from training data — DIRECTORY is the complete and only source of truth here.
- When you're ready to recommend, call the recommendModels tool with 1-3 ids and a short (1-3 sentence) reasoning for each, tailored to what the user actually said.
- If the request is too vague to meaningfully differentiate between models (e.g. "what's a good model"), do not call the tool yet — ask a short clarifying question in plain text instead.
- If a later message adds or changes a requirement (e.g. "actually, open weights only"), call the tool again with a recommendation that reflects the full, updated requirements — don't just repeat your previous answer.
- If the user asks about your reasoning or wants more detail on a prior recommendation, answer in plain text — don't call the tool again unless the actual recommendation should change.

BENCHMARKS (what each score means):
${JSON.stringify(BENCHMARK_LEGEND)}

DIRECTORY:
${JSON.stringify(DIRECTORY)}`;

const recommendModels = tool({
  description: "Recommend 1-3 models from the directory for the user's stated needs.",
  inputSchema: z.object({
    recommendations: z
      .array(
        z.object({
          modelId: z.string().describe("Must be an id from DIRECTORY."),
          reasoning: z
            .string()
            .describe("1-3 sentences on why this model fits, referencing what the user said."),
        }),
      )
      .min(1)
      .max(3),
  }),
  execute: async ({ recommendations }) => {
    return recommendations
      .map((r) => ({ model: modelById.get(r.modelId) ?? null, reasoning: r.reasoning }))
      .filter((r): r is { model: Model; reasoning: string } => r.model != null);
  },
});

const tools = { recommendModels };

export type WhichModelUIMessage = UIMessage<never, UIDataTypes, InferUITools<typeof tools>>;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return new Response(
      "You're sending messages a little too fast — wait a moment and try again.",
      { status: 429 },
    );
  }

  const { messages }: { messages: WhichModelUIMessage[] } = await req.json();

  const result = streamText({
    model: groq("openai/gpt-oss-120b"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: () => "The recommender hit a snag — try again in a bit.",
    }),
  });
}
```

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: PASS. This is a route handler, not a static page, so the build should report it as a dynamic function (ƒ) rather than static (○) — that's correct and expected for this route.

- [ ] **Step 3: Manual smoke test against the live gateway**

Run:
```bash
npm run dev
```
In another terminal:
```bash
curl -s -N -X POST http://localhost:3000/api/which-model \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"id":"1","role":"user","parts":[{"type":"text","text":"I need a cheap model for a chatbot I run all day"}]}]}'
```
Expected: a streamed response containing a `tool-recommendModels` part whose output includes 1-3 objects with a real `model.id` from `data/models.json` and non-empty `reasoning` text. If you get a 401, `GROQ_API_KEY` is missing or invalid in `.env.local` — see the prerequisite above. Stop the dev server after checking.

- [ ] **Step 4: Commit**

```bash
git add app/api/which-model/route.ts
git commit -m "Add Which Model Tool API route (context-stuffed, tool-calling recommender)"
```

---

### Task 3: Add the nav tab

**Files:**
- Modify: `components/Nav.tsx:7-12`

**Interfaces:**
- Consumes: nothing new.
- Produces: a working `/which-model` nav link (the route itself is created in Task 4; until then this links to a 404, which is expected mid-plan and fixed by the next task).

- [ ] **Step 1: Add the tab entry**

In `components/Nav.tsx`, change:
```tsx
const TABS = [
  { href: "/", label: "Models Directory" },
  { href: "/compare", label: "Compare" },
  { href: "/news", label: "News" },
  { href: "/info", label: "Info" },
];
```
to:
```tsx
const TABS = [
  { href: "/", label: "Models Directory" },
  { href: "/which-model", label: "Which Model Tool" },
  { href: "/compare", label: "Compare" },
  { href: "/news", label: "News" },
  { href: "/info", label: "Info" },
];
```

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: PASS (the `/which-model` link will 404 if visited until Task 4 lands — that's fine, it's not part of the static route list yet).

- [ ] **Step 3: Commit**

```bash
git add components/Nav.tsx
git commit -m "Add Which Model Tool tab to nav"
```

---

### Task 4: Chat page

**Files:**
- Create: `app/which-model/page.tsx`

**Interfaces:**
- Consumes: `ModelCard` (`components/ModelCard.tsx` — props `{ model: Model; onOpen: (m: Model) => void }`), `ModelDrawer` (`components/ModelDrawer.tsx` — props `{ model: Model | null; onClose: () => void }`), `useChat`/`DefaultChatTransport` from `@ai-sdk/react`/`ai`, and `WhichModelUIMessage` (type-only export from `app/api/which-model/route.ts`, Task 2) for typed tool parts.
- Produces: the `/which-model` page.

- [ ] **Step 1: Write the page**

```tsx
// app/which-model/page.tsx
"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { Model } from "@/lib/types";
import type { WhichModelUIMessage } from "@/app/api/which-model/route";
import { ModelCard } from "@/components/ModelCard";
import { ModelDrawer } from "@/components/ModelDrawer";

const PROMPTS = [
  "What's the task, and how demanding is it?",
  "How often or how long will you be using it — one-off, or constantly?",
  "Anything non-negotiable — budget, open weights, huge context, speed?",
];

export default function WhichModelPage() {
  const { messages, sendMessage, status, error, regenerate } = useChat<WhichModelUIMessage>({
    transport: new DefaultChatTransport({ api: "/api/which-model" }),
  });
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Model | null>(null);

  const busy = status === "submitted" || status === "streaming";

  const submit = () => {
    const text = input.trim();
    if (text.length < 5 || busy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 pb-16 pt-10">
      <section>
        <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">
          Ask the directory
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
          Which Model Tool
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-2">
          Describe what you need, in whatever terms you naturally think in
          — plain language or precise technical requirements. It reads
          straight off this site&apos;s own directory, so it only ever
          recommends real, current models.
        </p>
      </section>

      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="mono text-[10px] uppercase tracking-widest text-ink-3">
          Worth thinking about (you don&apos;t need to answer all of these)
        </p>
        <ul className="mt-2 flex flex-col gap-1 text-sm text-ink-2">
          {PROMPTS.map((p) => (
            <li key={p}>&middot; {p}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-2">
            <p className="mono text-[10px] uppercase tracking-widest text-ink-3">
              {message.role === "user" ? "You" : "Recommendation"}
            </p>
            {message.parts.map((part, index) => {
              if (part.type === "text") {
                return (
                  <p key={index} className="whitespace-pre-wrap text-sm text-ink">
                    {part.text}
                  </p>
                );
              }
              if (part.type === "tool-recommendModels") {
                switch (part.state) {
                  case "input-streaming":
                  case "input-available":
                    return (
                      <p key={index} className="mono text-xs text-ink-3">
                        Thinking through the directory…
                      </p>
                    );
                  case "output-available":
                    return (
                      <div key={index} className="grid gap-3 sm:grid-cols-2">
                        {part.output.map(({ model, reasoning }) => (
                          <div key={model.id} className="flex flex-col gap-2">
                            <ModelCard model={model} onOpen={setSelected} />
                            <p className="text-xs text-ink-2">{reasoning}</p>
                          </div>
                        ))}
                      </div>
                    );
                  case "output-error":
                    return (
                      <p key={index} className="text-xs text-ink-3">
                        Couldn&apos;t put a recommendation together that time.
                      </p>
                    );
                }
              }
              return null;
            })}
          </div>
        ))}

        {error && (
          <div className="flex flex-col items-start gap-2 rounded-lg border border-line bg-surface p-4">
            <p className="text-sm text-ink-2">{error.message}</p>
            <button
              onClick={() => regenerate()}
              className="mono rounded border border-line px-2.5 py-1.5 text-xs uppercase tracking-wider text-ink-2 hover:text-ink"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex flex-col gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Tell me what you need…"
          rows={3}
          className="rounded-lg border border-line bg-surface p-3 text-sm text-ink placeholder:text-ink-3 focus:border-line-strong focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || input.trim().length < 5}
          className="mono self-start rounded border border-accent/60 bg-accent/15 px-3 py-1.5 text-xs uppercase tracking-wider text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Thinking…" : "Ask"}
        </button>
      </form>

      <ModelDrawer model={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
```

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: PASS, with `/which-model` now listed among the built routes.

- [ ] **Step 3: Manual verification in the browser**

Run: `npm run dev`, open `http://localhost:3000/which-model`, and check:
- The three prompts render above the input.
- Typing under 5 characters keeps "Ask" disabled.
- Submitting "cheap model for a chatbot I run all day" streams a reply and ends with 1-3 `ModelCard`s + reasoning text under each.
- Clicking a returned card opens the existing `ModelDrawer`.
- Submitting a too-vague message like "what's good" gets a clarifying question in plain text, not cards.
- Submitting a technical follow-up, e.g. "actually, needs to be open-weights and 200K+ context", produces a revised card set.
Stop the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add app/which-model/page.tsx
git commit -m "Add Which Model Tool chat page"
```

---

### Task 5: Final full-flow verification

**Files:** none (verification only).

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: PASS, all routes (including `/which-model` and `/api/which-model`) build cleanly.

- [ ] **Step 2: Run through the spec's test scenarios end-to-end**

With `npm run dev` running, on `/which-model`, confirm each of these produces sensible, directory-grounded output (per the spec's Testing section):
1. Qualitative: "cheap model for a chatbot I run all day" → budget-tier recommendations.
2. Technical: "need 200K+ context, open weights, sub-$1/M input" → recommendations that actually satisfy those constraints per their real directory data.
3. Too vague: "what's good" → a clarifying question, no cards.
4. Mid-conversation change: after an initial recommendation, send "actually, open-weights only" → a revised card set, not a repeat of the first answer.

- [ ] **Step 3: Rate limit sanity check**

Send 9 messages in quick succession (under a minute) in one conversation; confirm the 9th shows the friendly rate-limit message ("You're sending messages a little too fast...") rather than a raw error.

- [ ] **Step 4: Confirm nothing else regressed**

Click through the other four tabs (Models Directory, Compare, News, Info) and confirm they still load normally with the new tab in place.
