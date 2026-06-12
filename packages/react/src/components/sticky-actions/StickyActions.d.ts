import { ReactNode, HTMLAttributes } from "react";

export interface StickyActionsProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Constrains the inner content to the same max-widths as Section's contentWidth prop.
   * Match this to the contentWidth of the Section above so buttons align with page content.
   * "xs" = 28.5rem · "sm" = 40rem · "md" = 50rem · "lg" = 60rem · "xl" = 70rem · "2xl" = 90rem
   */
  contentWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  children?: ReactNode;
}

/**
 * Fixed bottom action bar for flows, wizards, and multi-step forms.
 *
 * Renders a position:fixed bar at the bottom of the viewport and an invisible
 * spacer sibling in document flow. The spacer height is measured via ResizeObserver
 * and kept in sync automatically — no manual bottom padding needed on the page.
 */
export declare function StickyActions(props: StickyActionsProps): JSX.Element;
