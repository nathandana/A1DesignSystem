import { tokenPage } from './_shared.jsx'
export default {
  title: 'Foundations/Tokens/Step tracker motion',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}
export const Story = tokenPage(
  'Step tracker motion',
  'Labs step tracker transitions reuse semantic durations and easing. These tokens control fade opacity, pop scale, bounce lift and ripple scale. Motion is decorative; reduced motion and forced colors settle instantly.',
  key => key.startsWith('--component-tracker-motion-'),
)
