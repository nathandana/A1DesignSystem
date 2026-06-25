import { useEffect, useMemo, useRef, useState } from 'react'
import { Autocomplete, IconButton } from '@gtivr4/a1-design-system-react'
import iconRegistry from '../../../../../../system/icons/material-symbols.json'
import { AiIconDialog } from './AiIconDialog.jsx'
import { AI_ENABLED } from '../../../lib/aiImages.ts'
import {
  customIconMatchesProject,
  listCustomIcons,
  subscribeCustomIconStore,
} from '../../../lib/customIconStore.ts'
import { getActiveProjectId } from '../../../projects/projectStore.ts'

// Friendlier names for a few Material Symbols category ids; the rest are
// sentence-cased from the id.
const CATEGORY_LABELS = {
  av: 'Audio & video',
  ui: 'UI',
}
function categoryLabel(id) {
  if (!id) return 'Other'
  return CATEGORY_LABELS[id] ?? (id.charAt(0).toUpperCase() + id.slice(1))
}

// Grouped icon options, built once: every Material Symbol mapped to
// `{ value, label, icon, group }` and sorted by category then name so the
// Autocomplete renders one heading per category.
const MATERIAL_ICON_OPTIONS = iconRegistry.icons
  .map((icon) => {
    const cat = Array.isArray(icon.categories) ? icon.categories[0] : icon.categories
    return { value: icon.name, label: icon.name, icon: icon.name, group: categoryLabel(cat) }
  })
  .sort((a, b) => a.group.localeCompare(b.group) || a.value.localeCompare(b.value))

// Find a nearby label/text value to seed the AI prompt: scan a few ancestors up
// from the icon control for a text field, preferring one whose label reads like
// a name/title/label.
function deriveHint(rootEl) {
  if (!rootEl) return ''
  let scope = rootEl.parentElement
  for (let i = 0; i < 4 && scope?.parentElement; i += 1) scope = scope.parentElement
  if (!scope) return ''
  const fields = [...scope.querySelectorAll(
    'input:not([type=checkbox]):not([type=radio]):not([type=password]):not([type=number]):not([type=search]), textarea',
  )]
  const labelText = (el) => (el.labels?.[0]?.textContent || el.getAttribute('aria-label') || '').toLowerCase()
  const preferred = fields.find((el) => el.value?.trim() && /text|label|title|name|caption|legend|heading|quote/.test(labelText(el)))
  const any = fields.find((el) => el.value?.trim())
  return ((preferred || any)?.value || '').trim()
}

export function IconSelect({
  label = 'Icon',
  size = 'compact',
  value,
  onChange,
  /** Seed text for the AI icon prompt. Falls back to a nearby label/text field. */
  promptHint,
}) {
  const [aiOpen, setAiOpen] = useState(false)
  const [hint, setHint] = useState('')
  const [customIcons, setCustomIcons] = useState([])
  const wrapRef = useRef(null)

  useEffect(() => {
    let active = true
    const reload = () => listCustomIcons().then((icons) => {
      if (!active) return
      const projectId = getActiveProjectId()
      setCustomIcons(icons.filter((icon) => customIconMatchesProject(icon, projectId)))
    })
    reload()
    const unsubscribe = subscribeCustomIconStore(reload)
    return () => { active = false; unsubscribe() }
  }, [])

  const iconOptions = useMemo(() => [
    ...customIcons.map((icon) => ({
      value: `custom:${icon.name}`,
      label: icon.name,
      icon: `custom:${icon.name}`,
      group: 'Custom icons',
    })),
    ...MATERIAL_ICON_OPTIONS,
  ], [customIcons])

  function openAi() {
    setHint((promptHint && promptHint.trim()) || deriveHint(wrapRef.current))
    setAiOpen(true)
  }

  return (
    <>
      <div className="a1-web-icon-select" ref={wrapRef}>
        <div className="a1-web-icon-select__field">
          <Autocomplete
            label={label}
            size={size}
            value={value ?? ''}
            onChange={(name) => onChange?.(name)}
            options={iconOptions}
            maxVisible={200}
            emptyText="No icons match"
            aria-label={label}
          />
        </div>
        {AI_ENABLED && (
          <IconButton
            icon="auto_awesome"
            size={size === 'compact' ? 'sm' : 'md'}
            variant="secondary"
            aria-label="Find an icon with AI"
            onClick={openAi}
          />
        )}
      </div>
      {AI_ENABLED && (
        <AiIconDialog
          key={aiOpen ? `icon-ai-open-${hint}` : 'icon-ai-closed'}
          open={aiOpen}
          initialPrompt={hint}
          onClose={() => setAiOpen(false)}
          onApply={(name) => onChange?.(name)}
        />
      )}
    </>
  )
}
