const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const [input, ...extraArgs] = process.argv.slice(2);
const usage = 'Usage: node scripts/format-bytes.mjs <non-negative integer>';

if (extraArgs.length === 0 && (input === '--help' || input === '-h')) {
  console.log(usage);
  console.log('       node scripts/format-bytes.mjs --help | -h');
} else if (input === undefined || /[^0-9]/.test(input) || input === '' || extraArgs.length) {
  console.error(usage);
  process.exitCode = 1;
} else {
  const bytes = BigInt(input);
  let unit = 0;
  let divisor = 1n;

  // Promote values that round to 1024 in the current unit.
  while (unit < units.length - 1 && bytes * 10n + divisor / 2n >= 10240n * divisor) {
    unit += 1;
    divisor *= 1024n;
  }

  const tenths = (bytes * 10n + divisor / 2n) / divisor;
  const fraction = tenths % 10n;
  const size = fraction === 0n ? `${tenths / 10n}` : `${tenths / 10n}.${fraction}`;
  console.log(`${size} ${units[unit]}`);
}
