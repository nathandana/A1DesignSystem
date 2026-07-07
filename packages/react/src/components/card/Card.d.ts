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
  /**
   * Card surface treatment. `"default"` uses the standard card surface;
   * `"accent"` uses the stronger action/accent background step (darker in light
   * mode, lighter in dark mode), applies the primary-action foreground as its
   * local text context, and disables status stripe rendering because the two
   * treatments compete.
   * Default: "default"
   */
  surface?: "default" | "accent";
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
  /** Add a shaped separator between the hero icon area and the card content. Only applies when `iconDisplay="hero"`. Default: false */
  heroSeparator?: boolean;
  /** Separator shape used when `heroSeparator` is true. Default: "wave" */
  heroSeparatorShape?: "wave" | "swell" | "curve" | "slope" | "peak" | "valley" | "ribbon";
  /** Badge label overlaid on the hero (only renders when `iconDisplay="hero"`). */
  heroBadge?: React.ReactNode;
  /** Status colour of the hero badge. Default: "neutral" */
  heroBadgeStatus?: "neutral" | "info" | "success" | "warn" | "error";
  /** Placement of the hero badge on a 3×3 grid ("{top|middle|bottom}-{start|center|end}"). Default: "top-end" */
  heroBadgePosition?:
    | "top-start" | "top-center" | "top-end"
    | "middle-start" | "middle-center" | "middle-end"
    | "bottom-start" | "bottom-center" | "bottom-end";
  /**
   * Renders a coloured status stripe down the card's inline-start edge, coloured from the
   * tokenized `component.card.status.*` palette (warn/success are two ramp steps lighter than
   * the status background so the status frame still reads as amber/green). The full card border
   * matches the status colour, and the inline-start stripe is at least 8px wide or the card
   * radius, whichever is larger.
   *
   * The stripe is decorative: status must NOT be conveyed by colour alone. Pair it with
   * `statusLabel` (or status text the card carries or sits within) — see the
   * `card-status-not-color-only` rule (WCAG 2.1 SC 1.4.1, Level A). Default: undefined (no stripe).
   */
  status?: "neutral" | "info" | "success" | "warn" | "error";
  /** Optional badge label shown at the top of the card content, tinted to match `status`. Only renders when `status` is set. */
  statusLabel?: React.ReactNode;
  /**
   * Subtly pulses the status stripe to signal in-progress / ongoing work. Respects
   * `prefers-reduced-motion` (the stripe stays static). Only applies when `status` is set.
   * Default: false.
   */
  statusPulse?: boolean;
  children?: React.ReactNode;
}

export declare function Card(props: CardProps): React.ReactElement;
