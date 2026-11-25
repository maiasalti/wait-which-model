import { test } from "node:test";
import assert from "node:assert/strict";
import { mostReportedBenchmark } from "./filter.ts";

test("mostReportedBenchmark picks the key scored by the most recent models", () => {
  const b = (o: Record<string, number>) => o as never;
  const ms = [
    { releaseDate: "2026-11-20", benchmarks: b({ terminalBench: 80, gpqaDiamond: 90 }) },
    { releaseDate: "2026-10-01", benchmarks: b({ terminalBench: 70 }) },
    { releaseDate: "2026-09-01", benchmarks: b({ gpqaDiamond: 85 }) },
    // Older than three months before the newest release, so not counted.
    { releaseDate: "2026-05-01", benchmarks: b({ gpqaDiamond: 1, sweBench: 1 }) },
    { releaseDate: "2026-04-01", benchmarks: b({ sweBench: 1 }) },
  ];
  // gpqaDiamond and terminalBench tie on 2 recent scores; the earlier key wins.
  assert.equal(mostReportedBenchmark(ms, ["sweBench", "gpqaDiamond", "terminalBench"]), "gpqaDiamond");
  assert.equal(mostReportedBenchmark(ms, ["terminalBench", "gpqaDiamond"]), "terminalBench");
  // sweBench only has old scores, so it loses even listed first.
  assert.equal(mostReportedBenchmark(ms, ["sweBench", "terminalBench"]), "terminalBench");
  assert.equal(mostReportedBenchmark([], ["hle"]), "hle");
});
