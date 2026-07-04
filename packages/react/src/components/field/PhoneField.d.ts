import * as React from "react";
import { TextFieldProps } from "./TextField";

export interface PhoneFieldProps extends Omit<TextFieldProps, "type"> {
  /** Mask pattern; `#` marks a digit slot. Default: "#-###-###-####" */
  mask?: string;
}

/** Masked US phone number input built on the TextField base. */
export declare function PhoneField(props: PhoneFieldProps): React.ReactElement;
