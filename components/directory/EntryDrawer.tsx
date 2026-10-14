"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AnyEntry, EntryKind } from "@/lib/types";
import { EntryDetail } from "./EntryDetail";
import { EntryHeader } from "./EntryHeader";

/** The ModelDrawer pattern for directory entries: rendered into @modal by the
 *  intercepting route, closed by popping the history entry the card pushed. */
export function EntryDrawer({ kind, entry }: { kind: EntryKind; entry: AnyEntry }) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={entry.name}>
      <div className="absolute inset-0 bg-black/60" onClick={() => router.back()} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col gap-6 overflow-y-auto border-l border-line bg-surface p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <EntryHeader entry={entry} as="h2" />
          <button
            onClick={() => router.back()}
            aria-label="Close details"
            className="rounded border border-line px-2 py-1 text-sm text-ink-2 hover:text-ink"
          >
            Esc
          </button>
        </div>
        <EntryDetail kind={kind} entry={entry} compact />
      </aside>
    </div>
  );
}
