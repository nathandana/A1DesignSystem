import * as React from "react";

export interface SegmentOption {
  value: string;
  label?: string;
  icon?: string;
  ariaLabel?: string;
}

export interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Option list. Pass strings or `{ value, label, icon }` objects. */
  options?: (string | SegmentOption)[];
  /** Currently selected value (controlled) */
  value?: string;
  /** Called with the new value when an option is selected */
  onChange?: (value: string) => void;
  /** Stretch to fill the container width. Default: false */
  fullWidth?: boolean;
  /** Height scale. Default: "md" */
  size?: "sm" | "md" | "lg";
  /**
   * Label display. `"all"` (default) shows every option's label. `"selected"`
   * shows the label only on the selected option; the rest render icon-only
   * (using each option's `ariaLabel`/`label` for its accessible name). Options
   * without an icon always show their label so they never render blank.
   * "none" hides every label (fully icon-only).
   */
  labelMode?: "all" | "selected" | "none";
}

export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;
