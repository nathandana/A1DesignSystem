import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { parseCssColor, rgbToHex } from '../../../editor/contrastCheck.ts'

/**
 * Custom background color picker: type a hex value or use the native color
 * swatch, then apply it as a raw CSS color to a Section/Card `surface` prop
 * (the same escape hatch Card's `heroColor` already supports). Mirrors
 * ImageLibraryDialog's open/onClose/onApply shape.
 */
export function CustomColorDialog({ open, value, onClose, onApply }) {
  const [text, setText] = useState(value || '#ffffff')
  useEffect(() => { if (open) setText(value || '#ffffff') }, [open, value])

  let normalized = null
  try {
    normalized = rgbToHex(parseCssColor(text))
  } catch {
    normalized = null
  }
  const isValid = normalized != null
  const showError = !isValid && text.trim().length > 0

  function apply() {
    if (!isValid) return
    onApply?.(normalized)
    onClose?.()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Custom background color"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!isValid} icon="check" onClick={apply}>Apply</Button>
        </>
      }
    >
      <Stack gap="md">
        <Paragraph size="sm" color="muted">
          Enter a hex color, or pick one, to use as a custom background. Check
          the contrast of any content placed on it — use the editor's Contrast
          check tool or a manual review.
        </Paragraph>
        <Stack direction="row" gap="sm" align="end">
          <input
            type="color"
            className="a1-web-theme-swatch"
            value={isValid ? normalized : '#ffffff'}
            aria-label="Custom background color swatch"
            onChange={(e) => setText(e.target.value)}
          />
          <Stack grow as="span">
            <TextField
              label="Hex value"
              size="compact"
              value={text}
              spellCheck={false}
              error={showError ? 'Enter a valid hex color, e.g. #4262FF or #F60.' : undefined}
              onChange={(e) => setText(e.target.value)}
            />
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  )
}
