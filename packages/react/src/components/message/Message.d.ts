import * as React from "react";

export interface MessageBadgeProps {
  /** Semantic status colour. Default: "neutral" */
  status?: "neutral" | "info" | "success" | "warn" | "error";
  /** Reduce background opacity for a softer appearance. Default: false */
  subtle?: boolean;
  /** Size. Default: "md" */
  size?: "sm" | "md" | "lg";
  /**
   * Override the default status icon. Pass `null` to suppress the icon entirely.
   */
  icon?: string | null;
  children?: React.ReactNode;
}

export interface MessageEmptyStateProps {
  /**
   * Visual scale — matches the container this empty state lives in. Default: "section"
   * page = largest (h1), section = medium (h2), card = compact (h3)
   */
  scale?: "page" | "section" | "card";
  /** Material Symbols icon name shown above the title. Default: "inbox" */
  icon?: string;
  /** Primary message */
  title?: string;
  /** Supporting description text */
  description?: string;
  /** Action element (e.g. a Button) */
  action?: React.ReactNode;
}

export declare function MessageBadge(props: MessageBadgeProps): React.ReactElement;
export declare function MessageEmptyState(props: MessageEmptyStateProps): React.ReactElement;
