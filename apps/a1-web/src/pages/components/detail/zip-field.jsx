import { ZipField } from '@gtivr4/a1-design-system-react'
import { createFieldModule } from './fieldKit.jsx'

const mod = createFieldModule({
  Component: ZipField,
  componentName: 'ZipField',
  defaults: { label: 'ZIP code', value: '', autoComplete: 'postal-code' },
})

export const { getDefaultConfig, Preview, Controls, Snippet } = mod
