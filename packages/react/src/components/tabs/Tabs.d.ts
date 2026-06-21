import * as React from "react";

export interface TabsProps {
  /** Currently active tab value (controlled) */
  value: string;
  /** Called with the new value when a tab is clicked */
  onChange?: (value: string) => void;
  /**
   * Visual style. Default: "line"
   * line     — underline indicator
   * pills    — filled pill buttons
   * segment  — segmented control style
   * progress — step-progress indicator
   * folder   — browser-tab style folders
   */
  variant?: "line" | "pills" | "segment" | "progress" | "folder";
  /**
   * Heading level for accessibility. Tabs at level 1 sit above level 2 tabs.
   * Default: 1
   */
  level?: 1 | 2;
  /** Size variant. Default: undefined (standard) */
  size?: "compact";
  /**
   * Keep every panel mounted, stacked in one cell, so the panel area always reserves
   * the **tallest** panel's height — switching tabs won't change the container height.
   * Opt-in (default `false`); use inside a Dialog/overlay so it doesn't resize and move
   * its targets. On a page, leave it off so tabs size to the active panel.
   * Default: false
   */
  equalHeight?: boolean;
  /**
   * Label display. `"all"` (default) shows every tab's label at all breakpoints.
   * `"selected"` shows the label only on the **active** tab; inactive tabs render
   * **icon-only** (the label stays in the DOM for the accessible name). Pair with a
   * `Tab` `icon` so inactive tabs aren't blank, and give **every** `Tab` a label.
   * Mirrors `ToolbarGroup`'s `labelMode`. Default: "all"
   */
  labelMode?: "all" | "selected";
  className?: string;
  children?: React.ReactNode;
}

export interface TabListProps {
  children?: React.ReactNode;
}

export interface TabProps {
  /** Value identifier — must match the corresponding `TabPanel` value */
  value: string;
  /** Badge count shown next to the label */
  count?: number;
  /** Material Symbols icon name */
  icon?: string;
  /** Icon placement relative to the label. Default: "start" */
  iconPosition?: "start" | "end" | "above";
  /** Status indicator (used in "progress" variant) */
  status?: "completed" | "error" | "warn";
  children?: React.ReactNode;
}

export interface TabPanelProps {
  /** Value identifier — panel renders only when this matches the active `Tabs` value */
  value: string;
  children?: React.ReactNode;
}

export declare function Tabs(props: TabsProps): React.ReactElement;
export declare function TabList(props: TabListProps): React.ReactElement;
export declare function Tab(props: TabProps): React.ReactElement;
export declare function TabPanel(props: TabPanelProps): React.ReactElement;
