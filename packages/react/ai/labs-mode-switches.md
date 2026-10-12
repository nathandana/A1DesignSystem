# Labs mode switches

Five ways to switch between light and dark, shown one at a time and chosen
from a ChoiceGroup in the side panel. Every control drives the real Labs
appearance mode (the same setting as the header's Settings menu). The change
between modes can be instant, a fade or a reveal from the control, with a
duration from the motion tokens. Not published A1 components. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## The five controls

| Control | Choices | Semantics | Interaction |
| --- | --- | --- | --- |
| Pull cord | Light / Dark | `button role="switch"` ("Dark mode, pull cord") | A nickel ball chain: drag the pull ball down past `cordThreshold` and release; tap, Enter or Space tugs it. Spring physics return it to rest |
| Sun and moon switch | Light / Dark | The A1 `Switch` (native checkbox switch, visible "Dark mode" label) | Only the icon animates: the thumb slides within the track while its sun or moon spins and grows in |
| Mode dial | Light / Auto / Dark | `role="slider"` with `aria-valuetext` | Arrow keys, Home/End, drag (the knob previews; the mode changes on release) or click a label |
| Eclipse | Light → Dark → Auto | Button whose name states the mode and the next one | Each press moves the moon over the sun; Auto is half covered |
| Slide switch | Light / Auto / Dark | Fieldset of native radios (hidden) with visible labels | Drag the ridged thumb (or press the track) and it follows; the mode changes on release at the nearest position. Arrow keys move between positions |

Pointer interactions change the mode only when the action finishes (release
or click): drags on the cord, dial and slide switch preview while held.
Binary controls show what is on screen (Auto resolves through the device
preference) and choose an explicit Light or Dark. The others can choose Auto
(`system`). The selected control is kept in `?switch=<id>`.

## Transition between modes

Same-document View Transitions. **None** switches instantly; **Fade**
cross-fades the page; **Reveal** grows the new mode in a circle from the
control that was used (last press, else the focused element), sized to cover
the farthest corner (`revealRadius`). Duration detents are the semantic motion
tokens fast / slow / slower / slowest (150 / 300 / 500 / 750 ms; default
slower). While a change runs the document carries `data-a1-mode-transition`
and `--a1-mode-transition-duration` / `--a1-mode-x` / `--a1-mode-y` /
`--a1-mode-r`; they are removed when it finishes. While a transition runs the
browser sends clicks to the document element, so the page catches such a click,
skips the transition and replays the click on the control under the pointer;
quick repeated presses are never lost. Reduced motion, an unchanged
visible mode or a browser without View Transitions switches instantly.

## Files and API

- `apps/a1-labs/src/mode-switches/ModeSwitches.jsx` — `PullCord`,
  `SunMoonSwitch`, `ModeDial`, `EclipseButton`, `SlideSwitch`. Each takes `mode` (`'light'|'dark'|'system'`), `systemDark`
  and `onChange(mode)`; binary ones also accept `label`.
- `mode-model.js` — `resolveMode`, `toggleBinary`, `nextCycle`, `dialIndex`,
  `pointerAngle`, `stepSpring`, `dragPosition` and `chainPoints` (even
  ball-chain spacing); `mode-transition.js` — `revealRadius`. Unit-tested in
  `tests/mode-switches.test.mjs`.
- `ModeSwitchesExperiment.jsx` — the Labs page: switch ChoiceGroup,
  transition toolbar, duration slider, Use Auto / Reset to Dark, and the
  transition runner. It receives `appearance` (`mode`, `setMode`) from
  `App.jsx` through `ExperimentPage`.
- `mode-switches.css` — one namespace per control plus the document-level
  view-transition rules. The sun and moon switch extends A1 Switch from
  outside: its thumb shows a Material Symbols glyph through
  `--a1-icon-font-family` and moves with `translate` (not A1's `translateX`
  transform) so its spin never carries it outside the track.

## Tokens

`component.modeSwitches`: cord stage, length, pull, threshold, stroke, pull
ball, spring and the ball chain (`chainBall`, `chainSpacing`) with a fixed
nickel palette (`metalLight`, `metalMid`, `metalDark`, `metalInk`); sun/moon
icon size; dial size, detent angle and label radius; eclipse size, corona and
moon positions with `sun` / `skyNight`; slide switch width/height; `settle`.
Token story: Foundations/Tokens/Mode switches.

## Accessibility and motion

- Native button/switch/slider/radio semantics with distinct accessible names
  and visible focus; a polite status states the mode (and, for Auto, what the
  device is using).
- Reduced motion: no transition between modes, no cord physics, and control
  transitions are removed.

## Recorded checks — Oct. 11, 2026

- Each control changes the Labs mode and stored preference. Cord: balls follow the chain,
  toggles only past the threshold. Sun and moon: the thumb only moves
  horizontally while the glyph spins. Slide: mode unchanged while dragging,
  commits on release; arrow keys work. Reveal and Fade set the token duration
  and clean up; None is instant and disables the duration slider. Axe reported
  no violations for any control; no console errors. Model tests pass.
- Not yet done: a screen-reader review, other browsers, every theme and a
  visual check of the reveal (headless screenshots show the end state).

The 3D wall switch (Three.js) was removed in 0.36.1; the pull cord is the
default control.
