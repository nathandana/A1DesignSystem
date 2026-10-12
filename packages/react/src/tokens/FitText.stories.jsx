import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Fitted type', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Fitted type', 'Measuring size, minimum and largest sizes, line height and spacing for the Labs fitted type experiment. Fonts come from the A1 display, heading, body and mono families.', key => key.startsWith('--component-fit-text-'))
