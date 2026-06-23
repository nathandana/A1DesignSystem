import {
  Accordion,
  Button,
  Code,
  PageNav,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'

const DEFAULT_LABEL = 'On this page'

function escapeJsString(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')
}

// Derive a readable anchor id from the section label, matching what a real
// heading id would look like. Falls back to the stable key when empty.
function slugify(value, fallback) {
  const slug = String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || fallback
}

function createSection(label, level = 1) {
  return {
    key: `page-nav-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    level,
  }
}

function normalizeSections(sections) {
  return Array.isArray(sections) && sections.length > 0
    ? sections
    : [createSection('Overview')]
}

export function getDefaultConfig() {
  return {
    label: DEFAULT_LABEL,
    sections: [
      { key: 'page-nav-overview', label: 'Overview', level: 1 },
      { key: 'page-nav-usage', label: 'Usage', level: 1 },
      { key: 'page-nav-examples', label: 'Examples', level: 2 },
      { key: 'page-nav-props', label: 'Props', level: 1 },
    ],
    openItems: [],
  }
}

export function Preview({ config, utilityClass = '' }) {
  // Use the stable key as the id in the preview so duplicate labels can't
  // produce colliding section ids (PageNav keys its list by id). The readable
  // slug is shown in the snippet instead.
  const sections = normalizeSections(config.sections).map((section) => ({
    id: section.key,
    label: section.label || 'Untitled',
    level: section.level,
  }))

  return <PageNav className={utilityClass || undefined} label={config.label || DEFAULT_LABEL} sections={sections} />
}

export function Controls({ config, setConfig }) {
  const sections = normalizeSections(config.sections)
  const openItems = Array.isArray(config.openItems) ? config.openItems : []

  function updateSection(key, patch) {
    setConfig((current) => ({
      ...current,
      sections: normalizeSections(current.sections).map((section) => (
        section.key === key ? { ...section, ...patch } : section
      )),
    }))
  }

  function toggleSection(key, open) {
    setConfig((current) => {
      const currentOpen = Array.isArray(current.openItems) ? current.openItems : []
      return {
        ...current,
        openItems: open
          ? Array.from(new Set([...currentOpen, key]))
          : currentOpen.filter((itemKey) => itemKey !== key),
      }
    })
  }

  function removeSection(key) {
    setConfig((current) => {
      const next = normalizeSections(current.sections).filter((section) => section.key !== key)
      return {
        ...current,
        sections: next.length > 0 ? next : normalizeSections(current.sections),
        openItems: (current.openItems ?? []).filter((itemKey) => itemKey !== key),
      }
    })
  }

  function addSection() {
    setConfig((current) => {
      const list = normalizeSections(current.sections)
      const next = createSection(`Section ${list.length + 1}`)
      return {
        ...current,
        sections: [...list, next],
        openItems: Array.from(new Set([...(current.openItems ?? []), next.key])),
      }
    })
  }

  return (
    <Stack gap="lg">
      <TextField
        label="Heading"
        size="compact"
        value={config.label}
        onChange={(event) => setConfig((current) => ({ ...current, label: event.target.value }))}
      />

      <Stack gap="sm">
        {sections.map((section, index) => {
          const label = section.label || 'Untitled section'
          return (
            <Accordion
              key={section.key}
              label={`${index + 1}. ${label}${section.level === 2 ? ' (nested)' : ''}`}
              size="sm"
              open={openItems.includes(section.key)}
              onChange={(open) => toggleSection(section.key, open)}
            >
              <Stack gap="md">
                <TextField
                  label="Label"
                  hint="The anchor id is derived from this label."
                  size="compact"
                  value={section.label}
                  onChange={(event) => updateSection(section.key, { label: event.target.value })}
                />

                <Choice
                  label="Level"
                  size="compact"
                  hideIndicator
                  columns={2}
                  value={String(section.level)}
                  onChange={(value) => updateSection(section.key, { level: Number(value) })}
                  options={[
                    { label: 'Top level', value: '1' },
                    { label: 'Nested', value: '2' },
                  ]}
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  icon="delete"
                  disabled={sections.length <= 1}
                  onClick={() => removeSection(section.key)}
                >
                  Remove section
                </Button>
              </Stack>
            </Accordion>
          )
        })}
      </Stack>

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addSection}>
        Add section
      </Button>
    </Stack>
  )
}

function sectionSnippet(section) {
  const props = [
    `id: '${escapeJsString(slugify(section.label, section.key))}'`,
    `label: '${escapeJsString(section.label || 'Untitled')}'`,
    section.level === 2 ? 'level: 2' : null,
  ].filter(Boolean).join(', ')
  return `    { ${props} },`
}

function buildPageNavSnippet(config, utilityClass = '') {
  const sections = normalizeSections(config.sections)
  const labelProp = config.label && config.label !== DEFAULT_LABEL
    ? `\n  label="${escapeJsString(config.label)}"`
    : ''
  const classNameProp = utilityClass ? `\n  className="${escapeJsString(utilityClass)}"` : ''

  return `<PageNav${classNameProp}${labelProp}
  sections={[
${sections.map(sectionSnippet).join('\n')}
  ]}
/>`
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildPageNavSnippet(config, utilityClass)}</Code>
}
