import * as React from "react";

export interface TextareaFieldProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "rows"> {
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
  /** Prevents user edits and suppresses browser/password-manager autofill. */
  readOnly?: boolean;
  /**
   * Initial visible row height. Pass a number for exact rows or a size token.
   * sm=2 · md=4 · lg=8 · xl=12. Default: "md"
   */
  rows?: "sm" | "md" | "lg" | "xl" | number;
  /** Maximum character count */
  maxLength?: number;
  /** Show a character counter. Auto-enabled when `maxLength` is set. Default: false */
  showCount?: boolean;
}

export declare const TextareaField: React.ForwardRefExoticComponent<TextareaFieldProps & React.RefAttributes<HTMLTextAreaElement>>;
