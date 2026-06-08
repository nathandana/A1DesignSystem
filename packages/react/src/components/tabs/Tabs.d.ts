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
