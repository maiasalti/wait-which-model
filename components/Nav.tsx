"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { FrontierSparkline } from "./FrontierSparkline";
import { activeDirectoryTab, visibleDirectoryTabs } from "@/lib/directory";
import { directoryCounts } from "@/lib/data";

const TABS = [
  { href: "/compare", label: "Compare" },
  { href: "/news", label: "News" },
  { href: "/info", label: "Info" },
];

// "Directory" is a grouping like "Tools": its children keep flat URLs (/, /agents…).
const DIRECTORY = visibleDirectoryTabs(directoryCounts).map((t) => ({
  href: t.href,
  label: t.label,
}));

// Both tools keep their own top-level URLs — "Tools" is a nav grouping only,
// so no existing link breaks and /which-model's OG image route is untouched.
const TOOLS = [
  { href: "/which-model", label: "Which Model?" },
  { href: "/cost-calculator", label: "Cost Calculator" },
];

function NavGroup({
  label,
  items,
  active,
  detailsRef,
}: {
  label: string;
  items: { href: string; label: string }[];
  active: boolean;
  detailsRef: RefObject<HTMLDetailsElement | null>;
}) {
  return (
    <details ref={detailsRef} className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-1 px-3 py-4 text-sm transition-colors ${
          active ? "text-ink" : "text-ink-2 hover:text-ink"
        }`}
      >
        {label}
        <span aria-hidden className="text-[10px] text-ink-3">▾</span>
        {active && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />}
      </summary>
      <div className="absolute left-0 top-full z-50 min-w-[12rem] overflow-hidden rounded border border-line-strong bg-surface-2 shadow-xl">
        {items.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block px-3 py-2 text-sm text-ink-2 hover:bg-white/5 hover:text-ink"
          >
            {t.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

export function Nav() {
  const pathname = usePathname();
  const directoryRef = useRef<HTMLDetailsElement>(null);
  const toolsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    for (const r of [directoryRef, toolsRef]) if (r.current) r.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const close = (e: Event) => {
      for (const r of [directoryRef, toolsRef]) {
        const el = r.current;
        if (!el?.open) continue;
        if (e instanceof KeyboardEvent && e.key !== "Escape") continue;
        if (e.type === "pointerdown" && el.contains(e.target as Node)) continue;
        el.open = false;
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color:var(--bg)]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2 py-4">
          <span className="text-lg font-semibold tracking-tight">
            Wait Which Model?
          </span>
        </Link>
        <nav className="flex gap-1" aria-label="Sections">
          <NavGroup
            label="Directory"
            items={DIRECTORY}
            active={activeDirectoryTab(pathname) !== null}
            detailsRef={directoryRef}
          />
          <NavGroup
            label="Tools"
            items={TOOLS}
            active={TOOLS.some((t) => pathname.startsWith(t.href))}
            detailsRef={toolsRef}
          />
          {TABS.map((t) => {
            const active = pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-3 py-4 text-sm transition-colors ${
                  active ? "text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                {t.label}
                {active && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="mono hidden text-[10px] uppercase tracking-widest text-ink-3 lg:block">
            SWE-bench frontier →
          </span>
          <FrontierSparkline />
        </div>
      </div>
    </header>
  );
}
