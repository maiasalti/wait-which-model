import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectoryShell } from "@/components/directory/DirectoryShell";
import { entries } from "@/lib/data";

export const metadata: Metadata = { title: "Frontier Features" };

export default function Page() {
  // Hidden until filled: no empty directory is ever reachable.
  if (entries["features"].length === 0) notFound();
  return <DirectoryShell kind="features" />;
}
