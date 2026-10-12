import { tokenPage } from './_shared.jsx'

export default {
  title: 'Foundations/Tokens/Switch morph',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}

export const Story = tokenPage(
  'Switch morph',
  'Labs scales the live A1 switch track, thumb and gap by 1, 2, 3 or 4. Normalized stroke geometry moves and rotates the same two bars through 90 degrees from an X to a checkmark. Gentle easing keeps motion nearly even through the middle. Colors, focus and shadow use existing A1 tokens; reduced motion changes state immediately.',
  key => key.startsWith('--component-switch-morph-'),
)
