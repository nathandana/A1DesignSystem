import { tokenPage } from './_shared.jsx'

export default {
  title: 'Foundations/Tokens/Page loading',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}

export const Story = tokenPage(
  'Page loading',
  'A1 Labs viewport loading border: tokenized loop durations, inner glow width, outer glow and corner radius. The live experiment at /experiments/page-loading defaults to the A1 Web phone viewport. Two blurred layers use only live theme accent, info, success, warning and error roles; reduced motion holds the glow still.',
  key => key.startsWith('--component-page-loading-'),
)
