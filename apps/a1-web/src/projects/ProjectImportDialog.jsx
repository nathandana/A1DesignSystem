import { useMemo, useState } from 'react'
import { Banner, Button, Code, Dialog, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { componentRegistry } from '../editor/componentRegistry'
import { validateProjectImport } from './projectStore.ts'

// Starter scaffold shown in the editable block so the expected shape is obvious.
const STARTER = `{
  "name": "My project",
  "description": "Pasted from JSON",
  "icon": "folder",
  "pages": [
    {
      "title": "Home",
      "icon": "home",
      "definition": {
        "schemaVersion": "0.1.0",
        "page": {
          "id": "home",
          "name": "Home",
          "layout": {
            "type": "PageLayout",
            "regions": [
              {
                "id": "main",
                "nodes": [
                  {
                    "id": "hero",
                    "type": "Section",
                    "props": { "padding": "xl", "contentWidth": "lg", "gap": "md", "align": "center" },
                    "children": [
                      { "id": "title", "type": "Heading", "props": { "as": "h1", "size": "xl" }, "content": { "fallback": "Hello from JSON" } },
                      { "id": "body", "type": "Paragraph", "props": { "color": "muted" }, "content": { "fallback": "Paste a project definition and import it." } }
                    ]
                  }
                ]
              }
            ]
          }
        }
      }
    }
  ]
}`

/**
 * ProjectImportDialog — paste a project bundle (or a single page definition) as
 * JSON, see live validation, and import it as a new project. Errors block the
 * import; warnings (e.g. unknown component types) don't.
 */
export function ProjectImportDialog({ open, onCancel, onImport }) {
  const [text, setText] = useState(STARTER)
  const knownTypes = useMemo(() => new Set(Object.keys(componentRegistry)), [])

  const { errors, warnings } = useMemo(() => {
    const trimmed = text.trim()
    if (!trimmed) return { errors: ['Paste a project or page definition.'], warnings: [] }
    let data
    try { data = JSON.parse(trimmed) } catch (e) { return { errors: [`Invalid JSON: ${e.message}`], warnings: [] } }
    return validateProjectImport(data, knownTypes)
  }, [text, knownTypes])

  const canImport = errors.length === 0

  function handleImport() {
    let data
    try { data = JSON.parse(text) } catch { return }
    onImport(data)
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title="Upload project from JSON"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button icon="upload" disabled={!canImport} onClick={handleImport}>Import project</Button>
        </>
      }
    >
      <Stack gap="md">
        <Paragraph size="sm" color="muted">
          Paste a project bundle — <Code variant="inline">{'{ "name", "pages": [ … ] }'}</Code> — where each page has a
          page <Code variant="inline">definition</Code>; or paste a single page definition
          (<Code variant="inline">{'{ "page": { … } }'}</Code>) to create a one-page project. Clear any errors below to import.
        </Paragraph>

        <Code variant="block" editable wrapping copyCode onChangeValue={setText}>{STARTER}</Code>

        {errors.length > 0 ? (
          <Banner status="error" title={`${errors.length} error${errors.length === 1 ? '' : 's'} — fix before importing`}>
            <Stack gap="xs">
              {errors.slice(0, 10).map((e, i) => <Paragraph key={i} size="sm">{e}</Paragraph>)}
              {errors.length > 10 && <Paragraph size="sm" color="muted">…and {errors.length - 10} more.</Paragraph>}
            </Stack>
          </Banner>
        ) : warnings.length > 0 ? (
          <Banner status="warn" title={`Ready to import — ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`}>
            <Stack gap="xs">
              {warnings.slice(0, 10).map((w, i) => <Paragraph key={i} size="sm">{w}</Paragraph>)}
              {warnings.length > 10 && <Paragraph size="sm" color="muted">…and {warnings.length - 10} more.</Paragraph>}
            </Stack>
          </Banner>
        ) : (
          <Banner status="success" title="Valid — ready to import">
            <Paragraph size="sm">The JSON parses and every node has a known component type.</Paragraph>
          </Banner>
        )}
      </Stack>
    </Dialog>
  )
}
