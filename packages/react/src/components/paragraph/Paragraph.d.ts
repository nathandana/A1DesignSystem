import * as React from "react";

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";
type ParagraphSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Underlying element. Default: "p" */
  as?: React.ElementType;
  /**
   * Font size. Responsive object syntax supported. Default: "md"
   * @example size={{ xs: "sm", md: "md" }}
   */
  size?: ParagraphSize | Partial<Record<Breakpoints, ParagraphSize>>;
  /** Text colour. Default: "default" */
  color?: "default" | "muted";
  children?: React.ReactNode;
}

export declare function Paragraph(props: ParagraphProps): React.ReactElement;
