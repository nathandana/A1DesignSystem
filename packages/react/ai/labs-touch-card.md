# Labs touch card actions

The Touch card experiment tests a compact, subtly bordered group of three A1
IconButtons in the top-right of a realistic content card. The actions save the field notes, open a
simulated share flow and reveal the card's next-step details.
The group stays in normal flow and uses the A1 8px spacing token to sit 8px from
the Card's top and right edges.

Mouse and keyboard activation run an action immediately. On an actual touch
pointer, the first tap only expands the full group from small to large A1
IconButtons and announces the change; the next tap activates an action and
returns the group to its compact state. Hybrid devices therefore retain direct
mouse behavior while touch input gets larger targets.
The compact group occupies a fixed layout slot. Its expanded version overlays
that slot with token-derived 44×44px buttons, so card dimensions and underlying
content positions remain unchanged.
The Labs host exposes `enlargeOnHover` through the standard right-side configuration-panel
switch so the touch-ready state can be inspected with a mouse.
The group returns to compact size when hover leaves. This visual override
does not introduce the two-tap touch gate for mouse or keyboard activation.
Button size, group spacing, padding, surface and shadow transition with A1's
normal duration and standard easing. Reduced motion applies the state instantly.

The reusable `TouchActionCard` owns only its local demonstration state. It uses
A1 Card, Stack, IconButton, MessageBadge, Heading and Paragraph. Local CSS is
limited to the action-row placement, its subtle token-backed border and the raised surface shown
when touch actions are ready.
The experiment Card uses the `base.radius.xl` token, one step above the shared
Card default. The action-group radius is that experiment radius minus its 8px edge inset, clamped at zero,
so its inner corner follows the outer Card corner concentrically.

Validation covers the two-tap touch contract, button size, pressed state, live
announcement, Labs tests and production build. Manual screen-reader review
remains required before promoting this pattern into A1.
