import {
  Card,
  ChoiceGroup,
  Code,
  Heading,
  Inset,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'

const SPACE_OPTIONS = [4, 8, 12, 16, 24, 32, 40]

function optionLabel(value) {
  return String(value)
}

function buildInsetSnippet(config) {
  const spaceStr = config.space !== 16 ? ` space={${config.space}}` : ''
  return `<Inset${spaceStr}>\n  {/* children */}\n</Inset>`
}

export function getDefaultConfig() {
  return { space: 16 }
}

export function Preview({ config }) {
  return (
    <Card>
      <Inset space={config.space}>
        <Stack direction="column" gap="xs">
          <Heading as="p" size="sm">Inset content</Heading>
          <Paragraph size="sm" color="muted">
            All sides are padded uniformly by the configured spacing token.
          </Paragraph>
        </Stack>
      </Inset>
    </Card>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <ChoiceGroup
      label="Space"
      hint="Uniform padding applied to all sides."
      size="compact"
      hideIndicator
      columns={4}
      value={config.space}
      onChange={(space) => setConfig((current) => ({ ...current, space }))}
      options={SPACE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
    />
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildInsetSnippet(config)}</Code>
}
