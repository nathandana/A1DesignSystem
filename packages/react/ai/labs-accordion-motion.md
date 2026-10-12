# Labs accordion transitions

Opening and closing transitions for the real A1 Accordion. Not a published A1
component or prop. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## How it works

The A1 Accordion keeps its body mounted, opens by moving the body's grid row
from `0fr` to `1fr`, and makes closed content `inert`. The transitions only
restyle that body, its inner content and the chevron, scoped under
`.a1-accordion-motion[data-motion]`, so opening and closing both animate and
A1's markup, semantics and keyboard are unchanged.

| Transition | Opening (closing is the reverse) |
| --- | --- |
| Default | The A1 accordion as it ships: a quick height change |
| Smooth | A slower height change while the content fades |
| Slide | Content slides down `shift` and fades in |
| Bounce | Content springs from `bounceScale` and `shift` with the expressive ease; the chevron overshoots too |
| Stagger | Each child of the content appears in turn (`staggerStep` apart); all leave together |
| Unfold | Content hinges down from the header (`unfoldAngle`, in perspective) |
| Blur | Content comes into focus from `blur` |
| Wipe | Content is revealed top down with `clip-path` |

All variants except Default follow the chosen duration (semantic motion
tokens fast to slowest, 150–750 ms) for the height, content and chevron.

## Files and API

- `apps/a1-labs/src/accordion-motion/AccordionMotion.jsx` — `AccordionMotion`
  (`transition`, `speed`, children: A1 Accordions) and
  `ACCORDION_TRANSITIONS`. For Stagger, wrap each accordion's content in one
  element (the sample uses an A1 Stack) whose children appear in turn.
- `accordion-motion.css` — the scoped transitions, all inside
  `prefers-reduced-motion: no-preference`.
- `AccordionMotionExperiment.jsx` — the Labs page: transition ChoiceGroup,
  duration, size, dividers and one-open-at-a-time.

## Tokens

`component.accordionMotion`: `shift`, `blur`, `unfoldAngle`, `bounceScale`,
`staggerStep`. Token story: Foundations/Tokens/Accordion motion.

## Accessibility

Triggers, `aria-expanded`, regions and `inert` closed content are A1's.
Reduced motion keeps every change instant (A1's own quick height change
remains). Closed content stays out of the tab order during every transition.

## Recorded checks — Oct. 11, 2026

- Each transition opens and closes to its rest state; mid-open samples at
  750 ms: Smooth fading, Slide translating, Bounce scaling, Stagger items
  appearing in order, Unfold rotating, Blur sharpening, Wipe clipping top
  down. One open at a time works. Reduced motion is instant. Axe reported no
  violations; no console errors.
- Not yet done: a screen-reader review, other browsers and every theme.
