import * as React from "react";

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Top header slot — rendered in a `<header>` landmark */
  header?: React.ReactNode;
  /** Bottom footer slot — rendered in a `<footer>` landmark */
  footer?: React.ReactNode;
  /** Side navigation panel — rendered in an `<aside>` landmark */
  sidebar?: React.ReactNode;
  /** Which side the sidebar occupies. Default: "start" */
  sidebarPlacement?: "start" | "end";
  /** Supplemental content panel (e.g. a table of contents) */
  aside?: React.ReactNode;
  /** Which side the aside occupies. Default: "end" */
  asidePlacement?: "start" | "end";
  /** Keep the header fixed at the top while content scrolls. Default: false */
  stickyHeader?: boolean;
  /** Constrain the layout to 100vh. Default: false */
  viewportHeight?: boolean;
  /** Main content */
  children?: React.ReactNode;
}

export declare function PageLayout(props: PageLayoutProps): React.ReactElement;
