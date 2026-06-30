import * as React from "react";

export interface MenuProps {
  /** Whether the menu is open */
  open: boolean;
  /** Called when the menu should close */
  onClose?: () => void;
  /** Ref to the trigger element — used to position the menu below it */
  anchorRef?: React.RefObject<HTMLElement>;
  /** Accessible label for the menu `dialog` element */
  "aria-label"?: string;
  /** Whether Tab navigation is trapped inside the menu while open. Defaults to true. */
  trapFocus?: boolean;
  /** Whether the menu opens as a modal dialog on narrow viewports. Defaults to true. */
  modalOnMobile?: boolean;
  /** Additional CSS class names for the menu dialog */
  className?: string;
  children?: React.ReactNode;
}

export interface MenuSectionProps {
  /** Optional section label shown above the items */
  label?: string;
  children?: React.ReactNode;
}

export interface MenuItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Material Symbols icon name shown before the label */
  icon?: string;
  /** Keyboard shortcut hint displayed at the trailing end */
  shortcut?: string;
  /** Visual style. Default: "default" */
  variant?: "default" | "destructive";
  /** Marks this item as the current page. Adds a left-border indicator and aria-current="page". */
  active?: boolean;
  disabled?: boolean;
  /** Renders as an anchor `<a>` when provided */
  href?: string;
  onClick?: React.MouseEventHandler;
  children?: React.ReactNode;
}

export declare function Menu(props: MenuProps): React.ReactElement;
export declare function MenuSection(props: MenuSectionProps): React.ReactElement;
export declare function MenuItem(props: MenuItemProps): React.ReactElement;
