import * as React from "react";

export interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Visible label text */
  label?: string;
  /** Helper text shown below the field */
  hint?: string;
  /** Error message — replaces hint and marks the field invalid */
  error?: string;
  /** Size density. Inherits from parent `Fieldset` when omitted. Default: "default" */
  size?: "comfortable" | "default" | "compact";
  /** Label position. Inherits from parent `Fieldset` when omitted. Default: "above" */
  labelPosition?: "above" | "before";
  required?: boolean;
  disabled?: boolean;
  /** Element rendered inside the field control */
  inputOverlay?: React.ReactNode;
  /** `<option>` elements */
  children?: React.ReactNode;
}

export declare const SelectField: React.ForwardRefExoticComponent<SelectFieldProps & React.RefAttributes<HTMLSelectElement>>;
