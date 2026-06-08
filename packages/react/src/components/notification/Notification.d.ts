import * as React from "react";

export interface NotificationProps {
  /** Element the badge is anchored to */
  children?: React.ReactNode;
  /** Numeric count displayed in the badge */
  count?: number;
  /** Short text label — used when count is not set */
  label?: string;
  /** Show a dot with no content. Default: false */
  dot?: boolean;
  /**
   * Visual status colour. Default: "neutral"
   * neutral | error | success | warn | info
   */
  status?: "neutral" | "error" | "success" | "warn" | "info";
  /** Badge anchor position. Default: "top-right" */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Count above this value shows as {max}+. Default: 99 */
  max?: number;
}

export declare function Notification(props: NotificationProps): React.ReactElement;
