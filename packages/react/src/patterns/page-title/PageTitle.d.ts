import * as React from "react";
import type { BreadcrumbItem } from "../../components/breadcrumb/Breadcrumb";

/**
 * A page action as data — a Button, a Link or an IconButton. For a SplitButton,
 * a ButtonContainer group, a Toolbar or a SegmentedControl, compose the
 * component itself in `actions`.
 */
export interface PageTitleAction {
  id?: string;
  /** What the action renders as. Default: "button". */
  kind?: "button" | "link" | "icon-button";
  /** The label; for an icon button it is the accessible name (and tooltip). */
  label: React.ReactNode;
  /**
   * Variant for a button (default "secondary") or an icon button (default
   * "tertiary"; icon buttons have no primary). At most one *button* is
   * "primary" and it always renders last — PageTitle keeps the first primary,
   * moves it to the end and turns any further primaries into secondary.
   */
  variant?: "primary" | "secondary" | "tertiary" | "destructive" | "success";
  /** Material Symbols icon name — optional for buttons and links, the icon of an icon button. */
  icon?: string;
  /** A link's URL; on a button or icon button, renders it as an anchor to this URL. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
}

/** One badge in the metadata row below the title. The data form page definitions use. */
export interface PageTitleBadge {
  id?: string;
  label: React.ReactNode;
  status?: "neutral" | "info" | "success" | "warn" | "error";
  /** Material Symbols icon name; `null` hides the status icon. */
  icon?: string | null;
}

/**
 * The page title band. Its presentation is locked — panel surface, fixed title
 * scale (lg on xs, xxl from md), an h1 heading and the metadata row directly
 * below it — so every page top matches; only the content and the content width
 * are configurable.
 */
export interface PageTitleProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Breadcrumb trail above the title; the last item is the current page. Omit
   * to show none. `true` is the page-definition form — "build it from the page
   * hierarchy" — which a host that knows the pages resolves to items before
   * rendering (a1-web does); the component itself shows nothing for `true`.
   */
  breadcrumb?: BreadcrumbItem[] | true;
  /** Label for the breadcrumb's back link in narrow containers. Default: "Back". */
  backLabel?: string;
  /** Short category label above the title (the A1 eyebrow composition). */
  eyebrow?: React.ReactNode;
  /** The page title, rendered as the page's h1. */
  title: React.ReactNode;
  /** `id` on the heading, for `aria-labelledby` on the sections that follow. */
  titleId?: string;
  /** Short supporting text under the title. */
  description?: React.ReactNode;
  /**
   * The metadata row, always directly below the title: badge data (one or a
   * list, rendered as small subtle MessageBadges) or composed nodes such as
   * your own badges. Replaces the former `accessory`.
   */
  meta?: React.ReactNode | PageTitleBadge | PageTitleBadge[];
  /**
   * Page actions: composed controls — Button, SplitButton, Link, IconButton, a
   * ButtonContainer group, Toolbar or SegmentedControl — or a list of
   * `PageTitleAction` descriptors. At most one primary (a Button or SplitButton,
   * which are primary by default) and it is shown last; a ButtonContainer group
   * stays together, with its primary at its end and the group last. Actions sit
   * in a ButtonContainer, so they stack full-width on narrow containers.
   */
  actions?: React.ReactNode | PageTitleAction[];
  /** Section content width — match the sections that follow. Default: "xl". */
  contentWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Extra content below the actions, such as a search field or tab strip. */
  children?: React.ReactNode;
}

export declare function PageTitle(props: PageTitleProps): React.ReactElement;

/**
 * The page-action rule for action data: keeps the first primary, moves it to
 * the end, and makes any further primaries secondary. PageTitle applies it
 * itself; use it to show the canonical order elsewhere (code, JSON).
 */
export declare function normalizePageTitleActions(actions: PageTitleAction[]): PageTitleAction[];
