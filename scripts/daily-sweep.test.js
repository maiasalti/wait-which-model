// Runs the real daily-sweep.sh in --dry-run mode against a throwaway git repo
// (SWEEP_REPO), to pin the guards that protect someone's working branch.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const SCRIPT = path.join(__dirname, "daily-sweep.sh");
const HELPER = path.join(__dirname, "lib", "sweep-jobs.js");

function repo({ branch = "main", brokenHelper = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sweep-test-"));
  const git = (...a) => execFileSync("git", a, { cwd: dir, stdio: "pipe" });
  git("init", "-q", "-b", "main");
  fs.mkdirSync(path.join(dir, "scripts", "lib"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "scripts", "lib", "sweep-jobs.js"),
    brokenHelper ? "throw new Error('broken by a bad edit');\n" : fs.readFileSync(HELPER)
  );
  fs.writeFileSync(path.join(dir, ".gitignore"), "logs/\n");
  git("add", "-A");
  git("-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "init");
  if (branch !== "main") git("switch", "-qc", branch);
  return dir;
}

const dryRun = (dir) =>
  spawnSync("bash", [SCRIPT, "--dry-run"], { env: { ...process.env, SWEEP_REPO: dir }, encoding: "utf8" });
const head = (dir) => execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: dir, encoding: "utf8" }).trim();

test("on main it selects today's jobs", () => {
  const dir = repo();
  assert.match(dryRun(dir).stdout, /jobs for today/);
});

test("on a working branch it refuses and stays on that branch", () => {
  const dir = repo({ branch: "data/some-work" });
  const r = dryRun(dir);
  assert.match(r.stdout, /not on main/);
  assert.doesNotMatch(r.stdout, /jobs for today/);
  assert.equal(head(dir), "data/some-work");
});

test("a broken helper stops the run instead of letting it past the guard", () => {
  for (const branch of ["data/some-work", "main"]) {
    const dir = repo({ branch, brokenHelper: true });
    const r = dryRun(dir);
    assert.doesNotMatch(r.stdout, /jobs for today/, `proceeded on ${branch}`);
    assert.notEqual(r.status, 0, `exit 0 on ${branch}`);
    assert.equal(head(dir), branch);
  }
});
