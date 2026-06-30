import * as React from "react";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols name, or a registered custom icon as `custom:<name>`. */
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

export interface CustomIconFontRegistration {
  fontUrl: string;
  /** Custom icon name mappings. Values are ligature names; numeric codepoints are accepted for legacy fonts. */
  mappings: Record<string, string | number>;
  fontFamily?: string;
}

/** Register a browser-built custom icon ligature font for the current application scope. */
export declare function registerCustomIconFont(registration: CustomIconFontRegistration): void;
/** Clear the active custom icon font and mappings. */
export declare function clearCustomIconFont(): void;
