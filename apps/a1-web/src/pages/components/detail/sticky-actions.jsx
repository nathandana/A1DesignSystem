import {
  Button,
  ButtonContainer,
  ChoiceGroup,
  Code,
  Paragraph,
  Section,
  StickyActions,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Toggle } from './Toggle.jsx'

export const bareDisplay = true

const CONTENT_WIDTH_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

function optionLabel(v) {
  return v.charAt(0).toUpperCase() + v.slice(1)
}

function buildSnippet(config) {
  const width = config.contentWidth !== 'sm' ? `\n  contentWidth="${config.contentWidth}"` : ''
  const secondary = config.showSecondary
    ? `<Button variant="secondary">${config.secondaryLabel}</Button>\n      `
    : ''
  return `<StickyActions${width}>
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

export function Preview({ config }) {
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
      <StickyActions contentWidth={config.contentWidth}>
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
      <ChoiceGroup
        label="Content width"
        size="compact"
        hideIndicator
        columns={3}
        value={config.contentWidth}
        onChange={(contentWidth) => set({ contentWidth })}
        options={CONTENT_WIDTH_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <TextField
        label="Primary button label"
        size="compact"
        value={config.primaryLabel}
        onChange={(e) => set({ primaryLabel: e.target.value })}
      />
      <Toggle
        label="Secondary button"
        value={config.showSecondary}
        onChange={(showSecondary) => set({ showSecondary })}
      />
      {config.showSecondary && (
        <TextField
          label="Secondary button label"
          size="compact"
          value={config.secondaryLabel}
          onChange={(e) => set({ secondaryLabel: e.target.value })}
        />
      )}
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
