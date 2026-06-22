/**
 * Data sources — local (offline / signed-out) backend. Gzipped localStorage via the
 * editor storage helpers. Single-browser only; no cross-user sync. Mirrors
 * services/backlog/localBackend.ts so the Data page works without Supabase.
 */
import { readStored, writeStored } from '../../editor/storage';
import type { CreateDataSourceRow, DataSourceBackend } from './backend';
import type { DataSource, DataSourceUser, UpdateDataSourcePatch } from './types';

const KEY = 'a1-data-sources';

const listeners = new Set<() => void>();
function notify() { for (const fn of listeners) { try { fn(); } catch { /* ignore */ } } }

function read(): DataSource[] {
  try {
    const raw = readStored(KEY);
    return raw ? (JSON.parse(raw) as DataSource[]) : [];
  } catch { return []; }
}
function write(value: DataSource[]) { writeStored(KEY, JSON.stringify(value)); }

function uid(): string {
  return `ds_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
function nowIso(): string { return new Date().toISOString(); }

export function createLocalBackend(getUser: () => DataSourceUser | null): DataSourceBackend {
  return {
    async list() {
      return read().sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
    },

    async create(row: CreateDataSourceRow) {
      const items = read();
      const ts = nowIso();
      const user = getUser();
      const item: DataSource = {
        id: uid(),
        name: row.name,
        description: row.description ?? null,
        columns: row.columns ?? [],
        rows: row.rows ?? [],
        projectIds: row.projectIds ?? [],
        createdBy: row.createdBy ?? user?.id ?? null,
        createdByEmail: row.createdByEmail ?? user?.email ?? null,
        createdAt: ts,
        updatedAt: ts,
      };
      write([item, ...items]);
      notify();
      return item;
    },

    async update(id: string, patch: UpdateDataSourcePatch) {
      const items = read();
      let updated: DataSource | null = null;
      const next = items.map((it) => {
        if (it.id !== id) return it;
        updated = { ...it, ...patch, updatedAt: nowIso() };
        return updated;
      });
      if (!updated) return null;
      write(next);
      notify();
      return updated;
    },

    async remove(id: string) {
      write(read().filter((it) => it.id !== id));
      notify();
    },

    subscribe(cb: () => void) {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
  };
}
