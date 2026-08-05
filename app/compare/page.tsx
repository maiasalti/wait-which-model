import { Suspense } from "react";
import CompareClient from "./CompareClient";

/** Server shell. CompareClient reads search params, which in Next 16 forces a
 *  Suspense boundary — without one the production build fails with "Missing
 *  Suspense boundary with useSearchParams". It builds fine in dev, so this
 *  must be verified with `npm run build`, not the dev server. */
export default function ComparePage() {
  return (
    <Suspense fallback={<div className="pt-10 text-sm text-ink-3">Loading comparison…</div>}>
      <CompareClient />
    </Suspense>
  );
}
