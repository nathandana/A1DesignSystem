import * as React from "react";

export interface AutocompleteOption {
  value: string;
  label?: string;
  /** A CSS colour rendered as a swatch beside the option (and on the selected value / chip). In `variant="color"` the swatch defaults to `value` when omitted. */
  swatch?: string;
  /** A Material Symbols glyph name rendered beside the option / chip / selected value. */
  icon?: string;
  /** Group name. When any option has a `group`, the listbox renders a sticky heading before each group's options. Options are ordered by each group's first appearance. */
  group?: string;
}

export interface AutocompleteProps {
  /** Suggestion list. Pass strings or `{ value, label }` objects. */
  options?: (string | AutocompleteOption)[];
  /** Selected value — a string in single mode, a string[] in multi mode. */
  value?: string | string[];
  /** Called with the new value (string, or string[] when `multiple`). */
  onChange?: (value: string | string[]) => void;
  /** Allow selecting more than one option (renders removable chips). Default: false */
  multiple?: boolean;
  /** Allow creating a value not in `options` ("Add …"). Default: false */
  allowCreate?: boolean;
  /** Called with the created value when an `allowCreate` option is chosen. */
  onCreate?: (value: string) => void;
  /** Visual variant. "color" renders a colour swatch beside each option / chip / the selected value (swatch defaults to the option `value`). Default: "default" */
  variant?: "default" | "color";
  /** Field label. */
  label?: React.ReactNode;
  /** Helper text shown below the control. */
  hint?: React.ReactNode;
  /** Error message; styles the control and replaces the hint. */
  error?: React.ReactNode;
  /** Size scale, matching the field family. Default: "default" */
  size?: "compact" | "default" | "comfortable";
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  /** Text shown when no options match. Default: "No matches" */
  emptyText?: React.ReactNode;
  /** Label for the create option, given the current query. */
  createLabel?: (query: string) => React.ReactNode;
  /** Cap the number of options rendered in the listbox (for very large lists like an icon picker). Excess options are hidden behind a "keep typing" footer. */
  maxVisible?: number;
  /** Footer text shown when the list is capped by `maxVisible`, given the shown count. */
  moreText?: (shown: number) => React.ReactNode;
  "aria-label"?: string;
}

export declare function Autocomplete(props: AutocompleteProps): React.ReactElement;
