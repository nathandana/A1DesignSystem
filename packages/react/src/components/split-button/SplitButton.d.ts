import * as React from "react";

/** A secondary action shown in the split button's menu. */
export interface SplitButtonAction {
  id: string;
  label: React.ReactNode;
  /** Optional Material Symbols icon name. */
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface SplitButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Main button label. */
  children?: React.ReactNode;
  /** Main (default) action. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Visual style, shared by both targets. Default: "primary". */
  variant?: "primary" | "secondary" | "tertiary" | "destructive" | "success";
  /** Size, shared by both targets. Default: "md". */
  size?: "sm" | "md" | "lg";
  /** Optional Material Symbols icon on the main button. */
  icon?: string;
  /** Icon position on the main button. Default: "start". */
  iconPosition?: "start" | "end";
  /** Show a spinner on the main button and make both targets inert. Default: false. */
  loading?: boolean;
  /** Disable both targets. Default: false. */
  disabled?: boolean;
  /** Secondary actions shown in the dropdown menu. */
  actions?: SplitButtonAction[];
  /** Accessible name for the menu. Default: "More actions". */
  menuLabel?: string;
  /** Accessible name for the caret toggle. Default: "More actions". */
  toggleLabel?: string;
  className?: string;
}

export declare function SplitButton(props: SplitButtonProps): React.ReactElement;
