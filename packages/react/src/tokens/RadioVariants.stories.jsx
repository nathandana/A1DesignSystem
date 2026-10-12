import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Radio variants', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Radio variants', 'Scales and dot sizes for the Labs animated radio variants, applied on top of the A1 RadioGroup. Durations come from the semantic motion tokens; reduced motion removes all movement.', key => key.startsWith('--component-radio-variants-'))
