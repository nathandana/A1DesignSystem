import React, { useEffect, useId, useRef, useState } from 'react'
import { Button, ButtonContainer, Card, Fieldset, Heading, Inset, PageLayout, Pagination, Paragraph, Section, SideNav, SideNavItem, Stack, StatusBar, StickyActions, TextField } from '@gtivr4/a1-design-system-react'
import { formProgress, missingAnswers, visibleSections } from './form-model.js'

// Scroll only the preview panel. Element.scrollIntoView would also scroll the
// iframe document and Labs ancestors, moving its persistent header offscreen.
function reveal(element, focus = false) {
  if (!element) return
  if (focus) element.focus({ preventScroll: true })
  const panel = element.closest('.a1-page-layout__main-scroll, .a1-side-nav__nav')
  if (panel) panel.scrollTo({ top: panel.scrollTop + element.getBoundingClientRect().top - panel.getBoundingClientRect().top, behavior: 'instant' })
}

/** A controlled, portable comparison of form navigation patterns. No Labs imports. */
export function LongForm({ sections, chapters, values, onChange, method, sectionsPerPage = 4, currentSection, onSectionChange, title, onComplete }) {
  const id = useId()
  const root = useRef(null)
  const navTrigger = useRef(null)
  const pendingFocus = useRef(null)
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [complete, setComplete] = useState(false)
  const progress = formProgress(sections, values)
  const missing = missingAnswers(sections, values)
  const pageSize = [1, 4].includes(sectionsPerPage) ? sectionsPerPage : 4
  const page = Math.floor(currentSection / pageSize)
  const indices = visibleSections(method, currentSection, sections.length, pageSize)
  const section = sections[currentSection]
  const position = method === 'pages' ? `Page ${page + 1} of ${Math.ceil(sections.length / pageSize)} · ${pageSize === 1 ? `Section ${currentSection + 1}` : `Sections ${page * pageSize + 1}–${Math.min((page + 1) * pageSize, sections.length)}`}` : `Section ${currentSection + 1} of ${sections.length} · ${section.title}`
  const locate = (index, fieldId) => {
    pendingFocus.current = fieldId ? `${id}-${fieldId}` : `${id}-heading-${index}`
    onSectionChange(index)
    setNavigationOpen(false)
    // Also handle a jump to the already active section.
    root.current?.ownerDocument.defaultView.requestAnimationFrame(() => {
      const target = root.current?.ownerDocument.getElementById(pendingFocus.current)
      if (target) { reveal(target, true); pendingFocus.current = null }
    })
  }
  useEffect(() => {
    const document = root.current?.ownerDocument
    const target = document?.getElementById(pendingFocus.current)
    if (target) { reveal(target, true); pendingFocus.current = null }
  }, [method, currentSection, complete, pageSize])
  useEffect(() => {
    reveal(root.current?.ownerDocument.getElementById(`${id}-heading-${currentSection}`))
  }, [method, pageSize])
  // SideNav supplies the responsive presentation; this host owns overlay focus
  // in the iframe document, including Escape, a focus loop and inert background.
  useEffect(() => {
    if (!navigationOpen) return
    const document = root.current.ownerDocument
    const nav = root.current.querySelector('nav[aria-label="Form sections"]')
    const overlay = document.defaultView.getComputedStyle(nav).position === 'fixed'
    const background = [...root.current.querySelectorAll('header, main, footer')]
    if (overlay) background.forEach(element => { element.inert = true })
    reveal(nav.querySelector('[aria-current]'), true)
    const keydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); setNavigationOpen(false) }
      if (!overlay || event.key !== 'Tab') return
      const focusable = [...nav.querySelectorAll('button, a[href]')].filter(element => element.getClientRects().length)
      const first = focusable[0], last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    const closeOnResize = () => setNavigationOpen(false)
    document.addEventListener('keydown', keydown)
    document.defaultView.addEventListener('resize', closeOnResize)
    return () => {
      background.forEach(element => { element.inert = false })
      document.removeEventListener('keydown', keydown)
      document.defaultView.removeEventListener('resize', closeOnResize)
      navTrigger.current?.focus({ preventScroll: true })
    }
  }, [navigationOpen])
  useEffect(() => { setNavigationOpen(false) }, [method])
  // Track the visible section without moving focus or announcing every scroll.
  const trackPosition = event => {
    if (complete || !['visual', 'pages'].includes(method) || pendingFocus.current) return
    const scroller = event.target
    if (!scroller.matches?.('.a1-page-layout__main-scroll')) return
    const threshold = scroller.getBoundingClientRect().top + scroller.clientHeight / 3
    const headings = [...root.current.querySelectorAll('[data-form-section]')]
    const atEnd = Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight
    const visible = atEnd ? headings.at(-1) : headings.filter(element => element.getBoundingClientRect().top <= threshold).at(-1) || headings[0]
    if (visible) {
      const next = Number(visible.dataset.formSection)
      if (next !== currentSection) onSectionChange(next)
    }
  }
  const submit = event => {
    event.preventDefault()
    setAttempted(true)
    if (missing.length) { locate(missing[0].section, missing[0].id); return }
    setComplete(true)
    onComplete?.(values)
  }
  const sidebar = method === 'sidenav' && !complete ? <SideNav aria-label="Form sections" open={navigationOpen} onClose={() => setNavigationOpen(false)} collapsed={false} collapseButtonPlacement="none" header={<Paragraph weight="bold">20 sections</Paragraph>}>
    {sections.map((item, index) => <SideNavItem key={item.id} as="button" type="button" label={`${index + 1}. ${item.title}`} active={index === currentSection} badge={`${progress.counts[index]}/${item.fields.length}`} icon={progress.counts[index] === item.fields.length ? 'check_circle' : 'circle'} onClick={() => locate(index)} />)}
  </SideNav> : undefined
  const header = <Inset space={16}><Stack gap={8}>
    <Stack direction="row" justify="between" align="center" gap={8} wrap>
      <Paragraph weight="bold">{title}</Paragraph>
      {sidebar && <Button ref={navTrigger} variant="tertiary" size="sm" icon="menu" aria-expanded={navigationOpen} onClick={() => setNavigationOpen(true)}>Form sections</Button>}
    </Stack>
    <Paragraph size="sm" data-form-position>{complete ? 'Complete · All sections answered' : position}</Paragraph>
    <StatusBar value={progress.answered} max={progress.total} size="sm" aria-label="Questions answered" aria-valuetext={`${progress.answered} of ${progress.total} questions answered; ${progress.complete} of ${sections.length} sections complete`} />
    <Paragraph size="sm" color="muted">{progress.answered} of {progress.total} questions answered · {progress.complete} of {sections.length} sections complete</Paragraph>
  </Stack></Inset>
  return <div ref={root} className="a1-long-form" onScrollCapture={trackPosition}>
    <PageLayout viewportHeight header={header} sidebar={sidebar} footer={!complete && <StickyActions contentWidth="md"><ButtonContainer align="end" fillButtons>
      {method !== 'visual' && <Button variant="secondary" disabled={currentSection === 0 || (method === 'pages' && page === 0)} onClick={() => locate(method === 'pages' ? (page - 1) * pageSize : currentSection - 1)}>Previous {method === 'pages' ? 'page' : 'section'}</Button>}
      {method !== 'visual' && (method === 'pages' ? page < Math.ceil(sections.length / pageSize) - 1 : currentSection < sections.length - 1)
        ? <Button onClick={() => locate(method === 'pages' ? (page + 1) * pageSize : currentSection + 1)}>Next {method === 'pages' ? 'page' : 'section'}</Button>
        : <Button type="submit" form={`${id}-form`}>Submit demo form</Button>}
    </ButtonContainer></StickyActions>}>
      <Section contentWidth="md" padding={{ xs: 'sm', md: 'md' }} gap="md">
        {!complete && method === 'pages' && <Pagination page={page + 1} totalPages={Math.ceil(sections.length / pageSize)} onChange={next => locate((next - 1) * pageSize)} />}
        {complete ? <Card icon="check_circle" iconDisplay="default" surface="success"><Stack gap={16}>
          <Heading as="h1" size="lg" tabIndex={-1} ref={element => element?.focus({ preventScroll: true })}>Your event plan is complete</Heading>
          <Paragraph>All {sections.length} sections and {progress.total} answers are included in this demonstration. Nothing was sent or saved to a server.</Paragraph>
          <Button onClick={() => { setComplete(false); setAttempted(false); locate(0) }}>Return to form</Button>
        </Stack></Card> : <form id={`${id}-form`} noValidate onSubmit={submit}>
          <Stack gap={32}>
            <Stack gap={8}>
              <Heading as="h1" size="lg">Plan a community event</Heading>
              <Paragraph size="sm">20 sections · 3 questions each. All questions are required before submission. Move freely between sections; your answers stay here while you compare layouts.</Paragraph>
              <Paragraph size="sm" color="muted">The first 4 sections contain fictional example answers. This demo keeps edits in memory until you leave or reload.</Paragraph>
            </Stack>
            {attempted && missing.length > 0 && <Card surface="error" icon="error" iconDisplay="default"><Paragraph role="alert">{missing.length} questions still need an answer. We’ve taken you to the first one. Complete the remaining questions, then submit again.</Paragraph></Card>}
            {indices.map(index => {
              const item = sections[index]
              return <Card key={item.id} as="section" aria-labelledby={`${id}-heading-${index}`} onFocusCapture={() => { if (index !== currentSection) onSectionChange(index) }}>
                <Stack gap={16}>
                  <Stack gap={8}>
                    <Paragraph size="sm" color="muted" id={`${id}-position-${index}`}>{chapters[item.chapter]} · Section {index + 1} of {sections.length} · {progress.counts[index]} of {item.fields.length} answered</Paragraph>
                    <Heading as="h2" size="md" id={`${id}-heading-${index}`} aria-describedby={`${id}-position-${index}`} data-form-section={index} tabIndex={-1}>{item.title}</Heading>
                    <Paragraph size="sm" color="muted">{item.description}</Paragraph>
                  </Stack>
                  <Fieldset legend={`${item.title} questions`} markRequired>
                    {item.fields.map(field => <TextField key={field.id} id={`${id}-${field.id}`} name={field.id} label={field.label} required autoComplete="off" value={values[field.id] ?? ''} error={attempted && !String(values[field.id] ?? '').trim() ? 'Enter an answer.' : undefined} onChange={event => onChange(field.id, event.target.value)} />)}
                  </Fieldset>
                </Stack>
              </Card>
            })}
          </Stack>
        </form>}
      </Section>
    </PageLayout>
  </div>
}
