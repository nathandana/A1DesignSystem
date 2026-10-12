# Labs password strength

A new-password field with seven strength meter styles, configurable rules and
a local strength estimate, built on A1 TextField, StatusBar, CircularProgress,
MessageBadge, List and Switch. Not a published A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Meter styles

| Style | What shows |
| --- | --- |
| Segments (default) | One segment per level fills in the level's tone, with the level named beside it |
| Bar | The A1 StatusBar fills continuously with estimated strength (bits ÷ 100), tinted by level |
| Ring | A1 CircularProgress fills by level around a lock icon that closes at the top level |
| Underline | A bar along the field's bottom edge (TextField `inputOverlay`), with the level named below |
| Badge | Only an A1 MessageBadge naming the level |
| Checklist | A strength badge plus each requirement, ticked when met |
| Time to guess | The level and how long an attacker would need, such as “about 4 days” |

Every style names the level in words, so colour never carries meaning alone.

## Configuration

Levels (3, 4 or 5), minimum length (8, 12 or 16), optional character rules
(lowercase, uppercase, number, symbol), update timing (as you type, or after
a pause), suggestions on or off, and example passwords. The demo also has a
Show password control and a Save password button that validates the rules and
a minimum Fair strength, then confirms without saving anything.

## Strength model

`apps/a1-labs/src/password-strength/password-model.js` is a pure, tested
estimate that runs in the browser; nothing typed is stored or sent.

- Bits = useful length × log2(character pool). Repeats (`aaa`) and runs
  (`abc`, `123`, keyboard rows such as `qwe`) count a quarter per character
  after the first 2.
- A built-in list of common passwords and words is checked after undoing
  look-alike swaps (`P@ssw0rd` → `password`). A contained common word counts
  as one character; a password that is only a common word is capped at 10 bits.
- Five grades split at 28, 40, 60 and 80 bits. `levelFor` folds them into 3, 4
  or 5 levels and `toneFor` maps levels to A1 status tones (error, warn, info,
  success).
- Time to guess assumes half the search space at 10 billion guesses a second
  (an offline attack on a fast hash).
- `checks` report each configured requirement separately from strength, and
  `suggestions` (`{ id, text }`, priority order) explain the most useful fix.

It is a teaching estimate. Production forms should also check passwords
against a breached-password service on the server.

## Files and API

- `StrengthMeter.jsx` — `StrengthMeter` (`result`, `levels`, `variant`, `id`
  for the value text, `showSuggestions`), `StrengthUnderline` (`result`,
  `levels`; pass to TextField `inputOverlay`), `describeStrength` and
  `STRENGTH_STYLES`.
- `password-strength.css` — scoped `.a1-password-strength` styles. Tones come
  from `data-tone` and A1 status roles. Empty tracks use the semantic default
  border role because A1's StatusBar and CircularProgress tracks are fixed
  light colours in dark mode. Movement is inside
  `prefers-reduced-motion: no-preference`.
- `PasswordStrengthExperiment.jsx` — the Labs page and configuration.

## Tokens

`component.passwordStrength`: `segmentHeight`, `segmentGap`, `underlineHeight`,
`barMinimum`, `pauseDelay` (500 ms) and `announceDelay` (1,000 ms). Token
story: Foundations/Tokens/Password strength.

## Accessibility

- The demo field is deliberately **not** `type="password"`, so password
  managers don't offer, generate or save a password. It is a text input
  masked with `-webkit-text-security: disc`, with `autoComplete="off"`, a
  neutral `name` and the ignore attributes for 1Password (`data-1p-ignore`),
  LastPass (`data-lpignore`), Bitwarden (`data-bwignore`) and Dashlane
  (`data-form-type="other"`). Browsers without CSS masking show the
  characters, and Show password is hidden there. Trade-off: screen readers
  may read the characters aloud, so the panel asks for a made-up password. A
  production field should use `type="password"` with
  `autoComplete="new-password"`.
- The field has no spellcheck, autocorrect or capitalisation, and uses
  `aria-describedby` for both its hint and the meter's value text.
- Each meter is one `role="meter"` element with `aria-valuetext` (for example
  “Fair password”). Its visual parts are hidden from assistive technology.
- A polite live region says the new strength once typing pauses for
  `announceDelay`, not on every key.
- Checklist items add “done” or “not yet” for screen readers. Suggestions are
  a labelled list.
- Save password puts errors in the field's alert message and returns focus to
  the field.

## Recorded checks — Oct. 11, 2026

- All seven styles at desktop width: meter values, the delayed announcement,
  suggestions, the checklist (with rules), the after-a-pause timing, Show
  password and both Save password outcomes. Light and dark modes checked for
  Segments, Bar, Ring and Checklist. Axe reported no violations at desktop and
  390 px widths; no console errors.
- Not yet done: a screen-reader review, other browsers and every theme.
