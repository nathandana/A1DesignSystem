# Labs code syntax highlighting

Introduced in Labs 0.73.0 at `/experiments/code-highlighting`. A candidate
extension of A1 `Code`: the real Code component renders highlighted spans as
its children, so copy, line numbers, wrapping and collapse keep working. A1
Code gained shared behaviour in the same change (see below); the highlighter
itself stays in Labs.

## Files

| File | Role |
| --- | --- |
| `apps/a1-labs/src/code-highlighting/highlight.js` | Dependency-free tokenizer (JSX/JS, CSS, HTML, JSON), `toLines`, `parseLineRanges`, `diffKind` |
| `apps/a1-labs/src/code-highlighting/HighlightedCode.jsx` | `HighlightedCode` (wraps A1 Code) and experimental `LiveHighlightEditor` |
| `apps/a1-labs/src/code-highlighting/code-highlighting.css` | Palettes, roles, line highlight/diff, line spacing, editor overlay (`.a1-code-hl*`) |
| `apps/a1-labs/src/code-highlighting/samples.js` | Sample, diff and inline snippets per language, with long lines for wrapping |
| `apps/a1-labs/src/code-highlighting/CodeHighlightingExperiment.jsx` | Labs page |
| `system/tokens/component/code-highlight.json` | `component.codeHighlight.*` tokens |

## Tokenizer

Every character lands in exactly one token, in order, so joining token text
always reproduces the source (unit-tested on every sample and on unterminated
strings, comments and tags). Roles: keyword, string, number, constant,
function, tag, attribute, property, selector, comment, operator, punctuation;
anything else is plain text. It is a pragmatic highlighter for documentation
snippets, not a full grammar: JSX text children containing keywords or
apostrophes, regex literals and embedded `<style>`/`<script>` in HTML are not
handled specially.

## `HighlightedCode` API

`code` (string), `language` (`jsx` · `css` · `html` · `json`), `palette`
(`full` · `subtle` · `mono`), `highlightLines` (Set of 1-based lines),
`diff` (lines starting `+ ` / `- ` get added/removed tints), `lineSpacing`
(`default` · `separated`), `variant` (`block` · `inline`) and every A1 Code
prop (`lineNumbers`, `wrapping`, `copyCode`, `collapsible`, …).

Render tokens as plain strings and spans directly — not inside another
component. Code reads its children's text by walking element props (for copy
and line measurement); text produced inside a child component is invisible to
it, which once made Copy code copy only line breaks.

Each line is wrapped in `<span class="a1-code-block__line a1-code-hl__line"
style="--a1-code-indent: n">` followed by a real newline; `n` comes from A1's
exported `codeLineIndent()`.

## Palettes and contrast

Full colour: keyword error, string success, number/constant warn,
function/attribute accent, tag/property/selector info; comments and
punctuation muted (comments italic). Subtle: accent structure, green strings,
muted italic comments. Monochrome: no hue and no italics — semibold keywords,
tags and selectors (`emphasisWeight`) and muted comments.

The theme status text colours alone fall below 4.5:1 on code surfaces in
several themes (Lumen light ~1.1:1 for error/warn, Kong light accent 1.02:1,
Dispatch, Heritage dark). Each hued role therefore keeps its palette hue and
chroma but takes most of its lightness from the default text colour:
`oklch(from color-mix(in oklch, hue W%, text-default) l calc(c / W) h)` with
`hueWeight` 0.3. Muted roles mix 75% muted with default text
(`mutedWeight`). Inside `@supports` for relative colour syntax; otherwise the
raw palette colour is used. An axe colour-contrast sweep across every Labs
theme, light and dark, all palettes and languages passes except **Fresh
dark**, where default text itself is only 4.96:1 on the code panel — a theme
issue to fix in Fresh.

## Line highlight, diff, spacing

Highlighted lines use the action surface with an inline-start marker
(`lineMarkerWidth`); added/removed use success/error surfaces and markers.
The `+`/`-` text stays, so diffs are not colour-only. Forced colours outline
these lines.

Separated line spacing sets A1 Code's `--a1-code-line-height` to 20px and
`--a1-code-line-gap` to 8px (`separatedLineHeight` / `separatedLineGap`):
lines are 28px apart, rows of a wrapped line 20px.

## Live editor (experimental)

A transparent textarea (the accessible control, labelled by the visible
heading) over an `aria-hidden` highlighted layer, synced on scroll. Both share
font, padding, line height (`lineHeight` 1.6, mirroring Code) and
`white-space: pre`; the layer's `<code>` resets the global inline `code` rule
(0.875em, padding), which otherwise shrank the colours under the caret. The
selection uses the action colour at `selectionStrength` opacity so highlighted
text shows through. Forced colours shows the textarea's own text. No
wrapping, line numbers or diff while editing. Edits persist per language.

## A1 Code changes made for this experiment

- **Hanging indent:** with `wrapping`, continuation rows align with the line's
  leading spaces/tabs. Plain-text children render as per-line
  `.a1-code-block__line` spans; `codeLineIndent(line)` is exported for element
  children.
- **Exact line-number heights:** wrapped line numbers used `Math.ceil` per line,
  drifting ~0.6px per line; they now use exact heights.
- **Line spacing hooks:** `--a1-code-line-height` and `--a1-code-line-gap` (unset
  = unchanged) drive the code, gutter and measure copy together.
- **Scrollable region:** a read-only block that overflows sideways becomes a
  focusable region named by `code.scrollRegion` ("Scrollable code").

## Validation

`tests/code-highlighting.test.mjs` (round-trip, roles per language, lines,
ranges, diff markers) and `tests/code-highlighting.browser.mjs` (copy equals
source for every language; with wrapping, line numbers level and hanging
indent within 0.5px at Default and Separated; Separated pitch; highlight and
diff counts; Monochrome weight and no italics; axe in light and dark; live
editor caret alignment and translucent selection; no overflow at 390px). The
Code story "Wrapping with indentation and line numbers" covers plain-text
children including tab indentation. Not yet done: screen-reader review and a
host outside Labs.
