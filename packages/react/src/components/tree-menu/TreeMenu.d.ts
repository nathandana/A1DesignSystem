import * as React from 'react';

export interface TreeItem {
  /** Unique identifier for this node. */
  id: string;
  /** Display label. */
  label: string;
  /** Material Symbols icon name. */
  icon?: string;
  /** Renders the item as an `<a>` when provided; otherwise a `<button>`. */
  href?: string;
  /** Prevents interaction and applies a muted style. Default: false */
  disabled?: boolean;
  /** Nested child items — supports unlimited depth. */
  children?: TreeItem[];
}

export interface TreeMenuProps {
  /** Tree data. Supports any depth of nesting. */
  items: TreeItem[];
  /**
   * Presentation mode. "expanded" renders the full tree. "collapsed" renders
   * root items as icon-only triggers and shows each branch's children in an A1
   * Menu flyout. Default: "expanded".
   */
  variant?: 'expanded' | 'collapsed';
  /** ID of the currently selected item (controlled). */
  selectedId?: string | null;
  /** Called with the id of the item the user activates. */
  onSelect?: (id: string) => void;
  /** IDs of items that are expanded on initial render (uncontrolled). */
  defaultExpandedIds?: string[];
  /** IDs of currently expanded items (controlled). */
  expandedIds?: string[];
  /** Called with the new array of expanded IDs when expansion changes. */
  onExpandedChange?: (ids: string[]) => void;
  /** Renders "Expand all" and "Collapse all" buttons above the tree. Default: false */
  showExpandControls?: boolean;
  /** Called with the id of the item the user is hovering, or null when hover ends. */
  onHoverChange?: (id: string | null) => void;
  /** Called when the user right-clicks a tree item label. Fires with the item id and the originating mouse event. */
  onItemContextMenu?: (id: string, event: React.MouseEvent) => void;
  /** Enables drag-and-drop reordering and reparenting of items. Default: false */
  draggable?: boolean;
  /**
   * Called when the user drops a dragged item onto a target.
   * Only fires when `draggable` is true.
   * - `position: "before"` — insert before the target.
   * - `position: "after"` — insert after the target.
   * - `position: "into"` — make the dragged item the last child of the target (branch nodes only).
   */
  onMove?: (params: { draggedId: string; targetId: string; position: 'before' | 'into' | 'after' }) => void;
  /**
   * ID of the item currently being renamed inline. When set, that item's label
   * is replaced by a text input seeded with its label (auto-focused/selected).
   * Drag is suspended for the item while it is being edited.
   */
  editingId?: string | null;
  /**
   * Called when the user requests an inline rename — by double-clicking an
   * item's label or pressing F2 on the focused item. Set `editingId` in
   * response to enter edit mode. Disabled items never fire it.
   */
  onRenameStart?: (id: string) => void;
  /**
   * Called when an inline rename is confirmed (Enter or blur) with the item id
   * and the new label. An empty/whitespace value falls back to the original
   * label. Pair with `editingId` to drive the editing state.
   */
  onRenameCommit?: (id: string, label: string) => void;
  /** Called when an inline rename is cancelled (Escape). */
  onRenameCancel?: () => void;
  /** Accessible name for the tree. Required when no visible label references the tree. */
  'aria-label'?: string;
  /** ID of an element that labels the tree. */
  'aria-labelledby'?: string;
  className?: string;
}

export declare function TreeMenu(props: TreeMenuProps): React.ReactElement;
