import * as React from "react";

export interface BlockquoteProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual style variant. Default: "border"
   *
   * border  — left accent border, subtle background
   * filled  — filled neutral surface
   * feature — large centered text with accent bar, for pullquotes
   * minimal — no decoration, plain text
   * accent  — filled action-colour background with inverse text
   * pull    — centred editorial with curly quotes
   * ruled   — top + bottom horizontal rules, centred
   */
  variant?: "border" | "filled" | "feature" | "minimal" | "accent" | "pull" | "ruled";
  /** Attribution text rendered as a `<figcaption>` */
  cite?: string;
  /** URL that the cite text links to */
  citeUrl?: string;
  children?: React.ReactNode;
}

export declare function Blockquote(props: BlockquoteProps): React.ReactElement;
