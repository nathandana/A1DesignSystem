/**
 * Stable hidden row ids (A1-94). Every dataset row carries a `__id` — a stable,
 * unique identifier that is NOT a displayed column (the DataGrid only shows
 * `dataset.columns`). It addresses a row in a detail-page URL (`?item=<__id>`) and
 * is bindable as `{{ key.__id }}`. Ids are assigned at the store chokepoint
 * (create + update) so samples, imports, and editor edits all get them.
 */
import type { DataRow } from './types';

/** The reserved row-id key. Hidden from the grid; persisted with the row. */
export const ROW_ID_KEY = '__id';

let seq = 0;
/** A short unique row id. */
export function genRowId(): string {
  seq += 1;
  return `i${Date.now().toString(36)}${seq.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Assign a `__id` to any row missing one (preserves existing ids). */
export function ensureRowIds(rows: DataRow[]): DataRow[] {
  if (!Array.isArray(rows)) return [];
  let changed = false;
  const next = rows.map((r) => {
    if (r && typeof r === 'object' && r[ROW_ID_KEY]) return r;
    changed = true;
    return { ...r, [ROW_ID_KEY]: genRowId() };
  });
  return changed ? next : rows;
}

/** True when any row lacks a `__id`. */
export function rowsNeedIds(rows: DataRow[]): boolean {
  return Array.isArray(rows) && rows.some((r) => !(r && typeof r === 'object' && r[ROW_ID_KEY]));
}

/** The index of the row whose `__id` matches, or -1. */
export function findRowIndexById(rows: DataRow[], id: string | null | undefined): number {
  if (!id || !Array.isArray(rows)) return -1;
  return rows.findIndex((r) => r && r[ROW_ID_KEY] === id);
}
