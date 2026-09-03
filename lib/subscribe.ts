import { z } from "zod";

/** Body shape for POST /api/subscribe. `website` is the honeypot: real
 *  visitors never see the field, so anything in it means a bot. */
const Body = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  website: z.string().optional(),
});

export type ParsedSubscribe =
  | { ok: true; email: string; honeypot: boolean }
  | { ok: false };

export function parseSubscribeBody(body: unknown): ParsedSubscribe {
  const r = Body.safeParse(body);
  if (!r.success) return { ok: false };
  return { ok: true, email: r.data.email, honeypot: (r.data.website ?? "").length > 0 };
}

/** A returning subscriber is not an error to them. Resend answers a duplicate
 *  contact with 409, or a 4xx whose message says so. */
export function resendSaysAlreadyExists(status: number, bodyText: string): boolean {
  if (status === 409) return true;
  return status >= 400 && status < 500 && /already exists/i.test(bodyText);
}
