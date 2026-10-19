import { notFound } from "next/navigation";
import { EntryDrawer } from "@/components/directory/EntryDrawer";
import { entryById } from "@/lib/data";
import { entryParams } from "@/components/directory/EntryPage";

// Intercepts /image-models/[id] when navigated to from the directory; a cold load gets
// app/image-models/[id]/page.tsx. Same pattern as app/@modal/(.)models/[id].
export const generateStaticParams = () => entryParams("image-models");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const entry = entryById("image-models", (await params).id);
  if (!entry) notFound();
  return <EntryDrawer kind="image-models" entry={entry} />;
}
