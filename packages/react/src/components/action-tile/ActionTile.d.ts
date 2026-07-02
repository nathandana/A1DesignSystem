import * as React from "react";

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";

export interface ActionTileProps extends React.HTMLAttributes<HTMLElement> {
  /** Underlying element for this tile item. Default: "a" when href is set, otherwise "div". */
  as?: React.ElementType;
  /** Link destination when rendering this tile item as an anchor. */
  href?: string;
  /** Material Symbols icon shown in the tile lead slot. */
  icon?: string;
  /** Primary tile label. */
  title?: React.ReactNode;
  /** Supporting tile text under the title. */
  subtitle?: React.ReactNode;
  /** Optional trailing slot for controls or metadata. Removed automatically when the tile item is interactive. */
  accessory?: React.ReactNode;
  /** Optional lower slot for additional actions or metadata. Removed automatically when the tile item is interactive. */
  footer?: React.ReactNode;
  /** Icon placement for this tile when not controlled by the parent group. Use "none" to hide icons. Default: "auto" */
  iconLayout?: "auto" | "top" | "side" | "none";
}

export interface ActionTilesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group layout. Default: "grid" */
  layout?: "grid" | "stack";
  /** Number of columns in grid layout. Pass a number for a fixed count, or a responsive object. */
  columns?: number | Partial<Record<Breakpoints, number>>;
  /** Toggle the space between items. Default: true */
  gap?: boolean;
  /** Icon placement applied to child ActionTile items. Use "none" to hide icons. Default: "auto" */
  iconLayout?: "auto" | "top" | "side" | "none";
  /** Child ActionTile elements. Use one child when only one tile is needed. */
  children?: React.ReactNode;
}

export declare function ActionTile(props: ActionTileProps): React.ReactElement;
export declare function ActionTiles(props: ActionTilesProps): React.ReactElement;
