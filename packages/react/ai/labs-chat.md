# Labs chat

`/experiments/chat` explores message appearance and entrance motion. It is a local
simulation, not an AI or messaging service. Messages exist only in page memory;
there is no request, persistence or actual delivery/read status.

## Reusable core

`src/chat/ChatConversation.jsx` and adjacent `chat.css` depend on React and A1
Stack, Avatar, Paragraph, TextareaField, Button and ButtonContainer. The core
imports no Labs shell, reply engine or demo data.

- `messages`: ordered objects with stable `id`, `sender` (`you`, `bot`, `person`),
  `name`, `text`, optional `motion` and semantic `duration` key.
- `onSend(text)`: receives trimmed, nonempty text; the host appends the message.
- `treatment`: `bubbles` (default), `soft`, `outline`, `editorial`, `compact`.
- `typing`: optional participant name, announced by a separate polite status.
- `resetKey`: increment to reset the draft and transcript scroll position.

The Labs host owns conversation history, queued replies, active partner, timing,
configuration and reset. Appearance changes preserve history and the draft.
Bot/person and pace selections apply to future submissions; queued replies keep
the partner and pace captured when submitted. Disabling Automatic replies clears
the queue, and Reset clears both history and pending replies. Effect cleanup
cancels timers on reset, disabled replies and unmount. `chat-model.js` provides
sample messages, choice metadata, names and deterministic, topic-aware responses.
Keep this simulation outside the reusable core.

## Presentation and motion

Five styles: alternating Bubbles (default), full-width Soft blocks, Outlined
bubbles, full-width Editorial separators and Compact unboxed messages. Each
message retains the participant name, so alignment or color alone never identifies
the sender. The outgoing bubble uses A1's primary action surface/foreground pair;
the Paragraph foreground uses its documented custom-property layer. Other
surfaces and outlines use live semantic/Card tokens. A1 owns typography,
controls and layout. No shared component CSS selectors are overridden.

Six entrances: Instant, Fade, Rise (default), Slide in, Pop and Unfold. Only new
messages animate, including simulated replies. Existing messages do not replay
when style or configuration changes. Per-message motion/duration is captured on
insertion; the new reply uses the then-current motion. Completed animations clear
their marker. Live reduced-motion and forced-colors preferences remove animation
and retain readable messages. Restoring motion does not replay history.

Durations: 100/300/500 ms, default 300, from semantic quick/slow/slower tokens.
`component.chat` supplies transcript height (28 rem), message width (85%), rise
and travel spacing aliases, pop scale and reply delays (750/1500/3000 ms, default
1500). The Chat token story documents this namespace. Keep CSS and keyframes
inside the `a1-chat-study` / `a1-chat-*` namespace.

## Input, scrolling and accessibility

The transcript is a named, keyboard-focusable `role=log`, polite and non-atomic,
announcing additions. Typing has a separate stable polite status. The composer
uses a labeled native textarea, max 1,000 characters, and a native submit button.
Enter sends; Shift+Enter adds a line. IME composition and repeated keys never
submit. Whitespace cannot send. Incoming replies never steal focus.

The fixed-height transcript has its own native scroll area. Appending your own
message goes to the bottom; replies follow only when the reader was already at
the bottom. Latest messages returns there explicitly. The main page scrolls
normally on phones, with configuration in the shared sheet. This experiment does
not use a device viewport. Long words wrap, and text remains selectable.

## Validation and promotion

Unit tests cover option IDs, sample data and topic/person reply selection.
Focused browser checks cover all 30 style/motion combinations, both reply
partners, queued delivery, empty drafts, keyboard/newline input, focus retention,
reset cancellation, reading-position retention, reduced motion, responsive
widths and scoped axe (without repeated contrast sweeps). Phone/light and
desktop/dark layouts were visually reviewed.

Human screen-reader speech quality and a standalone A1 host still need review
before promotion. Production delivery, streaming, attachments, message history
virtualization, retry/error states and persistence are outside this study.
