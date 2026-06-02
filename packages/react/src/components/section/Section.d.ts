import * as React from "react";

type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";
type PaddingSize = "lg" | "md" | "sm" | "none";
type ResponsivePadding = PaddingSize | Partial<Record<Breakpoints, PaddingSize>>;

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
  /** Force a specific height */
  height?: "screen";
  children?: React.ReactNode;
}

export declare function Section(props: SectionProps): React.ReactElement;
