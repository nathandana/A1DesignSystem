import * as React from "react";

export interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  /** Whether the dialog is visible. Default: false */
  open?: boolean;
  /** Called when the user closes the dialog (Escape, close button, or backdrop click). Omit to hide the close button. */
  onClose?: () => void;
  /** Dialog title shown in the header */
  title?: string;
  /** Footer content — wrapped in a right-aligned `ButtonContainer` */
  footer?: React.ReactNode;
  /**
   * Status variant — renders a full-bleed colored hero area at the top with a status icon.
   * "success" | "error" | "warn" | "info" | "neutral"
   */
  status?: "success" | "error" | "warn" | "info" | "neutral";
  /** Override the icon shown in the hero area. Defaults to the status icon when `status` is set. */
  icon?: string;
  /**
   * Dialog width. "sm" (440px) for short confirmations, "md" (560px, default) for
   * standard content, "lg" (720px) and "xl" (920px) for wide, content-rich dialogs
   * (e.g. multi-tab detail views). Every size stays capped at the viewport width.
   * Default: "md"
   */
  size?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
}

export declare function Dialog(props: DialogProps): React.ReactElement;
