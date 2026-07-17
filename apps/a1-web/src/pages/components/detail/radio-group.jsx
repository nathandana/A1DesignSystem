import { RadioGroup } from '@gtivr4/a1-design-system-react'
import { createGroupModule } from './groupKit.jsx'

const mod = createGroupModule({
  Component: RadioGroup,
  componentName: 'RadioGroup',
  multiple: false,
})

export const { getDefaultConfig, Preview, Controls, Snippet, jsonType, toJson, fromJson } = mod
