import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { formatDuration } from "./format-duration.mjs";

const cliPath = fileURLToPath(new URL("./format-duration.mjs", import.meta.url));

test("formats seconds using nonzero duration units", () => {
  assert.equal(formatDuration(0), "0s");
  assert.equal(formatDuration(65), "1m 5s");
  assert.equal(formatDuration(3_600), "1h");
  assert.equal(formatDuration(90_065), "1d 1h 1m 5s");
});

test("rejects invalid formatter inputs", () => {
  for (const value of [-1, 1.5, "65", Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(
      () => formatDuration(value),
      /seconds must be a nonnegative whole number/,
    );
  }
});

test("prints a formatted duration from the CLI", () => {
  const output = execFileSync(process.execPath, [cliPath, "65"], {
    encoding: "utf8",
  });

  assert.equal(output, "1m 5s\n");
});

test("rejects negative and malformed CLI inputs", () => {
  for (const args of [[], ["-1"], ["1.5"], ["abc"], ["01"], ["1", "2"]]) {
    const result = spawnSync(process.execPath, [cliPath, ...args], {
      encoding: "utf8",
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /^Error: /);
    assert.equal(result.stdout, "");
  }
});
