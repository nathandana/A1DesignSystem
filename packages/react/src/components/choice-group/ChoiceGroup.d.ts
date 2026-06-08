import * as React from "react";

export interface ChoiceGroupSection {
  /** Section heading displayed above the section's tiles */
  label: string;
  /** Options in this section */
  options: ChoiceOption[];
}

export interface ChoiceOption {
  value: string;
  label: string;
  subtext?: string;
  icon?: string;
  disabled?: boolean;
}

export interface ChoiceGroupProps {
  /** Group legend */
  label?: string;
  /** Helper text — hidden when error or success is present */
  hint?: string;
  /** Error message */
  error?: string;
  /** Success message — shown instead of hint when present, hidden if error is also present */
  success?: string;
  /** Tile size density — affects only padding and child element sizes. Default: "default" */
  size?: "compact" | "default" | "comfortable";
  /**
   * Column count. Pass a number for a fixed count at all breakpoints, or a
   * breakpoint object for responsive behaviour, e.g. `{ xs: 1, sm: 2, md: 3 }`.
   * Omit (default) for automatic fill based on tile min-width.
   */
  columns?: number | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", number>>;
  /**
   * Allow multiple selections (checkbox semantics). When false, only one
   * option may be selected at a time (radio semantics). Default: false
   */
  multiple?: boolean;
  /**
   * Place each tile's icon to the left of the label and subtext instead of
   * above the content block. Has no effect on tiles with no icon. Default: false
   */
  inlineIcon?: boolean;
  required?: boolean;
  /** Input name attribute. Defaults to the group id. */
  name?: string;
  /** Flat list of options. Use sections instead for grouped options with headings. */
  options?: ChoiceOption[];
  /**
   * Options divided into labeled sections with a divider between each group.
   * When provided, options is ignored.
   */
  sections?: ChoiceGroupSection[];
  /**
   * Controlled value. String for single-select; string[] for multi-select.
   * Pass undefined to use uncontrolled mode.
   */
  value?: string | string[] | null;
  /** Default value for uncontrolled mode. Default: null / [] */
  defaultValue?: string | string[] | null;
  /** Called with the selected value (string or string[]) on change */
  onChange?: (value: string | string[]) => void;
  id?: string;
  className?: string;
}

export declare function ChoiceGroup(props: ChoiceGroupProps): React.ReactElement;
