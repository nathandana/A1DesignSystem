/**
 * Local image library — upload images, keep them in the browser, and reference
 * them from Figures by a stable id.
 *
 * Storage: persistence is delegated to a pluggable backend (`imageStore.ts`) —
 * **IndexedDB** by default, or **Netlify Blobs** (via a Netlify Function) when
 * that endpoint is available (prod, or local `netlify dev`). This module keeps
 * the cross-backend concerns: downscaling on upload, the synchronous object-URL
 * cache, the `a1img://` reference scheme, and change subscription.
 *
 * Referencing: a Figure stores `a1img://<id>` as its `src`. At render time the
 * editor resolves that to a usable URL (an `object:` URL for IndexedDB, or the
 * Netlify Function's blob URL) via `resolveSrc` + `ImageLibraryContext`. Keeping
 * the page JSON to a tiny id (not an inline data URL) means an uploaded image can
 * be reused across many figures without duplicating bytes.
 */
import { getBackend, localBackend } from './imageStore';

/** The src scheme used to reference a library image from a Figure. */
export const IMAGE_REF_SCHEME = 'a1img://';

// 1×1 transparent GIF — shown while a referenced image is still hydrating
// (avoids an empty `src` that browsers treat as a re-request).
const BLANK_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const MAX_DIMENSION = 2000;
// Reserved metadata marker: kept in `categories` so all existing image backends
// persist it without a schema change, but filtered from the visible library list.
const TICKET_ATTACHMENT_CATEGORY = '__a1_internal_ticket_attachment';

/** A freeform crop rectangle as fractions (0–1) of the natural image. */
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A default crop stored on a library image, applied when it's used in a Figure. */
export interface ImageCrop {
  cropRect: CropRect | null;
  cropRatio: string;
}

export interface ImageMeta {
  id: string;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  /** Date added (ms). */
  createdAt: number;
  /** Date last modified (ms) — name, categories, restriction, or crop. */
  updatedAt: number;
  /** Optional default crop — Figures using this image start from it (overridable). */
  crop?: ImageCrop;
  /** Project ids this image is restricted to. Empty = available to every project. */
  projectIds: string[];
  /** User-defined category tags. */
  categories: string[];
}

interface AddImageOptions {
  hiddenFromLibrary?: boolean;
  /** Used only by trusted local bridge imports so the JSON reference stays stable. */
  id?: string;
}

/** A short-lived, local-only asset attached to a Figma Playground handoff. */
export interface FigmaBridgeImageAsset {
  id: string;
  name: string;
  type: string;
  dataBase64: string;
}

export const FIGMA_BRIDGE_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif']);
export const FIGMA_BRIDGE_MAX_IMAGE_BYTES = 4_000_000;

function uid(): string {
  return `img_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

// ── URL cache (synchronous resolution for the render path) ─────────────────────
//
// Resolving `a1img://id` during render must be synchronous, so we keep a Map of
// id → URL hydrated once (`ensureLoaded`): an `object:` URL for the IndexedDB
// backend, or the Netlify Function's blob URL for the Netlify backend. Until it's
// populated a referenced image resolves to the blank pixel; the provider bumps a
// version on load so the tree re-renders with real URLs.

const urlCache = new Map<string, string>();
const blobUrls = new Set<string>(); // which cached URLs we created and must revoke
let loadPromise: Promise<void> | null = null;

/** Resolve and cache the URL for one image (object URL, or backend direct URL). */
async function cacheUrl(id: string): Promise<string | undefined> {
  const backend = await getBackend();
  const direct = backend.directUrl(id);
  if (direct) {
    urlCache.set(id, direct);
    return direct;
  }
  const blob = await backend.getBlob(id);
  if (!blob) return undefined;
  const prev = urlCache.get(id);
  if (prev && blobUrls.has(prev)) URL.revokeObjectURL(prev);
  const url = URL.createObjectURL(blob);
  urlCache.set(id, url);
  blobUrls.add(url);
  return url;
}

/** Cache a URL for an image we already hold the blob for (fresh upload). */
function cacheUrlFromBlob(id: string, blob: Blob, direct: string | null): string {
  if (direct) { urlCache.set(id, direct); return direct; }
  const prev = urlCache.get(id);
  if (prev && blobUrls.has(prev)) URL.revokeObjectURL(prev);
  const url = URL.createObjectURL(blob);
  urlCache.set(id, url);
  blobUrls.add(url);
  return url;
}

/** Populate the URL cache from the active backend. Resolves once. */
export function ensureLoaded(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      const backend = await getBackend();
      const metas = await backend.list();
      await Promise.all(metas.map((m) => (urlCache.has(m.id) ? undefined : cacheUrl(m.id))));
    } catch {
      /* backend unavailable — library is simply empty */
    }
  })();
  return loadPromise;
}

/** The cached URL for a stored image, or undefined if not yet loaded. */
export function getObjectUrl(id: string): string | undefined {
  return urlCache.get(id);
}

/** Drop the URL cache and reload from the active backend. Called on sign-in/out
 *  (after `setSupabaseImageUser`) so referenced images re-resolve against the
 *  newly-selected backend instead of stale object URLs. */
export function resetImageCache(): void {
  for (const url of blobUrls) URL.revokeObjectURL(url);
  blobUrls.clear();
  urlCache.clear();
  loadPromise = null;
  notify();
  void ensureLoaded().then(notify);
}

// ── Reference helpers ──────────────────────────────────────────────────────────

export function toImageRef(id: string): string {
  return `${IMAGE_REF_SCHEME}${id}`;
}

export function isImageRef(src: unknown): src is string {
  return typeof src === 'string' && src.startsWith(IMAGE_REF_SCHEME);
}

export function idFromRef(src: string): string {
  return src.slice(IMAGE_REF_SCHEME.length);
}

/** Resolve a Figure `src`: library refs become object URLs (or the blank pixel
 *  until hydrated); any other src passes through unchanged. */
export function resolveSrc(src: string): string {
  if (!isImageRef(src)) return src;
  return getObjectUrl(idFromRef(src)) ?? BLANK_PIXEL;
}

// ── Change subscription (so views + the provider re-render on edits) ───────────

type Listener = () => void;
const listeners = new Set<Listener>();
export function subscribeLibrary(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notify(): void {
  for (const fn of listeners) fn();
}

// ── Downscale on upload ────────────────────────────────────────────────────────

async function processFile(file: File): Promise<{ blob: Blob; width: number; height: number; type: string }> {
  // Vector and exotic formats can't be drawn reliably — store them as-is.
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return { blob: file, width: 0, height: 0, type: file.type };
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return { blob: file, width: 0, height: 0, type: file.type };
  }
  const { width, height } = bitmap;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  // Small images that don't need scaling keep their original bytes/format.
  if (scale === 1 && file.size < 1_500_000) {
    bitmap.close?.();
    return { blob: file, width, height, type: file.type };
  }
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close?.();
    return { blob: file, width, height, type: file.type };
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  // Preserve transparency for PNG/WebP; re-encode everything else as JPEG.
  const keepAlpha = file.type === 'image/png' || file.type === 'image/webp';
  const outType = keepAlpha ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob((b) => res(b), outType, keepAlpha ? undefined : 0.85),
  );
  return { blob: blob ?? file, width: w, height: h, type: blob ? outType : file.type };
}

// ── Public CRUD ────────────────────────────────────────────────────────────────

/** Fill in defaults for fields that legacy records (saved before these existed)
 *  may not have. */
function normalize(meta: ImageMeta): ImageMeta {
  return {
    ...meta,
    updatedAt: meta.updatedAt ?? meta.createdAt,
    projectIds: meta.projectIds ?? [],
    categories: meta.categories ?? [],
  };
}

function isVisibleLibraryImage(meta: ImageMeta): boolean {
  return !(meta.categories ?? []).includes(TICKET_ATTACHMENT_CATEGORY);
}

/** Add an uploaded file to the library; returns its metadata. */
export async function addImage(file: File, options: AddImageOptions = {}): Promise<ImageMeta> {
  const { blob, width, height, type } = await processFile(file);
  const now = Date.now();
  const requestedId = typeof options.id === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(options.id)
    ? options.id
    : null;
  const meta: ImageMeta = {
    id: requestedId ?? uid(),
    name: file.name.replace(/\.[^.]+$/, '') || 'Image',
    type,
    size: blob.size,
    width,
    height,
    createdAt: now,
    updatedAt: now,
    projectIds: [],
    categories: options.hiddenFromLibrary ? [TICKET_ATTACHMENT_CATEGORY] : [],
  };
  const backend = await getBackend();
  await backend.save(meta, blob);
  cacheUrlFromBlob(meta.id, blob, backend.directUrl(meta.id));
  notify();
  return meta;
}

/** Read an image's metadata and bytes for a local Figma handoff. */
export async function getImageBlob(id: string): Promise<{ meta: ImageMeta; blob: Blob } | null> {
  const backend = await getBackend();
  const [meta, blob] = await Promise.all([backend.getMeta(id), backend.getBlob(id)]);
  return meta && blob ? { meta: normalize(meta), blob } : null;
}

function bridgeBase64ToBlob(dataBase64: string, type: string): Blob {
  const binary = atob(dataBase64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type });
}

/**
 * Persist image bytes received through the loopback Figma bridge. This is kept
 * separate from JSON parsing: the JSON carries only an `a1img://<id>` ref.
 */
export async function importFigmaBridgeImages(assets: FigmaBridgeImageAsset[] | undefined): Promise<number> {
  if (!Array.isArray(assets) || assets.length === 0) return 0;
  let imported = 0;
  for (const asset of assets) {
    if (!asset || typeof asset.id !== 'string' || !/^[A-Za-z0-9_-]{1,120}$/.test(asset.id)) continue;
    if (!FIGMA_BRIDGE_IMAGE_TYPES.has(asset.type) || typeof asset.dataBase64 !== 'string') continue;
    try {
      const blob = bridgeBase64ToBlob(asset.dataBase64, asset.type);
      if (blob.size === 0 || blob.size > FIGMA_BRIDGE_MAX_IMAGE_BYTES) continue;
      const extension = asset.type === 'image/jpeg' ? 'jpg' : asset.type.split('/')[1];
      await addImage(new File([blob], `${asset.name || 'Figure image'}.${extension}`, { type: asset.type }), {
        id: asset.id,
      });
      imported += 1;
    } catch {
      // A malformed local handoff must not break the otherwise valid JSON preview.
    }
  }
  return imported;
}

/** All library images, newest first (metadata only — no blobs). */
export async function listImages(): Promise<ImageMeta[]> {
  try {
    const backend = await getBackend();
    return (await backend.list())
      .map(normalize)
      .filter(isVisibleLibraryImage)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function deleteImage(id: string): Promise<void> {
  const backend = await getBackend();
  await backend.remove(id);
  const url = urlCache.get(id);
  if (url && blobUrls.has(url)) { URL.revokeObjectURL(url); blobUrls.delete(url); }
  urlCache.delete(id);
  notify();
}

/** Update editable metadata (name, categories, project restriction). */
export async function updateImage(
  id: string,
  patch: { name?: string; categories?: string[]; projectIds?: string[] },
): Promise<void> {
  const backend = await getBackend();
  const meta = await backend.getMeta(id);
  if (!meta) return;
  const next = normalize(meta);
  if (patch.name !== undefined) next.name = patch.name.trim() || next.name;
  if (patch.categories !== undefined) next.categories = patch.categories;
  if (patch.projectIds !== undefined) next.projectIds = patch.projectIds;
  next.updatedAt = Date.now();
  await backend.saveMeta(next);
  notify();
}

/** Store (or clear) the default crop for a library image. */
export async function setImageCrop(id: string, crop: ImageCrop | null): Promise<void> {
  const backend = await getBackend();
  const meta = await backend.getMeta(id);
  if (!meta) return;
  const next = normalize(meta);
  if (crop && crop.cropRect) next.crop = crop;
  else delete next.crop;
  next.updatedAt = Date.now();
  await backend.saveMeta(next);
  notify();
}

/** True when an image is visible to the given project (unrestricted, or listed). */
export function imageAvailableToProject(meta: ImageMeta, projectId: string | null | undefined): boolean {
  if (!meta.projectIds || meta.projectIds.length === 0) return true;
  if (!projectId) return true; // no project context (e.g. standalone detail page)
  return meta.projectIds.includes(projectId);
}

/** Bulk delete (used by the table view's row selection). */
export async function deleteImages(ids: string[]): Promise<void> {
  for (const id of ids) await deleteImage(id);
}

/** Copy every image held in the browser's local IndexedDB store up to the active
 *  backend (Supabase, when signed in). Used by the Account dialog's "Import local
 *  data". No-op unless the active backend is the cloud one. Returns how many
 *  images were uploaded. */
export async function migrateLocalImagesToCloud(): Promise<number> {
  const target = await getBackend();
  if (target.kind !== 'supabase') return 0;
  const local = localBackend();
  const metas = await local.list();
  let uploaded = 0;
  for (const meta of metas) {
    const blob = await local.getBlob(meta.id);
    if (!blob) continue;
    await target.save(normalize(meta), blob);
    uploaded += 1;
  }
  if (uploaded) {
    loadPromise = null;
    await ensureLoaded();
    notify();
  }
  return uploaded;
}

/** Human-readable byte size for the library UI. */
export function formatBytes(bytes: number): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
