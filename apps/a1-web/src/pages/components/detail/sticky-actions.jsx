import {
  Button,
  ButtonContainer,
  Code,
  Paragraph,
  Section,
  StickyActions,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { ConfigSlider } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'

export const bareDisplay = true

const CONTENT_WIDTH_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

function buildSnippet(config, utilityClass = '') {
  const className = utilityClass ? `\n  className="${utilityClass.replaceAll('"', '&quot;')}"` : ''
  const width = config.contentWidth !== 'sm' ? `\n  contentWidth="${config.contentWidth}"` : ''
  const secondary = config.showSecondary
    ? `<Button variant="secondary">${config.secondaryLabel}</Button>\n      `
    : ''
  return `<StickyActions${className}${width}>
  <ButtonContainer align="end">
    ${secondary}<Button variant="primary">${config.primaryLabel}</Button>
  </ButtonContainer>
</StickyActions>`
}

export function getDefaultConfig() {
  return {
    contentWidth: 'sm',
    primaryLabel: 'Save changes',
    secondaryLabel: 'Cancel',
    showSecondary: true,
  }
}

export function Preview({ config, utilityClass = '' }) {
  return (
    <div style={{
      position: 'relative',
      transform: 'translateZ(0)',
      minHeight: '200px',
      background: 'var(--semantic-color-surface-page)',
      overflow: 'hidden',
    }}>
      <Section padding="sm" contentWidth={config.contentWidth} surface="page">
        <Paragraph color="muted">Page content area. The action bar is fixed to the bottom of the viewport.</Paragraph>
      </Section>
      <StickyActions className={utilityClass || undefined} contentWidth={config.contentWidth}>
        <ButtonContainer align="end">
          {config.showSecondary && (
            <Button variant="secondary">{config.secondaryLabel || 'Cancel'}</Button>
          )}
          <Button variant="primary">{config.primaryLabel || 'Submit'}</Button>
        </ButtonContainer>
      </StickyActions>
    </div>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((c) => ({ ...c, ...patch }))

  return (
    <Stack gap="lg">
      <ConfigSlider prop="contentWidth" label="Content width" values={CONTENT_WIDTH_OPTIONS} value={config.contentWidth} onChange={(contentWidth) => set({ contentWidth })} />
      <Toggle prop="showSecondary"
        label="Secondary button"
        value={config.showSecondary}
        onChange={(showSecondary) => set({ showSecondary })}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
