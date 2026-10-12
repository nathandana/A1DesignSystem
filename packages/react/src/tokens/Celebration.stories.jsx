import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Celebration', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Celebration', 'Sizes, scales, particle counts and physics for the Labs submission celebrations. Colours come from the A1 status and action roles; durations use the semantic motion tokens, and reduced motion shows each celebration’s still state.', key => key.startsWith('--component-celebration-'))
