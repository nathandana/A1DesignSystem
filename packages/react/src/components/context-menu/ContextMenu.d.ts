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
  onClick?: (item: HTMLButtonElement) => void;
  /** Called after the pointer rests on the item for `hoverDelay` milliseconds. */
  onHover?: (item: HTMLButtonElement) => void;
  /** Delay before `onHover` runs. Default: 200 */
  hoverDelay?: number;
  /** Keep the current context menu open after this item is selected, for example while opening a submenu. */
  keepOpen?: boolean;
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

export interface ContextMenuCustomEntry {
  type: 'custom';
  id: string;
  /** Accessible name for the custom control group. */
  label: string;
  /** Interactive controls rendered inline in the menu. */
  children: React.ReactNode;
}

export type ContextMenuEntry =
  | ContextMenuItemEntry
  | ContextMenuDividerEntry
  | ContextMenuGroupEntry
  | ContextMenuCustomEntry;

export interface ContextMenuProps {
  /** Controls visibility. Default: false */
  open?: boolean;
  /** Horizontal position in viewport pixels (typically event.clientX). */
  x?: number;
  /** Vertical position in viewport pixels (typically event.clientY). */
  y?: number;
  /** Menu entries — items, dividers, group headings, and custom control groups. */
  items?: ContextMenuEntry[];
  /** Called when the menu should close (outside click or Escape key). */
  onClose?: () => void;
  /** Keep this menu open while the user interacts with another ContextMenu used as its submenu. Default: false */
  keepOpenForSubmenus?: boolean;
  /** Accessible name for the menu. Default: "Context menu" */
  'aria-label'?: string;
}

export declare function ContextMenu(props: ContextMenuProps): React.ReactElement | null;
