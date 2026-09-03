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

module.exports = { newModelIds, isUsableSha };
