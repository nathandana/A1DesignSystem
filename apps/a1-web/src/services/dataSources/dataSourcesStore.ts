/**
 * Data sources — store facade. Picks a backend (Supabase when configured + signed in,
 * else local) and exposes the dataset reads/writes. Mirrors services/backlog/backlogStore.ts:
 * dormant until `setDataSourceUser` is called, guarded so it degrades gracefully.
 */
import { supabaseConfigured } from '../../lib/supabase.js';
import type { DataSourceBackend } from './backend';
import { createLocalBackend } from './localBackend';
import { createSupabaseBackend } from './supabaseBackend';
import type {
  CreateDataSourceInput, DataSource, DataSourceUser, UpdateDataSourcePatch,
} from './types';
import { ensureRowIds } from './rowIds';

let currentUser: DataSourceUser | null = null;
let backend: DataSourceBackend | null = null;
let backendKey = '';

/** Set the signed-in user tagged on new datasets (called on auth change). */
export function setDataSourceUser(user: { id: string; email: string } | null): void {
  currentUser = user ? { id: user.id, email: user.email } : null;
  backend = null; // rebuild against the new user
}

/** True when datasets are shared/multi-user (vs. the local single-browser fallback). */
export function isCloudDataSources(): boolean {
  return !!(supabaseConfigured && currentUser);
}

function getBackend(): DataSourceBackend {
  const key = isCloudDataSources() ? `cloud:${currentUser!.id}` : 'local';
  if (!backend || backendKey !== key) {
    backend = isCloudDataSources()
      ? createSupabaseBackend(() => currentUser)
      : createLocalBackend(() => currentUser);
    backendKey = key;
  }
  return backend;
}

// ── Reads ─────────────────────────────────────────────────────────────────────

export function listDataSources(): Promise<DataSource[]> { return getBackend().list(); }
export function subscribe(cb: () => void): () => void { return getBackend().subscribe(cb); }

// ── Writes ──────────────────────────────────────────────────────────────────

export function createDataSource(input: CreateDataSourceInput): Promise<DataSource> {
  return getBackend().create({
    name: input.name.trim() || 'Untitled dataset',
    description: input.description?.trim() || null,
    columns: input.columns ?? [],
    rows: ensureRowIds(input.rows ?? []),
    projectIds: input.projectIds ?? [],
    createdBy: currentUser?.id ?? null,
    createdByEmail: currentUser?.email ?? null,
  });
}

export function updateDataSource(id: string, patch: UpdateDataSourcePatch): Promise<DataSource | null> {
  // Ensure new rows (added in the editor or imported) get a stable hidden id.
  const next = patch.rows ? { ...patch, rows: ensureRowIds(patch.rows) } : patch;
  return getBackend().update(id, next);
}

export function removeDataSource(id: string): Promise<void> {
  return getBackend().remove(id);
}
