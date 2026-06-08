import * as React from "react";

export interface SwitchProps {
  /** Visible label text */
  label?: string;
  /** Helper text shown below the switch */
  hint?: string;
  /** Error message */
  error?: string;
  /** Size density. Inherits from parent `Fieldset` when omitted. Default: "default" */
  size?: "comfortable" | "default" | "compact";
  /** Position of the label relative to the toggle. Default: "end" */
  labelPosition?: "start" | "end";
  disabled?: boolean;
  /** Controlled checked state */
  checked?: boolean;
  /** Initial checked state (uncontrolled). Default: false */
  defaultChecked?: boolean;
  /** Called with (checked, event) when the value changes */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
}

export declare function Switch(props: SwitchProps): React.ReactElement;
