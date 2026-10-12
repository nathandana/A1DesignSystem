import { tokenPage } from './_shared.jsx'
export default { title: 'Foundations/Tokens/Segmented motion', parameters: { layout: 'fullscreen', controls: { disable: true } } }
export const Story = tokenPage('Segmented motion', 'Scale, lag and travelling-bar sizes for the Labs segmented control background transitions, applied on top of the A1 SegmentedControl. Durations come from the semantic motion tokens; reduced motion moves the background instantly.', key => key.startsWith('--component-segmented-motion-'))
