import * as React from "react";

export interface InverseProps extends React.HTMLAttributes<HTMLElement> {
  /** Underlying element. Default: "div" */
  as?: React.ElementType;
  children?: React.ReactNode;
}

export declare function Inverse(props: InverseProps): React.ReactElement;
