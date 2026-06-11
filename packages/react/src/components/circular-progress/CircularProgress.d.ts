import * as React from "react";

export interface CircularProgressProps {
  /**
   * Current value. Combined with max to compute the filled arc length.
   * Ignored when indeterminate is true. Default: 0
   */
  value?: number;
  /**
   * Maximum value. Default: 100
   */
  max?: number;
  /**
   * Circle diameter. xs renders the smallest ring (no inner content — children
   * are placed inline after the ring instead). Default: "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Shows a continuously rotating arc instead of a value-based fill.
   * Removes aria-valuenow so assistive technology announces an indeterminate
   * state. Default: false
   */
  indeterminate?: boolean;
  /**
   * Content centered inside the ring for sm / md / lg sizes.
   * For xs, children are rendered inline after the ring.
   * Always pass aria-label on the root element for an accessible name since
   * this content receives aria-hidden="true".
   */
  children?: React.ReactNode;
  /** Additional CSS class names applied to the root element. */
  className?: string;
}

export declare function CircularProgress(
  props: CircularProgressProps & React.HTMLAttributes<HTMLDivElement>
): React.ReactElement;
