/**
 * Editor localStorage helpers with transparent gzip compression.
 *
 * A1 page definitions are large, repetitive JSON — gzip typically shrinks them
 * 5–10×, multiplying the effective localStorage capacity. Compression is
 * detected on read via the gzip magic bytes (0x1f 0x8b), which plain JSON never
 * starts with, so previously-stored uncompressed values keep working.
 */
import { gzipSync, gunzipSync, strToU8, strFromU8 } from 'fflate';

// Tiny values aren't worth the gzip header/overhead — store them as-is.
const COMPRESS_THRESHOLD = 256;

// When restoring from an import we reload the page; this lets the importer turn
// off the editor's history auto-flush first, so the open page's stale in-memory
// state can't overwrite the freshly-imported content during the reload.
let historyFlushSuppressed = false;
export function suppressHistoryFlush(): void { historyFlushSuppressed = true; }
export function isHistoryFlushSuppressed(): boolean { return historyFlushSuppressed; }

function bytesToBinaryString(bytes: Uint8Array): string {
  let out = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    out += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return out;
}

function binaryStringToBytes(str: string): Uint8Array {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i += 1) bytes[i] = str.charCodeAt(i) & 0xff;
  return bytes;
}

/** gzip-compress a string for storage (returns the original below the size
 *  threshold or on any failure). */
export function compress(value: string): string {
  if (value.length < COMPRESS_THRESHOLD) return value;
  try {
    return bytesToBinaryString(gzipSync(strToU8(value)));
  } catch {
    return value;
  }
}

/** Inverse of compress(). Passes uncompressed/legacy values through unchanged. */
export function decompress(stored: string | null): string | null {
  if (stored == null) return null;
  // gzip magic number.
  if (stored.charCodeAt(0) === 0x1f && stored.charCodeAt(1) === 0x8b) {
    try {
      return strFromU8(gunzipSync(binaryStringToBytes(stored)));
    } catch {
      return null;
    }
  }
  return stored;
}

/** Read and transparently decompress a localStorage value. */
export function readStored(key: string): string | null {
  try {
    return decompress(localStorage.getItem(key));
  } catch {
    return null;
  }
}

/** Reclaim space by trimming each page's edit history down to its most recent
 *  entries. Last resort when a write hits the quota. */
export function pruneEditorHistoryStorage(maxEntries = 10): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const k = localStorage.key(i);
    if (k && k.startsWith('a1-editor-history-')) keys.push(k);
  }
  for (const key of keys) {
    try {
      const raw = readStored(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { entries: unknown[]; index: number };
      if (!parsed?.entries?.length) continue;
      const idx = typeof parsed.index === 'number' ? parsed.index : parsed.entries.length - 1;
      const start = Math.max(0, idx - (maxEntries - 1));
      const entries = parsed.entries.slice(start, idx + 1);
      localStorage.setItem(key, compress(JSON.stringify({ entries, index: entries.length - 1 })));
    } catch { /* ignore */ }
  }
}

// ── Change notification (for cloud sync) ──────────────────────────────────────
type StorageWriteListener = (key: string) => void;
const writeListeners = new Set<StorageWriteListener>();
let notifySuspended = false;

/** Subscribe to successful localStorage writes — used to trigger a debounced
 *  cloud push. Returns an unsubscribe function. */
export function onStorageWrite(listener: StorageWriteListener): () => void {
  writeListeners.add(listener);
  return () => { writeListeners.delete(listener); };
}

/** Suspend write notifications. Wrap a bulk import (e.g. a cloud pull) so its
 *  writes don't immediately echo back out as a push. */
export function suspendStorageNotify(suspend: boolean): void {
  notifySuspended = suspend;
}

function notifyWrite(key: string): void {
  if (notifySuspended) return;
  for (const fn of writeListeners) {
    try { fn(key); } catch { /* a listener error must not break persistence */ }
  }
}

/** Compress + write to localStorage, freeing space and retrying once on a quota
 *  error. Returns true on success, false if it still cannot fit. */
export function writeStored(key: string, value: string): boolean {
  const payload = compress(value);
  try {
    localStorage.setItem(key, payload);
    notifyWrite(key);
    return true;
  } catch {
    pruneEditorHistoryStorage();
    try {
      localStorage.setItem(key, payload);
      notifyWrite(key);
      return true;
    } catch {
      return false;
    }
  }
}
