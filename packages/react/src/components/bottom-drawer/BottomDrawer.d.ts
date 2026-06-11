import { ReactNode } from "react";

export interface BottomDrawerItem {
  /** Unique identifier for the item. */
  id: string;
  /** Display label shown below the icon. */
  label: string;
  /** Material Symbols icon name. */
  icon: string;
  /** Navigate to this URL — renders an <a> element. */
  href?: string;
  /** Click handler — used when no href is provided; renders a <button>. */
  onClick?: () => void;
  /** Marks this item as the currently active destination. */
  active?: boolean;
  /** Numeric badge count shown on the icon (capped at 99+). */
  badge?: number;
  /** Disables the item. */
  disabled?: boolean;
}

export interface BottomDrawerProps {
  /**
   * Up to 5 navigation items. Additional items beyond 5 are silently ignored.
   */
  items: BottomDrawerItem[];
  /**
   * Accessible name for the nav element.
   * @default "Primary navigation"
   */
  "aria-label"?: string;
}

export declare function BottomDrawer(props: BottomDrawerProps): ReactNode;
