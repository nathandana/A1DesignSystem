import * as React from "react";

type SpacingToken = 1 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 64 | 96 | 128;

export interface InsetProps extends React.HTMLAttributes<HTMLElement> {
  /** Underlying element. Default: "div" */
  as?: React.ElementType;
  /** Base padding applied to all axes when no axis-specific value is set. Default: 16 */
  space?: SpacingToken;
  /** Block-axis (top/bottom) padding override. Falls back to `space`. */
  block?: SpacingToken;
  /** Inline-axis (left/right) padding override. Falls back to `space`. */
  inline?: SpacingToken;
  children?: React.ReactNode;
}

export declare function Inset(props: InsetProps): React.ReactElement;
