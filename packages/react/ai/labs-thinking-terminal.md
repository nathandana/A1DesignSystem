# Labs AI thinking

`/experiments/thinking-terminal` demonstrates a simulated chat with terminal-style
status text. This is an activity indicator, not generated content or an AI
model’s hidden reasoning. No messages leave the browser. Follow the
[Labs isolation and promotion contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Reusable candidate

`apps/a1-labs/src/thinking-terminal/ThinkingTerminal.jsx` accepts `lines` (array of
strings) and `paused` (boolean, default false). It depends on React, A1 Paragraph,
the shared screen-reader utility, its own stylesheet/model and A1 tokens. It does not depend
on Labs routing, the demo chat, configuration, sample copy or other experiments.
Mount it while work is pending; unmount it when the host has a result. Changing
lines resets the sequence; changing `paused` preserves progress. Empty input
shows a static Thinking fallback. A single line types once without restarting.

The demo owns editable lines, Apply/Reset, a message composer and a deterministic
sample response. Send message restarts thinking; Finish thinking reveals the
sample response. Stop/Resume animation controls the timer and cursor; both playback buttons live
in the configuration panel (the mobile sheet on small screens). The app
uses the standard responsive shell, tree search, settings and mobile sheet.

## Timing and text

The first configured line appears first. Subsequent picks are uniform across the
remaining lines, excluding the immediately preceding line. Duplicate and blank
lines are removed. Typing operates on grapheme clusters, so joined emoji and
combining characters stay intact. Each new thought replaces the previous one in the same output line; do not
append a command history or additional rows.

`component.thinkingTerminal.*` supplies 35 ms per typed character, 30 ms of
reading time per character, a minimum 1,200 ms full-line hold, a 1,000 ms cursor
cycle and a 1em-tall cursor that follows the text size. Total duration is typing time plus the greater of the
minimum hold and length-based reading time. Long lines therefore remain visible
longer; the next line cannot replace partially typed text. Hidden tabs do not
fast-forward unread lines. Timers and media-query listeners clean up on unmount.

Configuration validates 1–20 distinct lines, at most 160 graphemes per line,
and a 4,000-character editor limit. Edits do not disrupt the current sequence
until Apply lines. Text is rendered as React text, never evaluated as commands
or HTML. Default copy uses the user-supplied moose sentence and original absurdist
status lines, not additional film dialogue. Keep demo copy outside the core.

## Accessibility and isolation

The animated text replaces the visible Thinking label directly beneath Assistant,
without a panel, border or reserved output height. A screen-reader-only stable
polite status announces Thinking, pause and resume; the terminal artwork
is `aria-hidden` so typing and random copy do not repeatedly interrupt
screen-reader users. The result uses a separate polite status outside the busy
visual. Native A1 controls keep keyboard semantics and visible focus. Reduced
motion shows a full static current line, disables automatic line changes and
stops the cursor. The preference updates live. Pause and Finish thinking are available in the configuration panel and
mobile sheet, outside the chat content.

All custom CSS is scoped to `a1-thinking-terminal*`; only terminal typography, wrapping and cursor artwork are custom. A1 Paragraph
supplies the text row. Native code uses existing A1 monospace tokens because
A1 Code’s inline and block variants both add a surface. Stack and Section supply
the surrounding chat layout. All colors
come from live theme tokens. No global or shared component overrides.

Before promotion, validate the core in a minimal A1 host, keyboard controls,
random selection, duration scaling, Unicode input, empty/single-line input,
reduced motion, responsive layouts and light/dark appearance. Human screen-reader
review and the normal shared-component integration workflow remain outstanding.
Refresh the card using the preview capture script’s `--thinking-only` option.

## Recorded checks — Oct. 11, 2026

- The current 1em cursor height matches the computed font size at both normal
  and doubled text sizes. This supersedes the earlier 24 px cursor below.

- The background-free indicator passed compact row height, transparent surface,
  no border/panel, screen-reader-only status, pause announcement and 24 px cursor
  checks. Desktop dark and mobile light views were reviewed; long text wraps
  without horizontal overflow and a focused structural accessibility scan passed.

- In-place thought replacement passed: two subsequent thoughts use the same DOM
  line at the same vertical position with no retained history. Pause and reduced
  motion remain functional.

- Unit coverage passed for normalization, safe literal text, random selection
  without immediate repeats, length-based timing and Unicode grapheme handling.
- Browser checks passed for typing/history, pause/resume, applying/resetting
  custom lines, empty/long input validation, literal HTML text, completion and
  restarting via the composer. Live reduced motion holds a full static line.
- Reviewed desktop dark and mobile light appearance, five viewport widths and
  a focused structural accessibility scan without a repeated contrast sweep.
- Configuration-only playback controls work in the mobile sheet and preserve
  state across resizing. The cursor measures 24 px high. Card preview loading,
  routing, tree search, About link and release notes passed.
- A temporary minimal A1 host verified the core without Labs, A1 Web or demo
  imports, stable single-line input, reduced motion and no CSS changes to
  neighboring content. The temporary host was removed after verification.
- Human screen-reader review and shared-package promotion remain outstanding.
