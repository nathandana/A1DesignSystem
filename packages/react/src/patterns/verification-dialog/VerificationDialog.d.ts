import * as React from "react";
export interface VerificationDialogProps extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, "title" | "onClose"> {
  open?: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Optional label-service keys; the corresponding text props remain fallbacks. */
  titleKey?: string;
  messageKey?: string;
  confirmLabelKey?: string;
  cancelLabelKey?: string;
  destructive?: boolean;
  /** Prevent confirmation while leaving cancellation available. */
  disabled?: boolean;
  /** The host controls open and closes the dialog after either outcome. */
  onClose?: () => void;
  /** Runs only after confirmation, at most once per open session. */
  onConfirm?: () => void;
  /** Open supporting-content area between the message and the fixed action footer. */
  children?: React.ReactNode;
}
export declare function VerificationDialog(props: VerificationDialogProps): React.ReactElement;
