/**
 * Image library storage — Netlify Function over Netlify Blobs.
 *
 * The browser image library (`src/lib/imageStore.ts` → NetlifyBackend) calls this
 * for upload / list / metadata / blob / update / delete. Blobs live in the
 * `a1-images` store, each entry holding the image bytes plus its `ImageMeta` in
 * the blob's metadata. Works in prod and under `netlify dev` (which persists
 * Blobs on the local filesystem, so they survive clearing browser storage).
 *
 * Endpoints (all under /.netlify/functions/images):
 *   GET    ?op=ping            → 200 (capability probe)
 *   GET    ?op=list            → ImageMeta[]
 *   GET    ?op=meta&id=…       → ImageMeta
 *   GET    ?op=blob&id=…       → image bytes (Content-Type from meta)
 *   POST   ?op=upload  {meta, dataBase64}
 *   PUT    ?op=update  {meta}
 *   DELETE ?op=delete&id=…
 */
import { getStore } from '@netlify/blobs';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

export default async (req) => {
  const store = getStore('a1-images');
  const url = new URL(req.url);
  const op = url.searchParams.get('op');
  const id = url.searchParams.get('id');

  try {
    if (op === 'ping') return json({ ok: true });

    if (op === 'list') {
      const { blobs } = await store.list();
      const metas = await Promise.all(
        blobs.map(async ({ key }) => {
          const { metadata } = await store.getWithMetadata(key, { type: 'stream' });
          return metadata?.meta ?? null;
        }),
      );
      return json(metas.filter(Boolean));
    }

    if (op === 'meta') {
      if (!id) return json({ error: 'id required' }, 400);
      const { metadata } = await store.getMetadata(id);
      return metadata?.meta ? json(metadata.meta) : json({ error: 'not found' }, 404);
    }

    if (op === 'blob') {
      if (!id) return json({ error: 'id required' }, 400);
      const res = await store.getWithMetadata(id, { type: 'arrayBuffer' });
      if (!res) return json({ error: 'not found' }, 404);
      const type = res.metadata?.meta?.type || 'application/octet-stream';
      return new Response(res.data, {
        status: 200,
        headers: { 'content-type': type, 'cache-control': 'private, max-age=31536000' },
      });
    }

    if (op === 'upload' && req.method === 'POST') {
      const { meta, dataBase64 } = await req.json();
      if (!meta?.id || !dataBase64) return json({ error: 'meta.id and dataBase64 required' }, 400);
      const bytes = Uint8Array.from(atob(dataBase64), (c) => c.charCodeAt(0));
      await store.set(meta.id, bytes, { metadata: { meta } });
      return json(meta);
    }

    if (op === 'update' && req.method === 'PUT') {
      const { meta } = await req.json();
      if (!meta?.id) return json({ error: 'meta.id required' }, 400);
      // Re-set with the existing bytes so only metadata changes.
      const existing = await store.get(meta.id, { type: 'arrayBuffer' });
      if (existing == null) return json({ error: 'not found' }, 404);
      await store.set(meta.id, existing, { metadata: { meta } });
      return json(meta);
    }

    if (op === 'delete' && (req.method === 'DELETE' || req.method === 'POST')) {
      if (!id) return json({ error: 'id required' }, 400);
      await store.delete(id);
      return json({ ok: true });
    }

    return json({ error: 'unknown op' }, 400);
  } catch (err) {
    return json({ error: String(err?.message || err) }, 500);
  }
};
