"use client";

import { useEffect, useId, useRef, useState } from "react";
import { companies } from "@/lib/data";
import { CompanyLogo } from "./CompanyLogo";

/**
 * Named companion to the logo buttons on the directory.
 * Both read and write the same `selected` ids, so toggling either one
 * moves the other — the logos stay the fast path, this stays the legible one.
 */
export function CompanySelect({
  selected,
  onToggle,
  onClear,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const label =
    selected.length === 0
      ? "All companies"
      : selected.length === 1
        ? (companies.find((c) => c.id === selected[0])?.name ?? "1 company")
        : `${selected.length} companies`;

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        className={`flex items-center gap-1.5 rounded border bg-surface px-2 py-1.5 text-sm ${
          selected.length > 0 ? "border-line-strong text-ink" : "border-line text-ink-2"
        }`}
      >
        <span className="max-w-[10rem] truncate">{label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden
          className={`shrink-0 text-ink-3 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 3.5 5 7.5 9 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {open && (
        <div
          id={listId}
          role="group"
          aria-label="Filter by company"
          className="absolute left-0 top-full z-20 mt-1.5 max-h-72 w-56 overflow-y-auto rounded border border-line-strong bg-surface-2 p-1 shadow-xl"
        >
          <button
            type="button"
            onClick={onClear}
            disabled={selected.length === 0}
            className="mono w-full rounded px-2 py-1.5 text-left text-[11px] uppercase tracking-widest text-ink-3 hover:bg-surface disabled:opacity-40 disabled:hover:bg-transparent"
          >
            All companies
          </button>
          {companies.map((c) => (
            <label
              key={c.id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-ink-2 hover:bg-surface hover:text-ink"
            >
              <input
                type="checkbox"
                checked={selected.includes(c.id)}
                onChange={() => onToggle(c.id)}
              />
              <CompanyLogo companyId={c.id} size={14} />
              <span className="truncate">{c.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
