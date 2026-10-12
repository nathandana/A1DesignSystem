import { tokenPage } from './_shared.jsx'

export default {
  title: 'Foundations/Tokens/Image generation',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}

export const Story = tokenPage(
  'Image generation',
  'Experimental A1 Labs animation tokens: clockwise progress, themed discs or a glowing blob with increasing complexity and contrast, and a downward image reveal. Background, palette and highlights follow A1 semantic surface, info, success and text roles in light/dark modes. The progress border disappears when the reveal finishes. The live example is at /experiments/ai-image-generation on the Labs app.',
  key => key.startsWith('--component-image-generation-'),
)
