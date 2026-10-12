# Labs button completion

This is an experimental pattern for a primary action that becomes its own
result, not a published A1 component. Follow the [Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).
It mimics the A1 primary Button through shared button tokens rather than
wrapping the `Button` component, because the shared component cannot yet hold a
fixed width or host an animation stage.

## Files and reusable API

- `apps/a1-labs/src/button-completion/CompletionButton.jsx` exports
  `CompletionButton` (fixed width) plus the shared `CompletionFace`,
  `useWidestFace`, `COMPLETION_STATUSES`, `COMPLETION_TONES` and
  `isCompletionActionable`. It imports `completion-button.css`.
- `SendButton.jsx` is the large, fixed-size send variant. It imports `send-button.css` and the
  pure Canvas 2D module `paper-plane.js` (timeline, scene geometry, drawing).
- Neither core imports Labs routing, settings or layout, A1 Web, or another
  experiment. Dependencies: React, A1 `Icon` and `CircularProgress`, A1's
  `sr-only.css` utility, and generated A1 tokens/themes supplied by the host.
- `ButtonCompletionExperiment.jsx` owns the tabs, sample cards and copy,
  simulated work, outcome/size/processing configuration and the status line.
  `states.js` holds that demo copy and timing. Keep this scaffolding out of the cores.

| Prop | `CompletionButton` | `SendButton` |
| --- | --- | --- |
| `status` | `idle`, `working`, `success`, `failed`, `retry` (required) | Same |
| `labels` | Visible label per status (required) | Same; idle is centred, the rest show in the bottom row |
| `description` | — | Secondary text under the idle label; also the accessible description |
| `icons` | Material Symbols name per status; working shows a spinner | Per status; `null` for none (working shows the plane) |
| `size` | `sm`, `md` (default), `lg` | — (one fixed size) |
| `fullWidth` | Fill the container instead of the widest face (still constant) | Fill the container instead of `stageWidth` |
| `onClick` | Called only when `idle` or `retry` | Same |
| `onSettled` | — | `(status)` once the result shows |
| `buttonRef` | Ref to the native `<button>` | Same |

The consumer owns the work and reports the truth through `status`, including the
`failed` → `retry` change after a hold (`--component-button-completion-failure-hold`).
`CompletionButton` shows every status immediately. `SendButton` is one large,
fixed-size button that never resizes; the result shows inside it until the
consumer returns it to `idle`. After a result arrives it finishes the flight,
then shows the result and calls `onSettled`; start the failure hold from that
callback, and drive any visible status text from what is displayed, not from the
raw result.

```jsx
<CompletionButton
  status={status}
  labels={{ idle: 'Publish changes', working: 'Publishing…', success: 'Published', failed: 'Not published', retry: 'Try again' }}
  icons={{ idle: 'publish' }}
  onClick={publish}
/>
```

## States and behavior

- **Fixed width:** `CompletionButton` measures hidden copies of every face and
  takes the widest, so its width never changes between statuses. Size,
  label, font-loading and theme changes remeasure through a ResizeObserver.
- **Tones:** idle/working use primary button roles; success uses the success
  button roles; failed/retry use destructive roles. Disabled dimming is never
  applied — `aria-disabled` keeps focus on the button while it is inert.
- **Feedback (Publish):** each change pops in the new icon and fades in the new
  label; `failed` shakes.
- **Send button:** one fixed size (`stageWidth` × `stageHeight`, card radius).
  At rest a filled `xl` icon, the label and `description` are centred. On press
  the resting content slides down (`introTravel`) and fades; the working label
  fades into a bottom row once it has cleared. The canvas plane is drawn from
  the filled Material Symbols `send` glyph outline at the measured icon size, so
  the icon itself drops into a slingshot near the left edge (`enterDuration`)
  with no change of shape, fill or size. It is drawn back (`aimDuration`) and
  released; once the band snaps, the slingshot recoils out through the left
  edge (`slingExitDuration`). The plane flies a clear arc, trailed by a short window of dashed, curved
  motion lines that erase behind it and march toward it.
- **Speed follows the work:** while sending is pending, arc progress is
  `0.85 × (1 − e^(−2t / expectedDuration))`, so the plane covers most of the arc
  in a typical send and keeps slowing if sending takes longer; it never reaches
  the end before a result. Once the result is known, it flies the remaining arc
  at the `finishDuration` pace.
- **Result:** success flies out through the right edge, its trail following
  it out; failure peels off and crash-lands on the floor of the artwork area,
  vanishing in a mini explosion (rays, a puff ring and debris that fade). After
  a beat (`resultBeatDuration`), the slingshot fades out while a centred
  checkmark or cross draws on (`markDuration`); the result tone and label
  arrive with the mark, and `onSettled` fires then. The bottom
  row shows the result label; the failed button becomes a clickable retry that
  relaunches from the same stage. Secondary text — the description and every
  bottom-row message — shares one size and weight.

## CSS and token dependencies

All selectors, keyframes and custom properties use the `a1-button-completion`
namespace. Colours, typography, radii, focus ring and sizes come from
`component.button.*`; motion easing from `semantic.motion.*`. Experiment values
live in `system/tokens/component/button-completion.json`: processing detents,
`failureHold`, `changeDuration`, `shakeDuration`, `shakeDistance`,
`enterDuration`, `introTravel`, `aimDuration`, `slingExitDuration`,
`expectedDuration`,
`finishDuration`, `resultBeatDuration`, `markDuration`, `stageWidth`,
`stageHeight` and `strokeWidth`.

## Accessibility

The native button keeps focus through every status; its accessible name is the
current label (icons are hidden). `aria-busy` marks work in progress. Hosts
should pair the button with a polite, atomic status region that names the
result, as the demo does, so the outcome is not conveyed by colour or motion
alone. Reduced motion removes the pop, fade, shake, expansion transition and
flight; the send button shows a still plane in the slingshot, then the result
mark as soon as the result arrives. Its accessible name is the visible label;
the resting description is exposed with `aria-describedby`.

## Validation and promotion

Check both tabs at all sizes for success, failure, retry, reset and Start over
focus return; width constancy for `CompletionButton`; layout at phone width;
light and dark mode; live reduced motion; and keyboard operation.

### Recorded checks — Oct. 11, 2026

- Browser checks passed for success, failure and retry in both versions. Send
  flight speed was compared at the same moment for 1- and 4-second sends: the
  slower send's plane was visibly further back. Publish
  width was constant across all five statuses at sm/md/lg (before `fullWidth` was
  enabled for the demo); Send stayed at its
  fixed 160 px through every status, with the result inside. Focus stayed on the button
  and returned to it from Start over. Status text matched the displayed state.
- A minimal A1 host (tokens only, no Labs shell) rendered `CompletionButton`
  with constant width, no CSS leaking to neighboring controls and no contrast
  violations once each state settled.
- Axe found no violations in the button experiment content in light or dark
  mode. It reports the shared A1 Tabs selected label in dark mode at 3.45:1
  (`#7c3aed` on `#060b14`) and the shared destructive Button hover in dark mode
  at 4.13:1, which the retry state reuses. Both are shared-token issues.
- Both demos use `fullWidth`; no overflow at 375 px. Labs unit tests and build passed.
- Not yet done: human screen-reader review, forced-colors review, a full theme
  sweep and the shared-package promotion workflow.
