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
  /** Milliseconds before calling `onClose`. Omit or pass 0 to disable. Pauses while hovered or focused. */
  autoHideDuration?: number;
  /** Show the close icon button when `onClose` is provided. Default: true */
  dismissible?: boolean;
  /**
   * Snackbar position.
   * Default: "bottom"
   */
  position?: 'bottom' | 'bottom-left' | 'bottom-right' | 'top' | 'top-left' | 'top-right';
  /** Render as a static item inside `SnackbarStack` instead of as a fixed overlay. Default: false */
  stacked?: boolean;
  /** ARIA role. Default: "status" (aria-live="polite"). */
  role?: string;
  className?: string;
  /**
   * @deprecated Accepted but ignored. Snackbar has a single visual style; use
   * `Banner` for persistent status-coloured messages. Will be removed in a
   * future major version.
   */
  variant?: string;
  /**
   * @deprecated Accepted but ignored. The inverse treatment is applied
   * internally. Will be removed in a future major version.
   */
  inverse?: boolean;
}

export declare function Snackbar(props: SnackbarProps): React.ReactElement | null;

export interface SnackbarStackItem {
  id?: React.Key;
  /** Hide this item without removing it from the collection. Default: true */
  open?: boolean;
  /** Message content for this snackbar item. */
  children?: React.ReactNode;
  /** Plain text message fallback when `children` is not provided. */
  message?: React.ReactNode;
  /** Label for this item's optional action button. */
  actionLabel?: string;
  /** Called when this item's action button is clicked. */
  onAction?: () => void;
  /** Called when this item's dismiss icon button is clicked. */
  onClose?: () => void;
  /** Milliseconds before calling this item's `onClose`. Omit or pass 0 to disable. */
  autoHideDuration?: number;
  /** Show the close icon button when `onClose` is provided. Default: true */
  dismissible?: boolean;
  /** ARIA role for this item. Default: "status" */
  role?: string;
  className?: string;
}

export interface SnackbarStackProps {
  /** Snackbar items in visual order. Put the newest item first when stacking toasts. */
  items?: SnackbarStackItem[];
  /** Composed Snackbar children. Children are rendered as stacked/static items. */
  children?: React.ReactNode;
  /**
   * Stack position.
   * Default: "bottom"
   */
  position?: SnackbarProps['position'];
  className?: string;
}

export declare function SnackbarStack(props: SnackbarStackProps): React.ReactElement | null;
