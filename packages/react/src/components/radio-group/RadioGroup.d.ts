import * as React from "react";

export interface RadioOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
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
  /** Render radios side by side. Default: false */
  inline?: boolean;
  /** Input name attribute shared by all radios */
  name?: string;
  /** Array of radio options */
  options?: RadioOption[];
  /** Controlled selected value */
  value?: string | null;
  /** Default selected value (uncontrolled). Default: null */
  defaultValue?: string | null;
  /** Called with the selected value string on change */
  onChange?: (value: string) => void;
  id?: string;
  className?: string;
}

export declare function RadioGroup(props: RadioGroupProps): React.ReactElement;
