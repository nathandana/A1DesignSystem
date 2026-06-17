import * as React from "react";

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";
type PaddingSize = "lg" | "md" | "sm" | "xs" | "none";
type ResponsivePadding = PaddingSize | Partial<Record<Breakpoints, PaddingSize>>;
type AlignmentValue = "left" | "center" | "right";
type ResponsiveAlignment = AlignmentValue | Partial<Record<Breakpoints, AlignmentValue>>;

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Underlying element. Default: "section" */
  as?: React.ElementType;
  /** Block padding scale. Responsive object syntax supported. Default: "md" */
  padding?: ResponsivePadding;
  /** Background surface treatment */
  surface?: "page" | "panel" | "raised";
  /** Gap between direct children */
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Gradient overlay colour */
  gradient?: "accent" | "highlight" | "info" | "success" | "warn";
  /** Gradient origin. Default: "center" */
  gradientPosition?: "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left" | "top-left" | "center";
  /** Apply inverse (dark) colour scheme to this section */
  inverse?: boolean;
  /** Constrain inner content to a max-width and centre it */
  contentWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Force a specific height. "hero" fills 90svh minus the sticky header height and vertically centres content. */
  height?: "screen" | "hero";
  /** Horizontal layout alignment for direct children. Responsive object syntax supported. */
  align?: ResponsiveAlignment;
  /** Border thickness. Uses the same size tokens as Divider. Omit for no border. */
  borderSize?: "xs" | "sm" | "md" | "lg";
  /** Border pattern. Uses the same line styles as Divider. Default: "solid" */
  borderStyle?: "solid" | "dashed" | "dotted";
  /** Border color tone. Uses the same variants as Divider. Default: "subtle" */
  borderVariant?: "subtle" | "strong" | "accent";
  /**
   * Which sides the border is drawn on (requires `borderSize`). `"all"` (default)
   * draws all four sides; pass an array to draw only those sides, e.g.
   * `["top", "bottom"]`. An empty array draws no border.
   */
  borderSides?: "all" | ("top" | "right" | "bottom" | "left")[];
  /** Border radius scale. */
  radius?: "none" | "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
}

export declare function Section(props: SectionProps): React.ReactElement;
