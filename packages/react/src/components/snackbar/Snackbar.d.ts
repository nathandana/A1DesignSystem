import * as React from 'react';

export interface SnackbarProps {
  /** Controls visibility — renders nothing when false. Default: false */
  open?: boolean;
  /** Message content displayed inside the snackbar. */
  children?: React.ReactNode;
  /** Label for the optional action button. Both `actionLabel` and `onAction` must be provided to show the button. */
  actionLabel?: string;
  /** Called when the action button is clicked. Both `actionLabel` and `onAction` must be provided to show the button. */
  onAction?: () => void;
  /** Called when the dismiss icon button is clicked. Omit to hide the dismiss button. */
  onClose?: () => void;
  /**
   * Snackbar position.
   * Default: "bottom"
   */
  position?: 'bottom' | 'bottom-left' | 'bottom-right' | 'top' | 'top-left' | 'top-right';
  /** ARIA role. Default: "status" (aria-live="polite"). */
  role?: string;
  className?: string;
}

export declare function Snackbar(props: SnackbarProps): React.ReactElement | null;
