import type { ReactNode } from "react";

/** Native <details> so the standalone model page stays a server component.
 *  `meta` is the muted right-hand note in the summary — used for the
 *  benchmark coverage count, which doubles as an honesty signal. */
export function Collapsible({
  title,
  meta,
  defaultOpen = false,
  children,
}: {
  title: string;
  meta?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-t border-line pt-3">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-2 transition-colors hover:text-ink">
        <span
          aria-hidden
          className="text-ink-3 transition-transform group-open:rotate-90"
        >
          ▸
        </span>
        <span>{title}</span>
        {meta && <span className="mono ml-auto text-[10px] normal-case tracking-normal text-ink-3">{meta}</span>}
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  );
}
