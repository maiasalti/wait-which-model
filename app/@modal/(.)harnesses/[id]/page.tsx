import { notFound } from "next/navigation";
import { EntryDrawer } from "@/components/directory/EntryDrawer";
import { entryById } from "@/lib/data";
import { entryParams } from "@/components/directory/EntryPage";

// Intercepts /harnesses/[id] when navigated to from the directory; a cold load gets
// app/harnesses/[id]/page.tsx. Same pattern as app/@modal/(.)models/[id].
export const generateStaticParams = () => entryParams("harnesses");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const entry = entryById("harnesses", (await params).id);
  if (!entry) notFound();
  return <EntryDrawer kind="harnesses" entry={entry} />;
}
