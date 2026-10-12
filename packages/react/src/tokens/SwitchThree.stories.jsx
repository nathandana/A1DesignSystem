import { tokenPage } from './_shared.jsx'
export default {
  title: 'Foundations/Tokens/Switch 3D',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}
export const Story = tokenPage(
  'Switch 3D',
  'The Labs Three.js switch shares A1 switch sizing and colors and the original two-stroke morph. These tokens add physical depth, bevels, thumb lift, camera tilt and lighting. Reduced motion settles immediately; forced colors and WebGL failures use a native-input fallback.',
  key => key.startsWith('--component-switch-three-'),
)
