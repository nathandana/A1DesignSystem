import React, { useEffect, useRef, useState } from 'react'
import {
  Button, Card, Heading, Icon, Inset, Paragraph, Section, Slider, Stack, Tab, TabList, TabPanel, Tabs, Toolbar, ToolbarGroup,
} from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import '../../../../packages/react/src/utilities/sr-only.css'
import tokens from '../../../../system/tokens/component/button-completion.json'
import { CompletionButton } from './CompletionButton.jsx'
import { SendButton } from './SendButton.jsx'
import {
  PUBLISH_ICONS, PUBLISH_LABELS, PUBLISH_STATUS_TEXT, SEND_DESCRIPTION, SEND_ICONS, SEND_LABELS, SEND_STATUS_TEXT,
  nextStatus, parseDuration,
} from './states.js'

// Labs page: simulates the work, supplies sample copy and owns configuration.
// The reusable buttons only receive the resulting status.
const timing = tokens.component.buttonCompletion
const processingTime = key => parseDuration(timing[key].$value)
const STATUS_ICON = { success: ['check_circle', 'success'], failed: ['error', 'error'], retry: ['error', 'error'] }

function readFailureHold() {
  return parseDuration(getComputedStyle(document.documentElement).getPropertyValue('--component-button-completion-failure-hold'), 1500)
}

function DemoCard({ eyebrow, title, description, statusText, status, statusHidden = false, after, children }) {
  const [statusIcon, statusTone] = STATUS_ICON[status] ?? []
  return (
    <Section padding="none" contentWidth="xs">
      <Card>
        <Stack gap={24}>
          <Stack gap={4}>
            <Paragraph as="span" size="xs" color="muted">{eyebrow}</Paragraph>
            <Heading as="h2" size="sm">{title}</Heading>
            <Paragraph size="sm" color="muted">{description}</Paragraph>
          </Stack>
          <Stack gap={12} align="start">
            {children}
            {/* Always rendered so it stays a live region; hidden visually when the
                button already shows the same text. */}
            <div role="status" aria-live="polite" aria-atomic="true" className={statusHidden ? 'a1-sr-only' : undefined}>
              <Stack direction="row" gap={8} align="center">
                {statusIcon && <Icon name={statusIcon} size="sm" color={statusTone} />}
                <Paragraph size="sm" color={statusIcon ? 'default' : 'muted'}>{statusText}</Paragraph>
              </Stack>
            </div>
            {after}
          </Stack>
        </Stack>
      </Card>
    </Section>
  )
}

export function ButtonCompletionExperiment({ experiment, onOpenSettings }) {
  const [version, setVersion] = useState('send')
  const [outcome, setOutcome] = useState('success')
  const [processing, setProcessing] = useState(processingTime('processingDuration'))
  const [size, setSize] = useState('md')
  // Publish: the status is shown as soon as it changes.
  const [publishStatus, setPublishStatus] = useState('idle')
  // Send: `sendStatus` is the truth handed to the button; `sendShown` follows
  // what the button displays, so text never announces a result before the
  // plane has launched.
  const [sendStatus, setSendStatus] = useState('idle')
  const [sendShown, setSendShown] = useState('idle')
  const buttonRef = useRef(null)
  const outcomeRef = useRef(outcome)
  const retryTimer = useRef(0)
  outcomeRef.current = outcome

  // Simulated work: the outcome is read when it finishes, so changing it
  // mid-flight still applies.
  useEffect(() => {
    if (publishStatus !== 'working' && publishStatus !== 'failed') return undefined
    const delay = publishStatus === 'working' ? processing : readFailureHold()
    const timer = setTimeout(() => setPublishStatus(nextStatus(publishStatus, outcomeRef.current)), delay)
    return () => clearTimeout(timer)
  }, [publishStatus, processing])

  useEffect(() => {
    if (sendStatus !== 'working') return undefined
    const timer = setTimeout(() => setSendStatus(nextStatus('working', outcomeRef.current)), processing)
    return () => clearTimeout(timer)
  }, [sendStatus, processing])

  useEffect(() => () => clearTimeout(retryTimer.current), [])

  const reset = () => {
    clearTimeout(retryTimer.current)
    setPublishStatus('idle')
    setSendStatus('idle')
    setSendShown('idle')
  }
  const send = () => {
    clearTimeout(retryTimer.current)
    setSendStatus('working')
    setSendShown('working')
  }
  const sendSettled = result => {
    setSendShown(result)
    if (result !== 'failed') return
    retryTimer.current = setTimeout(() => {
      setSendStatus('retry')
      setSendShown('retry')
    }, readFailureHold())
  }
  // The result button unmounts; return focus to the main button.
  const startOver = () => {
    reset()
    requestAnimationFrame(() => buttonRef.current?.focus())
  }

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <Toolbar label="Outcome">
          <ToolbarGroup aria-label="Outcome" showLabels value={outcome} onChange={setOutcome}
            options={[
              { value: 'success', label: 'Succeed', icon: 'check_circle' },
              { value: 'error', label: 'Fail', icon: 'error' },
            ]} />
        </Toolbar>
        {/* Send email is one fixed-size button, so size applies to Publish only. */}
        {version === 'publish' && (
          <Toolbar label="Button size">
            <ToolbarGroup aria-label="Button size" showLabels value={size} onChange={setSize}
              options={[
                { value: 'sm', label: 'Small' },
                { value: 'md', label: 'Medium' },
                { value: 'lg', label: 'Large' },
              ]} />
          </Toolbar>
        )}
        <Slider label="Processing time" variant="subtle" value={processing} onChange={setProcessing}
          detents={['processingFast', 'processingDuration', 'processingSlow'].map(key => ({
            value: processingTime(key), label: `${processingTime(key) / 1000} sec`,
          }))}
          formatValue={value => `${value / 1000} seconds`} />
        <Button variant="secondary" icon="replay" onClick={reset} fullWidth>Reset button</Button>
      </Stack>
    </Inset>
  )

  const startOverButton = (
    <Button variant="tertiary" size="sm" icon="replay" onClick={startOver}>Start over</Button>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Tabs value={version} onChange={value => { reset(); setVersion(value) }}>
        <TabList>
          <Tab value="send" icon="send">Send email</Tab>
          <Tab value="publish" icon="publish">Publish</Tab>
        </TabList>
        <TabPanel value="send">
          <Inset block={24} inline={0}>
            <DemoCard eyebrow="Newsletter" title="Spring launch announcement"
              description="Our spring update is written, proofed and scheduled for now."
              status={sendShown} statusText={SEND_STATUS_TEXT[sendShown]} statusHidden
              after={sendShown === 'success' && startOverButton}>
              <SendButton status={sendStatus} labels={SEND_LABELS} description={SEND_DESCRIPTION} icons={SEND_ICONS} fullWidth
                buttonRef={buttonRef} onClick={send} onSettled={sendSettled} />
            </DemoCard>
          </Inset>
        </TabPanel>
        <TabPanel value="publish">
          <Inset block={24} inline={0}>
            <DemoCard eyebrow="Draft" title="Spring campaign site"
              description="Homepage, pricing and FAQ have unpublished edits."
              status={publishStatus} statusText={PUBLISH_STATUS_TEXT[publishStatus]}
              after={publishStatus === 'success' && startOverButton}>
              <CompletionButton status={publishStatus} labels={PUBLISH_LABELS} icons={PUBLISH_ICONS} size={size} fullWidth
                buttonRef={buttonRef} onClick={() => setPublishStatus('working')} />
            </DemoCard>
          </Inset>
        </TabPanel>
      </Tabs>
    </ExperimentLayout>
  )
}
