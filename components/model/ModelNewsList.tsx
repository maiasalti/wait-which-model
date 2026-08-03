import type { Model } from "@/lib/types";
import { formatDate, news } from "@/lib/data";

/** Related news for a model, from news.modelIds. Renders nothing when a model
 *  has no coverage — most recent additions don't yet. */
export function ModelNewsList({ model }: { model: Model }) {
  const related = news.filter((n) => n.modelIds.includes(model.id));
  if (related.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-2">
        In the news
      </h3>
      <ul className="mt-2 space-y-2">
        {related.map((n) => (
          <li key={n.id}>
            <a
              href={n.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded border border-line p-2 text-sm transition-colors hover:border-ink-3 hover:bg-white/5"
            >
              <span className="mono text-[10px] text-ink-3">{formatDate(n.date)}</span>
              <p className="text-ink-2">{n.title}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
