import type { Model } from "@/lib/types";
import { formatDate, news } from "@/lib/data";

const relatedNews = (model: Model) => news.filter((n) => n.modelIds.includes(model.id));

/** Callers hide the News section entirely when this is 0 — most recent
 *  additions have no coverage yet. */
export const newsCount = (model: Model) => relatedNews(model).length;

/** Related news for a model, from news.modelIds. Renders nothing when a model
 *  has no coverage. */
export function ModelNewsList({ model }: { model: Model }) {
  const related = relatedNews(model);
  if (related.length === 0) return null;

  return (
    <div>
      <ul className="space-y-2">
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
