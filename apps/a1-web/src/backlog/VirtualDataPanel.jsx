import { useMemo, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  Card,
  Dialog,
  Heading,
  Icon,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  SelectField,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { useDataSources } from '../data/DataSourcesContext.jsx'
import { datasetAvailableToProject } from '../services/dataSources/types'
import { loadPages, loadProjects } from '../projects/projectStore'
import {
  applyVirtualDataPlan,
  runVirtualData,
  virtualData,
} from '../services/virtualData'

const PREVIEW_LIMIT = 60

function runDetail(run) {
  if (!run) return ''
  const seconds = `${(run.elapsedMs / 1000).toFixed(1)}s`
  if (run.engine === 'model') {
    const tokens = run.promptTokens != null || run.outputTokens != null
      ? ` · ${run.promptTokens ?? 0} in / ${run.outputTokens ?? 0} out tokens`
      : ''
    return `${run.model} · ${seconds}${tokens} · local`
  }
  return `${seconds} · local matching fallback`
}

/**
 * Dev-only local data teammate. It asks an optional Ollama model to select the
 * most relevant dataset for each page, then uses deterministic, validated rules
 * to prepare repeat/content/prop/collection bindings. Apply is always explicit.
 */
export function VirtualDataPanel({ onOpenProject }) {
  const data = useDataSources()
  const projects = useMemo(
    () => loadProjects().filter((project) => loadPages(project.id).length > 0),
    [],
  )
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '')
  const [busy, setBusy] = useState(false)
  const [run, setRun] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const datasets = (data?.items ?? []).filter((dataset) => (
    projectId && datasetAvailableToProject(dataset, projectId)
  ))

  async function handlePreview() {
    if (!projectId) return
    setBusy(true)
    setError('')
    setResult(null)
    try {
      const next = await runVirtualData(projectId, data?.items ?? [])
      setRun(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Virtual data could not inspect this project.')
    } finally {
      setBusy(false)
    }
  }

  function handleApply() {
    if (!run?.plan) return
    const count = applyVirtualDataPlan(run.plan)
    setResult({
      projectId: run.plan.projectId,
      projectName: run.plan.projectName,
      pages: run.plan.pages.length,
      count,
    })
    setRun(null)
  }

  const plan = run?.plan
  const hasTarget = !!projectId && projects.length > 0
  const canRun = hasTarget && datasets.length > 0

  return (
    <>
      <Stack gap="md">
        <Stack direction="row" gap="xs" align="center" wrap>
          <Icon name={virtualData.icon} color="accent" />
          <Heading as="h3" size="xs">{virtualData.name}</Heading>
          <MessageBadge status="warn" subtle size="sm">Dev only</MessageBadge>
        </Stack>
        <Paragraph size="sm" color="muted">{virtualData.blurb}</Paragraph>

        <SelectField
          label="Project"
          size="compact"
          value={projectId}
          disabled={projects.length === 0}
          onChange={(event) => {
            setProjectId(event.target.value)
            setRun(null)
            setResult(null)
          }}
        >
          {projects.length === 0 && <option value="">No projects with pages</option>}
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </SelectField>

        <Card>
          <Stack gap="sm">
            <Stack direction="row" gap="sm" align="center" wrap>
              <Icon name="database" color="accent" size="sm" />
              <Heading as="h4" size="xs">Connect project data</Heading>
            </Stack>
            <Stack direction="row" gap="xs" wrap>
              <MessageBadge status={datasets.length ? 'info' : 'warn'} subtle size="sm">
                {datasets.length} dataset{datasets.length === 1 ? '' : 's'}
              </MessageBadge>
              <MessageBadge status="neutral" subtle size="sm">
                {projectId ? loadPages(projectId).length : 0} page{loadPages(projectId).length === 1 ? '' : 's'}
              </MessageBadge>
            </Stack>
            <Paragraph size="sm" color="muted">
              Finds repeatable templates and structured lists, then maps their text and props
              to matching dataset fields. Existing bindings are preserved.
            </Paragraph>
            <ButtonContainer align="start">
              <Button
                size="sm"
                icon="link"
                loading={busy}
                disabled={!canRun}
                onClick={handlePreview}
              >
                Preview connections
              </Button>
            </ButtonContainer>
            {!hasTarget && (
              <Paragraph size="xs" color="muted">Create a project with at least one page first.</Paragraph>
            )}
            {hasTarget && datasets.length === 0 && (
              <Paragraph size="xs" color="muted">
                Add or scope a dataset to this project before running Virtual data.
              </Paragraph>
            )}
          </Stack>
        </Card>

        {error && (
          <Banner status="error" variant="inline" title="Virtual data could not run" onDismiss={() => setError('')}>
            {error}
          </Banner>
        )}

        {result && (
          <Banner
            status="success"
            variant="inline"
            title={`${result.projectName} is connected`}
            onDismiss={() => setResult(null)}
          >
            Added {result.count} connection{result.count === 1 ? '' : 's'} across{' '}
            {result.pages} page{result.pages === 1 ? '' : 's'}. Each page has a named editor-history entry.
            {onOpenProject && (
              <ButtonContainer align="start">
                <Button size="sm" variant="secondary" icon="arrow_forward" onClick={() => onOpenProject(result.projectId)}>
                  Open project
                </Button>
              </ButtonContainer>
            )}
          </Banner>
        )}
      </Stack>

      <Dialog
        open={!!run}
        onClose={() => setRun(null)}
        title={plan ? `${virtualData.name} — ${plan.projectName}` : virtualData.name}
        size="lg"
        footer={plan ? (
          <Stack gap="xs">
            <Paragraph size="xs" color="muted">{runDetail(run)}</Paragraph>
            <ButtonContainer>
              <Button variant="secondary" onClick={() => setRun(null)}>Cancel</Button>
              <Button
                icon="check"
                disabled={plan.proposals.length === 0}
                onClick={handleApply}
              >
                {plan.proposals.length === 0
                  ? 'Nothing to connect'
                  : `Apply ${plan.proposals.length} connection${plan.proposals.length === 1 ? '' : 's'}`}
              </Button>
            </ButtonContainer>
          </Stack>
        ) : undefined}
      >
        {plan && (
          <Stack gap="md">
            <Paragraph size="sm">
              Examined <strong>{plan.pageCount}</strong> page{plan.pageCount === 1 ? '' : 's'} and{' '}
              <strong>{plan.datasetCount}</strong> available dataset{plan.datasetCount === 1 ? '' : 's'}.
              {plan.proposals.length > 0
                ? <> Found <strong>{plan.proposals.length}</strong> explainable connection{plan.proposals.length === 1 ? '' : 's'} across <strong>{plan.pages.length}</strong> page{plan.pages.length === 1 ? '' : 's'}.</>
                : <> No high-confidence template or field matches were found. Nothing has changed.</>}
            </Paragraph>

            {plan.proposals.length > 0 && (
              <List size="sm">
                {plan.proposals.slice(0, PREVIEW_LIMIT).map((proposal, index) => (
                  <ListItem key={`${proposal.pageId}-${proposal.nodeId}-${proposal.kind}-${proposal.field ?? index}`}>
                    <strong>{proposal.pageTitle}</strong> · {proposal.summary}
                  </ListItem>
                ))}
              </List>
            )}
            {plan.proposals.length > PREVIEW_LIMIT && (
              <Paragraph size="xs" color="muted">
                …and {plan.proposals.length - PREVIEW_LIMIT} more.
              </Paragraph>
            )}
          </Stack>
        )}
      </Dialog>
    </>
  )
}
