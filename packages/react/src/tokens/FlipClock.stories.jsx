import { tokenPage } from './_shared.jsx'

export default {
  title: 'Foundations/Tokens/Flip clock',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}

export const Story = tokenPage(
  'Flip clock',
  'The Labs Three.js split-flap clock uses monochrome physical materials, tokenized card and housing proportions, lighting and camera fitting. The compact variant limits the stage width and removes the housing, feet and recesses. Only changed digits flip; zero resets cycle backward through intervening cards within the selected duration; reduced motion updates instantly. A1 owns the surrounding theme-aware interface.',
  key => key.startsWith('--component-flip-clock-'),
)
