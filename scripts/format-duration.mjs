#!/usr/bin/env node

const [secondsInput, ...extraArguments] = process.argv.slice(2);

if (
  extraArguments.length > 0 ||
  secondsInput === undefined ||
  !/^(?:0|[1-9]\d*)$/.test(secondsInput)
) {
  console.error("Usage: node scripts/format-duration.mjs <whole non-negative seconds>");
  process.exitCode = 1;
} else {
  let remainingSeconds = BigInt(secondsInput);
  const hours = remainingSeconds / 3600n;
  remainingSeconds %= 3600n;
  const minutes = remainingSeconds / 60n;
  const seconds = remainingSeconds % 60n;
  const parts = [];

  if (hours > 0n) parts.push(`${hours}h`);
  if (minutes > 0n) parts.push(`${minutes}m`);
  if (seconds > 0n || parts.length === 0) parts.push(`${seconds}s`);

  console.log(parts.join(" "));
}
