import { Button, Code, Dialog, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { formatJsonDiagnostics } from '../editor/jsonValidation.js'
import { useT } from '../labels/useT.js'

// Keep failures available until dismissed. Code provides selectable, copyable
// text without rendering snapshot content or raw HTTP response bodies as HTML.
export function PreviewImportErrorDialog({ error, onClose }) {
  const t = useT()
  if (!error) return null
  const title = t('jsonPreview.importErrorTitle')
  const knownReason = ['expired', 'missing', 'invalid', 'importWorkspaceFailed', 'importValidationFailed'].includes(error.code)
  const reason = knownReason ? error.code : error.stage === 'fetch' ? 'importRequestFailed' : 'importFailed'
  const report = {
    ...error,
    message: t(`jsonPreview.${reason}`),
    ...(error.diagnostics?.length ? { details: formatJsonDiagnostics(error.diagnostics, t) } : {}),
  }
  return (
    <Dialog open onClose={onClose} title={title} aria-label={title} size="lg"
      footer={<Button as="a" href={`/preview/${error.previewId}`}>{t('jsonPreview.returnToPreview')}</Button>}
    >
      <Stack gap="md">
        <Paragraph>{t(`jsonPreview.${reason}`)}</Paragraph>
        <Code variant="block" wrapping copyCode>{JSON.stringify(report, null, 2)}</Code>
      </Stack>
    </Dialog>
  )
}
