import type { Metadata } from "next";
import { benchmarks, formatDate, methodology } from "@/lib/data";

export const metadata: Metadata = {
  title: "Info · Wait Which Model?",
  description: "How this site defines \"frontier,\" what the benchmarks mean, and how the data stays current.",
};

export default function InfoPage() {
  return (
    <div className="max-w-3xl">
      <section className="pt-10 pb-8">
        <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">Info</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
          How this site works
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-2">
          What &ldquo;frontier&rdquo; means here, why some figures are blank, and how the data
          stays up to date.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold">What counts as &ldquo;frontier&rdquo;</h2>
        <p className="mt-2 text-sm text-ink-2">{methodology.frontierDefinition.summary}</p>
        <ul className="mt-4 space-y-3">
          {methodology.frontierDefinition.criteria.map((c) => (
            <li key={c} className="flex gap-3 rounded border border-line p-3 text-sm text-ink-2">
              <span className="mono mt-0.5 shrink-0 text-ink-3">→</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="mono mt-3 text-xs text-ink-3">
          Definition last reviewed {formatDate(methodology.frontierDefinition.lastReviewed)}.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold">Tiers</h2>
        <p className="mt-2 text-sm text-ink-2">
          Every model belongs to one tier, so it&rsquo;s only ever compared against peers built
          for the same job.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {methodology.tiers.map((t) => (
            <div key={t.key} className="rounded border border-line p-3">
              <dt className="text-sm font-semibold">{t.label}</dt>
              <dd className="mt-1 text-sm text-ink-2">{t.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold">Status labels</h2>
        <dl className="mt-4 space-y-3">
          {methodology.statusMeanings.map((s) => (
            <div key={s.key} className="rounded border border-line p-3">
              <dt className="mono text-xs uppercase tracking-wider text-ink-3">{s.label}</dt>
              <dd className="mt-1 text-sm text-ink-2">{s.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold">Benchmarks</h2>
        <p className="mt-2 text-sm text-ink-2">
          Scores come from each benchmark&rsquo;s own methodology — they measure different
          things and aren&rsquo;t directly interchangeable.
        </p>
        <div className="mt-4 overflow-x-auto rounded border border-line">
          <table className="mono w-full text-sm">
            <tbody>
              {benchmarks.map((b) => (
                <tr key={b.key} className="border-b border-line last:border-0">
                  <td className="whitespace-nowrap py-2 pl-3 pr-4 align-top font-semibold text-ink">
                    {b.name}
                  </td>
                  <td className="py-2 pr-3 text-ink-2">{b.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold">Why some numbers are missing</h2>
        <p className="mt-2 text-sm text-ink-2">{methodology.dataGaps.summary}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold">Where the numbers come from</h2>
        <p className="mt-2 text-sm text-ink-2">{methodology.sourcing.summary}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold">How current this data is</h2>
        <p className="mt-2 text-sm text-ink-2">{methodology.currency.summary}</p>
      </section>
    </div>
  );
}
