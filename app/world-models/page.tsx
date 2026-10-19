import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectoryShell } from "@/components/directory/DirectoryShell";
import { entries } from "@/lib/data";

export const metadata: Metadata = { title: "World models" };

export default function Page() {
  // Hidden until filled: no empty directory is ever reachable.
  if (entries["world-models"].length === 0) notFound();
  return <DirectoryShell kind="world-models" />;
}
