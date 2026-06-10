import * as React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Material Symbols icon name */
  icon: string;
  /** Accessible label (used as `aria-label` and visible tooltip) */
  label: string;
  /** Visual style. Default: "tertiary" */
  variant?: "tertiary" | "secondary" | "destructive" | "success";
  /** Button size. "lg" matches Button's large touch target (3.5rem) and icon size, suitable for pairing with large Buttons. Default: "md" */
  size?: "md" | "lg";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export declare function IconButton(props: IconButtonProps): React.ReactElement;
