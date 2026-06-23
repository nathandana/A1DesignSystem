/**
 * Data-driven collections (A1-94). A component's array prop (DefinitionList `items`,
 * ChoiceGroup/Select/Autocomplete `options`) can be filled from a dataset instead of
 * literal entries. Three modes:
 *   - `rows`     — one entry per dataset row (mapped columns → output fields).
 *   - `fields`   — one entry per column of the *active* item (label = column name,
 *                  value = cell), for a DefinitionList of "all details".
 *   - `distinct` — one entry per distinct value of a column (auto-growing categories).
 *
 * The binding lives on `node.collections[prop]` (a node field, so configurator
 * round-trips don't clobber it); the renderer expands it into the real array.
 */
import type { DatasetMap, RowContext } from './bindings';
import { pickRepeatIndices } from './repeat';
import type { DataRow } from '../services/dataSources/types';

export type CollectionMode = 'rows' | 'fields' | 'distinct';

export interface CollectionBinding {
  dataset: string;
  mode: CollectionMode;
  /** For `distinct`: the column whose distinct values become entries. */
  column?: string;
  /** Output field key → dataset column key (for `rows` / `distinct`). */
  map?: Record<string, string>;
  limit?: number | null;
  random?: boolean;
}

export interface CollectionTargetField { key: string; label: string }
export interface CollectionTarget {
  /** The array prop this fills. */
  prop: string;
  /** Human label for the prop, e.g. "items". */
  label: string;
  modes: CollectionMode[];
  /** Output fields the user maps from columns (for `rows` / `distinct`). */
  fields: CollectionTargetField[];
}

/** Which component types can be filled from data, and the shape of their array prop. */
export const COLLECTION_TARGETS: Record<string, CollectionTarget> = {
  DefinitionList: { prop: 'items', label: 'items', modes: ['fields', 'rows'], fields: [{ key: 'label', label: 'Label' }, { key: 'value', label: 'Value' }] },
  ChoiceGroup: { prop: 'options', label: 'options', modes: ['distinct', 'rows'], fields: [{ key: 'value', label: 'Value' }, { key: 'label', label: 'Label' }, { key: 'subtext', label: 'Subtext' }] },
  Select: { prop: 'options', label: 'options', modes: ['rows', 'distinct'], fields: [{ key: 'value', label: 'Value' }, { key: 'label', label: 'Label' }] },
  Autocomplete: { prop: 'options', label: 'options', modes: ['rows', 'distinct'], fields: [{ key: 'value', label: 'Value' }, { key: 'label', label: 'Label' }] },
};

export function collectionTargetFor(type: string): CollectionTarget | null {
  return COLLECTION_TARGETS[type] ?? null;
}

function fmt(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function buildEntry(target: CollectionTarget, map: Record<string, string>, row: DataRow): Record<string, unknown> {
  const entry: Record<string, unknown> = {};
  for (const f of target.fields) {
    const col = map[f.key];
    if (col && row[col] !== undefined) entry[f.key] = fmt(row[col]);
  }
  return entry;
}

function applyLimit(arr: unknown[], binding: CollectionBinding, seedKey: string): unknown[] {
  if (!binding.limit && !binding.random) return arr;
  return pickRepeatIndices(arr.length, binding, seedKey).map((i) => arr[i]);
}

/** Expand a collection binding into the array its target component expects. */
export function expandCollection(
  binding: CollectionBinding, target: CollectionTarget,
  datasetMap: DatasetMap, rowContext: RowContext, seedKey: string,
): unknown[] {
  const ds = datasetMap[binding.dataset];
  if (!ds) return [];
  const map = binding.map ?? {};

  if (binding.mode === 'fields') {
    const row = ds.rows[rowContext[binding.dataset] ?? 0];
    if (!row) return [];
    return ds.columns.map((c) => ({ label: c.name, value: fmt(row[c.key]) }));
  }

  if (binding.mode === 'distinct') {
    const col = binding.column || ds.columns[0]?.key;
    if (!col) return [];
    const seen = new Set<string>();
    const out: Record<string, unknown>[] = [];
    for (const row of ds.rows) {
      const raw = row[col];
      if (raw === null || raw === undefined || raw === '') continue;
      const key = String(raw);
      if (seen.has(key)) continue;
      seen.add(key);
      const entry = buildEntry(target, map, row);
      if (entry.value === undefined) entry.value = key;
      if (entry.label === undefined) entry.label = key;
      out.push(entry);
    }
    return applyLimit(out, binding, seedKey);
  }

  // rows
  return pickRepeatIndices(ds.rows.length, binding, seedKey).map((i) => buildEntry(target, map, ds.rows[i]));
}
