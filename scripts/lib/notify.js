/** Pure helpers behind scripts/notify-new-models.js — no I/O, so they run
 *  under `node --test` without git, network or secrets. */

/** Ids present in `after` and absent from `before`, in `after` order. This is
 *  the site's own definition of "a model was added": a new id in models.json. */
function newModelIds(before, after) {
  const seen = new Set(before.map((m) => m.id));
  return after.filter((m) => !seen.has(m.id)).map((m) => m.id);
}

/** GitHub sends an all-zero `before` sha on branch creation; a rewritten
 *  history can leave one that no longer exists. Neither is a diff base. */
function isUsableSha(sha) {
  return typeof sha === "string" && sha.length > 0 && !/^0+$/.test(sha);
}

const TIER_LABELS = { flagship: "Flagship", balanced: "Balanced", fast: "Fast" };

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** One email per push: every added model, in models.json order. Inline styles
 *  only — email clients strip <style>. Names and strengths are data, so they
 *  are escaped; the unsubscribe placeholder is substituted by Resend per
 *  recipient and must appear verbatim. */
function buildEmail(models, companies, siteUrl) {
  const companyName = (id) => companies.find((c) => c.id === id)?.name ?? id;
  const subject = "NEW model release: " + models.map((m) => m.name).join(", ");

  const blocks = models.map((m) => {
    const url = `${siteUrl}/models/${m.id}`;
    const meta = [companyName(m.company), TIER_LABELS[m.tier] ?? m.tier, `released ${m.releaseDate}`].join(" · ");
    const restricted = m.availability !== "general";
    const teaser = m.strengths?.[0] ?? "";
    return {
      html: `
        <div style="padding:16px 0;border-bottom:1px solid #e5e7eb">
          <a href="${escapeHtml(url)}" style="font-size:18px;font-weight:600;color:#1d4ed8;text-decoration:none">${escapeHtml(m.name)}</a>
          <div style="margin-top:4px;font-size:13px;color:#6b7280">${escapeHtml(meta)}</div>
          ${restricted ? `<div style="margin-top:4px;font-size:13px;color:#b45309">Restricted access — not generally available yet.</div>` : ""}
          ${teaser ? `<div style="margin-top:8px;font-size:14px;color:#111827">${escapeHtml(teaser)}</div>` : ""}
        </div>`,
      text: [
        m.name,
        meta,
        restricted ? "Restricted access — not generally available yet." : null,
        teaser || null,
        url,
      ].filter(Boolean).join("\n"),
    };
  });

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:24px">
    <h1 style="margin:0 0 4px;font-size:20px">${escapeHtml(subject)}</h1>
    <p style="margin:0 0 8px;font-size:13px;color:#6b7280">${models.length === 1 ? "A new model" : `${models.length} new models`} just landed on Wait Which Model?</p>
    ${blocks.map((b) => b.html).join("")}
    <p style="margin:20px 0 0;font-size:14px"><a href="${escapeHtml(siteUrl)}" style="color:#1d4ed8">See every model →</a></p>
    <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">You're getting this because you subscribed at waitwhichmodel.fyi. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#9ca3af">Unsubscribe</a>.</p>
  </div>
</body></html>`;

  const text = [
    subject,
    "",
    ...blocks.map((b) => b.text + "\n"),
    `See every model: ${siteUrl}`,
    "",
    "You're getting this because you subscribed at waitwhichmodel.fyi.",
    "Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}",
  ].join("\n");

  return { subject, html, text };
}

module.exports = { newModelIds, isUsableSha, buildEmail, escapeHtml, TIER_LABELS };
