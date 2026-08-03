import type { Model } from "@/lib/types";

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-2">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-2">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

/** Strengths, weaknesses and the notes line. `className` lets the page lay the
 *  two lists side by side while the drawer stacks them. */
export function ModelProsCons({
  model,
  className = "",
}: {
  model: Model;
  className?: string;
}) {
  return (
    <div>
      <div className={className}>
        <List title="Strengths" items={model.strengths} />
        <List title="Weaknesses" items={model.weaknesses} />
      </div>
      {model.notes && <p className="mt-5 text-sm italic text-ink-3">{model.notes}</p>}
    </div>
  );
}
