import { tokenPage } from './_shared.jsx'

export default {
  title: 'Foundations/Tokens/Focus animation',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}

export const Story = tokenPage(
  'Focus animation',
  'Eight Labs focus treatments: ring settle, halo, underline, double ring, subtle zoom, gentle lift, corner draw and inset frame. Tokens supply travel, accent width, 1.5% zoom, lift distance and corner length. The isolated scope uses live A1 field/button focus colors and button ring widths/offsets, with quick/fast/normal motion durations. Every treatment retains an outline and becomes static and untransformed with reduced motion.',
  key => key.startsWith('--component-focus-animation-'),
)
