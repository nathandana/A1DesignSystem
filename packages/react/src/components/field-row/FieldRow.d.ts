import * as React from "react";

export interface FieldRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lays out multiple field components side by side in a single row. */
  children?: React.ReactNode;
}

export declare function FieldRow(props: FieldRowProps): React.ReactElement;
