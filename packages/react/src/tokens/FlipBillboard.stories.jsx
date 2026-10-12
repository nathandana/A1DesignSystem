import { tokenPage } from './_shared.jsx'

export default {
  title: 'Foundations/Tokens/Flip billboard',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}

export const Story = tokenPage(
  'Flip billboard',
  'The landing-page billboard shares the Three.js flip-clock mechanism and monochrome physical materials. Its tokens control the two-row character grid, letter fitting, camera, stage and message timing. Changed cards start together and cycle through characters, settling at different times based on distance; stock follows Light, Dark or Auto. Reduced motion settles cards and disables automatic rotation.',
  key => key.startsWith('--component-flip-billboard-'),
)
