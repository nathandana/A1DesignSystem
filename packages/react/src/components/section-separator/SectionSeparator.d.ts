import * as React from "react";

export interface SectionSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface color above the organic edge. Default: "page" */
  topSurface?: "page" | "panel" | "raised";
  /** Surface color below the organic edge. Default: "panel" */
  bottomSurface?: "page" | "panel" | "raised";
  /** Resolve both surfaces in the inverse color scope. Default: false */
  inverse?: boolean;
  /** Resolve the top surface in the inverse color scope. Default: false */
  topInverse?: boolean;
  /** Resolve the bottom surface in the inverse color scope. Default: false */
  bottomInverse?: boolean;
  /** Organic separator shape. Default: "wave" */
  shape?: "wave" | "swell" | "curve" | "slope" | "peak" | "valley" | "ribbon";
  /** Responsive height scale. Default: "md" */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Draw a highlighted line along the shape edge. Default: false */
  border?: boolean;
  /** Border thickness. Uses the same size tokens as Divider. Default: "xs" */
  borderSize?: "xs" | "sm" | "md" | "lg";
  /** Border color tone. Uses the same variants as Divider. Default: "subtle" */
  borderVariant?: "subtle" | "strong" | "accent";
  /** Render as decorative presentation by default. Set false for role="separator". */
  decorative?: boolean;
}

export declare function SectionSeparator(props: SectionSeparatorProps): React.ReactElement;
