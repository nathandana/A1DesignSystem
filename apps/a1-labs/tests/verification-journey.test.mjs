import test from 'node:test'
import assert from 'node:assert/strict'
import { CHECKS, createJob, initialValues, runDemo, restoreJob, abortableWait } from '../src/verification-journey/demo-model.js'

async function simulate(scenario, overrides = {}) {
  let time = 0
  const updates = []
  const result = await runDemo(createJob(initialValues(), scenario, 'DEMO-test'), {
    signal: new AbortController().signal,
    onUpdate: job => updates.push(job),
    wait: async ms => { time += ms }, now: () => time,
    ...overrides,
  })
  return { result, updates }
}
test('fast run finishes all services in order and emits one completed receipt', async () => {
  const { result, updates } = await simulate('fast')
  assert.equal(result.phase, 'success')
  assert.equal(result.elapsed, 2700)
  assert.equal(result.id, 'DEMO-test')
  assert.equal(result.steps.filter(s => s.status === 'done').length, CHECKS.length)
  assert.equal(updates.filter(job => job.phase === 'success').length, 1)
  assert.deepEqual(updates.filter(job => job.steps.some(s => s.status === 'running')).map(job => job.steps.find(s => s.status === 'running').id), CHECKS.map(s => s.id))
})
test('retry retains progress, announces failure/backoff and automatically recovers', async () => {
  const { result, updates } = await simulate('retry')
  const retry = updates.find(job => job.steps[3].status === 'retrying')
  assert.match(retry.message, /Retri?y.*automatically/)
  assert.equal(retry.steps.filter(s => s.status === 'done').length, 3)
  assert.equal(result.steps[3].attempt, 2)
  assert.equal(result.phase, 'success')
})
test('outage stops after bounded retries without running dependent APIs; resume skips saved work', async () => {
  const { result } = await simulate('blocked')
  assert.equal(result.phase, 'error')
  assert.equal(result.steps[3].attempt, 3)
  assert.equal(result.steps[4].status, 'pending')
  assert.equal(result.steps[5].status, 'pending')
  const resumed = []
  const success = await runDemo(result, { signal: new AbortController().signal, recovered: true, wait: async () => {}, onUpdate: job => resumed.push(job) })
  assert.equal(success.phase, 'success')
  assert.equal(success.id, result.id)
  assert.ok(resumed.every(job => job.steps.slice(0, 3).every(s => s.status === 'done' && s.attempt === 1)))
  assert.equal(success.recovered, true)
})
test('slow requests explain the wait without advancing completed-check progress', async () => {
  const { result, updates } = await simulate('slow')
  assert.equal(result.elapsed, 33600)
  assert.equal(updates.filter(job => job.message.includes('still responding')).length, 6)
  assert.equal(updates[1].steps.filter(s => s.status === 'done').length, 0)
})
test('abort during backoff prevents retry and completion updates', async () => {
  const control = new AbortController()
  const updates = []
  await assert.rejects(simulate('retry', { signal: control.signal,
    onUpdate: job => updates.push(job), wait: async ms => { if (ms === 2000) control.abort(); control.signal.throwIfAborted() },
  }), { name: 'AbortError' })
  assert.equal(updates.at(-1).steps[3].status, 'retrying')
  assert.ok(updates.every(job => job.phase !== 'success'))
})
test('reload restores interrupted jobs for automatic recovery and rejects invalid stored data', () => {
  const job = createJob(initialValues(), 'normal')
  const storage = { getItem: () => JSON.stringify(job) }
  assert.equal(restoreJob(storage).phase, 'interrupted')
  assert.deepEqual(restoreJob(storage).values, initialValues())
  assert.equal(restoreJob({getItem: () => '{bad'}), null)
  assert.equal(restoreJob({getItem: () => JSON.stringify({...job, steps: []})}), null)
  assert.equal(restoreJob({getItem: () => { throw Error('Denied') }}), null)
})
test('real wait rejects promptly when already aborted or stopped in flight', async () => {
  const control = new AbortController()
  const pending = abortableWait(60000, control.signal)
  control.abort()
  await assert.rejects(pending, {name:'AbortError'})
  await assert.rejects(abortableWait(60000, control.signal), {name:'AbortError'})
})

test('service details only grow; completed services and previous updates stay unchanged', async () => {
  for (const scenario of ['slow', 'retry', 'blocked']) {
    const { updates } = await simulate(scenario)
    for (let i = 1; i < updates.length; i++) {
      updates[i - 1].steps.forEach((before, index) => {
        const after = updates[i].steps[index]
        assert.deepEqual(after.updates.slice(0, before.updates.length), before.updates)
        if (before.status === 'done') assert.deepEqual(after, before)
        if (after.status === 'pending') assert.deepEqual(after.updates, [])
      })
    }
  }
})
