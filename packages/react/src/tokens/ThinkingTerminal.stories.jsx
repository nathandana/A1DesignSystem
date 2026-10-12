import { tokenPage } from './_shared.jsx'

export default {
  title: 'Foundations/Tokens/Thinking terminal',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
}

export const Story = tokenPage(
  'Thinking terminal',
  'A terminal-style activity indicator uses per-character typing and reading time, a minimum readable hold, and a 1em-tall block cursor. A background-free text row uses A1 typography and theme colors. Reduced motion shows a static full line without typing or blinking.',
  key => key.startsWith('--component-thinking-terminal-'),
)
