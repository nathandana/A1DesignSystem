import { PreviewError, previewService, readPreviewRequest } from '../../lib/previews.mjs';

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
  'referrer-policy': 'no-referrer',
  'x-robots-tag': 'noindex, nofollow',
};
const json = (value, status = 200) => new Response(value === null ? null : JSON.stringify(value), { status, headers });

export function createPreviewHandler(service = previewService) {
  return async request => {
    if (request.method === 'OPTIONS') return json(null, 204);
    const path = new URL(request.url).pathname.replace(/^\/\.netlify\/functions\/previews/, '/previews');
    try {
      if (request.method === 'POST' && /^\/previews\/?$/.test(path)) {
        const result = await service.create(await readPreviewRequest(request));
        return json(result, result.valid ? 201 : 422);
      }
      if (request.method === 'GET' && path.startsWith('/previews/')) return json(await service.read(path.slice('/previews/'.length)));
      return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
    } catch (error) {
      return json({ error: error instanceof PreviewError ? error.code : 'PREVIEW_UNAVAILABLE' }, error instanceof PreviewError ? error.status : 503);
    }
  };
}
export default createPreviewHandler();
export const config = {
  path: ['/previews', '/previews/:id'],
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 60 },
};
