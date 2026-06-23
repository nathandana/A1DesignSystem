/**
 * Data binding (A1-94). A component prop or text content can pull a value from a
 * project's dataset with a `{{ dataset.column }}` token, resolved at render time.
 *
 * Reference grammar: `{{ datasetKey.columnKey }}` resolves to **row 0** of that
 * dataset's column; an optional row index targets another row:
 * `{{ datasetKey.columnKey.2 }}`. `datasetKey` is the dataset's name slugified
 * (`datasetBindingKey`), e.g. "Users" → `users`.
 *
 * A whole-token value (`"{{ users.age }}"`) returns the raw cell value so a number
 * prop stays a number; an embedded token (`"Hi {{ users.name }}"`) interpolates as
 * a string. Unresolved tokens are left as-is so a bad reference is visible.
 */
import type { DataSource } from '../services/dataSources/types';

export type DatasetMap = Record<string, DataSource>;

/** Stable binding key for a dataset name: lowercase, non-alphanumeric → underscore. */
export function datasetBindingKey(name: string): string {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'data';
}

/** Build a binding key → dataset map (first wins on a slug collision). */
export function buildDatasetMap(datasets: DataSource[]): DatasetMap {
  const map: DatasetMap = {};
  for (const d of datasets) {
    const key = datasetBindingKey(d.name);
    if (!(key in map)) map[key] = d;
  }
  return map;
}

const TOKEN = /\{\{\s*([^}]+?)\s*\}\}/g;
const WHOLE = /^\{\{\s*([^}]+?)\s*\}\}$/;

/** True when a value is a string containing a `{{ … }}` token. */
export function hasBinding(value: unknown): boolean {
  return typeof value === 'string' && value.includes('{{') && value.includes('}}');
}

/**
 * The active row index per dataset key, set when rendering inside a repeated node.
 * A `{{ key.column }}` token with no explicit row uses `rowContext[key]` (else 0).
 */
export type RowContext = Record<string, number>;

/** Resolve a single reference like `users.email` or `users.email.2`. */
function resolveRef(map: DatasetMap, ref: string, rowContext: RowContext): unknown {
  const parts = ref.split('.').map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return undefined;
  const [dsKey, column, rowStr] = parts;
  const ds = map[dsKey];
  if (!ds) return undefined;
  const rowIndex = rowStr !== undefined ? Number.parseInt(rowStr, 10) : (rowContext[dsKey] ?? 0);
  if (Number.isNaN(rowIndex)) return undefined;
  const row = ds.rows[rowIndex];
  if (!row) return undefined;
  return row[column];
}

/**
 * Type-preserving resolve for a prop value. A whole-token binding returns the raw
 * cell value (keeps numbers/booleans); embedded tokens interpolate into the string.
 * Non-strings and strings without a token pass through unchanged. An unresolved
 * whole token returns the original string so the bad reference stays visible.
 */
export function resolveBinding(value: unknown, map: DatasetMap, rowContext: RowContext = {}): unknown {
  if (typeof value !== 'string') return value;
  const whole = value.match(WHOLE);
  if (whole) {
    const v = resolveRef(map, whole[1].trim(), rowContext);
    return v === undefined ? value : v;
  }
  if (!value.includes('{{')) return value;
  return value.replace(TOKEN, (_m, ref) => {
    const v = resolveRef(map, String(ref).trim(), rowContext);
    return v === undefined || v === null ? '' : String(v);
  });
}

/** String resolve for text content (always returns a string). */
export function resolveBindingsToString(value: string, map: DatasetMap, rowContext: RowContext = {}): string {
  const out = resolveBinding(value, map, rowContext);
  return out === undefined || out === null ? '' : String(out);
}
