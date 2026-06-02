import * as React from "react";

export interface ButtonContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Horizontal alignment of buttons. Default: "start" */
  align?: "start" | "center" | "end";
  /** Uniform size applied to all child buttons. */
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export declare function ButtonContainer(props: ButtonContainerProps): React.ReactElement;
