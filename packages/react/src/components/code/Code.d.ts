import * as React from "react";

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /** Code presentation. Inline keeps minimal padding for prose; block renders a preformatted block. Default: "inline" */
  variant?: "inline" | "block";
  /** Allow long inline snippets or block code to wrap. Default: false */
  wrapping?: boolean;
  /** Show a small tertiary copy button at the bottom-left of the code block. Default: false */
  copyCode?: boolean;
  /** Text copied to the clipboard. Defaults to the rendered text children. */
  copyText?: string;
  children?: React.ReactNode;
}

export declare function Code(props: CodeProps): React.ReactElement;
