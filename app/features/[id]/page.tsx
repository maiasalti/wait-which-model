import { EntryPage, entryMetadata, entryParams } from "@/components/directory/EntryPage";

export const generateStaticParams = () => entryParams("features");
export const generateMetadata = entryMetadata("features");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EntryPage kind="features" id={(await params).id} />;
}
