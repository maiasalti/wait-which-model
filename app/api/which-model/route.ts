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
    model: "deepseek/deepseek-v3.2",
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
