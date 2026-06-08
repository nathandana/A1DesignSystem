import * as React from "react";

export interface PageNavSection {
  /** Unique ID that matches the `id` on the corresponding heading/section element */
  id: string;
  /** Label shown in the nav */
  label: string;
  /** Heading nesting level for indentation. Default: 1 */
  level?: 1 | 2;
}

export interface PageNavProps extends React.HTMLAttributes<HTMLDivElement> {
  /** List of page sections to link to */
  sections?: PageNavSection[];
  /** Accessible label for the `<nav>` and the visible heading. Default: "On this page" */
  label?: string;
}

export declare function PageNav(props: PageNavProps): React.ReactElement;
