import * as React from "react";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  /** Element or text that receives hover/focus listeners. */
  children: React.ReactNode;
  /** Tooltip message. Keep it short and non-interactive. */
  content: React.ReactNode;
  /** Preferred tooltip placement. The rendered position is clamped to the viewport. Default: "top". */
  placement?: TooltipPlacement;
  /** Delay in milliseconds before showing the tooltip. Clamped from 0 to 1500. Default: 400. */
  delay?: number;
  /** Prevents the tooltip from opening. */
  disabled?: boolean;
  /** Optional class applied to the tooltip surface. */
  className?: string;
}

export declare function Tooltip(props: TooltipProps): React.JSX.Element;
