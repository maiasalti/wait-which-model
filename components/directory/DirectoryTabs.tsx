"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeDirectoryTab, visibleDirectoryTabs } from "@/lib/directory";
import { directoryCounts } from "@/lib/data";

/** The strip of Directory children shown at the top of each directory page.
 *  With only Models filled there is nothing to switch to, so it renders
 *  nothing rather than a lone tab. */
export function DirectoryTabs() {
  const pathname = usePathname();
  const tabs = visibleDirectoryTabs(directoryCounts);
  if (tabs.length < 2) return null;
  const active = activeDirectoryTab(pathname);

  return (
    <nav aria-label="Directory" className="-mx-1 mt-6 flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={active === t.key ? "page" : undefined}
          className={`relative shrink-0 px-3 py-2 text-sm ${
            active === t.key ? "text-ink" : "text-ink-2 hover:text-ink"
          }`}
        >
          {t.label}
          {active === t.key && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />}
        </Link>
      ))}
    </nav>
  );
}
