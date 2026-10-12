import React, { useState } from 'react'
import { Button, ChoiceGroup, Inset, Paragraph, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ResponsivePreviewFrame, VIEWPORT_PRESETS, viewportSize } from '../../../a1-web/src/pages/components/detail/ResponsivePreviewFrame.jsx'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { LongForm } from './LongForm.jsx'
import { CHAPTERS, METHODS, SECTIONS, exampleAnswers } from './form-model.js'

export function LongFormExperiment({ experiment, onOpenSettings }) {
  const [viewport, setViewport] = useState('lg')
  const [method, setMethod] = useState('pages')
  const [sectionsPerPage, setSectionsPerPage] = useState(4)
  const [currentSection, setCurrentSection] = useState(0)
  const [values, setValues] = useState(() => exampleAnswers(SECTIONS, 4))
  const [revision, setRevision] = useState(0)
  const devices = { xs: 'Phone', sm: 'Landscape phone', md: 'Tablet', lg: 'Laptop', xl: 'Desktop' }
  const configuration = <Inset space={16}><Stack gap={24}>
    <Toolbar label="Viewport"><ToolbarGroup aria-label="Viewport" value={viewport} onChange={setViewport} options={VIEWPORT_PRESETS.filter(preset => devices[preset.value]).map(preset => ({ value: preset.value, label: devices[preset.value], icon: preset.icon }))} /></Toolbar>
    <ChoiceGroup label="Form structure" name="form-structure" columns={1} value={method} onChange={setMethod} options={METHODS} />
    {method === 'pages' && <Stack gap={8}>
      <Paragraph weight="bold" size="sm">Sections per page</Paragraph>
      <Toolbar label="Sections per page"><ToolbarGroup aria-label="Sections per page" value={String(sectionsPerPage)} onChange={value => setSectionsPerPage(Number(value))} showLabels options={[
        { value: '1', label: '1 section' }, { value: '4', label: '4 sections' },
      ]} /></Toolbar>
    </Stack>}
    <Paragraph size="sm" color="muted">Compare the same 20 sections and 60 questions. Switching structure keeps your answers and current section.</Paragraph>
    <Button variant="secondary" onClick={() => { setValues(exampleAnswers()); setRevision(value => value + 1) }}>Fill example answers</Button>
    <Button variant="tertiary" onClick={() => { setValues(exampleAnswers(SECTIONS, 0)); setCurrentSection(0); setRevision(value => value + 1) }}>Clear form</Button>
  </Stack></Inset>
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <ResponsivePreviewFrame {...viewportSize(viewport)}>
      <LongForm key={revision} title="Community event plan" sections={SECTIONS} chapters={CHAPTERS} values={values} onChange={(id, value) => setValues(previous => ({ ...previous, [id]: value }))} method={method} sectionsPerPage={sectionsPerPage} currentSection={currentSection} onSectionChange={setCurrentSection} />
    </ResponsivePreviewFrame>
  </ExperimentLayout>
}
