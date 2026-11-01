import { randomBytes } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { validateJson } from '../../../system/json-model/validate.js';

import { PREVIEW_TTL_MS, PREVIEW_ID } from '../../../system/json-model/preview-contract.js';
export { PREVIEW_TTL_MS, PREVIEW_ID };
export const MAX_REQUEST_BYTES = 3_000_000;
export const previewStore = () => getStore({ name: `a1-json-previews-v1-${process.env.CONTEXT || 'production'}`, consistency: 'strong' });

export class PreviewError extends Error {
  constructor(code, status) { super(code); this.code = code; this.status = status; }
}

/** Bound transport work before parsing JSON (including chunked requests). */
export async function readPreviewRequest(request) {
  if (Number(request.headers.get('content-length')) > MAX_REQUEST_BYTES) throw new PreviewError('REQUEST_TOO_LARGE', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new PreviewError('INVALID_JSON', 400);
  let size = 0;
  const chunks = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_REQUEST_BYTES) { await reader.cancel(); throw new PreviewError('REQUEST_TOO_LARGE', 413); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new PreviewError('INVALID_JSON', 400); }
}

export function createPreviewService({ getStore: store = previewStore, now = Date.now, appUrl = () => process.env.A1_PREVIEW_APP_URL || 'https://a1design.app' } = {}) {
  return {
    async create(input) {
      const validation = validateJson(input ?? {});
      if (!validation.valid) return validation;
      const document = typeof input.document === 'string' ? JSON.parse(input.document) : input.document;
      if (Buffer.byteLength(JSON.stringify(document)) > 2_000_000) throw new PreviewError('REQUEST_TOO_LARGE', 413);
      const expiry = now() + PREVIEW_TTL_MS;
      const previewId = `${expiry}-${randomBytes(24).toString('hex')}`;
      const expiresAt = new Date(expiry).toISOString();
      const url = new URL(`/preview/${previewId}`, appUrl());
      if (!['https:', 'http:'].includes(url.protocol)) throw new PreviewError('PREVIEW_UNAVAILABLE', 503);
      const snapshot = { kind: input.kind, document, contractVersion: validation.contractVersion, expiresAt };
      try { await store().setJSON(previewId, snapshot); }
      catch { throw new PreviewError('PREVIEW_UNAVAILABLE', 503); }
      return { ...validation, previewId, previewUrl: url.href, expiresAt };
    },
    async read(id) {
      if (!PREVIEW_ID.test(id)) throw new PreviewError('PREVIEW_NOT_FOUND', 404);
      if (Number(id.split('-')[0]) <= now()) throw new PreviewError('PREVIEW_EXPIRED', 410);
      let snapshot;
      try { snapshot = await store().get(id, { type: 'json' }); }
      catch { throw new PreviewError('PREVIEW_UNAVAILABLE', 503); }
      if (!snapshot) throw new PreviewError('PREVIEW_NOT_FOUND', 404);
      if (Date.parse(snapshot.expiresAt) <= now()) throw new PreviewError('PREVIEW_EXPIRED', 410);
      return snapshot;
    },
    async cleanup() {
      const blobs = store();
      let deleted = 0;
      for await (const page of blobs.list({ paginate: true })) {
        const expired = page.blobs.filter(({ key }) => PREVIEW_ID.test(key) && Number(key.split('-')[0]) <= now());
        // Small batches keep scheduled cleanup within the function's resource budget.
        for (let i = 0; i < expired.length; i += 20) {
          await Promise.all(expired.slice(i, i + 20).map(({ key }) => blobs.delete(key)));
          deleted += expired.slice(i, i + 20).length;
        }
      }
      return { deleted };
    },
  };
}

export const previewService = createPreviewService();
