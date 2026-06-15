import { DefinitionList } from '@gtivr4/a1-design-system-react'

// Definition List uses a bespoke preview; config, controls, and snippet fall
// back to the generic module (snippet is sourced from snippets.js).

export function Preview() {
  return (
    <DefinitionList
      direction="row"
      labelWidth="fixed"
      copyValue
      items={[
        { label: 'Account ID', value: 'A1-849204' },
        { label: 'Plan', value: 'Enterprise' },
        { label: 'Renewal', value: 'June 30, 2026' },
      ]}
    />
  )
}
