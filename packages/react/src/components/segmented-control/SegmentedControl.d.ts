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
}

export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;
