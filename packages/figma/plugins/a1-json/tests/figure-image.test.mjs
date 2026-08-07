import assert from 'node:assert/strict';
import test from 'node:test';
import { a1ImageIdFromRef, publicA1ImageUrl } from '../src/pure/figure-image.js';

const publicBaseUrl = 'https://pszmkbfvyjkifbyututo.supabase.co/storage/v1/object/public/images/shared';

test('resolves the reported A1 Figure image to its public cloud asset', () => {
  assert.equal(a1ImageIdFromRef('a1img://img_msas4e319gypyu'), 'img_msas4e319gypyu');
  assert.equal(
    publicA1ImageUrl('a1img://img_msas4e319gypyu', publicBaseUrl),
    `${publicBaseUrl}/img_msas4e319gypyu`,
  );
});

test('does not resolve malformed or non-A1 image sources', () => {
  assert.equal(publicA1ImageUrl('https://example.com/image.png', publicBaseUrl), '');
  assert.equal(publicA1ImageUrl('a1img://../private', publicBaseUrl), '');
  assert.equal(publicA1ImageUrl('a1img://img_valid', ''), '');
});
