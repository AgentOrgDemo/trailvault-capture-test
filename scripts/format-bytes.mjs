import { pathToFileURL } from 'node:url';

const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const bytesPerUnit = 1024n;
const decimalDigits = /^[0-9]+$/;

export function formatBytes(input) {
  const valid = (typeof input === 'bigint' && input >= 0n)
    || (typeof input === 'number' && Number.isSafeInteger(input) && input >= 0)
    || (typeof input === 'string' && decimalDigits.test(input));
  if (!valid) {
    throw new TypeError('Expected a nonnegative whole byte count.');
  }

  const bytes = BigInt(input);
  let unit = 0;
  let scale = 1n;
  while (unit < units.length - 1 && bytes >= scale * bytesPerUnit) {
    scale *= bytesPerUnit;
    unit += 1;
  }

  let tenths = (bytes * 10n + scale / 2n) / scale;
  if (unit < units.length - 1 && tenths === bytesPerUnit * 10n) {
    unit += 1;
    tenths = 10n;
  }

  const fraction = tenths % 10n;
  return `${tenths / 10n}${fraction === 0n ? '' : `.${fraction}`} ${units[unit]}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !decimalDigits.test(args[0])) {
    console.error('Usage: node scripts/format-bytes.mjs <nonnegative whole bytes>');
    process.exitCode = 1;
  } else {
    console.log(formatBytes(args[0]));
  }
}
