import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Underlying element or component to render. Default: "button" */
  as?: React.ElementType;
  /** Visual style. Default: "primary" */
  variant?: "primary" | "secondary" | "tertiary" | "destructive" | "success";
  /** Size. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Material Symbols icon name to show alongside the label */
  icon?: string;
  /** Whether the icon appears before or after the label. Default: "start" */
  iconPosition?: "start" | "end";
  children?: React.ReactNode;
}

export declare function Button(props: ButtonProps): React.ReactElement;
