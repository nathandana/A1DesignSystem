import * as React from "react";

export interface SystemBannerProps {
  /** Semantic status colour. Default: "neutral" */
  status?: "neutral" | "info" | "success" | "warn" | "error";
  /** Bold title text */
  title?: string;
  /** Override the default status icon with any Material Symbols name */
  icon?: string;
  /** Action element rendered at the trailing end */
  action?: React.ReactNode;
  /** Called when the dismiss button is clicked. Omit to hide the dismiss button. */
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export declare function SystemBanner(props: SystemBannerProps): React.ReactElement;
