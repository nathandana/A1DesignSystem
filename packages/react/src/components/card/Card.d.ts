import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Underlying element. Default: "div" */
  as?: React.ElementType;
  /** Visual and semantic card variant. Navigation cards make the entire card interactive. Default: "default" */
  variant?: "default" | "navigation";
  /** Destination for navigation cards. When `variant="navigation"` is set, the card renders as an anchor by default. */
  href?: string;
  /** Remove the card border and background. Default: false */
  bare?: boolean;
  /** Material Symbols icon name. Used by `iconDisplay` to render the icon. */
  icon?: string;
  /**
   * Controls how the icon is displayed.
   * - `"default"` — small tokenised icon block above card content; scales with the card container (sm/md/lg).
   * - `"hero"` — full-bleed coloured header area at the top of the card.
   * - `"none"` — icon is not rendered.
   * Default: `"default"` (when `icon` is provided).
   */
  iconDisplay?: "none" | "default" | "hero";
  /**
   * Background colour of the hero block when `iconDisplay="hero"`.
   * Accepts a semantic colour role or any valid CSS colour value.
   * Default: "action"
   */
  heroColor?: "action" | "neutral" | "info" | "success" | "warn" | "error" | (string & {});
  children?: React.ReactNode;
}

export declare function Card(props: CardProps): React.ReactElement;
