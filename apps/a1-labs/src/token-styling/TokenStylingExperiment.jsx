import React, { useEffect, useState } from 'react'
import { ChoiceGroup, Heading, Inset, Paragraph, Section, SelectField, Stack } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { TokenSpecimen, tokenTreatments } from './TokenSpecimen.jsx'
import { tokenFamilies } from './token-options.js'
export function TokenStylingExperiment({ experiment, onOpenSettings }) {
  const [token, setToken] = useState('--semantic-color-surface-card'), [treatment, setTreatment] = useState('syntax'), [values, setValues] = useState({})
  useEffect(() => {
    const read = () => { const styles = getComputedStyle(document.documentElement); setValues(Object.fromEntries(tokenFamilies.flatMap(group => group.options.map(option => [option.token, styles.getPropertyValue(option.token).trim()])))) }
    read(); const observer = new MutationObserver(read); observer.observe(document.documentElement, { attributes: true }); return () => observer.disconnect()
  }, [])
  const specimen = style => <TokenSpecimen token={token} value={values[token]} treatment={style} color={token.startsWith('--semantic-color-')} />
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={
    <Inset space={16}><Stack gap={24}>
      <SelectField label="Example token" value={token} onChange={event => setToken(event.target.value)}>{tokenFamilies.map(family => <optgroup key={family.id} label={family.label}>{family.options.map(option => <option key={option.token} value={option.token}>{option.token}</option>)}</optgroup>)}</SelectField>
      <ChoiceGroup label="Token treatment" columns={1} size="compact" value={treatment} onChange={setTreatment} options={tokenTreatments.map(({ value, label }) => ({ value, label }))} />
      <Paragraph size="sm" color="muted">This styles the token reference itself. Names stay complete, selectable and readable. Colors and resolved values follow the active theme.</Paragraph>
    </Stack></Inset>
  }><Section padding="none" contentWidth="md"><Stack gap={24} className="a1-token-study">
    <Stack gap={16}><Heading as="h3" size="sm">{tokenTreatments.find(item => item.value === treatment).label}</Heading><div data-token-preview>{specimen(treatment)}</div><Paragraph size="sm" color="muted">Resolved value: {values[token] || 'Resolving token…'}</Paragraph></Stack>

  </Stack></Section></ExperimentLayout>
}
