import { DateField } from '@gtivr4/a1-design-system-react'
import { createFieldModule } from './fieldKit.jsx'

const mod = createFieldModule({
  Component: DateField,
  componentName: 'DateField',
  defaults: { label: 'Start date', value: '2026-06-15' },
})

export const { getDefaultConfig, Preview, Controls, Snippet } = mod
