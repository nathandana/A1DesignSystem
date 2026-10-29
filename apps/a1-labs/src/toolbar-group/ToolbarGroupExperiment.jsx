import React, { useState } from 'react'
import { ChoiceGroup, Heading, Inset, Paragraph, Section, Stack, Switch, ToolbarGroup, ToolbarToggle } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { HOVER_TREATMENTS, HoverToolbar } from './HoverToolbar.jsx'
import { HoverCheckboxGroup } from './HoverCheckboxGroup.jsx'

const formats = [
  { value: 'bold', label: 'Bold', icon: 'format_bold' },
  { value: 'italic', label: 'Italic', icon: 'format_italic' },
  { value: 'underline', label: 'Underline', icon: 'format_underlined' },
]
const alignments = [
  { value: 'left', label: 'Left', icon: 'format_align_left' },
  { value: 'center', label: 'Center', icon: 'format_align_center' },
  { value: 'right', label: 'Right', icon: 'format_align_right' },
]
const notificationOptions = [
  { value: 'email', label: 'Email notifications' },
  { value: 'push', label: 'Push notifications' },
  { value: 'activity', label: 'Activity summaries' },
  { value: 'product', label: 'Product updates' },
  { value: 'security', label: 'Security alerts' },
]

export function ToolbarGroupExperiment({ experiment, onOpenSettings }) {
  const [treatment, setTreatment] = useState('current')
  const [pressed, setPressed] = useState({ bold: true, italic: false, underline: false })
  const [alignment, setAlignment] = useState('left')
  const [notifications, setNotifications] = useState(['email', 'activity'])
  const [showLabels, setShowLabels] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const configuration = <Inset space={16}><Stack gap={24}>
    <ChoiceGroup label="Hover treatment" name="toolbar-hover-treatment" columns={1} size="compact"
      value={treatment} onChange={setTreatment}
      options={HOVER_TREATMENTS.map(item => ({ value: item.id, label: item.label }))} />
    <Paragraph size="sm" color="muted">{HOVER_TREATMENTS.find(item => item.id === treatment).description}</Paragraph>
    <Switch label="Show toolbar labels" checked={showLabels} onChange={setShowLabels} />
    <Switch label="Disabled" checked={disabled} onChange={setDisabled} />
  </Stack></Inset>

  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <Section padding={{ xs: 'sm', md: 'lg' }} contentWidth="md">
      <Stack gap={32} className="a1-toolbar-hover-demo">
        <Stack gap={16}>
          <Heading as="h2" size="md">Toolbar toggles</Heading>
          <HoverToolbar treatment={treatment} aria-label="Text formatting">
            {formats.map(item => <ToolbarToggle key={item.value} icon={item.icon} label={item.label}
              showLabel={showLabels} disabled={disabled} pressed={pressed[item.value]}
              onChange={value => setPressed(previous => ({ ...previous, [item.value]: value }))} />)}
          </HoverToolbar>
          <Paragraph size="sm" color="muted">Toggle each format on or off. Hover both selected and unselected items.</Paragraph>
        </Stack>
        <Stack gap={16}>
          <Heading as="h2" size="md">Checkbox group</Heading>
          <HoverCheckboxGroup treatment={treatment} label="Notification preferences" name="hover-notifications"
            value={notifications} onChange={setNotifications} disabled={disabled}
            options={notificationOptions} />
          <Paragraph size="sm" color="muted">Hover the checkbox or its label. The checkmark stays visible while the row changes.</Paragraph>
        </Stack>
        <Stack gap={16}>
          <Heading as="h2" size="md">Single-selection group</Heading>
          <HoverToolbar treatment={treatment} aria-label="Paragraph alignment">
            <ToolbarGroup aria-label="Alignment" value={alignment} onChange={setAlignment}
              options={alignments} showLabels={showLabels} disabled={disabled} />
          </HoverToolbar>
          <Paragraph size="sm" color="muted">One alignment stays selected. Use arrow keys, Home or End to change it.</Paragraph>
        </Stack>
      </Stack>
    </Section>
  </ExperimentLayout>
}
