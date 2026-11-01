import { createPreviewService } from '../../packages/mcp-server/lib/previews.mjs';

export function previewFixture(options = {}) {
  const records = new Map();
  const store = {
    async setJSON(id, value) { records.set(id, structuredClone(value)); },
    async get(id) { return structuredClone(records.get(id) ?? null); },
    async delete(id) { records.delete(id); },
    async *list() { yield { blobs: [...records.keys()].map(key => ({ key })) }; },
  };
  return { records, service: createPreviewService({ getStore: () => store, ...options }) };
}
