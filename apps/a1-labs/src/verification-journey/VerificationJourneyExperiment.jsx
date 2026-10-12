import React, { useEffect, useRef, useState } from 'react'
import { Button, ButtonContainer, ChoiceGroup, Fieldset, Grid, Heading, Inset, Paragraph, Section, Stack, StickyActions, TextField, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ResponsivePreviewFrame, VIEWPORT_PRESETS, viewportSize } from '../../../a1-web/src/pages/components/detail/ResponsivePreviewFrame.jsx'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { VerificationProgress } from './VerificationProgress.jsx'
import { SCENARIOS, SECTIONS, STORAGE_KEY, createJob, initialValues, restoreJob, runDemo } from './demo-model.js'

export function VerificationJourneyExperiment({ experiment, onOpenSettings }) {
  const [viewport, setViewport] = useState('md')
  const [job, setJob] = useState(() => { try { return restoreJob(window.sessionStorage) } catch { return null } })
  const [values, setValues] = useState(() => job?.values || initialValues())
  const [scenario, setScenario] = useState(job?.scenario || 'retry')
  const [persisted, setPersisted] = useState(Boolean(job))
  const controller = useRef(null)
  const current = useRef(job)
  const headingRef = useRef(null)
  const formHeadingRef = useRef(null)
  const phase = job?.phase || 'form'
  const publish = next => {
    current.current = next
    try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setPersisted(true) }
    catch { setPersisted(false) }
    setJob(next)
  }
  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    // Focus only on page-state changes, never on each check or retry.
    const heading = phase === 'form' ? formHeadingRef.current : headingRef.current
    heading?.focus()
  }, [phase])
  const run = (next, recovered = false) => {
    controller.current?.abort()
    const control = new AbortController()
    controller.current = control
    publish({ ...next, phase: 'running', message: 'Application recorded. Starting the remaining checks.' })
    runDemo(next, { signal: control.signal, onUpdate: publish, recovered }).catch(error => {
      if (error.name !== 'AbortError') publish({ ...current.current, phase: 'error', message: 'Verification stopped unexpectedly. Your application is kept; retry the remaining checks.' })
    })
  }
  useEffect(() => {
    // Recover an interrupted tab automatically; do not replay completed services.
    if (current.current?.phase === 'interrupted') run(current.current)
  }, [])
  const edit = () => {
    controller.current?.abort()
    setValues({ ...current.current.values })
    setJob(null)
    current.current = null
    try { window.sessionStorage.removeItem(STORAGE_KEY) } catch { /* memory copy remains */ }
  }
  const reset = () => {
    controller.current?.abort()
    setValues(initialValues()); setJob(null); current.current = null; setPersisted(false)
    try { window.sessionStorage.removeItem(STORAGE_KEY) } catch { /* no saved draft */ }
  }
  const download = () => {
    const blob = new Blob([JSON.stringify({ simulation: true, ...current.current }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${job.id}.json`; anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const devices = {xs: 'Phone', sm: 'Landscape phone', md: 'Tablet', lg: 'Laptop', xl: 'Desktop'}
  const configuration = <Inset space={16}><Stack gap={24}>
    <Toolbar label="Viewport"><ToolbarGroup aria-label="Viewport" value={viewport} onChange={setViewport}
      options={VIEWPORT_PRESETS.filter(preset => devices[preset.value]).map(preset => ({value: preset.value, label: devices[preset.value], icon: preset.icon}))} /></Toolbar>
    <ChoiceGroup label="Scenario" name="verification-scenario" columns={1} value={scenario} options={SCENARIOS.map(item => ({ ...item, disabled: Boolean(job) }))} onChange={setScenario} />
    <Paragraph size="sm" color="muted">Choose a scenario before submitting. Retry remaining checks simulates the service recovering and keeps completed checks.</Paragraph>
    <Button variant="secondary" onClick={reset}>Reset experiment</Button>
    <Paragraph size="sm" color="muted">All services are simulated. No API keys or real applications are sent. Saved data stays in this browser tab until the session ends.</Paragraph>
  </Stack></Inset>
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <ResponsivePreviewFrame {...viewportSize(viewport)}>
    <main aria-label="Verification journey preview">
    <Section padding={{xs: 'sm', md: 'md'}} contentWidth="md">
      <Stack gap={24}>
        <Paragraph size="sm" color="muted">Simulated application · {SCENARIOS.find(item => item.value === scenario)?.label}</Paragraph>
        {!job ? <Stack gap={24}>
          <Stack gap={8}>
            <Paragraph size="sm" color="muted">1 of 3 · Apply</Paragraph>
            <Heading as="h2" size="lg" ref={formHeadingRef} tabIndex={-1}>Set up your team workspace</Heading>
            <Paragraph>This example is filled in for you. Review or edit it, then follow the verification across 6 services. No real workspace will be created.</Paragraph>
          </Stack>
          <form onSubmit={event => { event.preventDefault(); if (!controller.current || controller.current.signal.aborted || !current.current) run(createJob(values, scenario)) }}>
            <Stack gap={32}>
              {SECTIONS.map(section => <Fieldset key={section.title} legend={section.title}>
                <Grid columns={{ xs: 1, md: 2 }} gap={16}>
                  {section.fields.map(([id, label,, type = 'text']) => <TextField key={id} id={`verification-${id}`} name={id} label={label} type={type} value={values[id]} required
                    pattern={type === 'text' ? ".*\\S.*" : undefined}
                    autoComplete={({organization: 'organization', firstName: 'given-name', lastName: 'family-name', email: 'email', phone: 'tel', street: 'street-address', city: 'address-level2', region: 'address-level1', postal: 'postal-code', country: 'country-name'})[id] || 'off'}
                    min={type === 'number' ? 1 : undefined} max={type === 'number' ? 500 : undefined} step={type === 'number' ? 1 : undefined}
                    onChange={event => setValues(previous => ({ ...previous, [id]: event.target.value }))} />)}
                </Grid>
              </Fieldset>)}
              <Paragraph size="sm">Submitting saves these 19 fields in this browser tab and starts the simulated checks. Keep the tab open to retain the saved application for this session.</Paragraph>
              <StickyActions contentWidth="md">
                <ButtonContainer align="end" fillButtons>
                  <Button type="submit" icon="fact_check">Save and verify application</Button>
                </ButtonContainer>
              </StickyActions>
            </Stack>
          </form>
        </Stack> : <>
          <VerificationProgress job={job} persisted={persisted} headingRef={headingRef} onRetry={() => run(current.current, true)} onEdit={edit} onNew={reset} />
          <Paragraph size="sm" color="muted">{persisted ? `Application ${job.id} saved in this tab at ${new Date(job.savedAt).toLocaleTimeString()}.` : 'Application held in memory only.'}</Paragraph>
          <Button variant="tertiary" size="sm" icon="download" onClick={download}>{job.phase === 'success' ? 'Download receipt' : 'Download application and progress'}</Button>
        </>}
      </Stack>
    </Section>
    </main>
    </ResponsivePreviewFrame>
  </ExperimentLayout>
}
