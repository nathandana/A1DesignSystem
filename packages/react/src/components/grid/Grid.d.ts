import * as React from "react";

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";
type GapKey = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | 1 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 64 | 96 | 128;
type ColSpan = number | "full";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns. Pass a number for a fixed count, or a responsive object.
   * @example columns={{ xs: 1, md: 2, lg: 3 }}
   */
  columns?: number | Partial<Record<Breakpoints, number>>;
  /** Gap applied to both row and column. Semantic token ("sm"–"xxl") or numeric spacing value. */
  gap?: GapKey;
  /** Row gap override. Falls back to `gap`. */
  rowGap?: GapKey;
  /** Column gap override. Falls back to `gap`. */
  columnGap?: GapKey;
  /** Grid layout preset. Default: "default" */
  layout?: "default" | "bento";
  /** CSS value for `grid-auto-rows` */
  autoRows?: string;
  children?: React.ReactNode;
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Column span. Pass a number, "full", or a responsive object.
   * @example span={{ xs: "full", md: 2 }}
   */
  span?: ColSpan | Partial<Record<Breakpoints, ColSpan>>;
  /** Row span. Pass a number or a responsive object. */
  rowSpan?: number | Partial<Record<Breakpoints, number>>;
  children?: React.ReactNode;
}

export declare function Grid(props: GridProps): React.ReactElement;
export declare function GridItem(props: GridItemProps): React.ReactElement;
