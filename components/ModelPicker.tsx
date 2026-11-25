"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Model } from "@/lib/types";
import { pickerOptions } from "@/lib/cost-calc";
import { CompanyLogo } from "./CompanyLogo";

/**
 * A searchable, alphabetical single-model picker. Replaces a native <select>
 * once the list grew past what anyone can scroll through: type to narrow,
 * arrow keys to move, Enter to choose, Escape to close.
 */
export function ModelPicker({
  models,
  value,
  onChange,
  placeholder = "Compare against a model…",
  label = "Model you are currently using",
}: {
  models: Model[];
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = models.find((m) => m.id === value) ?? null;
  const options = useMemo(() => pickerOptions(models, query), [models, query]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    list.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openWith = (q: string) => {
    setQuery(q);
    setActive(0);
    setOpen(true);
  };

  const choose = (id: string | null) => {
    onChange(id);
    setOpen(false);
    setQuery("");
    input.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return openWith(query);
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && options[active]) {
        e.preventDefault();
        choose(options[active].id);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={wrap} className="relative w-64">
      <div className="flex items-center rounded border border-line bg-surface">
        {selected && !open && (
          <span className="pl-2">
            <CompanyLogo companyId={selected.company} size={12} />
          </span>
        )}
        <input
          ref={input}
          type="text"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
          placeholder={selected ? selected.name : placeholder}
          value={open ? query : (selected?.name ?? "")}
          onFocus={() => openWith("")}
          onClick={() => !open && openWith("")}
          onChange={(e) => openWith(e.target.value)}
          onKeyDown={onKeyDown}
          className="mono w-full min-w-0 bg-transparent px-2 py-1 text-xs text-ink-2 placeholder:text-ink-3 focus:outline-none"
        />
        {selected && (
          <button
            type="button"
            aria-label="Clear the model you are comparing against"
            onClick={() => choose(null)}
            className="mono px-2 text-xs text-ink-3 hover:text-ink"
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <ul
          ref={list}
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute right-0 top-full z-20 mt-1.5 max-h-72 w-full overflow-y-auto rounded border border-line-strong bg-surface-2 p-1 shadow-xl"
        >
          {options.length === 0 && (
            <li className="mono px-2 py-1.5 text-xs text-ink-3">No model matches “{query}”</li>
          )}
          {options.map((m, i) => (
            <li
              key={m.id}
              id={`${listId}-${i}`}
              data-index={i}
              role="option"
              aria-selected={m.id === value}
              // pointerdown, not click: the input's blur would otherwise race it.
              onPointerDown={(e) => {
                e.preventDefault();
                choose(m.id);
              }}
              onPointerEnter={() => setActive(i)}
              className={`mono flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs ${
                i === active ? "bg-wash/10 text-ink" : "text-ink-2"
              }`}
            >
              <CompanyLogo companyId={m.company} size={12} />
              <span className="flex-1 truncate">{m.name}</span>
              {m.id === value && <span className="text-ink-3">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
