import * as React from "react";
import { TextFieldProps } from "./TextField";

export interface SearchFieldProps extends Omit<TextFieldProps, "type" | "inputOverlay"> {
  /** Called on every keystroke (native change event). */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Called after the clear button empties the field. */
  onClear?: () => void;
  /** Called with the current value when Enter is pressed. */
  onSearch?: (value: string) => void;
  /** Accessible label for the clear button. Default: the `field.clearSearch` label ("Clear search"). */
  clearLabel?: string;
}

export declare const SearchField: React.ForwardRefExoticComponent<
  SearchFieldProps & React.RefAttributes<HTMLInputElement>
>;
