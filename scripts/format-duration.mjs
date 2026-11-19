#!/usr/bin/env node

export function formatDuration(seconds) {
  if (!Number.isSafeInteger(seconds) || seconds < 0) {
    throw new TypeError("seconds must be a whole non-negative integer");
  }

  if (seconds === 0) {
    return "0s";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds}s`);
  }

  return parts.join(" ");
}

function main(args) {
  const usage = "Usage: node scripts/format-duration.mjs <whole non-negative seconds>";

  if (args.length === 1 && args[0] === "--help") {
    console.log(usage);
    return;
  }

  if (args.length !== 1 || !/^(0|[1-9]\d*)$/.test(args[0])) {
    console.error(usage);
    process.exitCode = 1;
    return;
  }

  const seconds = Number(args[0]);
  if (!Number.isSafeInteger(seconds)) {
    console.error("Seconds must be within JavaScript's safe integer range.");
    process.exitCode = 1;
    return;
  }

  console.log(formatDuration(seconds));
}

main(process.argv.slice(2));
