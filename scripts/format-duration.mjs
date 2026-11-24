#!/usr/bin/env node

import { pathToFileURL } from "node:url";

export function formatDuration(seconds) {
  if (!Number.isSafeInteger(seconds) || seconds < 0) {
    throw new TypeError("seconds must be a nonnegative whole number");
  }

  if (seconds === 0) {
    return "0s";
  }

  const units = [
    ["d", 86_400],
    ["h", 3_600],
    ["m", 60],
    ["s", 1],
  ];
  const parts = [];
  let remaining = seconds;

  for (const [suffix, size] of units) {
    const value = Math.floor(remaining / size);
    if (value > 0) {
      parts.push(`${value}${suffix}`);
      remaining %= size;
    }
  }

  return parts.join(" ");
}

function main(args) {
  if (args.length !== 1 || !/^(0|[1-9]\d*)$/.test(args[0])) {
    throw new TypeError("expected one nonnegative whole number of seconds");
  }

  const seconds = Number(args[0]);
  if (!Number.isSafeInteger(seconds)) {
    throw new TypeError("seconds must not exceed Number.MAX_SAFE_INTEGER");
  }

  console.log(formatDuration(seconds));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}
