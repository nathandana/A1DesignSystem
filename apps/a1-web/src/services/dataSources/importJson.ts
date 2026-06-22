/**
 * Data sources — JSON importer. "Give me a data JSON feed and it should just work"
 * (A1-94). Turns a parsed JSON value into `{ columns, rows }`:
 *   - array of objects   → keys become columns (first-seen order, union across rows)
 *   - array of primitives → a single `value` column
 *   - object of objects   → its values are treated as the row array
 */
import type { ColumnType, DataColumn, DataRow } from './types';

/** Title-case a key for the column header without uppercasing whole words. */
function humanize(key: string): string {
  const spaced = key.replace(/[_-]+/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim();
  if (!spaced) return key;
  // Sentence case: capitalise only the first letter (per the never-uppercase law).
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function inferType(rows: Record<string, unknown>[], key: string): ColumnType {
  let sawNumber = false;
  let sawBool = false;
  let sawOther = false;
  for (const r of rows) {
    const v = r[key];
    if (v === null || v === undefined || v === '') continue;
    if (typeof v === 'number') sawNumber = true;
    else if (typeof v === 'boolean') sawBool = true;
    else sawOther = true;
  }
  if (sawOther) return 'text';
  if (sawBool && !sawNumber) return 'boolean';
  if (sawNumber && !sawBool) return 'number';
  return 'text';
}

/** Coerce a cell to a string/number/boolean for storage (objects/arrays → JSON string). */
function normalizeValue(v: unknown): unknown {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return v;
}

export interface BuiltDataSource {
  columns: DataColumn[];
  rows: DataRow[];
}

/** Parse + build from a raw JSON string. Returns null when it isn't valid JSON. */
export function parseDataSourceJson(text: string): BuiltDataSource | null {
  let value: unknown;
  try { value = JSON.parse(text); } catch { return null; }
  return buildDataSourceFromJson(value);
}

/** Build columns + rows from an already-parsed JSON value. Returns null if unusable. */
export function buildDataSourceFromJson(value: unknown): BuiltDataSource | null {
  let arr: unknown[];
  if (Array.isArray(value)) arr = value;
  else if (value && typeof value === 'object') arr = Object.values(value as Record<string, unknown>);
  else return null;

  if (arr.length === 0) return { columns: [], rows: [] };

  const allObjects = arr.every((r) => r && typeof r === 'object' && !Array.isArray(r));
  if (allObjects) {
    const objs = arr as Record<string, unknown>[];
    const keys: string[] = [];
    for (const row of objs) {
      for (const k of Object.keys(row)) if (!keys.includes(k)) keys.push(k);
    }
    const columns: DataColumn[] = keys.map((k) => ({ key: k, name: humanize(k), type: inferType(objs, k) }));
    const rows: DataRow[] = objs.map((r) => {
      const out: DataRow = {};
      for (const k of keys) out[k] = normalizeValue(r[k]);
      return out;
    });
    return { columns, rows };
  }

  // Array of primitives → a single column.
  const columns: DataColumn[] = [{ key: 'value', name: 'Value', type: inferType(arr.map((v) => ({ value: v })), 'value') }];
  const rows: DataRow[] = arr.map((v) => ({ value: normalizeValue(v) }));
  return { columns, rows };
}
