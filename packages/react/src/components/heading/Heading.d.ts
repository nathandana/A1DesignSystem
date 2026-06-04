import * as React from "react";

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";
type HeadingSize = "xxl" | "xl" | "lg" | "md" | "sm" | "xs";
type DisplaySize = "sm" | "md" | "lg" | "xl" | "xxl" | "jumbo" | "xJumbo";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** HTML heading level. Default: "h2" */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  /**
   * Typography type — drives the available size scale.
   * "heading" uses the text hierarchy scale; "display" uses the larger editorial scale.
   * Default: "heading"
   */
  type?: "heading" | "display";
  /**
   * Size within the active type scale. Responsive object syntax supported.
   * Heading sizes: xs | sm | md | lg | xl | xxl
   * Display sizes: sm | md | lg | xl | xxl | jumbo | xJumbo
   * @example size={{ xs: "lg", md: "xl" }}
   */
  size?: HeadingSize | DisplaySize | Partial<Record<Breakpoints, HeadingSize | DisplaySize>>;
  /** Text colour. Default: "default" */
  color?: "default" | "muted" | "accent";
  /** Add bottom margin. Useful when followed by body text. */
  margin?: "sm" | "md" | "lg";
  /** Apply text-wrap. "balance" distributes line lengths evenly — best for short headings. */
  textWrap?: "balance";
  /** Horizontal text alignment. */
  align?: "left" | "center" | "right";
  children?: React.ReactNode;
}

export interface HeadingMarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual decoration style. Default: "highlight" */
  variant?: "highlight" | "underline";
  /** Underline style (only applies when variant="underline"). Default: "swoop" */
  underlineStyle?: "swoop" | "wave" | "sketch";
  children?: React.ReactNode;
}

export declare function Heading(props: HeadingProps): React.ReactElement;
export declare function HeadingMark(props: HeadingMarkProps): React.ReactElement;
