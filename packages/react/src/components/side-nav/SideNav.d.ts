import * as React from "react";

export interface SideNavProps {
  /**
   * Header slot. Pass a render function to receive the current `collapsed` state:
   * `header={(collapsed) => <Logo collapsed={collapsed} />}`
   */
  header?: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
  /** Footer slot — hidden when collapsed */
  footer?: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
  /** `SideNavItem` and `SideNavGroup` elements */
  children?: React.ReactNode;
  /** Controls overlay visibility on xs/sm/md viewports. Default: false */
  open?: boolean;
  /** Called when the scrim, Escape key, or close button is triggered */
  onClose?: () => void;
  /** Initial collapsed state for lg/xl (uncontrolled). Default: false */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state for lg/xl */
  collapsed?: boolean;
  /** Called with next boolean when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Where the desktop collapse toggle appears. Default: "header" */
  collapseButtonPlacement?: "header" | "footer";
  /** Side of the layout the nav occupies. Default: "start" */
  placement?: "start" | "end";
  className?: string;
}

export interface SideNavGroupProps {
  /** Material Symbols icon (recommended for collapsed state) */
  icon?: string;
  /** Trigger label */
  label: string;
  /** Initial expanded state (uncontrolled). Default: false */
  defaultOpen?: boolean;
  /** Controlled expanded state */
  open?: boolean;
  /** Called with next boolean when toggled */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface SideNavItemProps {
  /** Underlying element. Default: "a" */
  as?: React.ElementType;
  /** Material Symbols icon name */
  icon?: string;
  /** Visible label (also used as tooltip when collapsed) */
  label: string;
  /** Badge count shown next to the label */
  badge?: string | number;
  /** Mark as the current page. Default: false */
  active?: boolean;
  className?: string;
  [key: string]: any;
}

export declare function SideNav(props: SideNavProps): React.ReactElement;
export declare function SideNavGroup(props: SideNavGroupProps): React.ReactElement;
export declare function SideNavItem(props: SideNavItemProps): React.ReactElement;
