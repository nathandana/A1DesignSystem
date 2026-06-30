import * as React from "react";

export interface StatProps extends React.HTMLAttributes<HTMLElement> {
  /** Underlying element. Default: "div" */
  as?: React.ElementType;
  /** Metric label shown above the value. */
  title?: React.ReactNode;
  /** Metric value. Numbers can be formatted with locale, precision, and separator props. */
  value?: React.ReactNode | number;
  /** Content shown before the value, such as a currency symbol. */
  prefix?: React.ReactNode;
  /** Content shown after the value, such as a unit or percent sign. */
  suffix?: React.ReactNode;
  /** Supporting context shown below the value. */
  description?: React.ReactNode;
  /** Material Symbols icon shown with the title. */
  icon?: string;
  /** Optional badge label shown after the description. */
  badge?: React.ReactNode;
  /** Badge status tone. Default: "neutral" */
  badgeStatus?: "neutral" | "info" | "success" | "warn" | "error";
  /** Render the badge in its subtle treatment. Default: true */
  badgeSubtle?: boolean;
  /** Badge size. Default: "sm" */
  badgeSize?: "sm" | "md" | "lg";
  /** Material Symbols icon override for the badge. Pass null to suppress the default badge icon. */
  badgeIcon?: string | null;
  /** Formatting mode. None renders the value as provided; percent appends a percent sign without multiplying the value. Default: "number" */
  format?: "none" | "number" | "percent";
  /** Metric scale. Default: "md" */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Horizontal alignment. Default: "start" */
  align?: "start" | "center" | "end";
  /** Locale passed to Intl.NumberFormat when value is numeric. */
  locale?: string;
  /** Fixed fraction digits for numeric values. */
  precision?: number;
  /** Grouping separator for numeric values. Pass false to disable grouping. */
  groupSeparator?: string | false;
  /** Decimal separator for numeric values. */
  decimalSeparator?: string;
}

export declare function Stat(props: StatProps): React.ReactElement;
