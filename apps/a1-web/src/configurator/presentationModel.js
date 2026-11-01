export const CONFIGURATOR_PRESENTATION_VERSION = '1.0.0'

const NULLISH = new Set(['undefined', 'null'])
const LONG_TEXT = /(content|description|helper|hint|message|markup|markdown|css|javascript|\bjs\b)/i

function alternatives(type) {
  return String(type).split('|').map((part) => part.trim()).filter((part) => !NULLISH.has(part))
}

export function enumOptions(type) {
  const parts = alternatives(type)
  if (parts.length < 2) return []
  const values = parts.map((part) => part.match(/^(['"])(.*)\1$/)?.[2])
  return values.every((value) => value !== undefined) ? values : []
}

function scalarType(type) {
  const parts = alternatives(type)
  return parts.length === 1 ? parts[0] : String(type).trim()
}

function inferredDefault(property) {
  const match = property.description?.match(/Default:\s*(`?)([^`.]+)\1[.`]?/i)
  const raw = match?.[2]?.trim()
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (raw && /^-?\d+(\.\d+)?$/.test(raw)) return Number(raw)
  if (raw) return raw.replace(/^['"]|['"]$/g, '')
  if (property.kind === 'boolean') return false
  if (property.kind === 'number') return 0
  if (property.kind === 'enum') return property.options[0] ?? ''
  return ''
}

function classify(row) {
  const options = enumOptions(row.type)
  const scalar = scalarType(row.type)
  if (options.length) return { kind: 'enum', options, control: 'select', supportedControls: ['select', 'toolbar'] }
  if (scalar === 'boolean') return { kind: 'boolean', options: [], control: 'switch', supportedControls: ['switch', 'toggle'] }
  if (scalar === 'number') return { kind: 'number', options: [], control: 'number', supportedControls: ['number'] }
  if (scalar === 'string') {
    const control = LONG_TEXT.test(`${row.name} ${row.description ?? ''}`) ? 'textarea' : 'text'
    return { kind: 'string', options: [], control, supportedControls: ['text', 'textarea'] }
  }
  return { kind: 'unsupported', options: [], control: 'unsupported', supportedControls: [] }
}

function hash(value) {
  let result = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index)
    result = Math.imul(result, 16777619)
  }
  return (result >>> 0).toString(16).padStart(8, '0')
}

export function buildPropertyContract(tables) {
  const used = new Set()
  const properties = []
  for (const [tableIndex, table] of (tables ?? []).entries()) {
    for (const row of table.rows ?? []) {
      const baseKey = row.id ?? row.name
      let key = baseKey
      if (used.has(key)) key = `${table.title ?? tableIndex}.${baseKey}`
      used.add(key)
      const classified = classify(row)
      const property = {
        key,
        name: row.name,
        type: row.type,
        description: row.description ?? '',
        contractGroup: table.title ?? 'Properties',
        ...classified,
      }
      property.defaultValue = inferredDefault(property)
      properties.push(property)
    }
  }
  const signature = properties.map(({ key, type }) => `${key}:${type}`).join('|')
  return { properties, fingerprint: hash(signature) }
}

export function createPresentationMetadata(componentId, contract) {
  return {
    schemaVersion: CONFIGURATOR_PRESENTATION_VERSION,
    componentId,
    contractFingerprint: contract.fingerprint,
    properties: {},
  }
}

export function propertyPresentation(property, metadata) {
  const override = metadata?.properties?.[property.key] ?? {}
  const control = property.supportedControls.includes(override.control) ? override.control : property.control
  return {
    label: override.label || property.name,
    helpText: override.helpText ?? property.description,
    group: override.group || property.contractGroup,
    order: Number.isFinite(Number(override.order)) ? Number(override.order) : 0,
    control,
    visibleWhen: override.visibleWhen ?? null,
  }
}

export function initialConfiguratorValues(contract) {
  return Object.fromEntries(contract.properties.map((property) => [property.key, property.defaultValue]))
}

export function coercePropertyValue(property, value) {
  if (property.kind === 'boolean') return value === true || value === 'true'
  if (property.kind === 'number') return value === '' ? 0 : Number(value)
  return String(value ?? '')
}

export function validatePresentationMetadata(metadata, componentId, contract) {
  const diagnostics = []
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return [{ code: 'invalid-metadata', severity: 'error', message: 'Presentation metadata must be a JSON object.' }]
  }
  if (metadata.schemaVersion !== CONFIGURATOR_PRESENTATION_VERSION) diagnostics.push({ code: 'unsupported-version', severity: 'error', message: `Unsupported presentation metadata version “${metadata.schemaVersion ?? 'missing'}”.` })
  if (metadata.componentId !== componentId) diagnostics.push({ code: 'wrong-component', severity: 'error', message: `This metadata references “${metadata.componentId ?? 'no component'}”, not “${componentId}”.` })
  if (metadata.contractFingerprint !== contract.fingerprint) diagnostics.push({ code: 'contract-changed', severity: 'warning', message: 'The component property contract changed after this presentation metadata was saved.' })

  const byKey = new Map(contract.properties.map((property) => [property.key, property]))
  for (const [key, override] of Object.entries(metadata.properties ?? {})) {
    const property = byKey.get(key)
    if (!property) {
      diagnostics.push({ code: 'unknown-property', severity: 'error', property: key, message: `Property “${key}” is no longer in the component contract.` })
      continue
    }
    if (override.contractType && override.contractType !== property.type) diagnostics.push({ code: 'property-type-changed', severity: 'error', property: key, message: `Property “${property.name}” changed from “${override.contractType}” to “${property.type}”.` })
    if (override.control && !property.supportedControls.includes(override.control)) diagnostics.push({ code: 'unsupported-control', severity: 'error', property: key, message: `“${override.control}” cannot edit ${property.name} (${property.type}).` })
    if (override.visibleWhen?.property && !byKey.has(override.visibleWhen.property)) diagnostics.push({ code: 'unknown-condition-property', severity: 'error', property: key, message: `The visibility rule for “${property.name}” references an unknown property.` })
  }
  for (const property of contract.properties.filter((item) => item.kind === 'unsupported')) diagnostics.push({ code: 'unsupported-property', severity: 'info', property: property.key, message: `“${property.name}” (${property.type}) needs a custom editor.` })
  return diagnostics
}

export function updatePropertyOverride(metadata, property, patch) {
  const current = metadata.properties?.[property.key] ?? {}
  return {
    ...metadata,
    properties: {
      ...metadata.properties,
      [property.key]: { ...current, contractType: property.type, ...patch },
    },
  }
}
