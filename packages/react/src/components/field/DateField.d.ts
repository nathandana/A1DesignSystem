import * as React from "react";
import { TextFieldProps } from "./TextField";

/** Date input — the TextField base rendered as `type="date"`. The native format placeholder is muted while the field is empty. */
export interface DateFieldProps extends Omit<TextFieldProps, "type"> {}

export declare function DateField(props: DateFieldProps): React.ReactElement;
