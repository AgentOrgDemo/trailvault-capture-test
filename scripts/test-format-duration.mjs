import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { formatDuration } from "./format-duration.mjs";

const script = fileURLToPath(new URL("./format-duration.mjs", import.meta.url));

test("formats nonnegative whole seconds with zero units omitted", () => {
  assert.equal(formatDuration(0), "0s");
  assert.equal(formatDuration(65), "1m 5s");
  assert.equal(formatDuration(3_600), "1h");
  assert.equal(formatDuration(90_061), "1d 1h 1m 1s");
});

test("rejects invalid values", () => {
  for (const value of [-1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(
      () => formatDuration(value),
      /seconds must be a nonnegative whole number/,
    );
  }
});

test("CLI prints the formatted duration", () => {
  const result = spawnSync(process.execPath, [script, "65"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "1m 5s\n");
  assert.equal(result.stderr, "");
});

test("CLI rejects negative and malformed input", () => {
  for (const value of ["-1", "1.5", "seconds"]) {
    const result = spawnSync(process.execPath, [script, value], {
      encoding: "utf8",
    });

    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /nonnegative whole seconds/);
  }
});
