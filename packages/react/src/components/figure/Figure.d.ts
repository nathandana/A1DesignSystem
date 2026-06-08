import * as React from "react";

type SpacingToken = 1 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 64 | 96 | 128;

export interface FigureProps extends React.HTMLAttributes<HTMLElement> {
  /** Image source URL */
  src: string;
  /** Image alt text. Pass "" for decorative images. */
  alt?: string;
  /** Caption text or React node rendered as `<figcaption>` */
  caption?: React.ReactNode;
  /** Render caption visually hidden (screen-reader only). Default: false */
  captionSrOnly?: boolean;
  /** Caption alignment. Default: "start" */
  captionPosition?: "start" | "center";
  /** Border radius on the image. */
  radius?: "none" | "sm" | "md" | "lg";
  /** Constrain figure width. */
  size?: "xs" | "sm" | "md" | "lg";
  /** Horizontal alignment of the figure. Default: "start" */
  align?: "start" | "center" | "end";
  /** Top margin. */
  marginTop?: "sm" | "md" | "lg";
  /** Bottom margin. */
  marginBottom?: "sm" | "md" | "lg";
  /**
   * Pull the figure outside its container padding using `Bleed`.
   * Pass `true` for symmetric bleed or a numeric spacing token for inline-only.
   */
  bleed?: boolean | SpacingToken;
  /** Extra class names on the `<figure>` element */
  className?: string;
  /** Extra class names on the `<img>` element */
  imgClassName?: string;
  /** Inline styles for the `<img>` element */
  imgStyle?: React.CSSProperties;
}

export declare function Figure(props: FigureProps): React.ReactElement;
