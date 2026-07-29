import type { Metadata } from "next";

// `page.tsx` in this segment is a Client Component ("use client"), and Next only
// supports `metadata` exports from Server Components — so without this layout the
// route silently inherits the root layout's site-wide card, which is what link
// unfurlers were showing. This layout renders nothing of its own; it exists purely
// to carry the segment's metadata.

const TITLE = "Which model should I use?";
const DESCRIPTION =
  "Describe what you're working on in plain words and get up to three model " +
  "recommendations, with what each one trades off. No jargon, no leaderboards, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/which-model" },
  openGraph: {
    title: `${TITLE} · Wait Which Model?`,
    description: DESCRIPTION,
    url: "/which-model",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · Wait Which Model?`,
    description: DESCRIPTION,
  },
};

export default function WhichModelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
