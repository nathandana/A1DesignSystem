import * as React from "react";

/** One key detail: a label and its value, shown as a row in the card's definition list. */
export interface OverviewCardDetail {
  label: React.ReactNode;
  value: React.ReactNode;
}

/** A card action as data — a small Button (secondary or tertiary), a Link or a small IconButton. */
export interface OverviewCardAction {
  id?: string;
  /** What the action renders as. Default: "button". */
  kind?: "button" | "link" | "icon-button";
  /** The label; for an icon button supply a string as its accessible name. */
  label: React.ReactNode;
  /** Variant: "secondary" by default for a button, "tertiary" for an icon button. Cards have no primary action. */
  variant?: "secondary" | "tertiary";
  /** Material Symbols icon name — optional for buttons and links, the icon of an icon button. */
  icon?: string;
  iconPosition?: "start" | "end";
  /** A link's URL; on a button, renders it as an anchor to this URL. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
}

/**
 * The overview card. Its presentation is locked — default card surface, the
 * standard icon block, a md heading, row details with fixed labels and small,
 * non-primary actions — so every overview in a set reads the same.
 * Width is allocated by its parent layout; the pattern adds no width constraint.
 */
export interface OverviewCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Material Symbols icon in the card's icon block. Default: "account_circle". */
  icon?: string;
  /** The card heading. */
  title: React.ReactNode;
  /** Heading level, to fit the page outline. Default: "h3". The size is fixed. */
  titleAs?: "h2" | "h3" | "h4";
  /** Status stripe tone. Shown only with `statusLabel`, so status is never colour-only. */
  status?: "neutral" | "info" | "success" | "warn" | "error";
  /** Status badge text; turns the status on. */
  statusLabel?: React.ReactNode;
  /** Key details, as a row definition list with fixed-width labels. */
  details?: OverviewCardDetail[];
  /**
   * Card actions: composed Buttons, Links and IconButtons, or
   * `OverviewCardAction` data. Buttons and icon buttons are small and never
   * primary — a button's primary or unset variant becomes secondary — because
   * cards repeat in a grid.
   */
  actions?: React.ReactNode | OverviewCardAction[];
  /** The content area, between the details and the actions — a short paragraph, a progress bar or a chart. */
  children?: React.ReactNode;
}

export declare function OverviewCard(props: OverviewCardProps): React.ReactElement;

/** The card-action rule for action data: a primary or unset button variant becomes secondary. */
export declare function normalizeOverviewCardActions(actions: OverviewCardAction[]): OverviewCardAction[];
