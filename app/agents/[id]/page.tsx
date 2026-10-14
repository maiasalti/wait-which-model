import { EntryPage, entryMetadata, entryParams } from "@/components/directory/EntryPage";

export const generateStaticParams = () => entryParams("agents");
export const generateMetadata = entryMetadata("agents");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EntryPage kind="agents" id={(await params).id} />;
}
