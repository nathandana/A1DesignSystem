import * as React from "react";

export interface AccordionProps {
  /** Trigger label text */
  label: string;
  /** Controlled open state */
  open?: boolean;
  /** Initial open state (uncontrolled). Default: false */
  defaultOpen?: boolean;
  /** Called with the next boolean when the trigger is clicked */
  onChange?: (open: boolean) => void;
  /** Size — affects trigger text size and padding. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Prevent the accordion from being toggled. Default: false */
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export declare function Accordion(props: AccordionProps): React.ReactElement;
