#!/usr/bin/env node
/**
 * Data integrity for every file in data/. Replaces the one-liner that used to
 * live in AGENTS.md (which the daily sweep grepped out and eval'd). Pure
 * checkData() is unit-tested; the CLI is what protocols and the sweep run.
 *
 *   node scripts/integrity.js     → "OK …" and exit 0, or one error per line and exit 1
 */
const fs = require("fs");
const path = require("path");

const ALLOWED_FEATURE_COMPANIES = ["anthropic", "openai", "google", "xai", "meta"];

// Directory file key → the `type` news refs use for it.
const DIRECTORY_FILES = {
  "image-models": "image-model",
  "video-models": "video-model",
  harnesses: "harness",
  agents: "agent",
  features: "feature",
};

function checkData({ models, news, companies, reigns, directory = {} }) {
  const errors = [];
  const err = (s) => errors.push(s);
  const companyIds = new Set(companies.map((c) => c.id));
  const modelIds = new Set(models.map((m) => m.id));

  for (const c of companies)
    if (c.color == null && c.notable !== false) err(`notable company ${c.id} has no colour`);

  const seen = new Set();
  for (const m of models) {
    if (seen.has(m.id)) err(`duplicate model id ${m.id}`);
    seen.add(m.id);
    if (!companyIds.has(m.company)) err(`unknown company ${m.company} on ${m.id}`);
    if (m.predecessorId) {
      if (m.predecessorId === m.id) err(`self-predecessor ${m.id}`);
      else if (!modelIds.has(m.predecessorId)) err(`unknown predecessorId ${m.predecessorId} on ${m.id}`);
    }
    if (!m.openWeights && m.license) err(`closed model with license ${m.id}`);
    if (m.retirementDate && m.retirementDate < m.releaseDate) err(`retirement before release ${m.id}`);
  }
  const byId = new Map(models.map((m) => [m.id, m]));
  // Same walk as the old one-liner: follow predecessors until one repeats.
  for (const m of models) {
    const chain = new Set();
    let cur = m.predecessorId;
    while (cur) {
      if (chain.has(cur)) { err(`predecessor cycle at ${m.id}`); break; }
      chain.add(cur);
      cur = byId.get(cur)?.predecessorId;
    }
  }

  for (const r of reigns) if (!modelIds.has(r.modelId)) err(`unknown reign modelId ${r.modelId}`);
  const tiers = {};
  for (const r of reigns) (tiers[r.tier] ||= []).push(r);
  for (const [tier, list] of Object.entries(tiers)) {
    list.sort((a, b) => a.start.localeCompare(b.start));
    for (let i = 1; i < list.length; i++)
      if (list[i - 1].end === null || list[i - 1].end > list[i].start) err(`overlapping reigns in tier ${tier}`);
  }

  const entryIds = {};
  for (const [file, entries] of Object.entries(directory)) {
    const ids = new Set();
    for (const e of entries) {
      if (ids.has(e.id)) err(`duplicate ${file} id ${e.id}`);
      ids.add(e.id);
      if (!companyIds.has(e.company)) err(`${file} ${e.id}: unknown company ${e.company}`);
      if (file === "features" && !ALLOWED_FEATURE_COMPANIES.includes(e.company))
        err(`${file} ${e.id}: company ${e.company} is not one of ${ALLOWED_FEATURE_COMPANIES.join(", ")}`);
      const refs = [
        ...(e.modelIds ?? []),
        ...(e.underlyingModels ?? []),
        ...(Array.isArray(e.supportedModels) ? e.supportedModels : []),
        ...(e.scores ?? []).map((s) => s.modelId).filter(Boolean),
      ];
      for (const id of refs) if (!modelIds.has(id)) err(`${file} ${e.id}: unknown model ${id}`);
      if (e.openWeights === false && e.license) err(`${file} ${e.id}: closed entry with license`);
    }
    entryIds[DIRECTORY_FILES[file]] = ids;
  }

  const newsIds = new Set();
  for (const n of news) {
    if (newsIds.has(n.id)) err(`duplicate news id ${n.id}`);
    newsIds.add(n.id);
    for (const id of n.modelIds ?? []) if (!modelIds.has(id)) err(`unknown modelId ${id} in news ${n.id}`);
    for (const ref of n.refs ?? []) {
      if (!Object.values(DIRECTORY_FILES).includes(ref.type)) err(`news ${n.id}: unknown ref type ${ref.type}`);
      else if (!entryIds[ref.type]?.has(ref.id)) err(`news ${n.id}: unknown ${ref.type} ${ref.id}`);
    }
  }
  return errors;
}

function loadData(dir) {
  const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const directory = {};
  for (const file of Object.keys(DIRECTORY_FILES)) {
    const p = path.join(dir, `${file}.json`);
    if (fs.existsSync(p)) directory[file] = read(`${file}.json`);
  }
  return {
    models: read("models.json"),
    news: read("news.json"),
    companies: read("companies.json"),
    reigns: read("frontier-reigns.json"),
    directory,
  };
}

function main() {
  const data = loadData(path.join(__dirname, "..", "data"));
  const errors = checkData(data);
  if (errors.length) {
    for (const e of errors) console.error(e);
    process.exit(1);
  }
  const extra = Object.entries(data.directory).map(([k, v]) => `${v.length} ${k}`).join(", ");
  console.log(`OK ${data.models.length} models, ${data.news.length} news${extra ? ", " + extra : ""}`);
}

if (require.main === module) main();

module.exports = { checkData, loadData, ALLOWED_FEATURE_COMPANIES };
