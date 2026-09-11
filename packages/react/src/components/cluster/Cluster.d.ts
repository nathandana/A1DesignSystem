import * as React from "react";

type SpacingToken = 1 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 64 | 96 | 128;
type SemanticGap = "xs" | "sm" | "md" | "lg" | "xl";

export interface ClusterProps extends React.HTMLAttributes<HTMLElement> {
  /** Underlying element. Default: "div" */
  as?: React.ElementType;
  /** Gap applied to both row and column. Accepts the Stack semantic scale. Default: 8 */
  gap?: SemanticGap | SpacingToken;
  /** Row gap override */
  rowGap?: SemanticGap | SpacingToken;
  /** Column gap override */
  columnGap?: SemanticGap | SpacingToken;
  /** Align-items. Default: "center" */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Justify-content. Default: "start" */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  children?: React.ReactNode;
}

/**
 * @deprecated Cluster is deprecated and will be removed in the next major
 * version. Use `<Stack direction="row" wrap gap="...">` instead — Stack covers
 * the wrapping-row pattern with the semantic gap scale.
 */
export declare function Cluster(props: ClusterProps): React.ReactElement;
