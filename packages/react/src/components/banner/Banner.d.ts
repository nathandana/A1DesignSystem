import * as React from "react";

export interface BannerProps {
  /** Layout style. "inline" sits within content; "system" spans full width. Default: "inline" */
  variant?: "inline" | "system";
  /** Semantic status colour. Default: "neutral" */
  status?: "neutral" | "info" | "success" | "warn" | "error";
  /** Bold title text shown before the body */
  title?: string;
  /** Override the default status icon with any Material Symbols name */
  icon?: string;
  /** Action element (e.g. a Button) rendered at the trailing end */
  action?: React.ReactNode;
  /** Called when the dismiss button is clicked. Omit to hide the dismiss button. */
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export declare function Banner(props: BannerProps): React.ReactElement;
