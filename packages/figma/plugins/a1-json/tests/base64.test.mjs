import assert from 'node:assert/strict';
import test from 'node:test';
import { base64ToBytes, bytesToBase64 } from '../src/pure/base64.js';

test('round-trips image bytes without browser base64 globals', () => {
  const bytes = Uint8Array.from({ length: 62_735 }, (_, index) => index % 256);
  const encoded = bytesToBase64(bytes);

  assert.equal(encoded, Buffer.from(bytes).toString('base64'));
  assert.deepEqual(base64ToBytes(encoded), bytes);
});

test('decodes padded and unpadded PNG header data', () => {
  const pngHeader = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const encoded = Buffer.from(pngHeader).toString('base64');

  assert.deepEqual(base64ToBytes(encoded), pngHeader);
  assert.deepEqual(base64ToBytes(encoded.replace(/=+$/, '')), pngHeader);
});

test('rejects malformed base64 image data', () => {
  assert.throws(() => base64ToBytes('not an image!'), /Invalid base64 image data/);
  assert.throws(() => base64ToBytes('abcde'), /Invalid base64 image data/);
});
