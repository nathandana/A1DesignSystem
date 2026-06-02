import * as React from "react";

export interface PaginationProps {
  /** Current page number (1-based) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Called with the new page number when a page button is clicked */
  onChange?: (page: number) => void;
  /**
   * How many page numbers to show on each side of the current page.
   * Default: 1
   */
  siblings?: number;
  /** Size of the pagination buttons. Default: "md" */
  size?: "sm" | "md" | "lg";
}

export declare function Pagination(props: PaginationProps): React.ReactElement;
