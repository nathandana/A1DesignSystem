import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Slides', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Slides', 'Canvas, layout, transition speed, stagger and build values for the Labs slide deck. Includes the ramp swatches and the transition choreography fractions (handoff, fade out, fade in, piece share). Slide colours otherwise come from live semantic roles. Reduced motion cuts between slides and loads points without movement.', key => key.startsWith('--component-slides-'))
