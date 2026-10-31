import React, { useState } from 'react'
import {
  Button, ChoiceGroup, Code, Divider, Heading, Inset, Link, List, ListItem,
  Paragraph, Section, Stack, TextareaField,
} from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import './text-selection.css'

const treatments = [
  { value: 'default', label: 'Default', secondaryLabel: 'Browser selection; no custom styling' },
  { value: 'action-solid', label: 'Action solid', secondaryLabel: 'Strong product action' },
  { value: 'action-subtle', label: 'Action subtle', secondaryLabel: 'Low-emphasis annotation' },
  { value: 'info', label: 'Information', secondaryLabel: 'Reference or guidance' },
  { value: 'success', label: 'Success', secondaryLabel: 'Confirmed outcome' },
  { value: 'warning', label: 'Warning', secondaryLabel: 'Needs attention' },
  { value: 'error', label: 'Error', secondaryLabel: 'Blocking problem' },
  { value: 'highlight-subtle', label: 'Highlight ramp · subtle', secondaryLabel: 'Highlighted 100 with dark ramp text' },
  { value: 'highlight-obvious', label: 'Highlight ramp · obvious', secondaryLabel: 'Highlighted 400 with strongest ramp text' },
]

export function TextSelectionExperiment({ experiment, onOpenSettings }) {
  const [treatment, setTreatment] = useState('default')
  const [notes, setNotes] = useState('The review flow is clear. Confirm the migration note before approval.')

  const configuration = (
    <Inset space={16}>
      <Stack gap="lg">
        <ChoiceGroup
          label="Selection treatment"
          columns={1}
          size="compact"
          value={treatment}
          onChange={setTreatment}
          options={treatments}
        />
        <Paragraph size="sm" color="muted">Choose a treatment, then select any text in either section. Default leaves the browser’s selection unchanged.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Stack className={`a1-selection-study a1-selection-study--${treatment}`} gap={0}>
        <Section padding={{ xs: 'md', md: 'xl' }} contentWidth="md" aria-labelledby="selection-release-heading">
          <Stack gap={24}>
            <Stack gap={8}>
              <Paragraph size="sm" color="muted">Product update · Oct. 29, 2026</Paragraph>
              <Heading id="selection-release-heading" as="h1" size="xl">A faster way to review project changes</Heading>
              <Paragraph size="lg">The new review workspace keeps design decisions, implementation notes and approvals in one readable flow.</Paragraph>
            </Stack>
            <Paragraph>Select a short phrase, a complete sentence or several lines. Selection can cross <Link href="#release-details" onClick={event => event.preventDefault()}>linked release details</Link> and other inline content without changing the document structure.</Paragraph>
            <Heading as="h2" size="md">What changed</Heading>
            <List>
              <ListItem>Reviewers can compare the current proposal with its previous approved version.</ListItem>
              <ListItem>Keyboard navigation moves directly between unresolved decisions.</ListItem>
              <ListItem>Implementation references such as <Code variant="inline">Button.variant</Code> remain part of the selectable text.</ListItem>
            </List>
            <Divider />
            <TextareaField
              label="Reviewer notes"
              hint="Select text here to compare the same treatment inside a form control."
              rows="sm"
              value={notes}
              onChange={event => setNotes(event.target.value)}
            />
            <Stack direction="row" wrap gap={12} align="center">
              <Button>Start a review</Button>
              <Link href="#release-notes" onClick={event => event.preventDefault()}>Read all release notes</Link>
            </Stack>
          </Stack>
        </Section>

        <Section inverse surface="raised" padding={{ xs: 'md', md: 'xl' }} contentWidth="md" aria-labelledby="selection-incident-heading">
          <Stack gap={24}>
            <Stack gap={8}>
              <Paragraph size="sm" color="muted">Service notice · Resolved</Paragraph>
              <Heading id="selection-incident-heading" as="h2" size="xl">Project publishing has recovered</Heading>
              <Paragraph size="lg">Publishing is operating normally after a brief interruption affected new production releases.</Paragraph>
            </Stack>
            <Paragraph>Teams can resume scheduled launches. Existing sites remained available throughout the incident, and no saved project content was lost.</Paragraph>
            <Heading as="h3" size="md">Resolution details</Heading>
            <List>
              <ListItem>The deployment queue was restored at 3:42 p.m. EDT.</ListItem>
              <ListItem>Delayed releases are processing automatically in their original order.</ListItem>
              <ListItem>Follow-up monitoring remains active for the next 24 hours.</ListItem>
            </List>
            <Paragraph>For technical context, see incident reference <Code variant="inline">A1-2026-10-29</Code> or <Link href="#status-history" onClick={event => event.preventDefault()}>review status history</Link>.</Paragraph>
          </Stack>
        </Section>
      </Stack>
    </ExperimentLayout>
  )
}
