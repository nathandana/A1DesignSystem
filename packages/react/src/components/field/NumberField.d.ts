import * as React from "react";
import { TextFieldProps } from "./TextField.d.ts";

export interface NumberFieldProps extends Omit<TextFieldProps, "type"> {
  /** Non-editable prefix rendered before the value at full input size and color (e.g. "$"). */
  prefix?: string;
  /** Non-editable unit label rendered after the value at smaller, muted size (e.g. "lbs", "km", "ft"). */
  unit?: string;
}

export declare function NumberField(props: NumberFieldProps): React.ReactElement;
