#!/usr/bin/env node
/** Read-only look at the subscriber list and broadcast history, for when
 *  someone says "I never got the email". Runs in the notify-diagnostics
 *  workflow (workflow_dispatch) with the repository's Resend secrets; prints
 *  counts, statuses and the one address asked about, never the whole list.
 *
 *    RESEND_API_KEY=… RESEND_SEGMENT_ID=… EMAIL=someone@example.com node scripts/notify-diagnose.js
 */
const { RESEND_API_KEY, RESEND_SEGMENT_ID, EMAIL, BROADCAST_ID } = process.env;
for (const k of ["RESEND_API_KEY", "RESEND_SEGMENT_ID"]) if (!process.env[k]) throw new Error(`${k} is required`);

const headers = { Authorization: `Bearer ${RESEND_API_KEY}` };
async function get(path) {
  const res = await fetch(`https://api.resend.com${path}`, { headers });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}
const mask = (e) => e.replace(/^(.{2}).*(@.*)$/, "$1…$2");

async function main() {
  // Segment membership, paginated.
  let after, total = 0, unsubscribed = 0, hit = null;
  do {
    const { status, body } = await get(`/segments/${RESEND_SEGMENT_ID}/contacts?limit=100${after ? `&after=${after}` : ""}`);
    if (status !== 200) throw new Error(`segment contacts: ${status} ${JSON.stringify(body)}`);
    for (const c of body.data) {
      total += 1;
      if (c.unsubscribed) unsubscribed += 1;
      if (EMAIL && c.email.toLowerCase() === EMAIL.toLowerCase()) hit = c;
    }
    after = body.has_more ? body.data[body.data.length - 1].id : undefined;
  } while (after);
  console.log(`segment ${RESEND_SEGMENT_ID}: ${total} contacts, ${unsubscribed} unsubscribed`);

  if (EMAIL) {
    if (hit) console.log(`${mask(EMAIL)}: in segment, unsubscribed=${hit.unsubscribed}, added ${hit.created_at}`);
    else {
      const { status, body } = await get(`/contacts/${encodeURIComponent(EMAIL)}`);
      if (status === 200) console.log(`${mask(EMAIL)}: exists as a contact but NOT in the segment (unsubscribed=${body.unsubscribed}, added ${body.created_at})`);
      else console.log(`${mask(EMAIL)}: not a contact at all (${status})`);
    }
  }

  const { body: list } = await get("/broadcasts?limit=10");
  console.log("recent broadcasts:");
  for (const b of list.data || []) {
    const seg = b.segment_id === RESEND_SEGMENT_ID ? "this segment" : `segment ${b.segment_id}`;
    console.log(`  ${b.sent_at || b.created_at}  ${b.status.padEnd(9)}  ${seg}  ${b.name}`);
  }

  if (BROADCAST_ID) {
    const { status, body } = await get(`/broadcasts/${BROADCAST_ID}`);
    console.log(`broadcast ${BROADCAST_ID}: ${status}`, JSON.stringify({ status: body.status, sent_at: body.sent_at, subject: body.subject, segment_id: body.segment_id, from: body.from }));
  }
}

main().catch((err) => {
  console.error("[diagnose] FAILED:", err.message);
  process.exit(1);
});
