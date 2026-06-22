/**
 * Data sources — Supabase backend. Maps the snake_case `data_sources` table to the
 * camelCase `DataSource` records. Shared + attributed like backlog/edit_history:
 * every signed-in user reads/writes every row. Live updates come from a Realtime
 * channel with an 8s poll fallback. Mirrors services/backlog/supabaseBackend.ts.
 */
import { supabase } from '../../lib/supabase.js';
import type { CreateDataSourceRow, DataSourceBackend } from './backend';
import type { DataSource, DataSourceUser, UpdateDataSourcePatch } from './types';

// Select all columns so an optional / just-added column never breaks reads on a DB
// that hasn't run that migration yet — `fromRow` defaults any missing field.
const COLS = '*';

/* eslint-disable @typescript-eslint/no-explicit-any */
function fromRow(r: any): DataSource {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    columns: r.columns ?? [],
    rows: r.rows ?? [],
    projectIds: r.project_ids ?? [],
    createdBy: r.created_by ?? null,
    createdByEmail: r.created_by_email ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/** Translate a typed patch to a DB update payload (snake_case). */
function rowFromPatch(patch: UpdateDataSourcePatch): Record<string, unknown> {
  const map: Record<string, string> = {
    name: 'name', description: 'description', columns: 'columns',
    rows: 'rows', projectIds: 'project_ids',
  };
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    const col = map[k];
    if (col) out[col] = v;
  }
  return out;
}

export function createSupabaseBackend(getUser: () => DataSourceUser | null): DataSourceBackend {
  const sb = supabase!; // only constructed when supabaseConfigured

  return {
    async list() {
      const { data, error } = await sb
        .from('data_sources').select(COLS).order('updated_at', { ascending: false });
      if (error) { console.warn('[data-sources] list failed', error); return []; }
      return (data ?? []).map(fromRow);
    },

    async create(row: CreateDataSourceRow) {
      const user = getUser();
      const { data, error } = await sb.from('data_sources').insert({
        name: row.name,
        description: row.description ?? null,
        columns: row.columns ?? [],
        rows: row.rows ?? [],
        project_ids: row.projectIds ?? [],
        created_by: row.createdBy ?? user?.id ?? null,
        created_by_email: row.createdByEmail ?? user?.email ?? null,
      }).select(COLS).single();
      if (error) throw error;
      return fromRow(data);
    },

    async update(id: string, patch: UpdateDataSourcePatch) {
      const { data, error } = await sb
        .from('data_sources').update(rowFromPatch(patch)).eq('id', id).select(COLS).single();
      if (error) { console.warn('[data-sources] update failed', error); return null; }
      return fromRow(data);
    },

    async remove(id: string) {
      const { error } = await sb.from('data_sources').delete().eq('id', id);
      if (error) console.warn('[data-sources] remove failed', error);
    },

    subscribe(cb: () => void) {
      let channel: ReturnType<typeof sb.channel> | null = null;
      let poll: ReturnType<typeof setInterval> | null = null;
      (async () => {
        try {
          const { data } = await sb.auth.getSession();
          if (data?.session?.access_token) sb.realtime.setAuth(data.session.access_token);
        } catch { /* ignore */ }
        channel = sb
          .channel('data_sources_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'data_sources' }, cb)
          .subscribe();
      })();
      poll = setInterval(cb, 8000);
      return () => {
        if (channel) sb.removeChannel(channel);
        if (poll) clearInterval(poll);
      };
    },
  };
}
