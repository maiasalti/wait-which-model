"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { FrontierSparkline } from "./FrontierSparkline";

const TABS = [
  { href: "/", label: "Models Directory" },
  { href: "/compare", label: "Compare" },
  { href: "/news", label: "News" },
  { href: "/info", label: "Info" },
];

// Both tools keep their own top-level URLs — "Tools" is a nav grouping only,
// so no existing link breaks and /which-model's OG image route is untouched.
const TOOLS = [
  { href: "/which-model", label: "Which Model?" },
  { href: "/cost-calculator", label: "Cost Calculator" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color:var(--bg)]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2 py-4">
          <span className="text-lg font-semibold tracking-tight">
            Wait Which Model?
          </span>
        </Link>
        <nav className="flex gap-1" aria-label="Sections">
          {TABS.map((t, i) => {
            const active =
              t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
            return (
              <Fragment key={t.href}>
                <Link
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
                {i === 0 && (
                  <details className="group relative">
                    <summary
                      className={`flex cursor-pointer list-none items-center gap-1 px-3 py-4 text-sm transition-colors ${
                        TOOLS.some((t) => pathname.startsWith(t.href))
                          ? "text-ink"
                          : "text-ink-2 hover:text-ink"
                      }`}
                    >
                      Tools
                      <span aria-hidden className="text-[10px] text-ink-3">▾</span>
                      {TOOLS.some((t) => pathname.startsWith(t.href)) && (
                        <span className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />
                      )}
                    </summary>
                    <div className="absolute left-0 top-full z-50 min-w-[12rem] overflow-hidden rounded border border-line-strong bg-surface-2 shadow-xl">
                      {TOOLS.map((t) => (
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
                )}
              </Fragment>
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
