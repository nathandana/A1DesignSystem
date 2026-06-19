import { useState } from 'react'
import {
  Code,
  Heading,
  Paragraph,
  Stack,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarMenu,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'

const EXAMPLE_OPTIONS = ['text-editor', 'alignment', 'crop', 'overlay']

const ALIGN_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'left', label: 'Left', icon: 'format_align_left' },
  { value: 'center', label: 'Center', icon: 'format_align_center' },
  { value: 'right', label: 'Right', icon: 'format_align_right' },
  { value: 'justify', label: 'Justify', icon: 'format_align_justify' },
]

const CROP_OPTIONS = [
  { value: 'top-left', label: 'Top left', icon: 'north_west' },
  { value: 'top', label: 'Top', icon: 'north' },
  { value: 'top-right', label: 'Top right', icon: 'north_east' },
  { value: 'left', label: 'Left', icon: 'west' },
  { value: 'center', label: 'Center', icon: 'center_focus_strong' },
  { value: 'right', label: 'Right', icon: 'east' },
  { value: 'bottom-left', label: 'Bottom left', icon: 'south_west' },
  { value: 'bottom', label: 'Bottom', icon: 'south' },
  { value: 'bottom-right', label: 'Bottom right', icon: 'south_east' },
]

const LIST_OPTIONS = [
  { value: 'none', label: 'None', icon: 'format_clear' },
  { value: 'bulleted', label: 'Bulleted list', icon: 'format_list_bulleted' },
  { value: 'numbered', label: 'Numbered list', icon: 'format_list_numbered' },
  { value: 'checklist', label: 'Checklist', icon: 'checklist' },
]

const SIZE_OPTIONS = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
]

const EXAMPLE_LABELS = {
  'text-editor': 'Text editor',
  alignment: 'Alignment',
  crop: 'Crop grid',
  overlay: 'Overlay',
}

export function getDefaultConfig() {
  return { example: 'text-editor', showLabels: false, showLabel: false, fullWidth: false, disabled: false }
}

function TextEditorToolbar({ showLabels, disabled, showLabel, overlay, fullWidth }) {
  const [marks, setMarks] = useState({ bold: true, italic: false, underline: false })
  const [size, setSize] = useState('md')
  const [align, setAlign] = useState('left')
  const [list, setList] = useState('bulleted')
  const setMark = (k) => (v) => setMarks((m) => ({ ...m, [k]: v }))
  return (
    <Toolbar
      aria-label="Text formatting"
      label={showLabel ? 'Formatting' : undefined}
      overlay={overlay}
      fullWidth={fullWidth}
    >
      <ToolbarToggle icon="format_bold" label="Bold" showLabel={showLabels} pressed={marks.bold} onChange={setMark('bold')} disabled={disabled} />
      <ToolbarToggle icon="format_italic" label="Italic" showLabel={showLabels} pressed={marks.italic} onChange={setMark('italic')} disabled={disabled} />
      <ToolbarToggle icon="format_underlined" label="Underline" showLabel={showLabels} pressed={marks.underline} onChange={setMark('underline')} disabled={disabled} />
      <ToolbarDivider />
      <ToolbarMenu icon="format_size" aria-label="Text size" label="Size" value={size} onChange={setSize} items={SIZE_OPTIONS} showLabel={showLabels} disabled={disabled} />
      <ToolbarDivider />
      <ToolbarGroup aria-label="Alignment" value={align} onChange={setAlign} options={ALIGN_OPTIONS} showLabels={showLabels} disabled={disabled} />
      <ToolbarDivider />
      <ToolbarMenu aria-label="List type" label="List" value={list} onChange={setList} items={LIST_OPTIONS} showLabel={showLabels} disabled={disabled} />
      <ToolbarButton icon="link" label="Insert link" showLabel={showLabels} disabled={disabled} />
    </Toolbar>
  )
}

export function Preview({ config }) {
  const [align, setAlign] = useState('left')
  const [crop, setCrop] = useState('center')
  const { example, showLabels, showLabel, fullWidth, disabled } = config

  if (example === 'alignment') {
    return (
      <Toolbar aria-label="Alignment" label={showLabel ? 'Alignment' : undefined} fullWidth={fullWidth}>
        <ToolbarGroup aria-label="Alignment" value={align} onChange={setAlign} options={ALIGN_OPTIONS} showLabels={showLabels} disabled={disabled} />
      </Toolbar>
    )
  }
  if (example === 'crop') {
    return (
      <Toolbar aria-label="Crop" label={showLabel ? 'Crop focal point' : undefined}>
        <ToolbarGroup aria-label="Crop focal point" value={crop} onChange={setCrop} columns={3} options={CROP_OPTIONS} disabled={disabled} />
      </Toolbar>
    )
  }
  if (example === 'overlay') {
    // A floating selection toolbar hovering over a block of content.
    return (
      <div className="a1-web-toolbar-overlay-demo">
        <Stack gap="sm">
          <Heading as="h3" size="sm">Tasting menu</Heading>
          <Paragraph>
            Select any text in this paragraph and a floating toolbar appears above the
            selection. The overlay sits on its own elevated surface so it reads clearly
            against the page content beneath it.
          </Paragraph>
        </Stack>
        <div className="a1-web-toolbar-overlay-demo__bar">
          <TextEditorToolbar showLabels={showLabels} disabled={disabled} showLabel={false} overlay />
        </div>
      </div>
    )
  }
  return <TextEditorToolbar showLabels={showLabels} disabled={disabled} showLabel={showLabel} fullWidth={fullWidth} overlay={false} />
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  return (
    <Stack gap="lg">
      <Choice prop="example"
        label="Example"
        size="compact"
        hideIndicator
        columns={2}
        value={config.example}
        onChange={(example) => set({ example })}
        options={EXAMPLE_OPTIONS.map((opt) => ({ label: EXAMPLE_LABELS[opt], value: opt }))}
      />
      <Toggle prop="showLabels" label="Show labels" value={config.showLabels} onChange={(showLabels) => set({ showLabels })} />
      <Toggle prop="showLabel"
        label="Toolbar label"
        value={config.showLabel}
        onChange={(showLabel) => set({ showLabel })}
        disabled={config.example === 'overlay'}
      />
      <Toggle prop="fullWidth"
        label="Full width"
        value={config.fullWidth}
        onChange={(fullWidth) => set({ fullWidth })}
        disabled={config.example === 'overlay' || config.example === 'crop'}
      />
      <Toggle prop="disabled" label="Disabled" value={config.disabled} onChange={(disabled) => set({ disabled })} />
    </Stack>
  )
}

const SNIPPETS = {
  'text-editor': ({ showLabels, label, fullWidth }) => `<Toolbar aria-label="Text formatting"${label ? ' label="Formatting"' : ''}${fullWidth ? ' fullWidth' : ''}>
  <ToolbarToggle icon="format_bold" label="Bold"${showLabels ? ' showLabel' : ''} pressed={bold} onChange={setBold} />
  <ToolbarToggle icon="format_italic" label="Italic"${showLabels ? ' showLabel' : ''} pressed={italic} onChange={setItalic} />
  <ToolbarDivider />
  <ToolbarMenu
    icon="format_size"
    aria-label="Text size"
    label="Size"
    value={size}
    onChange={setSize}
    items={[
      { value: 'xs', label: 'XS' },
      { value: 'sm', label: 'SM' },
      { value: 'md', label: 'MD' },
      { value: 'lg', label: 'LG' },
      { value: 'xl', label: 'XL' },
    ]}
  />
  <ToolbarDivider />
  <ToolbarGroup aria-label="Alignment" value={align} onChange={setAlign}${showLabels ? ' showLabels' : ''} options={alignOptions} />
  <ToolbarDivider />
  <ToolbarMenu
    aria-label="List type"
    label="List"
    value={list}
    onChange={setList}
    items={[
      { value: 'none', label: 'None', icon: 'format_clear' },
      { value: 'bulleted', label: 'Bulleted list', icon: 'format_list_bulleted' },
      { value: 'numbered', label: 'Numbered list', icon: 'format_list_numbered' },
      { value: 'checklist', label: 'Checklist', icon: 'checklist' },
    ]}
  />
  <ToolbarButton icon="link" label="Insert link" />
</Toolbar>`,
  alignment: ({ showLabels, label, fullWidth }) => `<Toolbar aria-label="Alignment"${label ? ' label="Alignment"' : ''}${fullWidth ? ' fullWidth' : ''}>
  <ToolbarGroup
    aria-label="Alignment"
    value={align}
    onChange={setAlign}${showLabels ? '\n    showLabels' : ''}
    options={[
      { value: 'none', label: 'None' },
      { value: 'left', label: 'Left', icon: 'format_align_left' },
      { value: 'center', label: 'Center', icon: 'format_align_center' },
      { value: 'right', label: 'Right', icon: 'format_align_right' },
      { value: 'justify', label: 'Justify', icon: 'format_align_justify' },
    ]}
  />
</Toolbar>`,
  crop: ({ label }) => `<Toolbar aria-label="Crop"${label ? ' label="Crop focal point"' : ''}>
  <ToolbarGroup
    aria-label="Crop focal point"
    value={crop}
    onChange={setCrop}
    columns={3}
    options={cropOptions /* 9 directional icons */}
  />
</Toolbar>`,
  overlay: () => `{/* Position the wrapper where you want the bar to float */}
<div style={{ position: 'absolute', insetBlockStart: top, insetInlineStart: left }}>
  <Toolbar aria-label="Text formatting" overlay>
    <ToolbarToggle icon="format_bold" label="Bold" pressed={bold} onChange={setBold} />
    <ToolbarToggle icon="format_italic" label="Italic" pressed={italic} onChange={setItalic} />
    <ToolbarDivider />
    <ToolbarMenu aria-label="List type" label="List" value={list} onChange={setList} items={listOptions} />
    <ToolbarButton icon="link" label="Insert link" />
  </Toolbar>
</div>`,
}

export function Snippet({ config }) {
  const build = SNIPPETS[config.example] ?? SNIPPETS['text-editor']
  return (
    <Code variant="block" wrapping copyCode>
      {build({
        showLabels: config.showLabels,
        label: config.showLabel && config.example !== 'overlay',
        fullWidth: config.fullWidth && config.example !== 'overlay' && config.example !== 'crop',
      })}
    </Code>
  )
}
