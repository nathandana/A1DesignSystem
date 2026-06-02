import * as React from "react";

export interface CheckboxOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /** Group legend */
  label?: string;
  /** Helper text */
  hint?: string;
  /** Error message */
  error?: string;
  /** Size density. Inherits from parent `Fieldset` when omitted. Default: "default" */
  size?: "comfortable" | "default" | "compact";
  required?: boolean;
  disabled?: boolean;
  /** Render checkboxes side by side. Default: false */
  inline?: boolean;
  /** Input name attribute shared by all checkboxes */
  name?: string;
  /** Array of checkbox options */
  options?: CheckboxOption[];
  /** Controlled selected values */
  value?: string[];
  /** Default selected values (uncontrolled) */
  defaultValue?: string[];
  /** Called with the full updated array of selected values on change */
  onChange?: (value: string[]) => void;
  id?: string;
  className?: string;
}

export declare function CheckboxGroup(props: CheckboxGroupProps): React.ReactElement;
