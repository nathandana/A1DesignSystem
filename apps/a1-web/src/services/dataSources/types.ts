/**
 * Data sources — shared types for the dataset feature (backlog A1-94).
 *
 * A *data source* (dataset) is a named table — `columns` + `rows` — that can be
 * stored (local or Supabase), scoped (global vs specific projects), edited in the
 * A1 DataGrid, and bound into pages. Scoping mirrors the image-library / pattern
 * idiom: `projectIds` empty = available to every project (global); non-empty =
 * restricted to the listed projects.
 *
 * The DB enforces the same shape in `supabase/schema.sql` (`data_sources`); the
 * local backend mirrors it in gzipped localStorage. Keep the two in step.
 */

/** Loose value-type hint used by editors and the JSON importer. */
export const COLUMN_TYPES = ['text', 'number', 'boolean'] as const;
export type ColumnType = (typeof COLUMN_TYPES)[number];

/** A dataset column. `key` is the stable field id used in every row and in bindings. */
export interface DataColumn {
  key: string;
  name: string;
  type?: ColumnType;
}

/** One row: a map of column key → value. */
export type DataRow = Record<string, unknown>;

export interface DataSource {
  id: string;
  name: string;
  description: string | null;
  columns: DataColumn[];
  rows: DataRow[];
  /** Project ids this dataset is restricted to. Empty = available to every project. */
  projectIds: string[];
  createdBy: string | null;
  createdByEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DataSourceUser {
  id: string;
  email: string;
}

/** Fields a caller can set when creating a dataset. */
export interface CreateDataSourceInput {
  name: string;
  description?: string | null;
  columns?: DataColumn[];
  rows?: DataRow[];
  projectIds?: string[];
}

/** Editable fields on an existing dataset. */
export type UpdateDataSourcePatch = Partial<{
  name: string;
  description: string | null;
  columns: DataColumn[];
  rows: DataRow[];
  projectIds: string[];
}>;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** True when a dataset is visible to a given project (global, or explicitly listed). */
export function datasetAvailableToProject(
  ds: Pick<DataSource, 'projectIds'>,
  projectId: string | null | undefined,
): boolean {
  if (!ds.projectIds || ds.projectIds.length === 0) return true; // global
  if (!projectId) return true;
  return ds.projectIds.includes(projectId);
}

/** True when a dataset is global (available to every project). */
export function isGlobalDataset(ds: Pick<DataSource, 'projectIds'>): boolean {
  return !ds.projectIds || ds.projectIds.length === 0;
}

/** Short human label for a dataset's scope. */
export function datasetScopeLabel(ds: Pick<DataSource, 'projectIds'>): string {
  const n = ds.projectIds?.length ?? 0;
  if (n === 0) return 'All projects';
  return n === 1 ? '1 project' : `${n} projects`;
}
