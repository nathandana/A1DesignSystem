import * as React from "react";

export interface TopHeaderNavItem {
  id?: string;
  label?: React.ReactNode;
  href?: string;
  onClick?: (event: React.SyntheticEvent) => void;
  /** Material Symbols icon name. */
  icon?: string;
  /** Render the desktop nav item as an icon-only affordance with `label` as the accessible name. */
  iconOnly?: boolean;
  active?: boolean;
  /** Optional custom content rendered above this item's submenu sections. */
  menuHeader?: React.ReactNode | ((helpers: { onClose: () => void }) => React.ReactNode);
  /** Secondary line shown in dropdown/submenu entries. */
  description?: string;
  /** Nested items — renders the entry as a dropdown submenu. */
  items?: TopHeaderNavItem[];
  /** Starts a new menu section; optional `label` becomes that section label. */
  divider?: boolean;
  /** Only shown in the mobile nav overlay. */
  mobileOnly?: boolean;
  /** Renders as a non-interactive group header (submenus/mobile nav). */
  isHeader?: boolean;
  /** Renders menu entries with destructive styling. */
  danger?: boolean;
}

export interface TopHeaderAction extends TopHeaderNavItem {
  /** Badge content shown on the action (e.g. a count). */
  badge?: React.ReactNode;
}

/** Per-breakpoint nav icon position, cascading upward from xs. */
export type TopHeaderNavIconPosition = "start" | "above" | "hidden";

export interface TopHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Logo node rendered before the logo text. */
  logo?: React.ReactNode;
  logoText?: React.ReactNode;
  /** Default: "/" */
  logoHref?: string;
  navItems?: TopHeaderNavItem[];
  /** Trailing action buttons/menus (icon buttons with optional dropdowns). */
  actions?: TopHeaderAction[];
  /**
   * Login affordance rendered after the actions as a small primary Button.
   * Pass `{ label, onClick }` (label defaults to "Log in"), or a plain string
   * used as the label — the JSON-safe form used by page definitions.
   */
  loginButton?: string | { label?: string; onClick?: React.MouseEventHandler<HTMLButtonElement> };
  /**
   * Position of nav-item icons relative to their labels, or "hidden" to
   * suppress nav items at that breakpoint. Accepts a single value or a
   * responsive object. Default: "start"
   */
  navIconPosition?:
    | TopHeaderNavIconPosition
    | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", TopHeaderNavIconPosition>>;
  className?: string;
}

/** App header with logo, nav items (with dropdown submenus), actions, and a mobile nav overlay. */
export declare function TopHeader(props: TopHeaderProps): React.ReactElement;
