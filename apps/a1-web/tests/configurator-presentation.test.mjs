import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildPropertyContract,
  createPresentationMetadata,
  initialConfiguratorValues,
  propertyPresentation,
  updatePropertyOverride,
  validatePresentationMetadata,
} from '../src/configurator/presentationModel.js'

const tables = [{
  title: 'Button',
  rows: [
    { id: 'children', name: 'children', type: 'string', description: 'Visible label.' },
    { id: 'description', name: 'description', type: 'string', description: 'Long supporting content.' },
    { id: 'variant', name: 'variant', type: '"primary" | "secondary"', description: 'Default: "primary".' },
    { id: 'disabled', name: 'disabled', type: 'boolean', description: 'Default: false.' },
    { id: 'count', name: 'count', type: 'number', description: 'Default: 2.' },
    { id: 'onClick', name: 'onClick', type: '() => void', description: 'Activation callback.' },
  ],
}]

test('property contracts infer controls and defaults from authoritative prop metadata', () => {
  const contract = buildPropertyContract(tables)
  assert.equal(contract.properties.find((property) => property.key === 'children').control, 'text')
  assert.equal(contract.properties.find((property) => property.key === 'description').control, 'textarea')
  assert.deepEqual(contract.properties.find((property) => property.key === 'variant').options, ['primary', 'secondary'])
  assert.equal(contract.properties.find((property) => property.key === 'disabled').defaultValue, false)
  assert.equal(contract.properties.find((property) => property.key === 'count').defaultValue, 2)
  assert.equal(contract.properties.find((property) => property.key === 'onClick').kind, 'unsupported')
})

test('presentation overrides preserve values and round-trip as versioned JSON', () => {
  const contract = buildPropertyContract(tables)
  const disabled = contract.properties.find((property) => property.key === 'disabled')
  const values = { ...initialConfiguratorValues(contract), disabled: true }
  const metadata = updatePropertyOverride(createPresentationMetadata('button', contract), disabled, {
    control: 'toggle', label: 'Unavailable', group: 'State', order: 2,
  })
  const loaded = JSON.parse(JSON.stringify(metadata))
  assert.equal(propertyPresentation(disabled, loaded).control, 'toggle')
  assert.equal(values.disabled, true)
  assert.deepEqual(validatePresentationMetadata(loaded, 'button', contract).filter((item) => item.severity === 'error'), [])
})

test('contract drift, unknown properties and invalid controls are explicit', () => {
  const contract = buildPropertyContract(tables)
  const metadata = createPresentationMetadata('button', contract)
  metadata.contractFingerprint = 'stale'
  metadata.properties.disabled = { contractType: 'string', control: 'textarea' }
  metadata.properties.removed = { contractType: 'string', control: 'text' }
  const codes = validatePresentationMetadata(metadata, 'button', contract).map((item) => item.code)
  assert.ok(codes.includes('contract-changed'))
  assert.ok(codes.includes('property-type-changed'))
  assert.ok(codes.includes('unsupported-control'))
  assert.ok(codes.includes('unknown-property'))
  assert.ok(codes.includes('unsupported-property'))
})
