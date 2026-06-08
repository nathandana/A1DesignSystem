import * as React from "react";

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "placeholder"> {
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
  readOnly?: boolean;
  /** Element rendered inside the field control (e.g. a unit suffix) */
  inputOverlay?: React.ReactNode;
}

export declare const TextField: React.ForwardRefExoticComponent<TextFieldProps & React.RefAttributes<HTMLInputElement>>;
