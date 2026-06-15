import * as React from "react";

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";
type Orientation = "horizontal" | "vertical";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /**
   * Line orientation. Responsive object syntax supported. Default: "horizontal"
   * @example orientation={{ xs: "horizontal", md: "vertical" }}
   */
  orientation?: Orientation | Partial<Record<Breakpoints, Orientation>>;
  /** Color tone. Default: "subtle" */
  variant?: "subtle" | "strong" | "accent";
  /** Border pattern. Default: "solid" */
  lineStyle?: "solid" | "dashed" | "dotted";
  /** Line thickness. Default: "xs" */
  size?: "xs" | "sm" | "md" | "lg";
  /** Block-axis margin (space above and below for horizontal, left/right for vertical). Default: "sm" */
  space?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /** Whether this divider is purely decorative (no semantic role). Default: true */
  decorative?: boolean;
}

export declare function Divider(props: DividerProps): React.ReactElement;
