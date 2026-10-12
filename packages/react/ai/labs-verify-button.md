# Labs verify button

`/experiments/verify-button` explores deliberate confirmation for critical actions.
It is a simulated intent gate and a candidate A1 pattern, not a published shared
component or proof that a real submission succeeded.

## Reusable core

`apps/a1-labs/src/verify-button/VerifyButton.jsx`, `verification.js` and
`verify-button.css` require React, A1 Button/Icon/Paragraph/Stack and A1 tokens.
There are no Labs navigation, configuration, settings or demo dependencies.
`VerifyButtonExperiment.jsx` owns the simulated result, label editing, duration
slider and reset key.

| Input | Contract |
| --- | --- |
| `actionLabel` | Action name; defaults to Launch. The Labs field allows 32 characters. |
| `holdDuration` | Positive milliseconds; defaults to 2000. Invalid values use the default. Demo detents: 1000/2000/3000. |
| `onVerify()` | Called once when intent is confirmed. Does not run or report server work. Remount to reset. |

Changing the label or duration resets the gate so previously armed intent cannot
carry over to a different action. Phases: locked, armed, holding, ready, review,
complete. The state transition module contains no DOM or motion dependencies.

## Interaction and accessibility

1. Activate Arm to open the safety shutters.
2. Hold the main button with a primary pointer or Space. Progress reaches ready
   after the configured duration; time alone never confirms.
3. Release inside the button or release Space to verify. Early release cancels
   the hold. Dragging out, pointer cancellation, lost capture or control blur
   cancels the hold. Escape, window blur and backgrounding disarm the gate.
4. Enter, a screen-reader virtual click, or Confirm without holding opens review.
   A separate activation of Confirm is required. There is no time limit here.
5. Completion retains focus on the native button, marks it aria-disabled and
   prevents duplicate callbacks. Host reset allows another simulation.

The main control is always an A1 native Button with its standard focus ring.
Status text is a stable polite atomic live region. Only phase changes announce;
progress has a separately labeled progressbar and is not streamed into the live
region. Decorative artwork is hidden from assistive technology. Confirmation
and cancellation do not rely on color alone. Space key repeat cannot restart a
hold, and Enter repeat cannot accept review.

Reduced motion changes live through CSS: no shutter transition, no completion
movement, no sweeping ring. Numeric progress, instructions and confirmation
remain available. Forced colors uses a solid system-color dial outline.

## Styling and promotion

Unique shutter artwork and dial masking live only in `verify-button.css`, under
`a1-verify-button`. Core layout uses A1 Stack; actions use A1 Button without
shared class overrides. New geometry and hold timing come from
`system/tokens/component/verify-button.json`. Existing semantic tokens supply
colors and motion. The Foundations token story documents this dependency.
CSS mask gradients use currentColor as mask ink, not a fixed UI palette.

Before production use, the host must supply truthful action/consequence copy,
server pending/error handling and authorization. `onVerify` is user intent only;
it must not be interpreted as successful completion of the requested operation.
Promotion requires the normal shared pattern integration workflow.

## Validation

State-model checks cover gated confirmation, early release, interruption,
click-only review and prevention of repeat verification. Browser validation
covers pointer and keyboard sequences, focus, responsive widths, live reduced
motion and a focused axe check. Automated checks do not replace real assistive
technology review. This remains a Labs candidate.
