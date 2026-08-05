import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompanyLogo } from "@/components/CompanyLogo";
import { ModelStatsGrid } from "@/components/model/ModelStatsGrid";
import { ModelBenchmarks } from "@/components/model/ModelBenchmarks";
import { benchmarkCoverage } from "@/components/model/benchmarkCoverage";
import { ModelProsCons } from "@/components/model/ModelProsCons";
import { ModelNewsList } from "@/components/model/ModelNewsList";
import { Collapsible } from "@/components/Collapsible";
import { ModelDeveloperDetails } from "@/components/model/ModelDeveloperDetails";
import {
  companyName,
  formatContext,
  formatCostPerTask,
  formatDate,
  modelById,
  models,
} from "@/lib/data";

export function generateStaticParams() {
  return models.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const model = modelById.get(id);
  if (!model) return {};

  // Figures the model actually has, so the description never asserts a number
  // that is null in the data.
  const facts = [
    `${companyName(model.company)} · released ${formatDate(model.releaseDate)}`,
    model.benchmarks.sweBench != null ? `SWE-bench ${model.benchmarks.sweBench}%` : null,
    model.benchmarks.gpqaDiamond != null ? `GPQA ${model.benchmarks.gpqaDiamond}%` : null,
    model.costPerTask.usd != null
      ? `${formatCostPerTask(model.costPerTask.usd)} per task`
      : null,
    model.contextWindow != null ? `${formatContext(model.contextWindow)} context` : null,
  ].filter(Boolean);

  return {
    title: model.name,
    description: facts.join(" · "),
    openGraph: {
      title: `${model.name} · Wait Which Model?`,
      description: facts.join(" · "),
      url: `/models/${model.id}`,
      type: "article",
    },
  };
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = modelById.get(id);
  if (!model) notFound();

  return (
    <div className="pb-8 pt-10">
      <Link
        href="/"
        className="mono text-xs uppercase tracking-[0.2em] text-ink-3 transition-colors hover:text-ink"
      >
        ← Back to directory
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-2">
          <CompanyLogo companyId={model.company} size={17} />
          <span className="mono text-xs uppercase tracking-wider text-ink-2">
            {companyName(model.company)}
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{model.name}</h1>
        <p className="mono mt-2 text-xs text-ink-3">
          Released {formatDate(model.releaseDate)} · knowledge cutoff{" "}
          {model.knowledgeCutoff ?? "unpublished"}
        </p>
      </header>

      <div className="mt-8 max-w-3xl">
        <ModelStatsGrid model={model} className="grid-cols-2 sm:grid-cols-3" />

        <div className="mt-8">
          <Collapsible
            title="Benchmarks"
            meta={`${benchmarkCoverage(model).reported} of ${benchmarkCoverage(model).total} reported`}
            defaultOpen
          >
            <ModelBenchmarks model={model} />
          </Collapsible>
          <Collapsible title="Strengths & weaknesses" defaultOpen>
            <ModelProsCons model={model} className="grid gap-6 sm:grid-cols-2" />
          </Collapsible>
          <Collapsible title="For developers">
            <ModelDeveloperDetails model={model} />
          </Collapsible>
          <Collapsible title="News">
            <ModelNewsList model={model} />
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
