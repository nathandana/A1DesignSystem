import * as React from "react";

export interface BannerProps {
  /** Layout style. "inline" sits within content; "system" spans full width; "calendar" shows a date callout in place of the status icon. Default: "inline" */
  variant?: "inline" | "system" | "calendar";
  /** Semantic status colour. Default: "neutral" */
  status?: "neutral" | "info" | "success" | "warn" | "error";
  /** Bold title text shown before the body */
  title?: string;
  /** Small overline label shown above the title. Calendar variant only. */
  eyebrow?: string;
  /**
   * Date shown in the calendar callout. Accepts a Date, an ISO date string, or
   * `{ month, day }` for full control of the displayed month/day. Calendar variant only.
   */
  date?: Date | string | { month: string | number; day: string | number };
  /** Override the default status icon with any Material Symbols name */
  icon?: string;
  /** Action element (e.g. a Button) rendered at the trailing end */
  action?: React.ReactNode;
  /** Called when the dismiss button is clicked. Omit to hide the dismiss button. */
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export declare function Banner(props: BannerProps): React.ReactElement;
