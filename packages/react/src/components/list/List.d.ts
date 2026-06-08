import * as React from "react";

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";
type ListSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  /** Underlying element — "ol" switches to ordered variant automatically. Default: "ul" */
  as?: "ul" | "ol";
  /**
   * Font size. Responsive object syntax supported. Default: "md"
   */
  size?: ListSize | Partial<Record<Breakpoints, ListSize>>;
  /** Text colour. Default: "default" */
  color?: "default" | "muted";
  /**
   * Material Symbols icon name applied to all list items.
   * Setting `icon` automatically switches `variant` to "icon".
   */
  icon?: string | null;
  /**
   * List style. Auto-detected from `as` and `icon` when not set.
   * "divider" renders items separated by horizontal rules.
   */
  variant?: "unordered" | "ordered" | "icon" | "divider";
  /** Bottom margin. */
  marginBottom?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /**
   * Per-item icon override. Pass `null` to suppress the list-level icon for this item.
   * Omit to inherit from the parent `List`.
   */
  icon?: string | null;
  children?: React.ReactNode;
}

export declare function List(props: ListProps): React.ReactElement;
export declare function ListItem(props: ListItemProps): React.ReactElement;
