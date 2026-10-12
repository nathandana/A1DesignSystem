import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Checkbox motion', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Checkbox motion', 'Scales, distances and angles for the Labs checkbox animations, applied on top of the A1 CheckboxGroup. Durations come from the semantic motion tokens; reduced motion removes all movement.', key => key.startsWith('--component-checkbox-motion-'))
