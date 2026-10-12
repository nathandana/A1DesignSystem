import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Bulk actions', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Bulk actions', 'Timing and distance for the Labs bulk actions Animate away style: deleted rows tint, slide and fade, then the rows below glide up. Durations alias the semantic motion tokens; reduced motion removes rows at once.', key => key.startsWith('--component-bulk-actions-'))
