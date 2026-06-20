/**
 * A1 Pattern definitions — the contract for reusable, governed component
 * compositions.
 *
 * A **Pattern** is a JSON object, shaped like a page definition, that describes a
 * common arrangement of A1 components with specific properties — a page header, a
 * footer, a standardized card for a scenario, or even a whole page. Patterns add
 * two things on top of the page-definition node tree:
 *
 * 1. **Locking** — a node, individual props, or its text content can be locked so
 *    a consumer can reuse the pattern but not change the governed parts.
 * 2. **Nesting** — a node of type `"PatternRef"` embeds another pattern by id, so
 *    patterns can contain patterns (e.g. a page pattern that includes the shared
 *    header pattern).
 *
 * The same tree renders through the existing page renderer: pattern-only metadata
 * (`lock`, `patternId`) is stripped and `PatternRef` nodes are expanded by
 * `resolvePatternNodes` before rendering. A future pattern editor will read and
 * write this shape, and will be able to create a pattern from a selected portion
 * of a page.
 */
import type { ComponentNode, ComponentType } from '../editor/pageTypes';

/** What is locked on a single node. Absent fields mean "editable". */
export interface PatternLock {
  /** The node is structural — it can't be removed, moved, or replaced. */
  node?: boolean;
  /** Names of props that are locked (read-only) on this node. */
  props?: string[];
  /** The node's text content is locked (not editable). */
  content?: boolean;
}

/**
 * A node in a pattern tree. Extends the page-definition `ComponentNode` with lock
 * metadata and the `"PatternRef"` nesting type.
 */
export interface PatternNode extends Omit<ComponentNode, 'type' | 'children'> {
  /** An A1 component name, or `"PatternRef"` to embed another pattern. */
  type: ComponentType | 'PatternRef';
  /** Lock metadata. Absent = fully editable. */
  lock?: PatternLock;
  /** When `type` is `"PatternRef"`, the id of the pattern to embed here. */
  patternId?: string;
  /** Nested pattern nodes. */
  children?: PatternNode[];
}

/** Human/editor-facing metadata about a pattern. */
export interface PatternMetadata {
  /** Stable pattern id (also the reference target for `PatternRef`). */
  id: string;
  /** Display name. */
  name: string;
  /** What the pattern is for and how it's governed. */
  description?: string;
  /** Grouping, e.g. `"header" | "footer" | "card" | "section" | "page"`. */
  category: string;
  /** Free-form tags for search and filtering. */
  tags?: string[];
  /** A whole pattern can be governed (locked) so instances can't be detached. */
  locked?: boolean;
}

/** The full pattern definition: metadata + the component tree. */
export interface PatternDefinition {
  /** Schema version of the pattern format (semver). */
  schemaVersion: string;
  pattern: PatternMetadata & {
    /** The component tree, with lock metadata. */
    nodes: PatternNode[];
  };
}
