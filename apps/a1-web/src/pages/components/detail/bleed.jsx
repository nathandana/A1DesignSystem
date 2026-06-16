import {
  Bleed,
  Card,
  ChoiceGroup,
  Code,
  Inset,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'

const SPACE_OPTIONS = [4, 8, 12, 16, 24, 32, 40]

function buildBleedSnippet(config) {
  return `<Bleed${config.space !== 16 ? ` space={${config.space}}` : ''}>\n  {/* content that reaches past its inset container */}\n</Bleed>`
}

export function getDefaultConfig() {
  return { space: 16 }
}

export function Preview({ config }) {
  return (
    <Card>
      <Inset space={config.space}>
        <Paragraph size="sm" color="muted">Inset content — padded normally.</Paragraph>
      </Inset>
      <Bleed space={config.space}>
        <div
          style={{
            background: 'var(--semantic-color-action-background)',
            padding: 'var(--base-spacing-12)',
            color: 'var(--semantic-color-text-inverse)',
          }}
        >
          <Paragraph size="sm">Bleed content — reaches past the inset.</Paragraph>
        </div>
      </Bleed>
    </Card>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <ChoiceGroup
        label="Space"
        hint="Amount of bleed on all sides — should match the surrounding Inset."
        size="compact"
        hideIndicator
        columns={4}
        value={config.space}
        onChange={(space) => setConfig((current) => ({ ...current, space }))}
        options={SPACE_OPTIONS.map((opt) => ({ label: String(opt), value: opt }))}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildBleedSnippet(config)}</Code>
}
