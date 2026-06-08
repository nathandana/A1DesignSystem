import * as React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Ordered list of breadcrumb items.
   * The last item is treated as the current page (non-interactive).
   * All previous items render as links or buttons.
   */
  items?: BreadcrumbItem[];
  /**
   * Label for the back link shown in narrow containers. Defaults to "Back".
   */
  backLabel?: string;
}

export declare function Breadcrumb(props: BreadcrumbProps): React.ReactElement;
