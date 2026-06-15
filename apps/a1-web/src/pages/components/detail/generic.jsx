import {
  Button,
  Code,
  Heading,
  Icon,
  Paragraph,
  RadioGroup,
  SelectField,
  Stack,
  Switch,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { ICON_OPTIONS } from '../data.js'
import { COMPONENT_SNIPPETS } from './snippets.js'

// Default detail behaviour used by every component without a bespoke module.

export function getDefaultConfig(component, category) {
  return {
    label: component.title,
    icon: category.icon,
    size: 'default',
    variant: 'primary',
    showIcon: true,
  }
}

export function Preview({ component, config }) {
  return (
    <Stack direction="column" gap="md" align="center">
      <Icon name={config.icon} />
      <Heading as="h3" size={config.size === 'lg' ? 'lg' : 'md'}>{config.label || component.title}</Heading>
      <Paragraph size="sm" color="muted">
        {component.body}
      </Paragraph>
      <Button variant={config.variant} size={config.size === 'compact' ? 'sm' : 'md'} icon={config.showIcon ? config.icon : undefined}>
        {config.label || component.title}
      </Button>
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="md">
      <Heading as="h2" size="sm">Configure</Heading>
      <TextField
        label="Label"
        size="compact"
        value={config.label}
        onChange={(event) => setConfig((current) => ({ ...current, label: event.target.value }))}
      />
      <SelectField
        label="Icon"
        size="compact"
        value={config.icon}
        onChange={(event) => setConfig((current) => ({ ...current, icon: event.target.value }))}
      >
        {ICON_OPTIONS.map((icon) => (
          <option key={icon} value={icon}>{icon}</option>
        ))}
      </SelectField>
      <RadioGroup
        label="Size"
        size="compact"
        inline
        value={config.size}
        options={[
          { value: 'compact', label: 'Compact' },
          { value: 'default', label: 'Default' },
          { value: 'lg', label: 'Large' },
        ]}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
      />
      <RadioGroup
        label="Variant"
        size="compact"
        inline
        value={config.variant}
        options={[
          { value: 'primary', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'tertiary', label: 'Tertiary' },
        ]}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
      />
      <Switch
        label="Show icon"
        size="compact"
        checked={config.showIcon}
        onChange={(checked) => setConfig((current) => ({ ...current, showIcon: checked }))}
      />
    </Stack>
  )
}

export function Snippet({ component, config }) {
  const reactName = component.title.replace(/\s+/g, '')
  const snippets = COMPONENT_SNIPPETS[component.id] ?? {
    react: `<${reactName}>${component.title}</${reactName}>`,
    native: `<${reactName}>${component.title}</${reactName}>`,
    pure: `<div class="a1-${component.id}">${component.title}</div>`,
  }
  return <Code variant="block" wrapping copyCode>{snippets.react}</Code>
}
