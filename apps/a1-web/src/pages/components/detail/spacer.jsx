import {
  ChoiceGroup,
  Code,
  MessageBadge,
  Spacer,
  Stack,
} from '@gtivr4/a1-design-system-react'

const SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

function optionLabel(value) {
  return value.toUpperCase()
}

function buildSpacerSnippet(config) {
  return `<Spacer${config.size !== 'md' ? ` size="${config.size}"` : ''} />`
}

export function getDefaultConfig() {
  return { size: 'md' }
}

export function Preview({ config }) {
  return (
    <Stack direction="column" style={{ width: '100%' }}>
      <MessageBadge subtle>Block A</MessageBadge>
      <Spacer size={config.size} />
      <MessageBadge subtle>Block B</MessageBadge>
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <ChoiceGroup
      label="Size"
      size="compact"
      hideIndicator
      columns={3}
      value={config.size}
      onChange={(size) => setConfig((current) => ({ ...current, size }))}
      options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
    />
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSpacerSnippet(config)}</Code>
}
