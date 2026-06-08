import * as React from "react";

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";
type Direction = "column" | "column-reverse" | "row" | "row-reverse";
type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";
type Align = "stretch" | "start" | "center" | "end" | "baseline";
type SemanticGap = "xs" | "sm" | "md" | "lg";
type SpacingToken = 1 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 64 | 96 | 128;

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /** Underlying element. Default: "div" */
  as?: React.ElementType;
  /**
   * Flex direction. Responsive object syntax supported.
   * Default: "column"
   * @example direction={{ xs: "column", md: "row" }}
   */
  direction?: Direction | Partial<Record<Breakpoints, Direction>>;
  /**
   * Gap between children. Use a semantic token ("xs"–"lg") or a numeric spacing value.
   * Default: 16
   */
  gap?: SemanticGap | SpacingToken;
  /**
   * Align-items. Default: "stretch"
   */
  align?: Align;
  /**
   * Justify-content. Responsive object syntax supported.
   * Default: "start"
   */
  justify?: Justify | Partial<Record<Breakpoints, Justify>>;
  /** Allow children to wrap. Default: false */
  wrap?: boolean;
  children?: React.ReactNode;
}

export declare function Stack(props: StackProps): React.ReactElement;
