import { useEffect, useMemo, useState } from 'react'
import {
  Banner,
  Button,
  ButtonContainer,
  Card,
  Code,
  Heading,
  MessageBadge,
  Paragraph,
  Stack,
  TextareaField,
  TextField,
} from '@gtivr4/a1-design-system-react'
import {
  checkLocalCodexBridge,
  localCodexBridgeHost,
  reviewPageWithCodex,
  setLocalCodexBridgeHost,
} from '../lib/localCodex.ts'
import { useT } from '../labels/useT.js'

const SEVERITY_STATUS = {
  info: 'info',
  warn: 'warn',
  error: 'error',
}

function severityLabel(severity, t) {
  if (severity === 'error') return t('app.editor.codexSeverityError', 'Error')
  if (severity === 'warn') return t('app.editor.codexSeverityWarn', 'Warning')
  return t('app.editor.codexSeverityInfo', 'Info')
}

function codexUsageText(review, t) {
  const seconds = review.elapsedMs ? `${(review.elapsedMs / 1000).toFixed(1)}s` : ''
  const base = `${t('app.editor.codexReviewMeta', 'Reviewed locally with Codex in read-only mode.')} ${seconds}`.trim()
  if (!review.usage?.reported) {
    return `${base} ${t('app.editor.codexTokenUsageUnavailable', 'Token usage was not reported for this turn.')}`
  }
  return `${base} ${t('app.editor.codexTokenUsage', '{total} tokens ({input} in / {output} out).')
    .replace('{total}', String(review.usage.totalTokens ?? review.usage.inputTokens + review.usage.outputTokens))
    .replace('{input}', String(review.usage.inputTokens))
    .replace('{output}', String(review.usage.outputTokens))}`
}

function describeError(error, t) {
  if (error instanceof Error && error.name === 'AbortError') {
    return t('app.editor.codexErrorTimeout', 'Codex did not finish before the request timed out.')
  }
  if (error instanceof Error && error.message === 'Failed to fetch') {
    return t('app.editor.codexErrorBridgeUnavailable', 'The Codex bridge is not reachable. Start it locally, then try again.')
  }
  return t('app.editor.codexErrorGeneric', 'Codex could not complete the review. Check the bridge terminal for details.')
}

export function EditorCodexPanel({ definition }) {
  const t = useT()
  const [hostInput, setHostInput] = useState(() => localCodexBridgeHost())
  const [connected, setConnected] = useState(null)
  const [checking, setChecking] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [reviewing, setReviewing] = useState(false)
  const [review, setReview] = useState(null)
  const [error, setError] = useState('')

  const violations = useMemo(() => review?.result?.violations ?? [], [review])
  const guidance = useMemo(() => review?.result?.shouldBecomeGuidance ?? [], [review])

  async function checkBridge() {
    setChecking(true)
    setError('')
    try {
      setConnected(await checkLocalCodexBridge())
    } finally {
      setChecking(false)
    }
  }

  function saveHost() {
    setLocalCodexBridgeHost(hostInput)
    setConnected(null)
  }

  async function runReview() {
    if (!definition || reviewing) return
    setReviewing(true)
    setError('')
    try {
      const result = await reviewPageWithCodex({ definition, instruction })
      setConnected(true)
      setReview(result)
    } catch (err) {
      setError(describeError(err, t))
    } finally {
      setReviewing(false)
    }
  }

  useEffect(() => {
    checkBridge()
  }, [])

  return (
    <Stack gap="sm">
      <Paragraph size="xs" color="muted">
        {t('app.editor.codexDescription', 'Review the current page JSON with your local Codex CLI through a localhost bridge. The bridge runs Codex in read-only sandbox mode and returns findings to this panel.')}
      </Paragraph>

      <TextField
        label={t('app.editor.codexBridgeHostLabel', 'Bridge host')}
        size="compact"
        value={hostInput}
        autoComplete="off"
        onChange={(event) => setHostInput(event.target.value)}
      />
      <ButtonContainer>
        <Button size="sm" variant="secondary" icon="save" onClick={saveHost}>
          {t('app.editor.codexSaveBridgeHost', 'Save bridge')}
        </Button>
        <Button size="sm" variant="tertiary" icon="sync" loading={checking} onClick={checkBridge}>
          {t('app.editor.codexCheckBridge', 'Check bridge')}
        </Button>
      </ButtonContainer>

      {connected === true && (
        <Banner status="success" variant="inline">
          {t('app.editor.codexBridgeReady', 'Codex bridge is reachable.')}
        </Banner>
      )}
      {connected === false && (
        <Banner status="warn" variant="inline">
          {t('app.editor.codexBridgeMissing', 'Start the local bridge with npm run codex:bridge:a1-web, then check again.')}
        </Banner>
      )}
      {!definition && (
        <Banner status="warn" variant="inline">
          {t('app.editor.codexDefinitionMissing', 'Fix the page JSON before running a Codex review.')}
        </Banner>
      )}
      {error && (
        <Banner status="error" variant="inline" onDismiss={() => setError('')}>
          {error}
        </Banner>
      )}

      <TextareaField
        label={t('app.editor.codexInstructionLabel', 'Review focus')}
        size="compact"
        rows="sm"
        value={instruction}
        onChange={(event) => setInstruction(event.target.value)}
      />

      <ButtonContainer>
        <Button
          size="sm"
          icon="fact_check"
          loading={reviewing}
          disabled={!definition || reviewing}
          onClick={runReview}
        >
          {t('app.editor.codexReviewAction', 'Review page')}
        </Button>
      </ButtonContainer>

      {review && (
        <Stack gap="sm">
          <Paragraph size="xs" color="muted">
            {codexUsageText(review, t)}
          </Paragraph>
          <Card>
            <Stack gap="sm">
              <Heading level={3} size="sm">
                {t('app.editor.codexSummaryHeading', 'Summary')}
              </Heading>
              <Paragraph size="sm">{review.result.summary}</Paragraph>
            </Stack>
          </Card>

          {violations.length ? (
            <Stack gap="sm">
              <Heading level={3} size="sm">
                {t('app.editor.codexFindingsHeading', 'Findings')}
              </Heading>
              {violations.map((violation, index) => (
                <Card key={`${violation.rule}:${violation.nodeId}:${index}`}>
                  <Stack gap="xs">
                    <Stack direction="row" gap="xs" align="center" wrap>
                      <MessageBadge status={SEVERITY_STATUS[violation.severity] || 'info'}>
                        {severityLabel(violation.severity, t)}
                      </MessageBadge>
                      <Paragraph size="sm" weight="semibold">{violation.rule}</Paragraph>
                    </Stack>
                    {violation.nodeId && (
                      <Paragraph size="xs" color="muted">
                        {t('app.editor.codexNodeLabel', 'Node')}: <Code>{violation.nodeId}</Code>
                      </Paragraph>
                    )}
                    <Paragraph size="sm">{violation.message}</Paragraph>
                    <Paragraph size="xs" color="muted">{violation.suggestedFix}</Paragraph>
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : (
            <Banner status="success" variant="inline">
              {t('app.editor.codexNoFindings', 'Codex did not report any violations.')}
            </Banner>
          )}

          {guidance.length > 0 && (
            <Card>
              <Stack gap="xs">
                <Heading level={3} size="sm">
                  {t('app.editor.codexGuidanceHeading', 'Potential system guidance')}
                </Heading>
                <Code variant="block" wrapping copyCode>
                  {guidance.map((item) => `- ${item}`).join('\n')}
                </Code>
              </Stack>
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  )
}
