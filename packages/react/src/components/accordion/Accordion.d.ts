import * as React from "react";

export interface AccordionProps {
  /** Trigger label text */
  label: string;
  /**
   * Secondary information shown in the trigger, **below** the label. It only
   * shows while the accordion is collapsed (a glanceable summary, e.g. the
   * applied settings) and is hidden when open. Truncates with an ellipsis.
   */
  subtext?: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Initial open state (uncontrolled). Default: false */
  defaultOpen?: boolean;
  /** Called with the next boolean when the trigger is clicked */
  onChange?: (open: boolean) => void;
  /** Size — affects trigger text size and padding. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Show a divider under the trigger/header (it stays attached to the header, not the bottom of the open panel). Default: false */
  divider?: boolean;
  /** Prevent the accordion from being toggled. Default: false */
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export declare function Accordion(props: AccordionProps): React.ReactElement;
