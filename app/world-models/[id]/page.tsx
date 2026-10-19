import { EntryPage, entryMetadata, entryParams } from "@/components/directory/EntryPage";

export const generateStaticParams = () => entryParams("world-models");
export const generateMetadata = entryMetadata("world-models");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EntryPage kind="world-models" id={(await params).id} />;
}
