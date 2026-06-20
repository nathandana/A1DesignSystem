import * as React from "react";

/** Standard icon name for a "none" selection. */
export declare const TOOLBAR_NONE_ICON: string;

/**
 * Whether a tool's label is shown. Pass a boolean, or a breakpoint object to
 * vary it responsively (cascades xs → xl, e.g. `{ xs: false, lg: true }` shows
 * labels only from the `lg` breakpoint up). When labels can be hidden at any
 * breakpoint the tool keeps an `aria-label`, so the accessible name is stable.
 */
export type ToolbarShowLabel =
  | boolean
  | { xs?: boolean; sm?: boolean; md?: boolean; lg?: boolean; xl?: boolean };

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the toolbar (ignored when `label` is set). */
  "aria-label"?: string;
  /**
   * Optional visible caption rendered above the bar, styled to match the compact
   * ChoiceGroup label. When set it also provides the toolbar's accessible name.
   */
  label?: React.ReactNode;
  /**
   * Lift the bar into a floating, elevated surface (shadow + border) for a
   * toolbar that hovers over page content (e.g. a selection formatting bar).
   * The consumer is responsible for positioning. Default: false
   */
  overlay?: boolean;
  /**
   * Stretch the bar to fill its container, with the tools growing to share the
   * available width (dividers keep their natural size). When false the bar is
   * `fit-content` wide. Default: false
   */
  fullWidth?: boolean;
  children?: React.ReactNode;
}
/** A compact container grouping related editing controls on one subtle surface. */
export declare function Toolbar(props: ToolbarProps): React.ReactElement;

/** Visual separator between tools within a Toolbar. */
export declare function ToolbarDivider(): React.ReactElement;

export interface ToolbarToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Material Symbols icon name. */
  icon?: string;
  /** A colour swatch (any CSS color) shown inside the tool. */
  swatch?: string;
  /** Accessible name (and tooltip); shown as text when `showLabel`. */
  label?: string;
  /** Pressed (on) state. */
  pressed?: boolean;
  /** Called with the next pressed state when clicked. */
  onChange?: (pressed: boolean) => void;
  /** Show the label as visible text; boolean or a responsive breakpoint object. Default: false */
  showLabel?: ToolbarShowLabel;
  disabled?: boolean;
}
/** A two-state toggle button (e.g. bold on/off). */
export declare function ToolbarToggle(props: ToolbarToggleProps): React.ReactElement;

export interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  /** A colour swatch (any CSS color) shown inside the tool. */
  swatch?: string;
  /** Accessible name (and tooltip); shown as text when `showLabel`. */
  label?: string;
  /** Show the label as visible text; boolean or a responsive breakpoint object. Default: false */
  showLabel?: ToolbarShowLabel;
}
/** A plain action button inside a Toolbar (no pressed state). */
export declare function ToolbarButton(props: ToolbarButtonProps): React.ReactElement;

export interface ToolbarMenuItem {
  value: string | number;
  label?: React.ReactNode;
  /** Material Symbols icon name shown beside the menu item. */
  icon?: string;
  disabled?: boolean;
}
export interface ToolbarMenuProps {
  /** Button icon. Defaults to the active item's icon when `value` matches one. */
  icon?: string;
  /** Accessible name (and tooltip); shown as text when `showLabel`. */
  label?: string;
  /** Currently selected value — marks the matching item active. */
  value?: string | number;
  /** Called with the chosen item value. */
  onChange?: (value: string | number) => void;
  items?: ToolbarMenuItem[];
  /** Show the label as visible text; boolean or a responsive breakpoint object. Default: false */
  showLabel?: ToolbarShowLabel;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}
/** A toolbar button that opens a dropdown Menu of choices (e.g. list types). */
export declare function ToolbarMenu(props: ToolbarMenuProps): React.ReactElement;

export interface ToolbarGroupOption {
  value: string | number;
  label?: React.ReactNode;
  /** Material Symbols icon name (rendered instead of the label in icon-only mode). */
  icon?: string;
  /** A colour swatch (any CSS color) shown inside the option. */
  swatch?: string;
  disabled?: boolean;
}
export interface ToolbarGroupProps {
  value?: string | number;
  /** Called with the newly selected option value. */
  onChange?: (value: string | number) => void;
  options?: ToolbarGroupOption[];
  /** Lay the options out as a `columns`-wide grid (e.g. 3 for a 3×3 picker). */
  columns?: number;
  /** Show option labels as text; boolean or a responsive breakpoint object. Default: false (icon-only) */
  showLabels?: ToolbarShowLabel;
  /**
   * `"all"` (default) honours `showLabels` for every option. `"selected"` shows
   * the label only on the currently selected option; the rest render icon/swatch-only
   * and a `"none"`/empty value falls back to the standard none icon. Use it for a
   * swatch picker where only the chosen swatch is named (e.g. Section surface/gradient).
   */
  labelMode?: "all" | "selected";
  "aria-label"?: string;
  disabled?: boolean;
  className?: string;
}
/** A single-select button group (radio semantics); set `columns` for a grid. */
export declare function ToolbarGroup(props: ToolbarGroupProps): React.ReactElement;
