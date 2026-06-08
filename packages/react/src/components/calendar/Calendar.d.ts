import * as React from "react";

export interface CalendarMonth {
  /** Full calendar year, e.g. 2026 */
  year: number;
  /** 1-indexed month: 1 = January … 12 = December */
  month: number;
}

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Display mode.
   * - `"scroll"` — renders all months vertically; parent container controls scrolling (default).
   * - `"paginated"` — shows one month at a time with prev/next buttons and month/year selects.
   */
  variant?: "scroll" | "paginated";
  /**
   * Month to centre the scroll position on at mount (scroll) or the initial month shown (paginated).
   * Accepts a `Date` object or `{ year, month }` (month is 1-indexed).
   * Defaults to the current month.
   */
  initialMonth?: Date | CalendarMonth;
  /**
   * Total number of months to render. Only applies to `variant="scroll"`.
   * Default: 13
   */
  monthsToShow?: number;
  /**
   * Highlight today's date with the action colour.
   * Default: true
   */
  highlightToday?: boolean;
  /**
   * Apply a background tint to dates before today.
   * Default: true
   */
  dimPast?: boolean;
  /**
   * Show a "Today" button in the paginated nav bar that jumps to the current month.
   * Disabled automatically when already on the current month.
   * Only applies to `variant="paginated"`.
   * Default: false
   */
  todayButton?: boolean;
}

export declare function Calendar(props: CalendarProps): React.ReactElement;
