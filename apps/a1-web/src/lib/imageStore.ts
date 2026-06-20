/**
 * Image-storage backend abstraction.
 *
 * The image library (`imageLibrary.ts`) persists through one of these backends so
 * the rest of the app never cares where bytes live:
 *
 * - **IndexedDB** (default): blobs in the browser. Works with plain `vite` and
 *   offline. Used as the local fallback/cache.
 * - **Netlify Blobs**: blobs in Netlify's object store via a Netlify Function
 *   (`/.netlify/functions/images`). Works in prod *and* locally under
 *   `netlify dev`, which persists Blobs on the filesystem (`.netlify/blobs`) — so
 *   they survive clearing browser storage. Selected automatically when the
 *   function endpoint responds.
 * - **Supabase**: bytes in a Storage bucket (`images`, one folder per user) and
 *   metadata in the `user_images` table. Selected automatically whenever Supabase
 *   is configured and a user is signed in (set via `setSupabaseImageUser`), so an
 *   uploaded image follows the account across devices. The bucket is public-read
 *   with unguessable UUID paths, so `directUrl` is a plain synchronous CDN URL.
 *
 * A backend exposes raw persistence only; downscaling, the object-URL cache, ref
 * (`a1img://`) helpers, and change subscription stay in `imageLibrary.ts`.
 */
import type { ImageMeta } from './imageLibrary';
import { supabase, supabaseConfigured } from './supabase.js';

interface ImageRecordInput extends ImageMeta {
  blob: Blob;
}

export interface ImageBackend {
  kind: 'idb' | 'netlify' | 'supabase';
  /** Persist a new image (metadata + bytes). */
  save(meta: ImageMeta, blob: Blob): Promise<void>;
  /** Re-persist metadata only (rename, categories, restriction, crop). */
  saveMeta(meta: ImageMeta): Promise<void>;
  /** All image metadata (no blobs). */
  list(): Promise<ImageMeta[]>;
  /** Metadata for one image (no blob). */
  getMeta(id: string): Promise<ImageMeta | null>;
  /** Fetch the bytes for one image. */
  getBlob(id: string): Promise<Blob | null>;
  remove(id: string): Promise<void>;
  /** A directly-usable URL for an image, if the backend serves one (Netlify).
   *  IndexedDB returns null — the caller creates an object URL from the blob. */
  directUrl(id: string): string | null;
}

// ── IndexedDB backend ──────────────────────────────────────────────────────────

const DB_NAME = 'a1-image-library';
const STORE = 'images';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;
function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function store(db: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
  return db.transaction(STORE, mode).objectStore(STORE);
}

const idbBackend: ImageBackend = {
  kind: 'idb',
  async save(meta, blob) {
    const db = await openDb();
    const record: ImageRecordInput = { ...meta, blob };
    await reqToPromise(store(db, 'readwrite').put(record));
  },
  async saveMeta(meta) {
    const db = await openDb();
    const s = store(db, 'readwrite');
    const rec = await reqToPromise(s.get(meta.id) as IDBRequest<ImageRecordInput | undefined>);
    if (!rec) return;
    await reqToPromise(s.put({ ...rec, ...meta }));
  },
  async list() {
    const db = await openDb();
    const records = await reqToPromise(store(db, 'readonly').getAll() as IDBRequest<ImageRecordInput[]>);
    return records.map(({ blob, ...meta }) => meta); // eslint-disable-line @typescript-eslint/no-unused-vars
  },
  async getMeta(id) {
    const db = await openDb();
    const rec = await reqToPromise(store(db, 'readonly').get(id) as IDBRequest<ImageRecordInput | undefined>);
    if (!rec) return null;
    const { blob, ...meta } = rec; // eslint-disable-line @typescript-eslint/no-unused-vars
    return meta;
  },
  async getBlob(id) {
    const db = await openDb();
    const rec = await reqToPromise(store(db, 'readonly').get(id) as IDBRequest<ImageRecordInput | undefined>);
    return rec?.blob ?? null;
  },
  async remove(id) {
    const db = await openDb();
    await reqToPromise(store(db, 'readwrite').delete(id));
  },
  directUrl() {
    return null;
  },
};

// ── Netlify Blobs backend (via Netlify Function) ───────────────────────────────

const FN = '/.netlify/functions/images';

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

const netlifyBackend: ImageBackend = {
  kind: 'netlify',
  async save(meta, blob) {
    const dataBase64 = await blobToBase64(blob);
    const res = await fetch(`${FN}?op=upload`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ meta, dataBase64 }),
    });
    if (!res.ok) throw new Error('upload failed');
  },
  async saveMeta(meta) {
    const res = await fetch(`${FN}?op=update`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ meta }),
    });
    if (!res.ok) throw new Error('update failed');
  },
  async list() {
    const res = await fetch(`${FN}?op=list`);
    if (!res.ok) return [];
    return (await res.json()) as ImageMeta[];
  },
  async getMeta(id) {
    const res = await fetch(`${FN}?op=meta&id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return (await res.json()) as ImageMeta;
  },
  async getBlob(id) {
    const res = await fetch(`${FN}?op=blob&id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return res.blob();
  },
  async remove(id) {
    await fetch(`${FN}?op=delete&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  directUrl(id) {
    return `${FN}?op=blob&id=${encodeURIComponent(id)}`;
  },
};

// ── Supabase backend (Storage bucket + user_images table) ──────────────────────

const BUCKET = 'images';

// The signed-in user whose images we read/write. Set by `setSupabaseImageUser`
// on auth change; `null` (signed out) falls the selection back to Netlify/IDB.
let supabaseUserId: string | null = null;

/** Storage path for an image: one folder per user so RLS scopes by owner. */
function imagePath(id: string): string {
  return `${supabaseUserId}/${id}`;
}

function rowFromMeta(meta: ImageMeta) {
  return {
    user_id: supabaseUserId,
    id: meta.id,
    name: meta.name,
    type: meta.type,
    size: meta.size,
    width: meta.width,
    height: meta.height,
    created_at: meta.createdAt,
    updated_at: meta.updatedAt,
    crop: meta.crop ?? null,
    project_ids: meta.projectIds ?? [],
    categories: meta.categories ?? [],
  };
}

interface ImageRow {
  id: string;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  created_at: number;
  updated_at: number;
  crop: ImageMeta['crop'] | null;
  project_ids: string[];
  categories: string[];
}

function metaFromRow(row: ImageRow): ImageMeta {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    size: row.size,
    width: row.width,
    height: row.height,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
    crop: row.crop ?? undefined,
    projectIds: row.project_ids ?? [],
    categories: row.categories ?? [],
  };
}

const supabaseBackend: ImageBackend = {
  kind: 'supabase',
  async save(meta, blob) {
    const up = await supabase.storage
      .from(BUCKET)
      .upload(imagePath(meta.id), blob, { contentType: meta.type, upsert: true });
    if (up.error) throw up.error;
    const row = await supabase.from('user_images').upsert(rowFromMeta(meta));
    if (row.error) throw row.error;
  },
  async saveMeta(meta) {
    const { error } = await supabase.from('user_images').upsert(rowFromMeta(meta));
    if (error) throw error;
  },
  async list() {
    const { data, error } = await supabase
      .from('user_images')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data as ImageRow[]).map(metaFromRow);
  },
  async getMeta(id) {
    const { data, error } = await supabase.from('user_images').select('*').eq('id', id).maybeSingle();
    if (error || !data) return null;
    return metaFromRow(data as ImageRow);
  },
  async getBlob(id) {
    const { data, error } = await supabase.storage.from(BUCKET).download(imagePath(id));
    if (error || !data) return null;
    return data;
  },
  async remove(id) {
    await supabase.storage.from(BUCKET).remove([imagePath(id)]);
    await supabase.from('user_images').delete().eq('id', id);
  },
  directUrl(id) {
    return supabase.storage.from(BUCKET).getPublicUrl(imagePath(id)).data.publicUrl;
  },
};

/** Read the active backend's kind synchronously (null until selected). */
export function activeBackendKind(): ImageBackend['kind'] | null {
  return resolvedKind;
}

// ── Selection ──────────────────────────────────────────────────────────────────

let backendPromise: Promise<ImageBackend> | null = null;
let resolvedKind: ImageBackend['kind'] | null = null;

/** Point the image library at a signed-in user's Supabase storage (or `null` to
 *  fall back to Netlify/IndexedDB). Resets the memoized backend so the next
 *  `getBackend()` re-selects; `imageLibrary.resetImageCache()` rebuilds the URL
 *  cache to match. */
export function setSupabaseImageUser(userId: string | null): void {
  const next = userId || null;
  if (next === supabaseUserId) return;
  supabaseUserId = next;
  backendPromise = null;
  resolvedKind = null;
}

/** Pick the backend: Supabase when signed in, else Netlify Blobs if the function
 *  answers, else IndexedDB. Memoized until `setSupabaseImageUser` changes it. */
export function getBackend(): Promise<ImageBackend> {
  if (backendPromise) return backendPromise;
  backendPromise = (async () => {
    if (supabaseConfigured && supabaseUserId) {
      resolvedKind = 'supabase';
      return supabaseBackend;
    }
    try {
      const res = await fetch(`${FN}?op=ping`, { method: 'GET' });
      // Verify it's actually the function and not a SPA index.html fallback
      // (which plain `vite dev` serves with a 200 for unknown paths).
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json().catch(() => null);
        if (data && data.ok) { resolvedKind = 'netlify'; return netlifyBackend; }
      }
    } catch {
      /* function not available — fall back */
    }
    resolvedKind = 'idb';
    return idbBackend;
  })();
  return backendPromise;
}

/** The IndexedDB backend directly — used to migrate local images to the cloud. */
export function localBackend(): ImageBackend {
  return idbBackend;
}
