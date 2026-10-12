import { tokenPage } from './_shared.jsx'
export default {
  title: 'Foundations/Tokens/Button interactions',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}
export const Story = tokenPage(
  'Button interactions',
  'Six Labs hover/press treatments wrap the A1 Button: Subtle, Lift, Glow, Tilt, Spring and Ripple. Tokens control only decorative movement and shadows; A1 retains styling, focus and input behavior. Ripple keeps the button shape unchanged. Reduced motion and forced colors remove the extra effects.',
  key => key.startsWith('--component-button-motion-'),
)
