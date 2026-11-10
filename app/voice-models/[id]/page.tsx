import { EntryPage, entryMetadata, entryParams } from "@/components/directory/EntryPage";

export const generateStaticParams = () => entryParams("voice-models");
export const generateMetadata = entryMetadata("voice-models");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EntryPage kind="voice-models" id={(await params).id} />;
}
