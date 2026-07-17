import { CheckboxGroup } from '@gtivr4/a1-design-system-react'
import { createGroupModule } from './groupKit.jsx'

const mod = createGroupModule({
  Component: CheckboxGroup,
  componentName: 'CheckboxGroup',
  multiple: true,
})

export const { getDefaultConfig, Preview, Controls, Snippet, jsonType, toJson, fromJson } = mod
