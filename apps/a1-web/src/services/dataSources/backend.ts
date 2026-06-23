/**
 * Data sources — the storage backend interface. Two implementations:
 *   - supabaseBackend.ts — the shared, multi-user cloud store (signed in + configured)
 *   - localBackend.ts     — gzipped localStorage, so datasets work offline / solo
 * `dataSourcesStore.ts` selects between them. Mirrors services/backlog/backend.ts.
 */
import type {
  CreateDataSourceInput, DataSource, UpdateDataSourcePatch,
} from './types';

/** A new dataset as handed to a backend (the store has already stamped the author). */
export interface CreateDataSourceRow extends CreateDataSourceInput {
  createdBy?: string | null;
  createdByEmail?: string | null;
}

export interface DataSourceBackend {
  list(): Promise<DataSource[]>;
  create(row: CreateDataSourceRow): Promise<DataSource>;
  update(id: string, patch: UpdateDataSourcePatch): Promise<DataSource | null>;
  remove(id: string): Promise<void>;
  /** Call `cb` whenever data may have changed; returns an unsubscribe fn. */
  subscribe(cb: () => void): () => void;
}
