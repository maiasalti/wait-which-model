import { notFound } from "next/navigation";
import { EntryDrawer } from "@/components/directory/EntryDrawer";
import { entryById } from "@/lib/data";
import { entryParams } from "@/components/directory/EntryPage";

// Intercepts /agents/[id] when navigated to from the directory; a cold load gets
// app/agents/[id]/page.tsx. Same pattern as app/@modal/(.)models/[id].
export const generateStaticParams = () => entryParams("agents");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const entry = entryById("agents", (await params).id);
  if (!entry) notFound();
  return <EntryDrawer kind="agents" entry={entry} />;
}
