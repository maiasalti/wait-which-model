import { parseSubscribeBody, resendSaysAlreadyExists } from "@/lib/subscribe";

export const runtime = "nodejs";
export const maxDuration = 10;

// Best-effort, in-memory: Fluid Compute reuses instances, a cold one starts
// empty. Enough for a sign-up form; see the spec's risks section.
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count += 1;
  return false;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  // Preview deployments and local dev get no key on purpose, so a test build
  // can never add real contacts.
  if (!apiKey || !segmentId) return json({ error: "not_configured" }, 503);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  // Rate-limit before parsing: cheaper, and bots burn their quota on garbage. (The spec lists parse first; this reordering is deliberate.)
  if (isRateLimited(ip)) return json({ error: "rate_limited" }, 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_email" }, 400);
  }
  const parsed = parseSubscribeBody(body);
  if (!parsed.ok) return json({ error: "invalid_email" }, 400);
  if (parsed.honeypot) return json({ ok: true }); // bots see success and nothing happens

  const res = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: parsed.email, segments: [{ id: segmentId }] }),
  });
  if (res.ok) return json({ ok: true });

  const text = await res.text();
  if (resendSaysAlreadyExists(res.status, text)) return json({ ok: true });
  console.error(`[subscribe] Resend ${res.status}: ${text.slice(0, 300)}`);
  return json({ error: "upstream" }, 502);
}
