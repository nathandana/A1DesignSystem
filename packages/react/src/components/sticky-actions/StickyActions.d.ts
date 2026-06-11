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

export declare function StickyActions(props: StickyActionsProps): JSX.Element;
