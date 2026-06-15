import { CreditCardField } from '@gtivr4/a1-design-system-react'
import { createFieldModule } from './fieldKit.jsx'

const mod = createFieldModule({
  Component: CreditCardField,
  componentName: 'CreditCardField',
  defaults: { label: 'Card number', value: '', autoComplete: 'cc-number' },
})

export const { getDefaultConfig, Preview, Controls, Snippet } = mod
