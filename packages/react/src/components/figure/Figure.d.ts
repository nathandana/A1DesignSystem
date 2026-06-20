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
  /** Border radius on the image. Default (no prop) is square, same as "none". */
  radius?: "none" | "sm" | "md" | "lg";
  /** Constrain figure width. */
  size?: "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /** Horizontal alignment of the figure. Default: "none" (normal flow). */
  align?: "none" | "start" | "center" | "end";
  /**
   * Fix the image to a set aspect ratio, cropping to fill via `object-fit: cover`.
   * Omit for the image's natural ratio.
   */
  aspectRatio?: "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "21:9";
  /**
   * Crop focal point used when the image is cropped (i.e. when `aspectRatio` or a
   * fixed height applies). Maps to `object-position`. Default: "center"
   */
  crop?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  /**
   * Freeform crop: a sub-rectangle of the image to show, expressed as fractions
   * (0–1) of the natural image — `{ x, y, width, height }` where x/y is the
   * top-left corner. Applied non-destructively (CSS only); the image is never
   * modified. Takes precedence over `aspectRatio` / `crop` when set.
   */
  cropRect?: { x: number; y: number; width: number; height: number };
  /** Top margin. */
  marginTop?: "sm" | "md" | "lg";
  /** Bottom margin. */
  marginBottom?: "sm" | "md" | "lg";
  /**
   * Pull the figure outside its container padding using `Bleed`.
   * Pass `true` for symmetric bleed or a numeric spacing token for inline-only.
   */
  bleed?: boolean | SpacingToken;
  /**
   * Show a tokenized placeholder pattern when `src` is missing or fails to load
   * (e.g. a deleted image). Default: true. Set false to render the bare `<img>`.
   */
  placeholder?: boolean;
  /** Material Symbols icon shown in the placeholder. Default: "image" */
  placeholderIcon?: string;
  /** Extra class names on the `<figure>` element */
  className?: string;
  /** Extra class names on the `<img>` element */
  imgClassName?: string;
  /** Inline styles for the `<img>` element */
  imgStyle?: React.CSSProperties;
}

export declare function Figure(props: FigureProps): React.ReactElement;
