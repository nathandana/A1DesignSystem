import * as React from "react";
import type { HeadingProps } from "../heading/Heading";

export type DefinitionListDirection = "row" | "column";
export type DefinitionListSize = "sm" | "md" | "lg";
export type DefinitionListLabelWidth = "auto" | "fixed";

export interface DefinitionListItem {
  /** Stable key for this label/value pair. Falls back to label or index. */
  id?: React.Key;
  /** Label rendered in the `<dt>`. */
  label: React.ReactNode;
  /** Value rendered in the `<dd>`. */
  value?: React.ReactNode;
  /** Alternate value content for JSX object-literal ergonomics. */
  children?: React.ReactNode;
  /** Enables or disables the copy button for this item. Defaults to the list-level copyValue prop. */
  copyValue?: boolean;
  /** Exact text copied to the clipboard. Defaults to the rendered text value when it can be inferred. */
  copyText?: string;
  /** Accessible label for this item's copy button. Defaults to the list-level copyLabel. */
  copyLabel?: string;
  /** Accessible label shown after this item's value is copied. Defaults to the list-level copiedLabel. */
  copiedLabel?: string;
  /** Heading props for this item's value. Overrides the list-level valueHeadingProps. */
  valueHeadingProps?: Omit<HeadingProps, "children" | "className">;
}

export interface DefinitionListProps extends React.HTMLAttributes<HTMLDListElement> {
  /** Label/value pairs to render as `<dt>` and `<dd>` groups. */
  items?: DefinitionListItem[];
  /** Pair layout direction. Default: "row" */
  direction?: DefinitionListDirection;
  /** Spacing and body text size. Default: "md" */
  size?: DefinitionListSize;
  /**
   * Row label sizing. "auto" lets each label hug content; "fixed" aligns values on a responsive label column.
   * Only applies when direction="row". Default: "auto"
   */
  labelWidth?: DefinitionListLabelWidth;
  /** Show copy buttons for copyable text values. Can be overridden per item. Default: false */
  copyValue?: boolean;
  /** Accessible label for copy buttons. Default: "Copy value" */
  copyLabel?: string;
  /** Accessible label used after a copy succeeds. Default: "Copied" */
  copiedLabel?: string;
  /** Render values with Heading, including Heading type and size support. Can be overridden per item. */
  valueHeadingProps?: Omit<HeadingProps, "children" | "className">;
}

export declare function DefinitionList(props: DefinitionListProps): React.ReactElement;
