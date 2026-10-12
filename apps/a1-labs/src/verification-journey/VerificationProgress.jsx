import React, { useId } from 'react'
import { Button, Card, StatusBar, Heading, Paragraph, Stack } from '@gtivr4/a1-design-system-react'

/** Controlled progress/receipt composition. The host owns services and persistence. */
export function VerificationProgress({ job, persisted, onRetry, onEdit, onNew, headingRef }) {
  const titleId = useId()
  const done = job.steps.filter(step => step.status === 'done').length
  const success = job.phase === 'success'
  const stopped = job.phase === 'error'
  const title = success ? 'Your demo workspace is ready' : job.phase === 'error' ? (persisted ? 'Your application is saved. Verification needs another try.' : 'Verification stopped. Your application is still here.') : 'We’re verifying your application'
  return <Stack gap={24} className="a1-verification-journey" aria-labelledby={titleId}>
    <Stack gap={8}>
      <Paragraph size="sm" color="muted">{success ? '3 of 3 · Complete' : '2 of 3 · Verify'}</Paragraph>
      <Heading as="h2" size="lg" id={titleId} ref={headingRef} tabIndex={-1}>{title}</Heading>
      <Paragraph>{success ? `${job.values.workspace} is set up for ${job.values.organization}. Here is exactly what happened.` : 'Each check appears as it starts. Results are added as we receive them.'}</Paragraph>
    </Stack>
    <Card icon={success ? 'check_circle' : stopped ? 'error' : 'fact_check'} iconDisplay="default" surface={success ? 'success' : stopped ? 'warn' : 'info'}>
      <Stack gap={16}>
        <Stack gap={8}>
          <Paragraph weight="bold">{done} of {job.steps.length} checks complete</Paragraph>
          <StatusBar value={done} max={job.steps.length} aria-label="Verification checks completed" aria-valuetext={`${done} of ${job.steps.length} checks complete`} size="sm" showPauseControl={false} />
          <Paragraph size="sm">{success ? 'Completed checks and receipt recorded.' : 'Progress measures finished checks, not time remaining.'}</Paragraph>
        </Stack>
        <Paragraph className="a1-sr-only" role="status" aria-live="polite" aria-atomic="true">{job.message}</Paragraph>
        <Paragraph size="sm">{persisted ? 'All 19 fields and completed checks are saved in this tab.' : 'Your application and completed checks are held in memory.'}</Paragraph>
      </Stack>
    </Card>
    {!persisted && <Card icon="error" iconDisplay="default" surface="error"><Paragraph role="alert">Browser storage is unavailable. Your application is only held in this page’s memory. Keep this tab open or download a copy before leaving.</Paragraph></Card>}
    {stopped && <Card icon="help" iconDisplay="default">
      <Stack gap={12}>
        <Heading as="h3" size="sm">What’s saved, and what happens next</Heading>
        <Paragraph>{job.message}</Paragraph>
        <Paragraph>{persisted ? 'All 19 fields and the latest completed checks are saved in this browser tab for this session. Reloading this tab restores them.' : 'All 19 fields and completed checks remain in memory while this page stays open.'}</Paragraph>
        <Paragraph>No workspace has been created. {job.steps.slice(done).map(step => step.api).join(', ')} still need to finish.</Paragraph>
        <Paragraph>Try the remaining checks when the service is available. You can also edit the application; edits start a new verification.</Paragraph>
        <Stack direction="row" gap={8} wrap>
          <Button onClick={onRetry}>Retry remaining checks</Button>
          <Button variant="secondary" onClick={onEdit}>Edit application</Button>
        </Stack>
      </Stack>
    </Card>}
    {success && <Card icon="receipt_long" iconDisplay="default">
      <Stack gap={12}>
        <Heading as="h3" size="sm">Your completion receipt</Heading>
        <Paragraph><strong>Reference:</strong> {job.id}</Paragraph>
        <Paragraph><strong>Workspace:</strong> {job.values.workspace} · {job.values.seats} seats · {job.values.regionHosting}</Paragraph>
        <Paragraph><strong>Owner access:</strong> {job.values.owner}</Paragraph>
        <Paragraph><strong>First project:</strong> {job.values.project}</Paragraph>
        <Paragraph><strong>Completed:</strong> {new Date(job.completedAt).toLocaleString()} · {(job.elapsed / 1000).toFixed(1)} seconds of processing</Paragraph>
        <Paragraph>This simulation recorded the application, verified the contact, address and organization, checked capacity and created a demo workspace. No real workspace, account or reservation was created. No email or invitation was sent.</Paragraph>
        <Paragraph>{persisted ? 'This receipt is saved in this browser tab until the session ends.' : 'Download the receipt to keep a copy.'} Next: download your receipt or start another scenario.</Paragraph>
      </Stack>
    </Card>}
    {!success && <Stack gap={12} role="list" aria-label="Verification services">
      {job.steps.filter(step => step.status !== 'pending').map((step, index) => <Card key={step.id} role="listitem" icon={step.status === 'done' ? 'check_circle' : stopped ? 'error' : step.status === 'retrying' ? 'refresh' : 'hourglass_top'} iconDisplay="default" status={step.status === 'error' ? 'error' : step.status === 'done' ? 'success' : step.status === 'retrying' ? 'warn' : step.status === 'running' ? 'info' : undefined}>
        <Stack gap={8}>
          <Paragraph weight="bold">{index + 1}. {step.name}</Paragraph>
          <Paragraph size="sm" color="muted">{step.api}</Paragraph>
          <StatusBar size="sm" max={1} value={step.status === 'done' ? 1 : 0}
            showPauseControl={false}
            indeterminate={!stopped && ['running', 'retrying'].includes(step.status)}
            aria-label={`${step.api}: ${step.status === 'done' ? 'complete' : stopped ? 'verification stopped' : step.status === 'retrying' ? 'waiting to retry automatically' : 'verification in progress'}`} />
          <Stack gap={4}>
            {(step.updates ?? [{ detail: step.detail, status: step.status, attempt: step.attempt }]).map((update, updateIndex) => (
              <Paragraph size="sm" key={updateIndex}>
                {update.status === 'running' ? `Attempt ${update.attempt} started. ` : update.status === 'done' ? 'Complete. ' : ''}
                {update.detail}
              </Paragraph>
            ))}
          </Stack>
        </Stack>
      </Card>)}
    </Stack>}
    <details><summary>Activity log · {job.events.length} updates</summary><Stack gap={8}>
      {job.events.map((event, index) => <Paragraph size="sm" key={index}>{new Date(event.at).toLocaleTimeString()} — {event.message}</Paragraph>)}
    </Stack></details>
    <Stack direction="row" gap={8} wrap>
      {success && <Button onClick={onNew}>Start another scenario</Button>}
    </Stack>
  </Stack>
}
