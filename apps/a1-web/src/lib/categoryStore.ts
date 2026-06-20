/**
 * Image category store — categories are first-class objects (not just strings on
 * an image), so they can be browsed, renamed, and deleted from one place (the
 * Image Gallery's category editor) and offered as Autocomplete suggestions when
 * tagging an image.
 *
 * Images still reference categories by **name** (`ImageMeta.categories: string[]`);
 * this store is the canonical list plus the management surface. Kept in
 * localStorage (categories are tiny) with a change subscription, mirroring the
 * image library's pattern.
 */

const KEY = 'a1-image-categories';

export interface Category {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

function uid(): string {
  return `cat_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

type Listener = () => void;
const listeners = new Set<Listener>();
export function subscribeCategories(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notify(): void {
  for (const fn of listeners) fn();
}

function read(): Category[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Category[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list: Category[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
  notify();
}

/** All categories, alphabetical. */
export function listCategories(): Category[] {
  return read().slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function categoryNames(): string[] {
  return listCategories().map((c) => c.name);
}

/** Add a category by name (case-insensitive dedupe). Returns the existing or new
 *  record. */
export function addCategory(name: string): Category {
  const trimmed = name.trim();
  const list = read();
  const existing = list.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (existing || !trimmed) return existing ?? { id: '', name: trimmed, createdAt: 0, updatedAt: 0 };
  const now = Date.now();
  const cat: Category = { id: uid(), name: trimmed, createdAt: now, updatedAt: now };
  write([...list, cat]);
  return cat;
}

/** Ensure each name exists as a category (used to seed from existing image tags). */
export function ensureCategories(names: string[]): void {
  const list = read();
  const have = new Set(list.map((c) => c.name.toLowerCase()));
  const now = Date.now();
  const additions = names
    .map((n) => n.trim())
    .filter((n) => n && !have.has(n.toLowerCase()))
    .filter((n, i, arr) => arr.findIndex((x) => x.toLowerCase() === n.toLowerCase()) === i)
    .map((n) => ({ id: uid(), name: n, createdAt: now, updatedAt: now }));
  if (additions.length) write([...list, ...additions]);
}

export function renameCategory(id: string, name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const list = read();
  const cat = list.find((c) => c.id === id);
  if (!cat) return null;
  const oldName = cat.name;
  cat.name = trimmed;
  cat.updatedAt = Date.now();
  write(list);
  return oldName;
}

export function deleteCategory(id: string): string | null {
  const list = read();
  const cat = list.find((c) => c.id === id);
  if (!cat) return null;
  write(list.filter((c) => c.id !== id));
  return cat.name;
}
