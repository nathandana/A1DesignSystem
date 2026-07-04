import * as React from "react";
import { TextFieldProps } from "./TextField";

/** Masked credit-card number input built on the TextField base. */
export interface CreditCardFieldProps extends Omit<TextFieldProps, "type"> {}

export declare function CreditCardField(props: CreditCardFieldProps): React.ReactElement;
