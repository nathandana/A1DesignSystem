import * as React from "react";

export type ChipSize = "sm" | "md" | "lg";
export type ChipSelectionMode = "none" | "single" | "multiple";

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  /** Element or component to render as. Defaults to "button", or "a" when href is provided. */
  as?: React.ElementType;
  /** Link target for navigation chips. */
  href?: string;
  /** Material Symbols icon name shown before the title. */
  icon?: string;
  /** Short visible chip title. Children are used when title is omitted. */
  title?: React.ReactNode;
  /** Visual selected state. Usually controlled by ChipGroup. Default: false */
  selected?: boolean;
  /** Disable the chip. Default: false */
  disabled?: boolean;
  /** Size. Default: "md" */
  size?: ChipSize;
  /** Menu content shown from this chip. Use for filter chips that open option menus. */
  menu?: React.ReactNode | ((api: { close: () => void }) => React.ReactNode);
  /** Accessible label for the opened menu. Defaults to the chip title when it is a string. */
  menuLabel?: string;
}

export interface ChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Selection behavior. Use "none" for navigation/menu chip rows. Default: "none" */
  selectionMode?: ChipSelectionMode;
  /** Controlled selection value. String for single mode, string[] for multiple mode. */
  value?: string | string[];
  /** Initial uncontrolled selection value. String for single mode, string[] for multiple mode. */
  defaultValue?: string | string[];
  /** Called with the next selected value. */
  onChange?: (value: string | string[]) => void;
  /** Allow chips to wrap onto multiple lines. Default: true */
  wrap?: boolean;
  /** Size applied to child chips that do not set their own size. Default: "md" */
  size?: ChipSize;
  /** Optional visible group label. */
  label?: React.ReactNode;
  /** Child Chip elements. */
  children?: React.ReactNode;
}

export declare function Chip(props: ChipProps): React.ReactElement;
export declare function ChipGroup(props: ChipGroupProps): React.ReactElement;
