import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./format-bytes.mjs', import.meta.url));

function run(...args) {
  return spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
}

function expectSize(input, expected) {
  const result = run(input);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, `${expected}\n`);
}

test('formats zero bytes', () => {
  expectSize('0', '0 B');
});

test('uses binary units and omits trailing decimal zeros', () => {
  expectSize('1023', '1023 B');
  expectSize('1024', '1 KiB');
  expectSize('1536', '1.5 KiB');
  expectSize('1048576', '1 MiB');
  expectSize('1180591620717411303424', '1 ZiB');
});

test('rounds to one decimal place and promotes at a unit boundary', () => {
  expectSize('1279', '1.2 KiB');
  expectSize('1280', '1.3 KiB');
  expectSize('1048575', '1 MiB');
});

test('rejects missing, extra, and invalid input', () => {
  for (const args of [[], ['1', '2'], [''], ['-1'], ['1.5'], ['1e3'], ['NaN'], ['1\n']]) {
    const result = run(...args);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /^Usage:/);
  }
});
