import { EntryPage, entryMetadata, entryParams } from "@/components/directory/EntryPage";

export const generateStaticParams = () => entryParams("image-models");
export const generateMetadata = entryMetadata("image-models");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EntryPage kind="image-models" id={(await params).id} />;
}
