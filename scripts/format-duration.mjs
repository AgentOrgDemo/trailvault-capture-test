#!/usr/bin/env node

import { pathToFileURL } from "node:url";

const UNITS = [
  ["d", 86_400],
  ["h", 3_600],
  ["m", 60],
  ["s", 1],
];

export function formatDuration(seconds) {
  if (!Number.isSafeInteger(seconds) || seconds < 0) {
    throw new TypeError("seconds must be a nonnegative whole number");
  }

  if (seconds === 0) {
    return "0s";
  }

  const parts = [];
  let remaining = seconds;

  for (const [suffix, unitSeconds] of UNITS) {
    const value = Math.floor(remaining / unitSeconds);
    if (value > 0) {
      parts.push(`${value}${suffix}`);
      remaining %= unitSeconds;
    }
  }

  return parts.join(" ");
}

function main(args) {
  if (args.length !== 1 || !/^\d+$/.test(args[0])) {
    throw new TypeError("usage: node scripts/format-duration.mjs <nonnegative whole seconds>");
  }

  const seconds = Number(args[0]);
  console.log(formatDuration(seconds));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
