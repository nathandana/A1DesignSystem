import { useState } from 'react'
import {
  Stack, Heading, Paragraph, Card, Code, IconButton, MessageBadge, MessageEmptyState, Divider,
} from '@gtivr4/a1-design-system-react'
import { useDataSources } from '../data/DataSourcesContext.jsx'
import { datasetAvailableToProject, datasetScopeLabel } from '../services/dataSources/types'
import { datasetBindingKey } from '../data/bindings'

/** A copyable binding token row — click to copy `{{ key.column }}` to the clipboard. */
function CopyToken({ token }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(token) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <Stack direction="row" gap="xs" align="center" justify="between">
      <Code variant="inline">{token}</Code>
      <IconButton
        size="sm"
        icon={copied ? 'check' : 'content_copy'}
        aria-label={`Copy ${token}`}
        onClick={copy}
      />
    </Stack>
  )
}

/**
 * The editor's Data tab: lists the datasets available to this project and their
 * columns as copyable `{{ key.column }}` binding tokens. Paste a token into a
 * heading, paragraph, button label, or text prop and the renderer resolves it to
 * the dataset value. See `data/bindings.ts` + the resolution in `pageRenderer.tsx`.
 */
export function EditorDataPanel({ projectId }) {
  const ctx = useDataSources()
  const datasets = (ctx?.items ?? []).filter((d) => datasetAvailableToProject(d, projectId))

  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Heading as="h2" size="sm">Data</Heading>
        <Paragraph size="sm" color="muted">
          Bind text or a prop to dataset data: put a token like{' '}
          <Code variant="inline">{'{{ users.name }}'}</Code> in a heading, paragraph, button label,
          or text prop and it shows the value on the canvas. Add a row index for a specific row
          (<Code variant="inline">{'{{ users.name.2 }}'}</Code>); the default is the first row.
        </Paragraph>
      </Stack>

      {datasets.length === 0 ? (
        <MessageEmptyState
          scale="card"
          icon="table_chart"
          title="No datasets"
          description="Add datasets on the Data sources page, then bind them here."
        />
      ) : (
        datasets.map((ds) => {
          const key = datasetBindingKey(ds.name)
          return (
            <Card key={ds.id}>
              <Stack gap="sm">
                <Stack direction="row" gap="xs" align="center" justify="between">
                  <Heading as="h3" size="xs">{ds.name}</Heading>
                  <MessageBadge status="info" subtle size="sm">{datasetScopeLabel(ds)}</MessageBadge>
                </Stack>
                <Paragraph size="xs" color="muted">
                  Key <Code variant="inline">{key}</Code> · {ds.rows.length} {ds.rows.length === 1 ? 'row' : 'rows'}
                </Paragraph>
                <Divider space="xs" />
                <Stack gap="xs">
                  {ds.columns.length === 0
                    ? <Paragraph size="xs" color="muted">No columns yet.</Paragraph>
                    : ds.columns.map((c) => <CopyToken key={c.key} token={`{{ ${key}.${c.key} }}`} />)}
                </Stack>
              </Stack>
            </Card>
          )
        })
      )}
    </Stack>
  )
}
