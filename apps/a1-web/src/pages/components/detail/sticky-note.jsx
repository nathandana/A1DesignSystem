import {
  Card,
  Code,
  Heading,
  Paragraph,
  Stack,
  StickyNote,
  TextField,
  TextareaField,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider, WithHelp } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'

const COLOR_OPTIONS = [
  { value: 'yellow', label: 'Yellow', swatch: 'var(--component-sticky-note-color-yellow)' },
  { value: 'orange', label: 'Orange', swatch: 'var(--component-sticky-note-color-orange)' },
  { value: 'green', label: 'Green', swatch: 'var(--component-sticky-note-color-green)' },
  { value: 'blue', label: 'Blue', swatch: 'var(--component-sticky-note-color-blue)' },
  { value: 'pink', label: 'Pink', swatch: 'var(--component-sticky-note-color-pink)' },
  { value: 'purple', label: 'Purple', swatch: 'var(--component-sticky-note-color-purple)' },
  { value: 'grey', label: 'Grey', swatch: 'var(--component-sticky-note-color-grey)' },
]
const SIZE_OPTIONS = ['auto', 'xs', 'sm', 'md', 'lg', 'xl']
const PLACEMENT_OPTIONS = [
  { value: 'inline', label: 'Inline', icon: 'view_agenda' },
  { value: 'floating', label: 'Floating', icon: 'layers' },
]
const ANCHOR_OPTIONS = [
  { value: 'top-start', label: 'Top start', icon: 'north_west' },
  { value: 'top-end', label: 'Top end', icon: 'north_east' },
  { value: 'bottom-start', label: 'Bottom start', icon: 'south_west' },
  { value: 'bottom-end', label: 'Bottom end', icon: 'south_east' },
]

function escapeAttr(value) {
  return String(value).replaceAll('"', '&quot;')
}

// JSX text collapses line breaks and can't hold { or <, so multi-line or
// special-character Markdown is emitted as a string expression.
function contentChild(value) {
  const text = String(value ?? '')
  return /[\n{}<>]/.test(text) ? `{${JSON.stringify(text)}}` : text
}

function buildSnippet(config, utilityClass = '') {
  const floating = config.placement === 'floating'
  const props = [
    utilityClass ? `className="${escapeAttr(utilityClass)}"` : null,
    config.title ? `title="${escapeAttr(config.title)}"` : null,
    config.author ? `author="${escapeAttr(config.author)}"` : null,
    config.color !== 'yellow' ? `color="${config.color}"` : null,
    config.width !== 'md' ? `width="${config.width}"` : null,
    config.height !== 'auto' ? `height="${config.height}"` : null,
    config.resizable ? 'resizable' : null,
    floating ? 'placement="floating"' : null,
    floating && config.anchor !== 'top-end' ? `anchor="${config.anchor}"` : null,
    floating && config.movable ? 'movable' : null,
    config.editing ? 'editing onTitleChange={setTitle} onContentChange={setContent} onEditingChange={setEditing}' : null,
  ].filter(Boolean)
  const open = `<StickyNote${props.length ? ` ${props.join(' ')}` : ''}>`
  const note = `${open}\n  ${contentChild(config.content)}\n</StickyNote>`
  if (!floating) return note
  return `{/* Floating notes position in their nearest positioned ancestor. */}\n<div style={{ position: "relative" }}>\n  {/* …content… */}\n  ${note.replaceAll('\n', '\n  ')}\n</div>`
}

export function getDefaultConfig() {
  return {
    title: 'Check the hero copy',
    author: 'Priya',
    content: 'The headline still says “Spring sale”. Swap it for the **autumn campaign** before *Friday’s* review.',
    color: 'yellow',
    width: 'md',
    height: 'auto',
    resizable: false,
    placement: 'inline',
    anchor: 'top-end',
    movable: false,
    editing: false,
  }
}

export function Preview({ config, setConfig, utilityClass = '' }) {
  const set = (patch) => setConfig?.((current) => ({ ...current, ...patch }))
  const note = (
    <StickyNote
      className={utilityClass || undefined}
      title={config.title || undefined}
      author={config.author || undefined}
      color={config.color}
      width={config.width}
      height={config.height}
      resizable={config.resizable}
      placement={config.placement}
      anchor={config.anchor}
      movable={config.movable}
      editing={config.editing}
      onTitleChange={(title) => set({ title })}
      onContentChange={(content) => set({ content })}
      onEditingChange={(editing) => set({ editing })}
    >
      {config.content}
    </StickyNote>
  )
  if (config.placement !== 'floating') return note
  // Floating notes need a positioned parent; the stage supplies one so the
  // preview shows the note layered over sample content.
  return (
    <div className="a1-web-sticky-note-stage">
      <Card>
        <Stack gap="sm">
          <Heading as="h2" size="md">Pricing</Heading>
          <Paragraph>
            Choose the plan that fits your team. Every plan includes unlimited projects,
            version history and the A1 component library.
          </Paragraph>
          <Paragraph>
            Annual billing saves two months compared with paying monthly. You can change
            plans at any time from your workspace settings.
          </Paragraph>
          <Paragraph>Need something custom? Talk to our team about enterprise options.</Paragraph>
        </Stack>
      </Card>
      {note}
    </div>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <WithHelp helper="Shown as a small heading and used as the note's accessible name. Leave empty for an untitled note.">
        <TextField
          label="Title"
          size="compact"
          value={config.title}
          onChange={(event) => set({ title: event.target.value })}
        />
      </WithHelp>
      <WithHelp helper="Shown as a badge in the note header. Leave empty to hide it.">
        <TextField
          label="Author"
          size="compact"
          value={config.author}
          onChange={(event) => set({ author: event.target.value })}
        />
      </WithHelp>
      <WithHelp helper="The note's content. Supports basic Markdown: **bold**, *italic*, ~~strikethrough~~, `code`, [links](https://…), “- ” bulleted and “1. ” numbered lists, and blank lines between paragraphs.">
        <TextareaField
          label="Content"
          size="compact"
          rows={4}
          value={config.content}
          onChange={(event) => set({ content: event.target.value })}
        />
      </WithHelp>
      <Choice
        prop="color"
        label="Color"
        labelMode="selected"
        value={config.color}
        onChange={(color) => set({ color })}
        options={COLOR_OPTIONS}
        helper="Paper colour from the theme's colour ramps. Text meets WCAG AA on every colour, and the paper stays light in dark mode."
      />
      <ConfigSlider
        prop="width"
        label="Width"
        values={SIZE_OPTIONS}
        value={config.width}
        onChange={(width) => set({ width })}
        helper="A T-shirt size, or Auto to fill the container."
      />
      <ConfigSlider
        prop="height"
        label="Height"
        values={SIZE_OPTIONS}
        value={config.height}
        onChange={(height) => set({ height })}
        helper="Auto fits the content. A fixed size scrolls longer content inside the note."
      />
      <Toggle
        prop="resizable"
        label="Resizable"
        value={config.resizable}
        onChange={(resizable) => set({ resizable })}
        helper="Lets people drag the bottom corner to change the height, like a textarea."
      />
      <Toggle
        prop="editing"
        label="Editing"
        value={config.editing}
        onChange={(editing) => set({ editing })}
        helper="Edits the title and content in place (the content as Markdown). Leaving the note or pressing Escape ends editing through onEditingChange."
      />
      <Choice
        prop="placement"
        label="Placement"
        value={config.placement}
        onChange={(placement) => set({ placement })}
        options={PLACEMENT_OPTIONS}
        helper="Inline sits in the page flow. Floating layers the note over content at a corner of its nearest positioned parent, below sticky headers and menus."
      />
      {config.placement === 'floating' && (
        <Choice
          prop="anchor"
          label="Anchor"
          iconOnly
          columns={4}
          value={config.anchor}
          onChange={(anchor) => set({ anchor })}
          options={ANCHOR_OPTIONS}
          helper="The corner a floating note is pinned to."
        />
      )}
      {config.placement === 'floating' && (
        <Toggle
          prop="movable"
          label="Movable"
          value={config.movable}
          onChange={(movable) => set({ movable })}
          helper="Adds a move handle so people can drag the note, or nudge it with the arrow keys. It stays inside its positioned parent."
        />
      )}
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
