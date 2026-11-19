import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("./format-duration.mjs", import.meta.url));

function formatDuration(seconds) {
  return execFileSync(process.execPath, [script, seconds], {
    encoding: "utf8",
  }).trim();
}

test("formats zero seconds", () => {
  assert.equal(formatDuration("0"), "0s");
});

test("formats minutes and remaining seconds", () => {
  assert.equal(formatDuration("65"), "1m 5s");
});

test("formats hours, minutes, and seconds", () => {
  assert.equal(formatDuration("3665"), "1h 1m 5s");
});

test("rejects invalid input", () => {
  for (const input of ["-1", "1.5", "seconds"]) {
    const result = spawnSync(process.execPath, [script, input], {
      encoding: "utf8",
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /whole non-negative seconds/);
    assert.equal(result.stdout, "");
  }
});
