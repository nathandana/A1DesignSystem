import type { PageDefinition } from '../editor/pageTypes';

/** Portable project import/export envelope. Optional fields retain the existing
 * import defaults; no database IDs or browser state are required to validate it. */
export interface ProjectImportBundle {
  name?: string;
  description?: string;
  icon?: string;
  theme?: string;
  figmaPageLinks?: unknown[];
  pages: {
    id?: string;
    title?: string;
    icon?: string;
    description?: string;
    parentId?: string | null;
    /** Omitted/null means a blank page; JSON text remains a supported import. */
    definition?: PageDefinition | string | null;
  }[];
}
