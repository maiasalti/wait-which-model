import { EntryPage, entryMetadata, entryParams } from "@/components/directory/EntryPage";

export const generateStaticParams = () => entryParams("video-models");
export const generateMetadata = entryMetadata("video-models");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EntryPage kind="video-models" id={(await params).id} />;
}
