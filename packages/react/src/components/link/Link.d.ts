import * as React from "react";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Font size. Inherits from context when omitted. */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Font weight override. */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Material Symbols icon name to show alongside the link text. */
  icon?: string;
  /** Position of the icon relative to the text. Default: "start" */
  iconPosition?: "start" | "end";
  children?: React.ReactNode;
}

export declare function Link(props: LinkProps): React.ReactElement;
