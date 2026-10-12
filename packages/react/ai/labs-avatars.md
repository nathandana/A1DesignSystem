# Labs avatars

Introduced in Labs 0.69.0 at `/experiments/avatars`. A candidate extension of
A1 `Avatar`: the same five sizes and type tokens, plus radius, colour, border,
status, more content types and experimental treatments. It is a Labs
candidate, not a shared component change; A1 `Avatar` is unchanged.

## Files

| File | Role |
| --- | --- |
| `apps/a1-labs/src/avatars/avatar-model.js` | Pure helpers: initials, name hash, tint, generated pattern, accessible name |
| `apps/a1-labs/src/avatars/LabAvatar.jsx` | Reusable `LabAvatar` and `LabAvatarGroup`; no Labs shell dependency |
| `apps/a1-labs/src/avatars/avatars.css` | Styles, all under `.a1-avatar-lab` / `.a1-avatar-lab-group` |
| `apps/a1-labs/src/avatars/AvatarsExperiment.jsx` | Labs page: configuration and the profile/sizes/team/group stage |
| `system/tokens/component/avatar-lab.json` | `component.avatarLab.*` tokens |
| `apps/a1-labs/public/avatars/` | Sample portrait (square crop) and transparent cut-out |

The sample images are crops of the illustrated portrait from
`examples/portfolio/img/`. Teammates in the demo have no photo on purpose, so
Image content shows its initials fallback.

## `LabAvatar` API

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `name` | string | — | Accessible name; drives initials, tint and pattern |
| `content` | `initials` · `image` · `icon` · `pattern` | `initials` | Image falls back to initials when `src` is missing or fails |
| `src` | URL | — | Image content |
| `cutoutSrc` | URL | — | Transparent portrait used by `popOut` |
| `size` | `xs` · `sm` · `md` · `lg` · `xl` | `md` | A1 Avatar sizes (20/32/48/64/128px) |
| `radius` | `none` · `sm` · `md` · `lg` · `xl` · `full` | `full` | `full` is a circle; others use `base.radius.*` |
| `color` | `neutral` · `tinted` · `accent` | `neutral` | Tinted picks info/success/warn/error from the name; accent is the solid action colour |
| `border` | `none` · `hairline` · `ring` · `gradient` | `hairline` | Ring and gradient sit outside the avatar with a page-coloured gap |
| `status` | `online` · `away` · `busy` · `offline` | — | Indicator plus ", Status" in the accessible name |
| `initialsCount` | `1` · `2` | `2` | First and last words |
| `popOut` | boolean | `false` | Experimental: Image content with `cutoutSrc` only |

`LabAvatarGroup` takes `people` (`{ name, src? }[]`), `max` (default 4),
`label` (group name; default "N people"), `size` and the shared avatar props.
It overlaps avatars by `groupOverlap`, separates them with a page-coloured
ring and ends with a "+N" avatar named "N more". Status and pop-out are not
used inside a group.

## Experimental treatments

- **Pattern:** a 5×5 identicon mirrored left to right from an FNV-1a hash of
  the name, in the tone's text colour. Every row has at least one cell.
- **Gradient ring:** action → info → success, behind the frame with a gap.
- **Break the frame:** a cut-out portrait `popOutRatio` times the frame width
  tall. `clip-path: inset(-100% 0 0 0 round …)` keeps the bottom on the
  frame's curve while the head rises above it. Works with every radius.
- **Status shapes:** online is a dot, away a crescent, busy a bar, offline a
  hollow ring — shape as well as colour (WCAG 1.4.1). Pages should still show
  the status as text where it matters, as the team list does.

## Accessibility

The root is `role="img"` with the name (plus status); inner content and the
image (`alt=""`) are hidden from assistive technology. An empty name hides the
avatar. Forced-colours mode draws frames and indicators with `CanvasText`.
There is no motion.

## Tokens and colour

Sizes, type and hairline width come from `component.avatar`. Colours use
semantic roles directly (`surface.raised` / `text.default` / `border.default`,
status surface/text pairs, action colours) because the `component.avatar`
colours are not in the light/dark mode contract and stay light in dark mode —
an A1 Avatar issue to fix separately in `system/color-modes.mjs`. New values
are `component.avatarLab.*`: icon ratio, status size (ratio, min, max, glyph
proportions, cut-out), ring width/gap, group overlap/cut-out, pop-out ratio
and pattern cells/inset.

Rings, status and group cut-outs are page-coloured, so they assume the avatar
sits on `surface.page`. On another surface they would need a matching cut-out
colour — a promotion question.

## Validation

`tests/avatars.test.mjs` covers initials (including accents and surrogate
pairs), deterministic tint/pattern, symmetric non-empty patterns and the
accessible name. `tests/avatars.browser.mjs` covers sizes, radius, every
content type, one/two initials, the name field, status on/off, Break the
frame (enabled only for Image, rising above the frame), the group and "+N",
broken-image fallback, axe (including contrast) with ring and gradient, and no
horizontal overflow at 390px. Light and dark screenshots were reviewed for
each content type, square and circular radii, ring, gradient and Break the
frame. Not yet done: themes beyond Default, a host outside Labs, and
screen-reader review. Capture the card with
`capture:previews -- http://127.0.0.1:5187 --avatars-only`.

## Promotion notes

Candidates for A1 Avatar: `radius`, `status`, `color="tinted"`, the ring
border and a group component. Fix the Avatar colour-mode gap first. Pattern
and Break the frame need design review before promotion.
