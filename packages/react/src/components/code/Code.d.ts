import * as React from "react";

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /** Code presentation. Inline keeps minimal padding for prose; block renders a preformatted block. Default: "inline" */
  variant?: "inline" | "block";
  /** Allow long inline snippets or block code to wrap. Wrapped block lines hang at their own indentation. Default: false */
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

/**
 * Width of a line's leading spaces and tabs in character cells (tabs advance to
 * the next tab stop of 8). Code uses it as a hanging indent for wrapped lines;
 * when passing element children (e.g. highlighted spans) with `wrapping`, wrap
 * each line in `<span className="a1-code-block__line" style={{ "--a1-code-indent": n }}>`
 * followed by a newline so continuation lines and line numbers stay aligned.
 */
export declare function codeLineIndent(line: string): number;
