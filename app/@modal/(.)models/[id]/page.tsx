import { notFound } from "next/navigation";
import { ModelDrawer } from "@/components/ModelDrawer";
import { modelById, models } from "@/lib/data";

// Intercepts /models/[id] when it is navigated to from the directory, rendering
// the drawer over the still-mounted grid so filters, sort and scroll survive.
// A cold load or hard refresh skips interception and gets app/models/[id]/page.tsx.
export function generateStaticParams() {
  return models.map((m) => ({ id: m.id }));
}

export default async function InterceptedModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = modelById.get(id);
  if (!model) notFound();

  return <ModelDrawer model={model} />;
}
