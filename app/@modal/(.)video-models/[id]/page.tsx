import { notFound } from "next/navigation";
import { EntryDrawer } from "@/components/directory/EntryDrawer";
import { entryById } from "@/lib/data";
import { entryParams } from "@/components/directory/EntryPage";

// Intercepts /video-models/[id] when navigated to from the directory; a cold load gets
// app/video-models/[id]/page.tsx. Same pattern as app/@modal/(.)models/[id].
export const generateStaticParams = () => entryParams("video-models");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const entry = entryById("video-models", (await params).id);
  if (!entry) notFound();
  return <EntryDrawer kind="video-models" entry={entry} />;
}
