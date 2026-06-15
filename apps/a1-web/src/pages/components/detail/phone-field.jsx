import { PhoneField } from '@gtivr4/a1-design-system-react'
import { createFieldModule } from './fieldKit.jsx'

const mod = createFieldModule({
  Component: PhoneField,
  componentName: 'PhoneField',
  defaults: { label: 'Phone number', value: '', autoComplete: 'tel' },
})

export const { getDefaultConfig, Preview, Controls, Snippet } = mod
