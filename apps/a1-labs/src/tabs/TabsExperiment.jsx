import React, { useState } from 'react'
import { ChoiceGroup, DefinitionList, Heading, Inset, Paragraph, Section, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { StyledTabs, TAB_TREATMENTS } from './StyledTabs.jsx'

const views = [
  { id: 'overview', label: 'Overview', icon: 'dashboard', count: 8, title: 'A place for the whole project', text: 'Keep plans, conversations and shared resources together.', detail: 'Next milestone', value: 'Prototype review · Friday' },
  { id: 'files', label: 'Files', icon: 'folder', count: 12, title: 'Everything in its place', text: 'The latest project files are ready for your team to review.', detail: 'Latest file', value: 'Workspace prototype · Updated today' },
  { id: 'activity', label: 'Activity', icon: 'history', count: 4, title: 'What changed recently', text: 'Maya shared a prototype. Sam added feedback to the project brief.', detail: 'Last update', value: 'Design review · 12 minutes ago' },
  { id: 'team', label: 'Team', icon: 'group', count: 6, title: 'Made together', text: 'Six people are collaborating on this workspace.', detail: 'Project lead', value: 'Maya Chen · Design' },
  { id: 'settings', label: 'Settings', icon: 'settings', count: 3, title: 'Your workspace, your way', text: 'Manage access, notifications and preferences for this project.', detail: 'Visibility', value: 'Private · Invited team members' },
]

export function TabsExperiment({ experiment, onOpenSettings }) {
  const [treatment, setTreatment] = useState('default')
  const [value, setValue] = useState('overview')
  const [icons, setIcons] = useState(true)
  const [counts, setCounts] = useState(false)
  const [size, setSize] = useState('default')
  const configuration = <Inset space={16}><Stack gap={24}>
    <ChoiceGroup label="Tab treatment" name="tab-treatment" columns={2} size="compact" value={treatment} onChange={setTreatment}
      options={TAB_TREATMENTS.map(item => ({ value: item.id, label: item.label }))} />
    <Paragraph size="sm" color="muted">{TAB_TREATMENTS.find(item => item.id === treatment).description}</Paragraph>
    <Toolbar label="Tab size"><ToolbarGroup aria-label="Tab size" value={size} onChange={setSize} showLabels
      options={[{ value: 'compact', label: 'Compact' }, { value: 'default', label: 'Default' }]} /></Toolbar>
    <Switch label="Show icons" checked={icons} onChange={setIcons} />
    <Switch label="Show counts" checked={counts} onChange={setCounts} />
    <Paragraph size="sm" color="muted">Use arrow keys, Home and End to switch views. Tab moves into the selected panel. Narrow tab strips scroll horizontally.</Paragraph>
  </Stack></Inset>
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <Section padding="none" contentWidth="lg">
      <StyledTabs treatment={treatment} value={value} onChange={setValue} icons={icons} counts={counts} size={size === 'default' ? undefined : size}
        items={views.map(view => ({ ...view, content: <Inset space={24}><Stack gap={24}>
          <Stack gap={8}><Heading as="h2" size="md">{view.title}</Heading><Paragraph color="muted">{view.text}</Paragraph></Stack>
          <DefinitionList items={[{ label: view.detail, value: view.value }]} />
        </Stack></Inset> }))} />
    </Section>
  </ExperimentLayout>
}
