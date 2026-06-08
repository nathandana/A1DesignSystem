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
  gap?: "xs" | "sm" | "md" | "lg";
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
  alignment?: ResponsiveAlignment;
  children?: React.ReactNode;
}

export declare function Section(props: SectionProps): React.ReactElement;
