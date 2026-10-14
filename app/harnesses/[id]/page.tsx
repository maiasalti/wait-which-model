import { EntryPage, entryMetadata, entryParams } from "@/components/directory/EntryPage";

export const generateStaticParams = () => entryParams("harnesses");
export const generateMetadata = entryMetadata("harnesses");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EntryPage kind="harnesses" id={(await params).id} />;
}
