import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  Banner,
  Button,
  ButtonContainer,
  Code,
  Grid,
  Heading,
  MessageBadge,
  NumberField,
  Paragraph,
  Section,
  SelectField,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { GeneratedConfigurator } from '../../configurator/GeneratedConfigurator.jsx'
import {
  buildPropertyContract,
  coercePropertyValue,
  createPresentationMetadata,
  initialConfiguratorValues,
  propertyPresentation,
  updatePropertyOverride,
  validatePresentationMetadata,
} from '../../configurator/presentationModel.js'

const storageKey = (componentId) => `a1-configurator-presentation-${componentId}`

function loadMetadata(componentId, contract) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(componentId)))
    return saved && typeof saved === 'object' ? saved : createPresentationMetadata(componentId, contract)
  } catch {
    return createPresentationMetadata(componentId, contract)
  }
}

function PropertyEditor({ property, contract, metadata, setMetadata, t }) {
  const presentation = propertyPresentation(property, metadata)
  const override = metadata.properties?.[property.key] ?? {}
  const conditionProperty = contract.properties.find((candidate) => candidate.key === presentation.visibleWhen?.property)
  const set = (patch) => setMetadata((current) => updatePropertyOverride(current, property, patch))

  if (property.kind === 'unsupported') {
    return (
      <Accordion label={property.name} subtext={property.type} size="sm">
        <Banner status="warn">{t('label.configuratorPresentation.customEditorRequired', 'This property needs a custom editor because its contract type is not supported by the generated renderer.')}</Banner>
      </Accordion>
    )
  }

  return (
    <Accordion label={presentation.label} subtext={`${property.type} · ${presentation.control}`} size="sm">
      <Stack gap="md">
        <SelectField
          label={t('label.configuratorPresentation.control', 'Control presentation')}
          size="compact"
          value={presentation.control}
          onChange={(event) => set({ control: event.target.value })}
        >
          {property.supportedControls.map((control) => <option key={control} value={control}>{t(`label.configuratorPresentation.control.${control}`, control)}</option>)}
        </SelectField>
        <TextField label={t('label.configuratorPresentation.label', 'Label')} size="compact" value={presentation.label} onChange={(event) => set({ label: event.target.value })} />
        <TextareaField label={t('label.configuratorPresentation.helpText', 'Help text')} size="compact" value={presentation.helpText} onChange={(event) => set({ helpText: event.target.value })} />
        <TextField label={t('label.configuratorPresentation.group', 'Group')} size="compact" value={presentation.group} onChange={(event) => set({ group: event.target.value })} />
        <NumberField label={t('label.configuratorPresentation.order', 'Order')} size="compact" value={presentation.order} onChange={(event) => set({ order: Number(event.target.value) })} />
        <SelectField
          label={t('label.configuratorPresentation.visibleWhen', 'Visible when')}
          size="compact"
          value={presentation.visibleWhen?.property ?? ''}
          onChange={(event) => set({ visibleWhen: event.target.value ? { property: event.target.value, equals: '' } : null })}
        >
          <option value="">{t('label.configuratorPresentation.alwaysVisible', 'Always visible')}</option>
          {contract.properties.filter((candidate) => candidate.kind !== 'unsupported' && candidate.key !== property.key).map((candidate) => (
            <option key={candidate.key} value={candidate.key}>{candidate.name}</option>
          ))}
        </SelectField>
        {conditionProperty && (
          <TextField
            label={t('label.configuratorPresentation.equals', 'Equals')}
            size="compact"
            value={String(presentation.visibleWhen?.equals ?? '')}
            onChange={(event) => set({ visibleWhen: { property: conditionProperty.key, equals: coercePropertyValue(conditionProperty, event.target.value) } })}
          />
        )}
        {override.contractType && <Paragraph size="xs" color="muted">{t('label.configuratorPresentation.contractReference', 'Contract reference')}: {override.contractType}</Paragraph>}
      </Stack>
    </Accordion>
  )
}

export function ConfiguratorPresentationEditor({ component, tables, t }) {
  const contract = useMemo(() => buildPropertyContract(tables), [tables])
  const [metadata, setMetadata] = useState(() => loadMetadata(component.id, contract))
  const [jsonDraft, setJsonDraft] = useState(() => JSON.stringify(loadMetadata(component.id, contract), null, 2))
  const [values, setValues] = useState(() => initialConfiguratorValues(contract))
  const [jsonError, setJsonError] = useState('')
  const [notice, setNotice] = useState('')
  const diagnostics = validatePresentationMetadata(metadata, component.id, contract)

  useEffect(() => {
    setJsonDraft(JSON.stringify(metadata, null, 2))
  }, [metadata])

  function reset() {
    const next = createPresentationMetadata(component.id, contract)
    setMetadata(next)
    setJsonDraft(JSON.stringify(next, null, 2))
    setJsonError('')
    setNotice(t('label.configuratorPresentation.resetNotice', 'Presentation overrides reset.'))
  }

  function save() {
    localStorage.setItem(storageKey(component.id), JSON.stringify(metadata))
    setNotice(t('label.configuratorPresentation.savedNotice', 'Configurator presentation saved in this browser.'))
  }

  function editJson(text) {
    setJsonDraft(text)
    try {
      const next = JSON.parse(text)
      setMetadata(next)
      setJsonError('')
    } catch (error) {
      setJsonError(`${t('label.configuratorPresentation.invalidJson', 'Not valid JSON.')} ${error.message}`)
    }
  }

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Heading as="h2" size="md">{t('label.configuratorPresentation.title', 'Configurator editor')}</Heading>
        <Paragraph color="muted">{t('label.configuratorPresentation.description', 'Generate controls from the component property contract, then customize presentation without changing allowed values or types.')}</Paragraph>
        <ButtonContainer>
          <Button type="button" size="sm" onClick={save}>{t('label.configuratorPresentation.save', 'Save presentation')}</Button>
          <Button type="button" size="sm" variant="secondary" onClick={reset}>{t('label.configuratorPresentation.reset', 'Reset overrides')}</Button>
        </ButtonContainer>
        {notice && <Banner status="success">{notice}</Banner>}
      </Stack>

      {diagnostics.length > 0 && (
        <Stack gap="xs">
          <Heading as="h3" size="sm">{t('label.configuratorPresentation.contractStatus', 'Contract status')}</Heading>
          {diagnostics.map((diagnostic, index) => (
            <Banner key={`${diagnostic.code}-${diagnostic.property ?? index}`} status={diagnostic.severity === 'error' ? 'error' : diagnostic.severity === 'warning' ? 'warn' : 'info'}>
              {t('label.configuratorPresentation.contractDiagnostic', 'Contract diagnostic')}: {diagnostic.message}
            </Banner>
          ))}
        </Stack>
      )}

      <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
        <Section padding="md" surface="panel" direction="column" gap="sm">
          <Stack direction="row" gap="sm" align="center" justify="between">
            <Heading as="h3" size="sm">{t('label.configuratorPresentation.properties', 'Property presentation')}</Heading>
            <MessageBadge subtle>{contract.properties.length}</MessageBadge>
          </Stack>
          {contract.properties.map((property) => (
            <PropertyEditor key={property.key} property={property} contract={contract} metadata={metadata} setMetadata={setMetadata} t={t} />
          ))}
        </Section>

        <Stack gap="lg">
          <Section padding="md" surface="raised" direction="column" gap="md">
            <Heading as="h3" size="sm">{t('label.configuratorPresentation.preview', 'Generated configurator preview')}</Heading>
            <GeneratedConfigurator
              contract={contract}
              metadata={metadata}
              values={values}
              onChange={(key, value) => setValues((current) => ({ ...current, [key]: value }))}
              emptyLabel={t('label.configuratorPresentation.noSupportedProperties', 'No supported properties are available.')}
            />
          </Section>
          <Stack gap="sm">
            <Heading as="h3" size="sm">{t('label.configuratorPresentation.metadata', 'Presentation metadata')}</Heading>
            <Paragraph size="sm" color="muted">{t('label.configuratorPresentation.metadataHelp', 'This versioned JSON stores presentation overrides and contract references. The component property contract remains authoritative.')}</Paragraph>
            <Code variant="block" editable wrapping copyCode onChangeValue={editJson}>{jsonDraft}</Code>
            {jsonError && <Banner status="error">{jsonError}</Banner>}
          </Stack>
        </Stack>
      </Grid>
    </Stack>
  )
}
