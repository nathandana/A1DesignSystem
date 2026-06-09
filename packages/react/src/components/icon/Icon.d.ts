import * as React from "react";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols icon name (e.g. "check_circle", "home", "arrow_back") */
  name: string;
  /**
   * Icon size. "md" (default) inherits font-size from the parent.
   * "xs"=16px, "sm"=20px, "md"=inherit, "lg"=32px, "xl"=40px, "jumbo"=64px, "xJumbo"=96px
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "jumbo" | "xJumbo";
  /**
   * Icon color. Omit to inherit the current text color.
   * Status values map to semantic status background tokens.
   */
  color?: "muted" | "accent" | "inverse" | "success" | "error" | "warn" | "info";
  /**
   * Variable font weight axis (100–700).
   * Default is set via CSS token `--a1-icon-weight`.
   */
  weight?: number;
  /**
   * Grade axis — adjusts visual weight without changing size (-25–200).
   * Default is set via CSS token `--a1-icon-grade`.
   */
  grade?: number;
  /**
   * Optical size axis — adjusts detail level (20, 24, 40, 48).
   * Default is set via CSS token `--a1-icon-opsz`.
   */
  opticalSize?: 20 | 24 | 40 | 48;
  /** Fill the icon shape. Default: false */
  fill?: boolean;
}

export declare function Icon(props: IconProps): React.ReactElement;
