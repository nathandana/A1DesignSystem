import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Dialog motion', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Dialog motion', 'Distances, scales, angles and blur for the Labs dialog animations, applied on top of the A1 Dialog. Durations and easing come from the semantic motion tokens; reduced motion removes all movement.', key => key.startsWith('--component-dialog-motion-'))
