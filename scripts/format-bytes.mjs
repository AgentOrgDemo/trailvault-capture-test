const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const base = 1024n;

function formatBytes(bytes) {
  let unit = 0;
  let divisor = 1n;
  while (unit < units.length - 1 && bytes >= divisor * base) {
    divisor *= base;
    unit++;
  }

  let tenths = (bytes * 10n + divisor / 2n) / divisor;
  if (tenths === base * 10n && unit < units.length - 1) {
    tenths = 10n;
    unit++;
  }

  const fraction = tenths % 10n;
  const decimal = fraction === 0n ? '' : `.${fraction}`;
  return `${tenths / 10n}${decimal} ${units[unit]}`;
}

const args = process.argv.slice(2);
const [input] = args;
if (args.length !== 1 || input.length === 0 || /[^0-9]/.test(input)) {
  console.error('Usage: node scripts/format-bytes.mjs <nonnegative whole byte count>');
  process.exitCode = 1;
} else {
  console.log(formatBytes(BigInt(input)));
}
