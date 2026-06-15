import * as React from "react";

export interface InlineEditableProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  /** Current text value (controlled). */
  value: string;
  /** Called with the new value as the user types. */
  onChange: (value: string) => void;
  /** Edit in a `<textarea>` instead of a single-line `<input>`. Default: false */
  multiline?: boolean;
  /** Prevents entering edit mode and removes the interactive affordances. Default: false */
  disabled?: boolean;
  /** Edit the text in place via `contentEditable` instead of a boxed field. The element inherits all typography (font, size, colour, line-height, alignment, wrapping) from the surrounding component, so editing never resizes or restyles the text — ideal for making any heading, paragraph, label, or button text live-editable. Only a focus ring is added. Default: false */
  seamless?: boolean;
  /** Text shown in the display state when there is no value and no `children`. */
  placeholder?: string;
  /** Class applied to the wrapper in the display state. */
  className?: string;
  /** Class applied to the `<input>` / `<textarea>` in the edit state. */
  inputClassName?: string;
  /** Display content rendered in the read state; falls back to `placeholder` when omitted. */
  children?: React.ReactNode;
}

export declare function InlineEditable(props: InlineEditableProps): React.ReactElement;
