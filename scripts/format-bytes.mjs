const args = process.argv.slice(2);
const si = args[0] === '--si';
const [input, ...extraArgs] = si ? args.slice(1) : args;
const units = si
  ? ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  : ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const base = si ? 1000n : 1024n;
const usage = 'Usage: node scripts/format-bytes.mjs [--si] <non-negative integer>';

if (args.length === 1 && (input === '--help' || input === '-h')) {
  console.log(usage);
  console.log('       node scripts/format-bytes.mjs --help | -h');
} else if (input === undefined || /[^0-9]/.test(input) || input === '' || extraArgs.length) {
  console.error(usage);
  process.exitCode = 1;
} else {
  const bytes = BigInt(input);
  let unit = 0;
  let divisor = 1n;

  // Promote values that round to the unit base.
  while (unit < units.length - 1 && bytes * 10n + divisor / 2n >= base * 10n * divisor) {
    unit += 1;
    divisor *= base;
  }

  const tenths = (bytes * 10n + divisor / 2n) / divisor;
  const fraction = tenths % 10n;
  const size = fraction === 0n ? `${tenths / 10n}` : `${tenths / 10n}.${fraction}`;
  console.log(`${size} ${units[unit]}`);
}
