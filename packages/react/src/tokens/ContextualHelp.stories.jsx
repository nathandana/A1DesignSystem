import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Contextual help', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Contextual help', 'Popover width, spacing and entrance offset for the Labs contextual help patterns. Surfaces use A1 surface, border, radius and shadow roles; motion uses the semantic motion tokens and stops with reduced motion.', key => key.startsWith('--component-contextual-help-'))
