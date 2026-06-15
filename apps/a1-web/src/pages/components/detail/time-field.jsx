import { TimeField } from '@gtivr4/a1-design-system-react'
import { createFieldModule } from './fieldKit.jsx'

const mod = createFieldModule({
  Component: TimeField,
  componentName: 'TimeField',
  defaults: { label: 'Start time', value: '09:30' },
})

export const { getDefaultConfig, Preview, Controls, Snippet } = mod
