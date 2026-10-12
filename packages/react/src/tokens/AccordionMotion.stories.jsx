import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Accordion motion', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Accordion motion', 'Distances, blur, fold angle, scale and stagger for the Labs accordion opening and closing transitions, applied on top of the A1 Accordion. Durations come from the semantic motion tokens; reduced motion makes every transition instant.', key => key.startsWith('--component-accordion-motion-'))
