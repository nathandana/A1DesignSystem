import * as React from "react";

import type { VerificationDialogProps } from "../verification-dialog/VerificationDialog";

export type OverflowMenuVerification = React.ReactElement<VerificationDialogProps>;
export interface OverflowMenuAction {
  /** Unique, stable identity within this menu. */
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  destructive?: boolean;
  /** Optional navigation destination; delayed until verification succeeds. */
  href?: string;
  /** Nested VerificationDialog element. OverflowMenu supplies open/onClose/onConfirm. Optional for any action. */
  verification?: OverflowMenuVerification;
}
export interface OverflowMenuProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> {
  /** Accessible trigger/menu name. Defaults to the localized More actions label. */
  label?: string;
  size?: "sm" | "md" | "lg";
  /** Ordered menu items. Empty by default; an empty menu has a disabled trigger. */
  actions?: OverflowMenuAction[];
  /** Called once on immediate activation or confirmation; never on dismissal. Host owns application behavior and asynchronous work. */
  onAction?: (action: OverflowMenuAction) => void;
}
export declare function OverflowMenu(props: OverflowMenuProps): React.ReactElement;
