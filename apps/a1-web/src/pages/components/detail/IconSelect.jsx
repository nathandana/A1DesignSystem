import { useRef, useState } from 'react'
import { IconButton, SelectField } from '@gtivr4/a1-design-system-react'
import iconRegistry from '../../../../../../system/icons/material-symbols.json'
import { AiIconDialog } from './AiIconDialog.jsx'

const ICON_OPTIONS = iconRegistry.icons.map((icon) => icon.name)

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
  const wrapRef = useRef(null)

  function openAi() {
    setHint((promptHint && promptHint.trim()) || deriveHint(wrapRef.current))
    setAiOpen(true)
  }

  return (
    <>
      <div className="a1-web-icon-select" ref={wrapRef}>
        <div className="a1-web-icon-select__field">
          <SelectField
            label={label}
            size={size}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
          >
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </SelectField>
        </div>
        <IconButton
          icon="auto_awesome"
          size={size === 'compact' ? 'sm' : 'md'}
          variant="secondary"
          aria-label="Find an icon with AI"
          onClick={openAi}
        />
      </div>
      <AiIconDialog
        key={aiOpen ? `icon-ai-open-${hint}` : 'icon-ai-closed'}
        open={aiOpen}
        initialPrompt={hint}
        onClose={() => setAiOpen(false)}
        onApply={(name) => onChange?.(name)}
      />
    </>
  )
}
