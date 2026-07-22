"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FrontierSparkline } from "./FrontierSparkline";

const TABS = [
  { href: "/", label: "Models Directory" },
  { href: "/compare", label: "Compare" },
  { href: "/news", label: "News" },
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
          {TABS.map((t) => {
            const active =
              t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
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
