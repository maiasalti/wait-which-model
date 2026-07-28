import { z } from "zod";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  toUIMessageStream,
  type InferUITools,
  type LanguageModel,
  type TextStreamPart,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { benchmarks, models } from "@/lib/data";
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

const RECOMMENDABLE_MODELS = models.filter((m) => m.status !== "deprecated");

// Single source of truth for "recommendable models": the same filtered set backs
// both what the LLM sees in the prompt (DIRECTORY) and what execute() is allowed
// to resolve ids against. This ensures a hallucinated OR deprecated id (e.g. one
// the model recalls from training data, like "gpt-4" or "claude-3-opus") can never
// reach the user, even though those ids do exist in the full lib/data.ts modelById map.
const recommendableById = new Map(RECOMMENDABLE_MODELS.map((m) => [m.id, m]));

const DIRECTORY = RECOMMENDABLE_MODELS.map((m) => ({
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
- The tool only accepts ids that appear in DIRECTORY; anything else is silently dropped. If the tool result comes back with ok: false (no valid ids resolved), immediately call it again with different ids taken directly from DIRECTORY — do not repeat the same ids and do not give up silently.

After you call recommendModels, the app already renders each recommended model as a rich card showing its name, company, release date, context window, pricing, open-weights status, and benchmark scores — with the per-model reasoning you gave the tool displayed directly beneath its card. So after a successful tool call, do NOT write anything that restates model names, specs, prices, or reasoning — the user already sees all of that in the cards. At most add one short plain-sentence lead-in or follow-up (e.g. offering to narrow things down further, or asking if they want a different tradeoff) — or say nothing else at all.

Your replies are rendered as plain text, never as markdown — there is no markdown renderer, so any markdown syntax you write shows up to the user as literal stray characters. This applies to every reply you write, not just what follows a tool call: clarifying questions, follow-up answers, and any lead-in/follow-up text after recommending. Never use markdown tables, headings, bold/asterisks, bullet/numbered-list syntax, or pipe characters for layout — write plain sentences only.

BENCHMARKS (what each score means):
${JSON.stringify(BENCHMARK_LEGEND)}

DIRECTORY:
${JSON.stringify(DIRECTORY)}`;

export type RecommendModelsResult =
  | { ok: true; recommendations: { model: Model; reasoning: string }[] }
  | { ok: false; reason: string };

const recommendModels = tool({
  description:
    "Recommend 1-3 models from the directory for the user's stated needs. Ids not found in " +
    "DIRECTORY are silently dropped from the result — if that drops everything, the result " +
    "comes back with ok: false and you must call this tool again with valid ids from DIRECTORY.",
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
  execute: async ({ recommendations }): Promise<RecommendModelsResult> => {
    const seen = new Set<string>();
    const resolved = recommendations
      .map((r) => ({ model: recommendableById.get(r.modelId) ?? null, reasoning: r.reasoning }))
      .filter((r): r is { model: Model; reasoning: string } => r.model != null)
      .filter((r) => (seen.has(r.model.id) ? false : (seen.add(r.model.id), true)));

    if (resolved.length === 0) {
      return {
        ok: false,
        reason: "None of the given ids matched DIRECTORY — retry with valid ids from DIRECTORY.",
      };
    }
    return { ok: true, recommendations: resolved };
  },
});

const tools = { recommendModels };

export type WhichModelUIMessage = UIMessage<never, UIDataTypes, InferUITools<typeof tools>>;

// Primary: OpenRouter's free open-weight tier (keeps this feature's original
// "free, open-source LLM" intent). Fallback: Google's Gemini free tier, which
// survives OpenRouter's tight 50-requests/day free ceiling.
const OPENROUTER_MODEL_ID = "nvidia/nemotron-3-super-120b-a12b:free";
const GEMINI_MODEL_ID = "gemini-3.5-flash-lite";

type ProviderAttempt =
  | { ok: true; stream: ReadableStream<TextStreamPart<typeof tools>> }
  | { ok: false; error: unknown };

// Extracts just enough to debug a both-providers-failed report server-side —
// the error's constructor name and, if present, its HTTP status code (either
// an APICallError-style `statusCode`, or the numeric/string `code` OpenRouter
// puts on its in-band SSE error objects). Deliberately never touches
// `.message`, never logs the error object itself, and never touches the
// prompt or any key material.
function describeError(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as { name?: unknown; statusCode?: unknown; code?: unknown };
    const name = typeof e.name === "string" ? e.name : "UnknownError";
    const status =
      typeof e.statusCode === "number"
        ? e.statusCode
        : typeof e.code === "number" || typeof e.code === "string"
          ? e.code
          : undefined;
    return status !== undefined ? `${name} (status ${status})` : name;
  }
  return "UnknownError";
}

type Peek =
  | { kind: "error"; error: unknown }
  | { kind: "ended"; parts: TextStreamPart<typeof tools>[] }
  | { kind: "content"; parts: TextStreamPart<typeof tools>[] };

// streamText() never throws for provider-side failures (bad key, 429, 402, 5xx,
// timeout) — it swallows them and emits a `{ type: "error" }` part into the
// stream instead, so the request can still resolve gracefully. Its very first
// part is unconditionally `{ type: "start" }`, emitted synchronously before the
// provider is even called (stream-text.ts), so peeking only the first chunk
// can never tell us whether the call is going to fail.
//
// A fixed second-chunk check isn't enough either: an error that a provider
// *throws* (non-2xx, connection failure, retries exhausted) produces
// `[start, error]`, but OpenRouter's `:free` endpoints often return HTTP 200
// with the failure inside the SSE body instead — the provider maps that to an
// in-band `{ type: "error" }` part (verified in
// node_modules/@openrouter/ai-sdk-provider/dist/index.js:4737-4742), and
// stream-text.ts (~2156-2168) unconditionally injects a `start-step` part in
// front of the first non-`model-call-start` chunk of every step, regardless
// of whether that chunk turns out to be content or an error. So that failure
// mode actually produces `[start, start-step, error]` — a second-chunk-only
// check would misread `start-step` as "content began" and stream the failed
// OpenRouter response straight to the user.
//
// So instead we keep reading and buffering while the part type is one of the
// two non-committal control parts (`start`, `start-step`). The first part
// that isn't one of those settles it: `error` means the primary failed and we
// fail over; anything else (`text-start`, `tool-input-start`, `tool-call`,
// `finish-step`, `finish`, ...; part-type names verified against
// node_modules/ai/src/generate-text/stream-text-result.ts) means real output
// has begun and we commit to this provider.
async function peekUntilContentOrError(
  reader: ReadableStreamDefaultReader<TextStreamPart<typeof tools>>,
): Promise<Peek> {
  const parts: TextStreamPart<typeof tools>[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) return { kind: "ended", parts };
    parts.push(value);
    if (value.type === "error") return { kind: "error", error: value.error };
    if (value.type !== "start" && value.type !== "start-step") {
      return { kind: "content", parts };
    }
  }
}

async function attemptProvider(
  model: LanguageModel,
  label: string,
  system: string,
  messages: Awaited<ReturnType<typeof convertToModelMessages>>,
  // The primary should fail fast so there's time left for a fallback attempt;
  // the fallback has nothing after it, so it keeps the SDK's default retries.
  maxRetries?: number,
): Promise<ProviderAttempt> {
  try {
    const result = streamText({
      model,
      system,
      messages,
      tools,
      maxRetries,
      // Allow one extra step so the model can see an ok: false tool result and
      // retry with a valid id instead of the turn silently ending on an empty
      // recommendation.
      stopWhen: stepCountIs(2),
    });

    const reader = result.stream.getReader();
    const peek = await peekUntilContentOrError(reader);

    if (peek.kind === "error") {
      await reader.cancel().catch(() => {});
      return { ok: false, error: peek.error };
    }

    const leadingParts = peek.parts;
    const streamEnded = peek.kind === "ended";

    // Splice the peeked parts back onto the front of a fresh stream drawn
    // from the same underlying reader — none of this has been handed to the
    // client's response yet, so a failed peek above never leaks partial
    // bytes; a successful peek is replayed here in original order.
    const stream = new ReadableStream<TextStreamPart<typeof tools>>({
      async start(controller) {
        for (const part of leadingParts) controller.enqueue(part);
        if (streamEnded) {
          controller.close();
          return;
        }
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
      cancel(reason) {
        return reader.cancel(reason);
      },
    });

    console.info(`[which-model] serving via ${label}`);
    return { ok: true, stream };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return new Response(
      "You're sending messages a little too fast — wait a moment and try again.",
      { status: 429 },
    );
  }

  try {
    const { messages }: { messages: WhichModelUIMessage[] } = await req.json();
    // ignoreIncompleteToolCalls drops any assistant tool call left without a matching
    // result (stream cut off mid-turn, maxDuration hit, dropped connection) instead of
    // shipping a provider-invalid history that would 400 on every later turn.
    const modelMessages = await convertToModelMessages(messages, {
      ignoreIncompleteToolCalls: true,
    });

    const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;
    const hasGoogle = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    let attempt: ProviderAttempt | undefined;

    if (hasOpenRouter) {
      attempt = await attemptProvider(
        openrouter(OPENROUTER_MODEL_ID),
        "openrouter",
        SYSTEM_PROMPT,
        modelMessages,
        // Fail fast on the primary — there's a fallback to try, and the free
        // tier's 429/402s are exactly the errors default retries would waste
        // several seconds retrying before we ever reach Gemini.
        0,
      );
      if (!attempt.ok) {
        // Never log key material, full prompts, or the error object/message —
        // just enough (name + status) to see how often this fires and why.
        console.info(
          `[which-model] openrouter attempt failed (${describeError(attempt.error)}), falling back to gemini`,
        );
      }
    }

    if ((!attempt || !attempt.ok) && hasGoogle) {
      attempt = await attemptProvider(
        google(GEMINI_MODEL_ID),
        "gemini",
        SYSTEM_PROMPT,
        modelMessages,
      );
    }

    if (!attempt || !attempt.ok) {
      // Same rule as above: name + status only, never the message/object/prompt/key.
      const detail = attempt ? describeError(attempt.error) : "no provider configured";
      console.info(`[which-model] request failed — ${detail}`);
      return new Response(
        "The recommender hit a snag — try again in a bit.",
        { status: 502 },
      );
    }

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: attempt.stream,
        sendReasoning: false,
        onError: () => "The recommender hit a snag — try again in a bit.",
      }),
    });
  } catch {
    return new Response(
      "That request didn't look right — try sending your message again.",
      { status: 400 },
    );
  }
}
