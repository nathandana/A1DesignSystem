import * as React from "react";

type SpacingToken = 1 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 64 | 96 | 128;

export interface BleedProps extends React.HTMLAttributes<HTMLElement> {
  /** Underlying element. Default: "div" */
  as?: React.ElementType;
  /** Base bleed amount applied to all axes when no axis-specific value is set. Default: 16 */
  space?: SpacingToken | "none";
  /** Block-axis (top/bottom) bleed override. Default: "none" */
  block?: SpacingToken | "none";
  /** Inline-axis (left/right) bleed override. Falls back to `space`. */
  inline?: SpacingToken;
  children?: React.ReactNode;
}

export declare function Bleed(props: BleedProps): React.ReactElement;
