import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./format-bytes.mjs', import.meta.url));

function run(...args) {
  return spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
}

const examples = [
  ['0', '0 B'],
  ['1023', '1023 B'],
  ['1024', '1 KiB'],
  ['1536', '1.5 KiB'],
  ['1280', '1.3 KiB'],
  ['1048524', '1023.9 KiB'],
  ['1048525', '1 MiB'],
  ['1269372110595360633441484', '1 YiB'],
  ['1269372110595360633441485', '1.1 YiB'],
  ['1237940039285380274899124224', '1024 YiB'],
];

test('formats byte counts with binary units and exact rounding', () => {
  for (const [input, expected] of examples) {
    const result = run(input);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, `${expected}\n`, input);
  }
});

test('rejects missing, extra, negative, and malformed arguments', () => {
  for (const args of [[], ['1', '2'], [''], ['-1'], ['+1'], ['1.5'], ['1e3'], ['0xff'], [' 1'], ['1\n']]) {
    const result = run(...args);
    assert.equal(result.status, 1, JSON.stringify(args));
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /nonnegative whole byte count/);
  }
});
