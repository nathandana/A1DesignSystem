import * as React from "react";

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";
type SpacerSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Space height. Responsive object syntax supported.
   * xs=8px · sm=16px · md=24px · lg=40px · xl=64px · xxl=96px
   * Default: "md"
   * @example size={{ xs: "sm", md: "lg" }}
   */
  size?: SpacerSize | Partial<Record<Breakpoints, SpacerSize>>;
}

export declare function Spacer(props: SpacerProps): React.ReactElement;
