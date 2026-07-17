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
  /** Render the block as an editable textarea initialized from children. Only meaningful in block mode. Default: false */
  editable?: boolean;
  /** Visible textarea rows when editable. Default: 10 */
  rows?: number;
  /** Show a non-interactive gutter with one number per logical line. Only meaningful for block code. Default: false */
  lineNumbers?: boolean;
  /** Called with the current string value whenever the editable textarea changes. */
  onChangeValue?: (value: string) => void;
  /** Cap a long read-only block to `collapsedLines` with a fade + Show more/less toggle (the toggle appears only when the content overflows). Block, non-editable only. Default: false */
  collapsible?: boolean;
  /** Approximate number of lines shown when collapsed. Default: 14 */
  collapsedLines?: number;
  children?: React.ReactNode;
}

export declare function Code(props: CodeProps): React.ReactElement;
