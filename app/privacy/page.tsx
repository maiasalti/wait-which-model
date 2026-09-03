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
        <p className="mono mt-3 text-xs text-ink-3">Last updated Sep 3, 2026</p>
      </section>

      <div className="space-y-6 pb-16 text-sm text-ink-2">
        <p>
          Wait Which Model? is a static reference site. It has no user accounts and
          nothing to log in to. The one thing it can collect is an email address, and
          only if you type it into the sign-up box in the footer.
        </p>

        <div>
          <h2 className="text-base font-semibold text-ink">Email notifications</h2>
          <p className="mt-2">
            If you subscribe, your address is stored with{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resend
            </a>
            , the service that sends the emails, and used for exactly one thing: an email
            when a new model is added to this site. Nothing else is sent to it, and it is
            not shared or sold. Every email has an unsubscribe link, which removes you
            immediately.
          </p>
        </div>

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
            advertising trackers, and no data is collected, stored, or shared beyond the
            analytics and the optional email sign-up described above.
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
