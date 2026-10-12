import { tokenPage } from './_shared.jsx'
export default {
  title: 'Foundations/Tokens/Verify button',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}
export const Story = tokenPage(
  'Verify button',
  'Deliberate intent verification with 1/2/3-second holds, safety shutters and a progress dial. A1 supplies theme colors, controls and motion curves. Reduced motion removes shutter and completion movement while retaining numeric progress.',
  key => key.startsWith('--component-verify-button-'),
)
