import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Chat', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Chat', 'Transcript size, message width, entrance geometry and simulated reply pacing for the Labs chat study. Surfaces and timing use A1 semantic tokens.', key => key.startsWith('--component-chat-'))
