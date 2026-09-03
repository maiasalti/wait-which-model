import { useState } from "react";

export type Status = "idle" | "sending" | "done" | "invalid" | "paused" | "limited" | "error";

export const MESSAGES: Record<Exclude<Status, "idle" | "sending">, string> = {
  done: "You're on the list.",
  invalid: "That address didn't work — try again?",
  paused: "Sign-ups are paused.",
  limited: "Too many attempts — try again later.",
  error: "Something went wrong — try again in a minute.",
};

/** Shared submit logic for the footer SubscribeForm and the sticky
 *  SubscribeBanner. Posts { email, website } to /api/subscribe; the
 *  `website` field is a honeypot that real visitors never fill in. */
export function useSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("done");
        setEmail("");
      } else if (data.error === "invalid_email") setStatus("invalid");
      else if (data.error === "not_configured") setStatus("paused");
      else if (data.error === "rate_limited") setStatus("limited");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return { email, setEmail, status, submit };
}
