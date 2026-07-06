import * as React from "react";

export interface OverlayProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  /** Whether the full-screen overlay is open. Default: false */
  open?: boolean;
  /** Called when the user dismisses the overlay with Escape or the close button. Omit for an intentionally blocking overlay. */
  onClose?: () => void;
  /** Status colour treatment. Default: "info" */
  status?: "neutral" | "info" | "success" | "warn" | "error";
  /** Icon name shown above the message. Defaults to the status icon. Pass null to hide the icon. */
  icon?: string | null;
  /** Primary heading for the overlay. Used as the accessible label when no aria label is provided. */
  title?: React.ReactNode;
  /** Body copy shown below the title. Used as the accessible description when no aria description is provided. */
  body?: React.ReactNode;
  /** Action buttons or links shown below the message. */
  actions?: React.ReactNode;
  /** Accessible label for the close button. Defaults to the overlay dismiss system label. */
  dismissLabel?: string;
  /** Additional content shown below body copy and above actions. */
  children?: React.ReactNode;
}

export declare function Overlay(props: OverlayProps): React.ReactElement;
