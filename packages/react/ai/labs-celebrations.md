# Labs submission celebrations

A short waitlist form (Name, Email) whose success screen celebrates in one of
seven ways, from a quiet check to an explosion of confetti. Submission is
simulated; nothing is sent or stored. Not a published A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Celebrations

| Celebration | What happens | Reduced motion |
| --- | --- | --- |
| Check | A large success check springs in (`checkPopScale`) | Still check |
| Rings | Three rings ripple out from the check (`ringScale`) | Check only |
| Stamp | A “You’re in” stamp slams down (`stampFrom`, `stampAngle`) and the content jolts | Still stamp |
| Sparkles | Eight sparkles twinkle in around the check (`sparkleDistance`) | Still sparkles |
| Fenex | Fenex the fox hops for joy: arms pump, ears wiggle, tail swishes, he laughs, and stars and confetti fall; he settles after 4.8 s | Fenex stands still with confetti scattered around him |
| Fireworks | Rockets rise from the bottom and burst into fading sparks | Check only |
| Confetti | Confetti explodes up from the check, tumbles and rains down | Check only |

Fireworks and Confetti take an amount: Light, Normal or Lots
(`confettiLight` / `Normal` / `Lots`, `rocketsLight` / `Normal` / `Lots`).

## Files and API

- `particles.js` — pure, tested physics:
  - `seededRandom`, `createConfetti` (spread, speed, size, flutter) and
    `createBurst` (even radial sparks).
  - `createRocket` (ease-out rise after a delay) and `stepParticles` (gravity,
    drag, spin).
  - `rocketLanded` and `stillVisible`.
- `Celebration.jsx` — `Celebration` (`variant`, `amount`, `run` to replay) and
  `CELEBRATIONS`. Fireworks and Confetti draw on a full-screen canvas shown as
  a manual popover in the top layer, so they float over everything without a
  z-index. They ignore pointer events and hide when the last particle is gone.
  Colors are the live A1 status and action roles.
- Fenex comes from the shared `Fenex` component in `apps/a1-labs/src/fenex/`
  ([Fenex celebrates](labs-fenex.md)). Here he is decorative and settles into
  his still pose after `characterSettle` (4.8 s), so the movement stops within
  5 seconds.
- `celebrations.css` — scoped check, rings, stamp and sparkles. Each rests on
  its final state, and movement is inside `prefers-reduced-motion:
  no-preference`.
- `CelebrationsExperiment.jsx` — the form, validation, simulated sending and
  configuration (celebration, amount, replay or skip to the celebration).

## Tokens

`component.celebration`: `stageSize`, `checkPopScale`, `ringScale`,
`stampFrom`, `stampAngle`, `sparkleDistance`, `characterHeight`, `characterSettle`, the six amount counts,
`gravity`, `sparkLife` and `sendDelay`. Token story:
Foundations/Tokens/Celebration.

## Accessibility

- Every celebration is `aria-hidden`. The success heading (“You’re on the
  list, Sam”) receives focus, so it is announced and Tab continues from there.
- Validation errors show in the fields' alert messages, and focus moves to the
  first invalid field. The submit button shows A1's loading state while
  sending.
- No flashing: sparks fade rather than strobe.

## Recorded checks — Oct. 11, 2026

- The empty and invalid submissions show errors and focus the first field. A
  valid submission shows the loading state, then success with focus on the
  heading.
- Confetti runs and its canvas hides after about 5 seconds. All six
  celebrations were sampled mid-animation and at rest.
- Reduced motion: no canvas and a still check. Axe reported no violations on
  the form or success screen; no console errors.
- Not yet done: a screen-reader review, other browsers and every theme.
