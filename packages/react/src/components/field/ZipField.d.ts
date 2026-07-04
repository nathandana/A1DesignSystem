import * as React from "react";
import { TextFieldProps } from "./TextField";

/** Built-in ZIP mask patterns: `zip5` ("#####") and `zip9` ("#####-####"). */
export declare const ZIP_MASKS: {
  zip5: string;
  zip9: string;
};

export interface ZipFieldProps extends Omit<TextFieldProps, "type"> {
  /** Mask pattern; `#` marks a digit slot. Default: `ZIP_MASKS.zip5`. */
  mask?: string;
}

/** Masked ZIP code input built on the TextField base. */
export declare function ZipField(props: ZipFieldProps): React.ReactElement;
