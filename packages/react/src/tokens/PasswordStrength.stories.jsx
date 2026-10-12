import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Password strength', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Password strength', 'Segment, underline and timing values for the Labs password strength meters. Colours come from the A1 status roles; transitions use the semantic motion tokens and stop with reduced motion.', key => key.startsWith('--component-password-strength-'))
