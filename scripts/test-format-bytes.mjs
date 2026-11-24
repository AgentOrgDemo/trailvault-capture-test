import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBytes } from './format-bytes.mjs';

test('formats bytes and binary units without trailing zeros', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1023n), '1023 B');
  assert.equal(formatBytes('1024'), '1 KiB');
  assert.equal(formatBytes('1536'), '1.5 KiB');
});

test('rounds to the nearest tenth and promotes at the unit boundary', () => {
  assert.equal(formatBytes(1279), '1.2 KiB');
  assert.equal(formatBytes(1280), '1.3 KiB');
  assert.equal(formatBytes(1048524), '1023.9 KiB');
  assert.equal(formatBytes(1048525), '1 MiB');
});

test('preserves precision at a rounding boundary above the safe integer range', () => {
  const yib = 1024n ** 8n;
  const midpoint = yib * 5n / 4n;
  assert.equal(formatBytes(String(midpoint - 1n)), '1.2 YiB');
  assert.equal(formatBytes(String(midpoint)), '1.3 YiB');
  assert.equal(formatBytes(yib * 1024n), '1024 YiB');
});

test('rejects negative, malformed, and unsafe numeric inputs', () => {
  for (const input of [-1, -1n, '-1', '1.5', '1e3', '0x10', '', ' 1', '1\n', 1.5, Infinity, 2 ** 53, null]) {
    assert.throws(() => formatBytes(input), TypeError);
  }
});
