import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · Wait Which Model?",
  description: "How this site handles data and analytics.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl">
      <section className="pt-10 pb-8">
        <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mono mt-3 text-xs text-ink-3">Last updated Jul 22, 2026</p>
      </section>

      <div className="space-y-6 pb-16 text-sm text-ink-2">
        <p>
          Wait Which Model? is a static reference site. It has no user accounts, no
          sign-up, and no forms that collect personal information — there is nothing
          here to log in to and nothing to submit.
        </p>

        <div>
          <h2 className="text-base font-semibold text-ink">Analytics</h2>
          <p className="mt-2">
            This site uses Google Analytics (via Google&rsquo;s gtag.js) to understand
            general traffic patterns — pages visited, approximate location, device and
            browser type. Google Analytics may set cookies and collect your IP address
            for this purpose. This data is aggregated and used only to understand how
            the site is used; it is not sold or shared beyond Google&rsquo;s standard
            analytics processing. You can opt out of Google Analytics tracking using a{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              browser extension
            </a>{" "}
            or by blocking third-party cookies in your browser.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-ink">What this site doesn&rsquo;t do</h2>
          <p className="mt-2">
            No accounts, no cookies set directly by this site outside of analytics, no
            advertising trackers, and no data is collected, stored, or shared beyond
            what&rsquo;s described above.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent to{" "}
            <a
              href="mailto:maia.salti@gmail.com"
              className="text-accent hover:underline"
            >
              maia.salti@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
