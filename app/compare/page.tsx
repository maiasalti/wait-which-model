import { Suspense } from "react";
import CompareClient from "./CompareClient";

/** The fallback is what every visitor actually sees first: /compare is
 *  statically prerendered, and search params do not exist at build time, so
 *  Next bakes THIS into the static HTML and swaps in the real page on
 *  hydration. A one-line "Loading…" would therefore collapse the layout on
 *  every single load and pop it back — a guaranteed layout shift, not an edge
 *  case. It has to reserve roughly the real page's height. */
function ComparePlaceholder() {
  return (
    <div className="min-h-[80vh] pt-10" aria-hidden>
      <div className="h-4 w-40 rounded bg-white/5" />
      <div className="mt-3 h-9 w-72 rounded bg-white/5" />
      <div className="mt-3 h-4 w-full max-w-2xl rounded bg-white/5" />
      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="h-96 w-full rounded border border-line lg:w-64 lg:shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <div className="h-72 rounded border border-line" />
          <div className="h-72 rounded border border-line" />
        </div>
      </div>
    </div>
  );
}

/** Server shell. CompareClient reads search params, which in Next 16 forces a
 *  Suspense boundary — without one the production build fails with "Missing
 *  Suspense boundary with useSearchParams". It builds fine in dev, so this
 *  must be verified with `npm run build`, not the dev server. */
export default function ComparePage() {
  return (
    <Suspense fallback={<ComparePlaceholder />}>
      <CompareClient />
    </Suspense>
  );
}
