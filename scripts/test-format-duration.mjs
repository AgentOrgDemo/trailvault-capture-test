import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("./format-duration.mjs", import.meta.url));

function run(...args) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
  });
}

test("formats zero seconds", () => {
  const result = run("0");

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "0s\n");
  assert.equal(result.stderr, "");
});

test("formats minutes and remaining seconds", () => {
  const result = run("65");

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "1m 5s\n");
  assert.equal(result.stderr, "");
});

test("formats hours, minutes, and seconds", () => {
  const result = run("3665");

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "1h 1m 5s\n");
  assert.equal(result.stderr, "");
});

test("prints help successfully", () => {
  const result = run("--help");

  assert.equal(result.status, 0);
  assert.equal(
    result.stdout,
    "Usage: node scripts/format-duration.mjs <whole non-negative seconds>\n",
  );
  assert.equal(result.stderr, "");
});

test("rejects invalid input", () => {
  for (const args of [[], ["-1"], ["1.5"], ["seconds"], ["1", "2"]]) {
    const result = run(...args);

    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /^Usage:/);
  }
});
