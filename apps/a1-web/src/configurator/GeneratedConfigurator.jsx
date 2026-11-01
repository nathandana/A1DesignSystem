import {
  Banner,
  Heading,
  NumberField,
  SelectField,
  Stack,
  Switch,
  TextareaField,
  TextField,
  Toolbar,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { coercePropertyValue, propertyPresentation } from './presentationModel.js'

function isVisible(presentation, values) {
  if (!presentation.visibleWhen?.property) return true
  return values[presentation.visibleWhen.property] === presentation.visibleWhen.equals
}

function PropertyControl({ property, presentation, value, onChange }) {
  const change = (next) => onChange(property.key, coercePropertyValue(property, next))
  const shared = { label: presentation.label, hint: presentation.helpText || undefined, size: 'compact' }
  if (presentation.control === 'textarea') return <TextareaField {...shared} value={value} onChange={(event) => change(event.target.value)} />
  if (presentation.control === 'text') return <TextField {...shared} value={value} onChange={(event) => change(event.target.value)} />
  if (presentation.control === 'number') return <NumberField {...shared} value={value} onChange={(event) => change(event.target.value)} />
  if (presentation.control === 'select') {
    return (
      <SelectField {...shared} value={value} onChange={(event) => change(event.target.value)}>
        {property.options.map((option) => <option key={option} value={option}>{option}</option>)}
      </SelectField>
    )
  }
  if (presentation.control === 'toolbar') {
    return (
      <Toolbar label={presentation.label}>
        <ToolbarGroup showLabels value={value} onChange={change} options={property.options.map((option) => ({ value: option, label: option }))} />
      </Toolbar>
    )
  }
  if (presentation.control === 'toggle') {
    return (
      <Toolbar label={presentation.label}>
        <ToolbarToggle icon="check" label={presentation.label} pressed={Boolean(value)} onChange={change} />
      </Toolbar>
    )
  }
  return <Switch {...shared} checked={Boolean(value)} onChange={change} />
}

export function GeneratedConfigurator({ contract, metadata, values, onChange, emptyLabel = 'No supported properties are available.' }) {
  const supported = contract.properties
    .filter((property) => property.kind !== 'unsupported')
    .map((property) => ({ property, presentation: propertyPresentation(property, metadata) }))
    .filter(({ presentation }) => isVisible(presentation, values))
    .sort((a, b) => a.presentation.group.localeCompare(b.presentation.group) || a.presentation.order - b.presentation.order || a.property.name.localeCompare(b.property.name))

  if (!supported.length) return <Banner status="info">{emptyLabel}</Banner>
  const groups = supported.reduce((map, item) => {
    const group = item.presentation.group
    map.set(group, [...(map.get(group) ?? []), item])
    return map
  }, new Map())
  return (
    <Stack gap="lg">
      {[...groups.entries()].map(([group, properties]) => (
        <Stack key={group} gap="sm">
          <Heading as="h3" size="xs">{group}</Heading>
          {properties.map(({ property, presentation }) => (
            <PropertyControl key={property.key} property={property} presentation={presentation} value={values[property.key]} onChange={onChange} />
          ))}
        </Stack>
      ))}
    </Stack>
  )
}
