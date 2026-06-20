import { useEffect, useRef, useState } from 'react'
import {
  Accordion,
  Code,
  Heading,
  Paragraph,
  Slider,
  Stack,
  TextareaField,
  TextField,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { ConfigHelp, Lockable, ResponsiveControl, responsiveProp } from './configKit.jsx'

const HEADING_ELEMENT_OPTIONS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']
const HEADING_TYPE_OPTIONS = ['heading', 'display']
const HEADING_SIZE_OPTIONS = {
  heading: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  display: ['sm', 'md', 'lg', 'xl', 'xxl', 'jumbo', 'xJumbo'],
}

function optionLabel(value) {
  if (!value) return 'None'
  // align/size can be a responsive object ({ xs, md, … }).
  if (typeof value === 'object') return 'Responsive'
  if (typeof value !== 'string') return String(value)
  return value === 'xJumbo'
    ? 'X jumbo'
    : value.charAt(0).toUpperCase() + value.slice(1)
}

// Join the applied (truthy) parts into a collapsed-accordion summary.
const summarize = (parts) => parts.filter(Boolean).join(' · ')

// Margin scale as a Slider (index space ↔ value; '' = no margin).
const MARGIN_VALUES = ['', 'sm', 'md', 'lg']
const MARGIN_DETENTS = MARGIN_VALUES.map((value, index) => ({ value: index, label: value ? optionLabel(value) : '--' }))

// A compact, subtle Slider over a string-value scale (matches the Section configurator).
function DetentSlider({ label, values, detents, value, onChange, prop }) {
  return (
    <Lockable prop={prop}>
      <Slider
        size="compact"
        variant="subtle"
        label={label}
        detents={detents}
        value={Math.max(0, values.indexOf(value))}
        onChange={(index) => onChange(values[index])}
      />
    </Lockable>
  )
}

function escapeJsxText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

// ── Heading-mark (HeadingMark) helpers ─────────────────────────────────────────

const UNDERLINE_STYLES = ['swoop', 'wave', 'sketch']

// The class list HeadingMark renders for the given props — applied directly when
// wrapping a selection so the inline edit matches the real component output.
function markClass(variant, underlineStyle = 'swoop') {
  if (variant === 'underline') {
    const style = UNDERLINE_STYLES.includes(underlineStyle) ? underlineStyle : 'swoop'
    return `a1-heading-mark a1-heading-mark--underline a1-heading-mark--underline-${style}`
  }
  return 'a1-heading-mark a1-heading-mark--highlight'
}

function parseHeadingHtml(html) {
  return new DOMParser().parseFromString(`<div>${html ?? ''}</div>`, 'text/html').body.firstChild
}

// Read the HeadingMark props off the first mark in the heading (drives the
// configurator's choice groups).
function getMarkState(html) {
  if (typeof window === 'undefined') return { variant: null, underlineStyle: 'swoop' }
  const mark = parseHeadingHtml(html).querySelector('.a1-heading-mark')
  if (!mark) return { variant: null, underlineStyle: 'swoop' }
  const underline = mark.classList.contains('a1-heading-mark--underline')
  const underlineStyle = underline
    ? (UNDERLINE_STYLES.find((s) => mark.classList.contains(`a1-heading-mark--underline-${s}`)) ?? 'swoop')
    : 'swoop'
  return { variant: underline ? 'underline' : 'highlight', underlineStyle }
}

// Apply a mark variant to the heading. "none" removes all marks; an existing
// mark is re-styled in place; if there is no mark yet, the trailing word is
// wrapped so the mark lands at the end of the heading.
function setHeadingMark(html, variant, underlineStyle = 'swoop') {
  if (typeof window === 'undefined') return html
  const root = parseHeadingHtml(html)
  const existing = [...root.querySelectorAll('.a1-heading-mark')]

  if (variant === 'none' || variant === null) {
    existing.forEach((span) => {
      while (span.firstChild) span.parentNode.insertBefore(span.firstChild, span)
      span.remove()
    })
    return root.innerHTML
  }

  if (existing.length > 0) {
    existing.forEach((span) => { span.className = markClass(variant, underlineStyle) })
    return root.innerHTML
  }

  // No mark yet — wrap the trailing word at the end of the heading.
  const text = root.textContent
  const match = text.match(/^([\s\S]*?)(\S+)(\s*)$/)
  if (!match) {
    return `<span class="${markClass(variant, underlineStyle)}">${escapeHtml(text)}</span>`
  }
  return escapeHtml(match[1]) + `<span class="${markClass(variant, underlineStyle)}">${escapeHtml(match[2])}</span>` + escapeHtml(match[3])
}

function setUnderlineStyle(html, style) {
  if (typeof window === 'undefined') return html
  const root = parseHeadingHtml(html)
  root.querySelectorAll('.a1-heading-mark--underline').forEach((span) => {
    span.className = markClass('underline', style)
  })
  return root.innerHTML
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

// Markdown-ish shorthand for the Text field: ==text== → highlight mark,
// __text__ → underline mark. Other content is escaped as plain text.
function markdownToHtml(md) {
  return escapeHtml(md ?? '')
    .replace(/==(.+?)==/g, `<span class="${markClass('highlight')}">$1</span>`)
    .replace(/__(.+?)__/g, `<span class="${markClass('underline')}">$1</span>`)
}

// Inverse: turn the editable HTML back into the markdown shorthand so the Text
// field stays in sync with marks added directly in the preview.
function htmlToMarkdown(html) {
  if (typeof window === 'undefined') return html ?? ''
  const root = new DOMParser().parseFromString(`<div>${html ?? ''}</div>`, 'text/html').body.firstChild
  let out = ''
  root.childNodes.forEach((node) => {
    if (node.nodeType === 1 && node.classList.contains('a1-heading-mark')) {
      const underline = node.classList.contains('a1-heading-mark--underline')
      out += underline ? `__${node.textContent}__` : `==${node.textContent}==`
    } else {
      out += node.textContent
    }
  })
  return out
}

// Convert the editable HTML (text + heading-mark spans) into JSX for the snippet.
function htmlToJsx(html) {
  if (typeof window === 'undefined') return escapeJsxText(html ?? '')
  const root = new DOMParser().parseFromString(`<div>${html ?? ''}</div>`, 'text/html').body.firstChild
  let out = ''
  root.childNodes.forEach((node) => {
    if (node.nodeType === 1 && node.classList.contains('a1-heading-mark')) {
      const underline = node.classList.contains('a1-heading-mark--underline')
      out += `<HeadingMark${underline ? ' variant="underline"' : ''}>${escapeJsxText(node.textContent)}</HeadingMark>`
    } else {
      out += escapeJsxText(node.textContent)
    }
  })
  return out
}

function buildHeadingSnippet(config) {
  const textWrap = config.textWrap ? 'balance' : undefined
  const props = [
    config.as !== 'h2' ? `as="${config.as}"` : null,
    config.type !== 'heading' ? `type="${config.type}"` : null,
    config.size && typeof config.size === 'object' ? responsiveProp('size', config.size) : (config.size ? `size="${config.size}"` : null),
    config.color !== 'default' ? `color="${config.color}"` : null,
    config.align !== 'left' ? `align="${config.align}"` : null,
    config.margin ? `margin="${config.margin}"` : null,
    textWrap ? `textWrap="${textWrap}"` : null,
  ].filter(Boolean).join(' ')

  const propsStr = props ? ` ${props}` : ''
  return `<Heading${propsStr}>\n  ${htmlToJsx(config.children || 'Heading')}\n</Heading>`
}

export function getDefaultConfig(component) {
  return {
    as: 'h2',
    type: 'heading',
    size: 'md',
    color: 'default',
    align: 'left',
    margin: '',
    textWrap: false,
    children: component.title,
  }
}

// ── Editable preview ───────────────────────────────────────────────────────────

function EditableHeading({ component, config, setConfig }) {
  const wrapperRef = useRef(null)
  const [toolbar, setToolbar] = useState(null) // { left, top } | null
  const textWrap = config.textWrap ? 'balance' : undefined
  const getEl = () => wrapperRef.current?.querySelector('.a1-heading')

  // Push config content into the DOM, but never while editing here (that would
  // reset the caret). Re-runs when `as`/`type`/`size` change since those remount
  // the element.
  useEffect(() => {
    const el = getEl()
    if (!el) return
    const html = config.children || component.title
    if (document.activeElement !== el && el.innerHTML !== html) {
      el.innerHTML = html
    }
  }, [config.children, component.title, config.as, config.type, config.size])

  function commit() {
    const el = getEl()
    if (el) setConfig((current) => ({ ...current, children: el.innerHTML }))
  }

  function refreshToolbar() {
    const el = getEl()
    const sel = window.getSelection()
    if (!el || !sel || sel.isCollapsed || sel.rangeCount === 0 || !el.contains(sel.anchorNode)) {
      setToolbar(null)
      return
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect()
    const host = wrapperRef.current.getBoundingClientRect()
    setToolbar({ left: rect.left - host.left + rect.width / 2, top: rect.top - host.top })
  }

  // The heading-mark span wholly containing the current selection, if any.
  function selectionMark() {
    const el = getEl()
    const sel = window.getSelection()
    if (!el || !sel || sel.rangeCount === 0) return null
    let node = sel.anchorNode
    while (node && node !== el) {
      if (node.nodeType === 1 && node.classList?.contains('a1-heading-mark')) return node
      node = node.parentNode
    }
    return null
  }

  function applyMark(variant) {
    const el = getEl()
    const sel = window.getSelection()
    if (!el || !sel || sel.isCollapsed || sel.rangeCount === 0) return

    const existing = selectionMark()
    if (existing) {
      const isSameVariant = variant === 'underline'
        ? existing.classList.contains('a1-heading-mark--underline')
        : existing.classList.contains('a1-heading-mark--highlight')
      if (isSameVariant) {
        // Toggle off — replace the mark with its own contents.
        const parent = existing.parentNode
        while (existing.firstChild) parent.insertBefore(existing.firstChild, existing)
        parent.removeChild(existing)
      } else {
        existing.className = markClass(variant)
      }
    } else {
      const range = sel.getRangeAt(0)
      const span = document.createElement('span')
      span.className = markClass(variant)
      span.appendChild(range.extractContents())
      range.insertNode(span)
    }

    el.normalize()
    sel.removeAllRanges()
    setToolbar(null)
    commit()
  }

  function handleKeyDown(event) {
    // Single-line: Enter commits and exits rather than inserting a <div>/<br>.
    if (event.key === 'Enter') {
      event.preventDefault()
      event.currentTarget.blur()
    }
  }

  function handlePaste(event) {
    // Force plain-text paste so no foreign markup enters the heading.
    event.preventDefault()
    const text = event.clipboardData.getData('text/plain')
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    range.deleteContents()
    range.insertNode(document.createTextNode(text))
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
    commit()
  }

  const activeMark = toolbar ? selectionMark() : null
  const activeUnderline = !!activeMark?.classList.contains('a1-heading-mark--underline')
  const activeHighlight = !!activeMark?.classList.contains('a1-heading-mark--highlight')

  return (
    <div ref={wrapperRef} className="a1-web-editable-heading">
      <Heading
        as={config.as}
        type={config.type}
        size={config.size}
        color={config.color}
        align={config.align}
        margin={config.margin || undefined}
        textWrap={textWrap}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        role="textbox"
        aria-label="Edit heading text"
        onInput={commit}
        onMouseUp={refreshToolbar}
        onKeyUp={refreshToolbar}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={() => setToolbar(null)}
      />
      {toolbar && (
        <div
          className="a1-web-heading-mark-toolbar"
          style={{ left: `${toolbar.left}px`, top: `${toolbar.top}px` }}
          onMouseDown={(event) => event.preventDefault()}
        >
          <Toolbar overlay aria-label="Heading mark">
            <ToolbarToggle
              icon="ink_highlighter"
              label="Highlight"
              showLabel
              pressed={activeHighlight}
              onChange={() => applyMark('highlight')}
            />
            <ToolbarToggle
              icon="format_underlined"
              label="Underline"
              showLabel
              pressed={activeUnderline}
              onChange={() => applyMark('underline')}
            />
          </Toolbar>
        </div>
      )}
    </div>
  )
}

export function Preview({ component, config, setConfig }) {
  // Read-only fallback when no setConfig is provided.
  if (!setConfig) {
    const textWrap = config.textWrap ? 'balance' : undefined
    return (
      <Heading
        as={config.as}
        type={config.type}
        size={config.size}
        color={config.color}
        align={config.align}
        margin={config.margin || undefined}
        textWrap={textWrap}
        dangerouslySetInnerHTML={{ __html: config.children || component.title }}
      />
    )
  }
  return <EditableHeading component={component} config={config} setConfig={setConfig} />
}

export function Controls({ config, setConfig }) {
  const sizeOptions = HEADING_SIZE_OPTIONS[config.type] ?? HEADING_SIZE_OPTIONS.heading
  const markState = getMarkState(config.children)
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  const advancedSummary = summarize([
    config.align !== 'left' && `${optionLabel(config.align)} align`,
    config.margin && `${optionLabel(config.margin)} margin`,
    config.textWrap && 'Balanced',
  ])

  return (
    <Stack gap="lg">
<TextareaField
        label="Text"
        rows="sm"
        
        hint="==text== highlights · __text__ underlines"
        size="compact"
        value={htmlToMarkdown(config.children)}
        onChange={(event) => set({ children: markdownToHtml(event.target.value) })}
      />
      <Lockable prop="type"><Toolbar label="Type">
        <ToolbarGroup
          aria-label="Type"
          showLabels
          value={config.type}
          onChange={(type) => {
            const nextSizeOptions = HEADING_SIZE_OPTIONS[type] ?? HEADING_SIZE_OPTIONS.heading
            setConfig((current) => ({
              ...current,
              type,
              size: nextSizeOptions.includes(current.size) ? current.size : nextSizeOptions[2],
            }))
          }}
          options={HEADING_TYPE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
        />
      </Toolbar></Lockable>
      <Lockable prop="as"><Toolbar label="Element">
        <ToolbarGroup aria-label="Element" showLabels value={config.as} onChange={(as) => set({ as })} options={HEADING_ELEMENT_OPTIONS.map((opt) => ({ label: opt, value: opt }))} />
      </Toolbar></Lockable>
      <ResponsiveControl prop="size" label="Size" value={config.size} onChange={(size) => set({ size })} defaultValue={sizeOptions[2]}>
        {(val, setVal) => (
          <DetentSlider
            values={sizeOptions}
            detents={sizeOptions.map((value, index) => ({ value: index, label: optionLabel(value) }))}
            value={val}
            onChange={setVal}
          />
        )}
      </ResponsiveControl>
      <Lockable prop="color"><Toolbar label="Color">
        <ToolbarGroup
          aria-label="Color"
          showLabels
          value={config.color}
          onChange={(color) => set({ color })}
          options={[
            { label: 'Default', value: 'default', swatch: 'var(--semantic-color-text-default)' },
            { label: 'Muted', value: 'muted', swatch: 'var(--semantic-color-text-muted)' },
            { label: 'Accent', value: 'accent', swatch: 'var(--semantic-color-action-background)' },
          ]}
        />
      </Toolbar></Lockable>

      <Accordion label="Advanced" size="sm" subtext={advancedSummary} divider>
        <Stack gap="md">
          <ConfigHelp>
            <Paragraph size="xs" color="muted">
              Edit the heading directly in the preview and select text to add a mark — or type
              in the Text field using markdown: <code>==text==</code> highlights, <code>__text__</code> underlines.
            </Paragraph>
          </ConfigHelp>
          <Lockable prop="align"><Toolbar label="Align">
            <ToolbarGroup
              aria-label="Align"
              value={config.align}
              onChange={(align) => set({ align })}
              options={[
                { icon: 'align_horizontal_left', label: 'Left', value: 'left' },
                { icon: 'align_horizontal_center', label: 'Center', value: 'center' },
                { icon: 'align_horizontal_right', label: 'Right', value: 'right' },
              ]}
            />
            <ToolbarDivider />
            <ToolbarToggle icon="wrap_text" label="Balance text wrap" pressed={config.textWrap} onChange={(textWrap) => set({ textWrap })} />
          </Toolbar></Lockable>
          <DetentSlider prop="margin" label="Margin" values={MARGIN_VALUES} detents={MARGIN_DETENTS} value={config.margin} onChange={(margin) => set({ margin })} />
        </Stack>


      </Accordion>
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildHeadingSnippet(config)}</Code>
}
