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
                  default:
                    // approval-requested / approval-responded / output-denied are part of the
                    // SDK's ToolUIPart union but unreachable here — recommendModels never sets
                    // needsApproval. Rendered anyway so a fallthrough is visible, not silent.
                    return (
                      <p key={index} className="mono text-xs text-ink-3">
                        Still working on that recommendation…
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
          aria-label="Describe what you need a model for"
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
