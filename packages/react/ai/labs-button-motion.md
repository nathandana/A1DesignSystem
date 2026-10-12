# Labs button interactions

`/experiments/button-motion` adds six hover/pressed-state studies in Controls and
interaction, tagged Microinteraction and Motion. They are Subtle, Lift, Glow,
Tilt, Spring and Ripple. Jelly was rejected because it distorted the button;
do not bring back nonuniform scaling. The host shows A1 primary, secondary and
tertiary buttons with a ChoiceGroup, duration slider, size toolbar and Disabled
switch in configuration. Default is Subtle, 200 ms, medium.

## Reusable implementation

`src/button-motion/MotionButton.jsx` wraps an actual A1 Button in a stationary
outer wrapper and an animated surface. It accepts ordinary native A1 Button
props plus `treatment` (the six IDs above, lowercase) and `speed`
(fast/normal/slow/slower/slowest). Unknown values fall back to subtle/normal.
The host owns actions and result announcements; the core has no Labs imports.

A1 keeps its colors, dimensions, typography, hover/pressed colors, focus ring,
keyboard activation and disabled/loading behavior. Native `:active` handles
pointer press; local keyboard state gives Space and Enter the same treatment
without preventing default behavior or synthesizing clicks. Clear that state on
keyup/blur. Disabled/loading buttons must not move or activate.

Hover motion applies only on hover-capable devices. Keyboard focus uses the same
emphasis with A1's existing visible focus ring. Press feedback is distinct for
all six treatments, and release reverses the transition. Spring uses A1's
expressive easing; Ripple preserves button shape and adds a noninteractive ring
after activation, removed when its finite animation ends. Rapid activation
restarts that one ring; changing treatment cancels it. No automatic looping.

## Styling and accessibility

All custom selectors and keyframes use `a1-button-motion`. Only the wrapper and
decorative ripple receive custom motion/shadows. Do not target shared A1 classes
or copy/replace Button markup. Transforms do not shift neighboring layout.
`component.buttonMotion` supplies scale, lift, angle, shadow and ripple geometry;
duration/easing, focus color and button radius use A1 tokens. Colors stay live.
Reduced motion and forced colors remove transforms, filters and ripple animation
immediately while retaining normal A1 control states. The scoped important
resets win over active/hover specificity; they do not alter shared components.

## Validation and promotion

Run `node --test apps/a1-labs/tests/button-motion.browser.mjs` against the dev
server, or with `LABS_ORIGIN=http://127.0.0.1:4189` against production. It checks
six hover/press endpoints, native pointer/Space/Enter activation, disabled state,
visible focus, live reduced motion, forced colors, responsive layout and focused
axe. Capture the real six treatments with `--button-motion-only` in the preview
script. Keep the registry preview and About link current.

Validation completed Oct. 11, 2026: production build, unit suite and the focused
button browser checks passed, including Ripple shape preservation and focused
axe without contrast scanning. The card preview and responsive screenshots were
visually reviewed.

This is a Labs candidate. Separate-host and human assistive-technology review
are still required before shared A1 promotion.
