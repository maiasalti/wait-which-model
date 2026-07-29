// app/which-model/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { Model } from "@/lib/types";
import type { WhichModelUIMessage } from "@/app/api/which-model/route";
import { ModelCard } from "@/components/ModelCard";
import { ModelDrawer } from "@/components/ModelDrawer";

const PROMPTS = [
  "What are you trying to do, and how tricky is it?",
  "Is this a one-off, or something you'll run all day?",
  "Anything that matters a lot to you — cost, speed, privacy?",
];

// Tag picker for people who can't easily put their need into a sentence.
// Split into the two things the recommender actually weighs against each other
// — what the work is, and what you're optimising for — because a request with
// only one of the two is what makes it stop and ask a clarifying question.
// `phrase` is the fragment each tag contributes to the composed sentence.
const TASK_TAGS = [
  { id: "coding", label: "Coding", phrase: "writing and debugging code" },
  { id: "docs", label: "Doc summarisation", phrase: "summarising long documents" },
  { id: "chat", label: "Everyday chat", phrase: "day-to-day chat" },
  { id: "writing", label: "Writing", phrase: "drafting or editing prose" },
  { id: "analysis", label: "Data analysis", phrase: "analysing data to spot patterns" },
  { id: "vision", label: "Images", phrase: "reading images, screenshots and charts" },
  { id: "agents", label: "Automation", phrase: "running long automated tasks that use tools" },
] as const;

const PRIORITY_TAGS = [
  { id: "cheap", label: "Cheap", phrase: "keeping the cost down" },
  { id: "quick", label: "Quick", phrase: "fast replies" },
  { id: "best", label: "Best quality", phrase: "the best quality I can get" },
  { id: "private", label: "Private", phrase: "running on my own computers so my data stays put" },
  { id: "volume", label: "Heavy use", phrase: "using it constantly, at high volume" },
] as const;

const TAG_BY_ID = new Map<string, { label: string; phrase: string }>(
  [...TASK_TAGS, ...PRIORITY_TAGS].map((t) => [t.id, t]),
);

/** "a", "a and b", "a, b and c" — reads as a sentence, not a list dump. */
function joinPhrases(phrases: string[]): string {
  if (phrases.length <= 1) return phrases[0] ?? "";
  return `${phrases.slice(0, -1).join(", ")} and ${phrases[phrases.length - 1]}`;
}

function composeRequest(picked: string[]): string {
  const phraseFor = (ids: readonly { id: string }[]) =>
    ids.filter((t) => picked.includes(t.id)).map((t) => TAG_BY_ID.get(t.id)!.phrase);
  const tasks = phraseFor(TASK_TAGS);
  const priorities = phraseFor(PRIORITY_TAGS);

  const sentences: string[] = [];
  if (tasks.length) sentences.push(`I need a model for ${joinPhrases(tasks)}.`);
  if (priorities.length) {
    sentences.push(
      tasks.length
        ? `What matters most to me is ${joinPhrases(priorities)}.`
        : `I'm looking for a model where what matters most is ${joinPhrases(priorities)}.`,
    );
  }
  return sentences.join(" ");
}

/** Rendered in two places: in the header before a conversation starts, and
 *  above the composer when reopened mid-thread. Same component either way so
 *  the two can't drift apart. */
function TagPicker({
  picked,
  onToggle,
  onAsk,
  busy,
}: {
  picked: string[];
  onToggle: (id: string) => void;
  onAsk: () => void;
  busy: boolean;
}) {
  return (
    <div className="max-h-[55vh] overflow-y-auto rounded-lg border border-line bg-surface p-4">
      <p className="text-sm text-ink-2">
        Not sure how to word it? Tap whatever applies and we&apos;ll write the
        question for you.
      </p>

      {[
        { heading: "What for", tags: TASK_TAGS },
        { heading: "What matters", tags: PRIORITY_TAGS },
      ].map(({ heading, tags }) => (
        <div key={heading} className="mt-4">
          <p className="mono text-[10px] uppercase tracking-widest text-ink-3">
            {heading}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const on = picked.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggle(tag.id)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    on
                      ? "border-accent bg-accent/20 text-ink"
                      : "border-line-strong bg-surface-2 text-ink-2 hover:border-accent/50 hover:text-ink"
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {picked.length > 0 && (
        <p className="mt-4 border-l-2 border-accent/40 pl-3 text-sm italic text-ink-2">
          {composeRequest(picked)}
        </p>
      )}

      <button
        type="button"
        onClick={onAsk}
        disabled={busy || picked.length === 0}
        className="mono mt-4 rounded border border-accent/60 bg-accent/15 px-3 py-1.5 text-xs uppercase tracking-wider text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        Ask this
      </button>
    </div>
  );
}

export default function WhichModelPage() {
  const { messages, sendMessage, status, error, regenerate } = useChat<WhichModelUIMessage>({
    transport: new DefaultChatTransport({ api: "/api/which-model" }),
  });
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Model | null>(null);
  const [tooShort, setTooShort] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  // Reopens the tag picker mid-conversation, so someone who wants the
  // options back does not have to reload the page to get them.
  const [pickerOpen, setPickerOpen] = useState(false);

  const busy = status === "submitted" || status === "streaming";

  // True once the in-flight assistant turn has produced something worth
  // showing (text with content, or a recommendModels tool part — the only
  // part shapes that render visible output below). Until then — including
  // the entire window before the assistant message even exists in state,
  // and the moment right after it appears but only holds a `step-start`
  // part — the pending indicator below covers the gap.
  const lastMessage = messages[messages.length - 1];
  const lastAssistantHasVisibleContent =
    lastMessage?.role === "assistant" &&
    lastMessage.parts.some(
      (part) =>
        (part.type === "text" && part.text.trim().length > 0) ||
        part.type === "tool-recommendModels"
    );
  const showPendingIndicator = busy && !lastAssistantHasVisibleContent;

  // The opening message needs enough to work with; once a conversation is
  // running, a one-word answer to a clarifying question ("SQL", "yes", "cheap")
  // is a perfectly valid turn, so only require that something was typed.
  const minLength = messages.length === 0 ? 5 : 1;

  const submit = () => {
    const text = input.trim();
    if (busy) return;
    if (text.length < minLength) {
      setTooShort(true);
      return;
    }
    setTooShort(false);
    sendMessage({ text });
    setInput("");
  };

  const togglePick = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  const askPicked = () => {
    if (busy || picked.length === 0) return;
    setTooShort(false);
    sendMessage({ text: composeRequest(picked) });
    setPicked([]);
    // Collapse back to the toggle after asking — the answer is what matters now.
    setPickerOpen(false);
  };

  // Keep the newest turn in view: the composer is pinned to the bottom of the
  // viewport, so without this the conversation grows underneath it unseen.
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, status]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 pt-10">
      <section>
        <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">
          Ask the directory
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
          Which Model Tool
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-2">
          Describe what you need in simple terms (or technically). It reads
          straight off this site&apos;s directory, so recommendations come from
          only what&apos;s here, not the model&apos;s own memory.
        </p>

        {/* Before a conversation starts the picker leads the page. Once one
            exists it collapses to a toggle by the composer (below) — always
            reachable, never in the way. */}
        {messages.length === 0 && (
          <div className="mt-5">
            <TagPicker
              picked={picked}
              onToggle={togglePick}
              onAsk={askPicked}
              busy={busy}
            />
          </div>
        )}
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
                    if (!part.output.ok || part.output.recommendations.length === 0) {
                      return (
                        <p key={index} className="text-xs text-ink-3">
                          Couldn&apos;t match that to a model in the directory — try
                          rephrasing what you need.
                        </p>
                      );
                    }
                    return (
                      <div key={index} className="grid gap-3 sm:grid-cols-2">
                        {part.output.recommendations.map(({ model, reasoning }) => (
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

        {showPendingIndicator && (
          <div className="flex flex-col gap-2" role="status" aria-live="polite">
            <p className="mono text-[10px] uppercase tracking-widest text-ink-3">
              Recommendation
            </p>
            <p className="mono flex items-center gap-2 text-xs text-ink-3">
              <span className="pending-dot inline-block h-1.5 w-1.5 rounded-full bg-ink-3" />
              Reading the model directory…
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-start gap-2 rounded-lg border border-line bg-surface p-4">
            <p className="text-sm text-ink-2">
              Something went wrong talking to the recommender — try again in a bit.
            </p>
            <button
              onClick={() => regenerate()}
              className="mono rounded border border-line px-2.5 py-1.5 text-xs uppercase tracking-wider text-ink-2 hover:text-ink"
            >
              Try again
            </button>
          </div>
        )}

        <div ref={bottomRef} aria-hidden />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        // Pinned to the bottom of the viewport so the composer never scrolls
        // away as the conversation grows. The gradient lets the thread fade
        // out underneath it instead of ending at a hard edge.
        className="sticky bottom-0 z-20 flex flex-col gap-2 bg-linear-to-t from-bg from-70% to-transparent pb-6 pt-4"
      >
        {messages.length > 0 && (
          <>
            {pickerOpen && (
              <TagPicker
                picked={picked}
                onToggle={togglePick}
                onAsk={askPicked}
                busy={busy}
              />
            )}
            <button
              type="button"
              onClick={() => setPickerOpen((open) => !open)}
              aria-expanded={pickerOpen}
              className="mono self-start rounded border border-line px-2.5 py-1.5 text-xs uppercase tracking-wider text-ink-3 transition-colors hover:border-line-strong hover:text-ink"
            >
              {pickerOpen ? "Hide options" : "+ Pick from options"}
            </button>
          </>
        )}
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (tooShort) setTooShort(false);
          }}
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
        {tooShort && (
          <p className="mono text-xs text-ink-3">
            {messages.length === 0
              ? "A little more detail would help — a few words about what you need."
              : "Type something first."}
          </p>
        )}
        <button
          type="submit"
          // Only disabled while a reply is in flight. Gating this on input
          // length instead left the button dead with no explanation for short
          // but perfectly valid answers; too-short input is now rejected on
          // submit with a visible reason.
          disabled={busy}
          className="mono self-start rounded border border-accent/60 bg-accent/15 px-3 py-1.5 text-xs uppercase tracking-wider text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Thinking…" : "Ask"}
        </button>
      </form>

      <ModelDrawer model={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
