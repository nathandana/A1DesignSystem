import * as React from "react";

export interface ButtonContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Horizontal alignment of buttons. Default: "start" */
  align?: "start" | "center" | "end";
  /** Default size passed to child Button elements that do not set their own size. */
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export declare function ButtonContainer(props: ButtonContainerProps): React.ReactElement;
