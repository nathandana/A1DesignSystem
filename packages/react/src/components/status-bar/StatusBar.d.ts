import * as React from "react";

export interface StatusBarProps {
  /**
   * Current value. Combined with max to compute the fill percentage.
   * Ignored when indeterminate is true. Default: 0
   */
  value?: number;
  /**
   * Maximum value. Default: 100
   */
  max?: number;
  /**
   * Label displayed adjacent to the bar. Accepts any ReactNode — plain string,
   * bold/inline markup, or composed components. Also provides the accessible
   * name for the progressbar via aria-labelledby.
   *
   * @example <StatusBar label="Storage used" />
   * @example <StatusBar label={<><strong>73%</strong> used</>} />
   */
  label?: React.ReactNode;
  /**
   * Position of the label relative to the bar.
   * "above" and "below" use a column layout; "before" and "after" use a row
   * layout and are RTL-aware ("before" = inline-start side). Default: "above"
   */
  labelPosition?: "above" | "below" | "before" | "after";
  /**
   * Bar height. Default: "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Shows an animated loading sweep instead of a value-based fill.
   * Removes aria-valuenow so assistive technology announces an indeterminate
   * state. After 3 seconds a pause/resume button appears. Default: false
   */
  indeterminate?: boolean;
  /** Additional CSS class names applied to the root element. */
  className?: string;
}

export declare function StatusBar(props: StatusBarProps & React.HTMLAttributes<HTMLDivElement>): React.ReactElement;
