import * as React from "react";

export interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  /** Whether the dialog is visible. Default: false */
  open?: boolean;
  /** Called when the user closes the dialog (Escape, close button, or backdrop click) */
  onClose?: () => void;
  /** Dialog title shown in the header */
  title?: string;
  /** Footer content — wrapped in a right-aligned `ButtonContainer` */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export declare function Dialog(props: DialogProps): React.ReactElement;
