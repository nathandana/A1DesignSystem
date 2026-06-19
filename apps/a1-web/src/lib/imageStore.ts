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
 *
 * A backend exposes raw persistence only; downscaling, the object-URL cache, ref
 * (`a1img://`) helpers, and change subscription stay in `imageLibrary.ts`.
 */
import type { ImageMeta } from './imageLibrary';

interface ImageRecordInput extends ImageMeta {
  blob: Blob;
}

export interface ImageBackend {
  kind: 'idb' | 'netlify';
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

// ── Selection ──────────────────────────────────────────────────────────────────

let backendPromise: Promise<ImageBackend> | null = null;

/** Pick the backend once: Netlify Blobs if the function answers, else IndexedDB. */
export function getBackend(): Promise<ImageBackend> {
  if (backendPromise) return backendPromise;
  backendPromise = (async () => {
    try {
      const res = await fetch(`${FN}?op=ping`, { method: 'GET' });
      // Verify it's actually the function and not a SPA index.html fallback
      // (which plain `vite dev` serves with a 200 for unknown paths).
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json().catch(() => null);
        if (data && data.ok) return netlifyBackend;
      }
    } catch {
      /* function not available — fall back */
    }
    return idbBackend;
  })();
  return backendPromise;
}
