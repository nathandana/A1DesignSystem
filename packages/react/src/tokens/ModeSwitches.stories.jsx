import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Mode switches', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Mode switches', 'Geometry, spring physics, timing and the small fixed palettes (nickel ball chain, eclipse) for the Labs light/dark mode switches: pull cord, sun and moon switch, dial, eclipse and slide switch. Surfaces, text and focus come from live A1 roles. Reduced motion removes the physics and transitions.', key => key.startsWith('--component-mode-switches-'))
