import * as React from "react";

export interface BottomSheetProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** First line shown in the header — the only content visible when collapsed. */
  title?: string;
  /**
   * Expanded heights as fractions of the viewport height (0–1), smallest first.
   * The collapsed state (header only) is always available as snap index 0.
   * Default: [0.5, 0.92].
   */
  detents?: number[];
  /** Controlled snap index. 0 = collapsed, then one index per `detents` entry. */
  detent?: number;
  /** Uncontrolled initial snap index. Default: 1 (the first detent). */
  defaultDetent?: number;
  /** Called with the next snap index when the detent changes. */
  onDetentChange?: (index: number) => void;
  children?: React.ReactNode;
}

export declare function BottomSheet(props: BottomSheetProps): React.ReactElement;
