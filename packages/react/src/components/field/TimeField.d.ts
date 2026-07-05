import * as React from "react";
import { TextFieldProps } from "./TextField";

/** Time input — the TextField base rendered as `type="time"`. The native format placeholder is muted while the field is empty. */
export interface TimeFieldProps extends Omit<TextFieldProps, "type"> {}

export declare function TimeField(props: TimeFieldProps): React.ReactElement;
