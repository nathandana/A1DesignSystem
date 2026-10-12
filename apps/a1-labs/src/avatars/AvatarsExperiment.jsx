import React, { useState } from 'react'
import { Heading, Inset, Paragraph, Section, SelectField, Slider, Stack, Switch, TextField, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { LabAvatar, LabAvatarGroup } from './LabAvatar.jsx'
import { AVATAR_SIZES, STATUS_LABELS } from './avatar-model.js'

// Labs page: configure one avatar treatment and see it as a profile, across
// every size, in a team list and in an overlapping group.

const PORTRAIT = '/avatars/portrait.jpg'
const CUTOUT = '/avatars/portrait-cutout.png'
const DEFAULT_NAME = 'Nathan Dana'

const TEAM = [
  { name: 'Alex Morgan', role: 'Design lead', status: 'online' },
  { name: 'Sam Rivera', role: 'Engineer', status: 'away' },
  { name: 'Jordan Chen', role: 'Researcher', status: 'busy' },
  { name: 'Taylor Brooks', role: 'Product manager', status: 'offline' },
  { name: 'Casey Patel', role: 'Engineer', status: 'online' },
  { name: 'Riley James', role: 'Content designer', status: 'online' },
  { name: 'Avery Kim', role: 'Engineer', status: 'away' },
]

const CONTENT = [
  { value: 'initials', label: 'Initials', icon: 'text_fields' },
  { value: 'image', label: 'Image', icon: 'image' },
  { value: 'icon', label: 'Icon', icon: 'person' },
  { value: 'pattern', label: 'Pattern', icon: 'grid_view' },
]
const SIZE_DETENTS = ['XS', 'SM', 'MD', 'LG', 'XL'].map((label, index) => ({ value: index, label }))
const RADIUS = [
  { value: 'none', label: 'None' }, { value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' }, { value: 'full', label: 'Full' },
]
const COLORS = [{ value: 'neutral', label: 'Neutral' }, { value: 'tinted', label: 'Tinted' }, { value: 'accent', label: 'Accent' }]
const BORDERS = [{ value: 'none', label: 'None' }, { value: 'hairline', label: 'Hairline' }, { value: 'ring', label: 'Ring' }, { value: 'gradient', label: 'Gradient' }]
const SIZE_NAMES = { xs: 'Extra small', sm: 'Small', md: 'Medium', lg: 'Large', xl: 'Extra large' }

export function AvatarsExperiment({ experiment, onOpenSettings }) {
  const [name, setName] = useState(DEFAULT_NAME)
  const [content, setContent] = useState('image')
  const [sizeIndex, setSizeIndex] = useState(AVATAR_SIZES.indexOf('xl'))
  const [radius, setRadius] = useState('full')
  const [color, setColor] = useState('tinted')
  const [border, setBorder] = useState('hairline')
  const [status, setStatus] = useState('online')
  const [initialsCount, setInitialsCount] = useState('2')
  const [popOut, setPopOut] = useState(false)
  const size = AVATAR_SIZES[sizeIndex]
  const person = name.trim() || DEFAULT_NAME
  // Only the profile person has a portrait; teammates show what an image
  // avatar falls back to when no photo exists.
  const shared = { content, radius, color, border, initialsCount: Number(initialsCount) }
  const radiusIndex = RADIUS.findIndex(item => item.value === radius)

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <TextField label="Name" size="compact" value={name} onChange={event => setName(event.target.value)}
          hint="Drives initials, tint and pattern." autoComplete="off" />
        <Toolbar label="Content">
          <ToolbarGroup aria-label="Content" value={content} onChange={setContent} labelMode="selected" options={CONTENT} />
        </Toolbar>
        <Slider label="Size" size="compact" variant="subtle" value={sizeIndex} onChange={setSizeIndex}
          detents={SIZE_DETENTS} formatValue={index => SIZE_NAMES[AVATAR_SIZES[index]]} />
        <Slider label="Radius" size="compact" variant="subtle" value={radiusIndex}
          onChange={index => setRadius(RADIUS[index].value)}
          detents={RADIUS.map((item, index) => ({ value: index, label: item.label }))}
          formatValue={index => (RADIUS[index].value === 'full' ? 'Full, a circle' : RADIUS[index].value === 'none' ? 'None, square' : RADIUS[index].label)} />
        <Toolbar label="Color">
          <ToolbarGroup aria-label="Color" value={color} onChange={setColor} showLabels options={COLORS} />
        </Toolbar>
        <Toolbar label="Border">
          <ToolbarGroup aria-label="Border" value={border} onChange={setBorder} showLabels options={BORDERS} />
        </Toolbar>
        <SelectField label="Status" size="compact" value={status} onChange={event => setStatus(event.target.value)}>
          <option value="">None</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </SelectField>
        <Toolbar label="Initials">
          <ToolbarGroup aria-label="Initials" value={initialsCount} onChange={setInitialsCount} showLabels
            options={[{ value: '1', label: '1 letter' }, { value: '2', label: '2 letters' }]} />
        </Toolbar>
        <Stack gap={8}>
          <Heading as="h2" size="xs">Experimental</Heading>
          <Switch label="Break the frame" checked={popOut} onChange={setPopOut} disabled={content !== 'image'}
            hint={content === 'image' ? 'A cut-out portrait rises above the top edge.' : 'Needs Image content.'} />
        </Stack>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none" contentWidth="md">
        <Stack gap={40} className="a1-avatars-lab">
          <Stack direction="row" align="center" gap={24} wrap>
            <LabAvatar {...shared} name={person} src={PORTRAIT} cutoutSrc={CUTOUT} size={size} status={status || undefined} popOut={popOut} />
            <Stack gap={4}>
              <Heading as="h2" size="md">{person}</Heading>
              <Paragraph color="muted">Design systems lead{status ? ` · ${STATUS_LABELS[status]}` : ''}</Paragraph>
            </Stack>
          </Stack>

          <Stack gap={16}>
            <Heading as="h2" size="xs">Sizes</Heading>
            <Stack direction="row" align="end" gap={24} wrap role="list" aria-label="Avatar sizes">
              {AVATAR_SIZES.map(item => (
                <Stack key={item} gap={8} align="center" role="listitem">
                  <LabAvatar {...shared} name={person} src={PORTRAIT} cutoutSrc={CUTOUT} size={item} status={status || undefined} popOut={popOut} />
                  <Paragraph size="xs" color="muted">{SIZE_NAMES[item]}</Paragraph>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Stack gap={16}>
            <Heading as="h2" size="xs">Team</Heading>
            <Stack gap={16} role="list" aria-label="Team members">
              {TEAM.slice(0, 4).map(member => (
                <Stack key={member.name} direction="row" align="center" gap={12} role="listitem">
                  <LabAvatar {...shared} name={member.name} size="md" status={status ? member.status : undefined} />
                  <Stack gap={0}>
                    <Paragraph size="sm">{member.name}</Paragraph>
                    <Paragraph size="xs" color="muted">{member.role}{status ? ` · ${STATUS_LABELS[member.status]}` : ''}</Paragraph>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Stack gap={16}>
            <Heading as="h2" size="xs">Group</Heading>
            <Stack direction="row" align="center" gap={16} wrap>
              <LabAvatarGroup {...shared} size="md" max={4} label={`Project team, ${TEAM.length + 1} people`}
                people={[{ name: person, src: PORTRAIT }, ...TEAM]} />
              <Paragraph size="sm" color="muted">{TEAM.length + 1} people on this project</Paragraph>
            </Stack>
          </Stack>
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
