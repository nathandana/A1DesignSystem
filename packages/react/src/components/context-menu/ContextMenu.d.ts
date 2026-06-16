import * as React from 'react';

export interface ContextMenuItemEntry {
  /** Default entry type — a clickable menu item. */
  type?: 'item';
  /** Unique identifier for this entry. */
  id: string;
  /** Display label. */
  label: string;
  /** Material Symbols icon name shown before the label. */
  icon?: string;
  /** Keyboard shortcut hint shown after the label (e.g. "⌦", "⌘Z"). */
  shortcut?: string;
  /** Visual variant. `destructive` uses error colors to signal a dangerous action. Default: "default" */
  variant?: 'default' | 'destructive';
  /** Highlights this item as the currently active/selected option. */
  active?: boolean;
  /** Prevents interaction. */
  disabled?: boolean;
  /** Called when the item is clicked. The menu closes automatically after. */
  onClick?: () => void;
}

export interface ContextMenuDividerEntry {
  type: 'divider';
  id: string;
}

export interface ContextMenuGroupEntry {
  type: 'group';
  id: string;
  /** Label shown as a non-interactive section heading. */
  label: string;
}

export type ContextMenuEntry =
  | ContextMenuItemEntry
  | ContextMenuDividerEntry
  | ContextMenuGroupEntry;

export interface ContextMenuProps {
  /** Controls visibility. Default: false */
  open?: boolean;
  /** Horizontal position in viewport pixels (typically event.clientX). */
  x?: number;
  /** Vertical position in viewport pixels (typically event.clientY). */
  y?: number;
  /** Menu entries — items, dividers, and group headings. */
  items?: ContextMenuEntry[];
  /** Called when the menu should close (outside click or Escape key). */
  onClose?: () => void;
  /** Accessible name for the menu. Default: "Context menu" */
  'aria-label'?: string;
}

export declare function ContextMenu(props: ContextMenuProps): React.ReactElement | null;
