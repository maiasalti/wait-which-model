/**
 * Which jobs the daily sweep runs, and whether it may run at all. Pulled out of
 * daily-sweep.sh so the schedule is tested rather than eyeballed.
 * Cadence: protocols/DAILY_SWEEP_PROTOCOL.md.
 */

// Each directory is scanned once a week (spec 2026-10-09). World models joined
// later and share Wednesday, the one weekday with no stats or news job.
const ROTATION = {
  1: ["image-models"],
  2: ["video-models"],
  3: ["agents", "world-models"],
  4: ["harnesses"],
  5: ["features"],
};

// A directory's job switches on in the stage that ships its protocol and data.
const ENABLED_DIRECTORY_JOBS = ["image-models", "video-models", "world-models", "harnesses", "agents", "features"];

function jobsFor(dow, enabled) {
  if (dow < 1 || dow > 5) return [];
  const jobs = ["health", "models"];
  if (dow === 2 || dow === 4) jobs.push("stats");
  if (dow === 1) jobs.push("news");
  for (const dir of ROTATION[dow]) if (enabled.includes(dir)) jobs.push(dir);
  return jobs;
}

/** The sweep checks out its own branch and later restores the starting one.
 *  Started from a working branch, it took over that session's edits
 *  (2026-10-01), so it only ever starts from main. */
function branchGuard(branch) {
  return branch === "main" ? null : `checkout is on ${branch}, not on main — refusing to switch branches under someone's work`;
}

if (require.main === module) {
  const [cmd, arg] = process.argv.slice(2);
  if (cmd === "jobs") console.log(jobsFor(Number(arg), ENABLED_DIRECTORY_JOBS).join(" "));
  else if (cmd === "guard") {
    const reason = branchGuard(arg);
    if (reason) { console.log(reason); process.exit(3); }
  } else { console.error("usage: sweep-jobs.js jobs <dow> | guard <branch>"); process.exit(2); }
}

module.exports = { ROTATION, ENABLED_DIRECTORY_JOBS, jobsFor, branchGuard };
