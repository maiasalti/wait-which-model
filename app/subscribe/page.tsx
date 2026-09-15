import type { Metadata } from "next";
import Link from "next/link";
import { SubscribePanel } from "@/components/SubscribePanel";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Get one email whenever a new frontier AI model is added to the directory.",
  openGraph: {
    title: "New model alerts · Wait Which Model?",
    description: "Get one email whenever a new frontier AI model is added to the directory.",
    url: "/subscribe",
  },
};

export default function SubscribePage() {
  return (
    <div className="max-w-2xl">
      <section className="pt-10 pb-8">
        <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">Alerts</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
          Get an email when a new model is released
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-2">
          Whenever a new frontier model is added to the directory, you get one email with a
          link to its page, where its scores and pricing are already laid out.
        </p>
      </section>

      <SubscribePanel />

      <div className="mt-8 space-y-4 pb-16 text-sm text-ink-2">
        <div>
          <h2 className="text-base font-semibold text-ink">What you get</h2>
          <p className="mt-2">
            A single email for each release, sent once the model&rsquo;s page is live. It
            names the model and links straight to it. Corrections to existing entries and
            news updates don&rsquo;t trigger anything.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-ink">Leaving</h2>
          <p className="mt-2">
            Every email has an unsubscribe link, which removes you immediately. Your address
            is used for these emails only and is never shared. Details in the{" "}
            <Link href="/privacy" className="text-accent hover:underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
