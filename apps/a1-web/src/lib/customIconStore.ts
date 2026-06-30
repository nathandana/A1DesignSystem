import { VEHICLE_PROJECT_ID } from '../projects/sampleVehicles';

export interface CustomIconRecord {
  id: string;
  name: string;
  svg: string;
  paths: string[];
  codepoint: number;
  projectIds: string[];
  createdAt: number;
  updatedAt: number;
}

export type CustomIconInput = Pick<CustomIconRecord, 'name' | 'svg' | 'paths' | 'projectIds'>;

const DB_NAME = 'a1-custom-icons';
const STORE_NAME = 'icons';
const DB_VERSION = 1;
const FIRST_CODEPOINT = 0xe001;
const ENGINE_SEED_ID = 'custom-icon-engine';
const ENGINE_SEED_FLAG = 'a1-custom-icon-engine-seeded';
const ENGINE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>engine</title><path d="M7,4V6H10V8H7L5,10V13H3V10H1V18H3V15H5V18H8L10,20H18V16H20V19H23V9H20V12H18V8H12V6H15V4H7Z" /></svg>';
const ENGINE_PATH = 'M7,4V6H10V8H7L5,10V13H3V10H1V18H3V15H5V18H8L10,20H18V16H20V19H23V9H20V12H18V8H12V6H15V4H7Z';
const listeners = new Set<() => void>();

let dbPromise: Promise<IDBDatabase> | null = null;
let seedPromise: Promise<void> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function withStore<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const request = action(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function notify(): void {
  for (const listener of listeners) listener();
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

async function seedEngineIcon(): Promise<void> {
  if (localStorage.getItem(ENGINE_SEED_FLAG) === '1') return;
  const existing = await withStore<CustomIconRecord | undefined>('readonly', (store) => store.get(ENGINE_SEED_ID));
  if (existing) {
    localStorage.setItem(ENGINE_SEED_FLAG, '1');
    return;
  }
  const now = Date.now();
  await withStore<IDBValidKey>('readwrite', (store) => store.add({
    id: ENGINE_SEED_ID,
    name: 'engine',
    svg: ENGINE_SVG,
    paths: [ENGINE_PATH],
    codepoint: FIRST_CODEPOINT,
    projectIds: [VEHICLE_PROJECT_ID],
    createdAt: now,
    updatedAt: now,
  } satisfies CustomIconRecord));
  localStorage.setItem(ENGINE_SEED_FLAG, '1');
}

function ensureEngineSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedEngineIcon().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

export function subscribeCustomIconStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function listCustomIcons(): Promise<CustomIconRecord[]> {
  await ensureEngineSeed();
  const icons = await withStore<CustomIconRecord[]>('readonly', (store) => store.getAll());
  return icons.sort((a, b) => a.name.localeCompare(b.name));
}

export function customIconMatchesProject(icon: CustomIconRecord, projectId?: string | null): boolean {
  return icon.projectIds.length === 0 || Boolean(projectId && icon.projectIds.includes(projectId));
}

export async function addCustomIcon(input: CustomIconInput): Promise<CustomIconRecord> {
  const icons = await listCustomIcons();
  const name = normalizeName(input.name);
  if (icons.some((icon) => icon.name === name)) {
    throw new Error(`A custom icon named "${name}" already exists.`);
  }
  const now = Date.now();
  const record: CustomIconRecord = {
    ...input,
    id: `custom-icon-${crypto.randomUUID()}`,
    name,
    projectIds: [...new Set(input.projectIds)],
    codepoint: Math.max(FIRST_CODEPOINT - 1, ...icons.map((icon) => icon.codepoint)) + 1,
    createdAt: now,
    updatedAt: now,
  };
  await withStore<IDBValidKey>('readwrite', (store) => store.add(record));
  notify();
  return record;
}

export async function updateCustomIcon(
  id: string,
  patch: Partial<Pick<CustomIconRecord, 'name' | 'projectIds'>>,
): Promise<CustomIconRecord> {
  const icons = await listCustomIcons();
  const current = icons.find((icon) => icon.id === id);
  if (!current) throw new Error('The custom icon no longer exists.');
  const name = patch.name == null ? current.name : normalizeName(patch.name);
  if (icons.some((icon) => icon.id !== id && icon.name === name)) {
    throw new Error(`A custom icon named "${name}" already exists.`);
  }
  const next = {
    ...current,
    ...patch,
    name,
    projectIds: patch.projectIds ? [...new Set(patch.projectIds)] : current.projectIds,
    updatedAt: Date.now(),
  };
  await withStore<IDBValidKey>('readwrite', (store) => store.put(next));
  notify();
  return next;
}

export async function deleteCustomIcon(id: string): Promise<void> {
  await withStore<undefined>('readwrite', (store) => store.delete(id));
  notify();
}
