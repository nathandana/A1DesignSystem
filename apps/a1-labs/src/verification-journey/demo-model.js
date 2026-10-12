// Demo data and deterministic simulated services. No external requests are made.
export const SCENARIOS = [
  { value: 'normal', label: 'Steady progress', subtext: 'About 12 seconds. Every check passes.' },
  { value: 'fast', label: 'Fast response', subtext: 'About 3 seconds. A quick, complete receipt.' },
  { value: 'slow', label: 'Slow service', subtext: 'About 35 seconds. Explicit updates while waiting.' },
  { value: 'retry', label: 'Automatic recovery', subtext: 'The Organization API times out once, then recovers.' },
  { value: 'blocked', label: 'Service unavailable', subtext: '3 attempts fail. Keep the draft and resume later.' },
]
export const SECTIONS = [
  { title: 'Organization', fields: [
    ['organization', 'Organization name', 'Northstar Studio'], ['registration', 'Registration ID', 'DEMO-2048'],
    ['website', 'Website', 'https://northstar.example', 'url'], ['industry', 'Industry', 'Design and research'],
  ] },
  { title: 'Primary contact', fields: [
    ['firstName', 'First name', 'Alex'], ['lastName', 'Last name', 'Morgan'],
    ['email', 'Work email', 'alex@example.com', 'email'], ['phone', 'Phone', '+1 202-555-0142', 'tel'],
  ] },
  { title: 'Office address', fields: [
    ['street', 'Street address', '42 Example St.'], ['city', 'City', 'Portland'],
    ['region', 'State or region', 'Oregon'], ['postal', 'Postal code', '97205'], ['country', 'Country', 'United States'],
  ] },
  { title: 'Workspace and access', fields: [
    ['workspace', 'Workspace name', 'Northstar research'], ['seats', 'Team seats', '24', 'number'],
    ['regionHosting', 'Hosting region', 'United States'], ['owner', 'Workspace owner email', 'alex@example.com', 'email'],
    ['domain', 'Allowed email domain', 'example.com'], ['project', 'First project', 'Customer discovery'],
  ] },
]
export const initialValues = () => Object.fromEntries(SECTIONS.flatMap(s => s.fields.map(([id,, value]) => [id, value])))
export const CHECKS = [
  { id: 'validate', name: 'Validate the application', api: 'Validation API', active: 'Checking required fields and input formats.', result: 'All application fields passed validation.' },
  { id: 'contact', name: 'Verify contact details', api: 'Contact API', active: 'Checking the contact and workspace owner email formats.', result: 'Contact and owner details verified in the demo.' },
  { id: 'address', name: 'Verify the office address', api: 'Address API', active: 'Checking the street, city and postal code together.', result: 'Office address verified in the demo.' },
  { id: 'organization', name: 'Verify the organization', api: 'Organization API', active: 'Looking up the organization registration.', result: 'Organization registration verified in the demo.' },
  { id: 'capacity', name: 'Check workspace availability', api: 'Capacity API', active: 'Checking the requested team size and hosting region.', result: 'Requested seats and hosting region are available in the demo.' },
  { id: 'submit', name: 'Create the workspace', api: 'Workspace API', active: 'Creating the demo workspace and recording the receipt.', result: 'Demo workspace, owner access and first project created. No invitations sent.' },
]
export function createJob(values, scenario, id = `DEMO-${Date.now().toString(36)}`) {
  return { id, values: { ...values }, scenario, phase: 'running', message: 'Application saved. Starting verification.',
    steps: CHECKS.map(check => ({ ...check, status: 'pending', attempt: 0, detail: '', updates: [] })),
    events: [], savedAt: new Date().toISOString(), elapsed: 0 }
}
export function abortableWait(ms, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new DOMException('Stopped', 'AbortError')) }
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve() }, ms)
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  })
}
// The runner is separate from the progress UI. Resume skips completed checks.
export async function runDemo(initial, { signal, onUpdate, wait = abortableWait, now = Date.now, recovered = false }) {
  let job = { ...initial, recovered: recovered || initial.recovered, phase: 'running', error: null }
  const started = now()
  const publish = (index, patch, message) => {
    signal.throwIfAborted()
    job = { ...job, elapsed: initial.elapsed + now() - started, message,
      steps: job.steps.map((step, i) => {
        if (i !== index) return step
        // Keep previously shown facts in place. New progress appends to this
        // service's history instead of replacing its description on every tick.
        const previous = step.updates ?? (step.status === 'pending' ? [] : [{ detail: step.detail, status: step.status, attempt: step.attempt }])
        return { ...step, ...patch, updates: [...previous, {
          detail: patch.detail, status: patch.status || 'update', attempt: patch.attempt || step.attempt,
        }] }
      }),
      events: [...job.events, { message, at: new Date(now()).toISOString() }] }
    onUpdate(job)
  }
  const duration = job.scenario === 'fast' ? 450 : job.scenario === 'slow' ? 5600 : 1800
  for (let index = 0; index < job.steps.length; index++) {
    if (job.steps[index].status === 'done') continue
    const check = job.steps[index]
    for (let attempt = 1; attempt <= 3; attempt++) {
      publish(index, { status: 'running', attempt, detail: check.active }, `${check.api}: ${check.active} Attempt ${attempt} of 3.`)
      if (job.scenario === 'slow') {
        await wait(duration / 2, signal)
        publish(index, { detail: 'The service is taking longer than usual. The request is still active; no action is needed.' }, `${check.api} is still responding. Your application is kept; no action is needed.`)
        await wait(duration / 2, signal)
      } else await wait(duration, signal)
      const failed = !job.recovered && check.id === 'organization' && (job.scenario === 'blocked' || (job.scenario === 'retry' && attempt === 1))
      if (failed && attempt < 3) {
        publish(index, { status: 'retrying', detail: `No response on attempt ${attempt}. Retrying automatically in 2 seconds (${attempt + 1} of 3).` }, `${check.api} timed out. Retrying automatically in 2 seconds. Attempt ${attempt + 1} of 3; completed checks are kept.`)
        await wait(2000, signal)
        continue
      }
      if (failed) {
        job = { ...job, phase: 'error', error: check.id }
        publish(index, { status: 'error', detail: 'No response after 3 attempts. Verification stopped here.' }, 'Organization API is unavailable after 3 attempts. Your draft and 3 completed checks are kept. No workspace was created.')
        return job
      }
      publish(index, { status: 'done', detail: check.result }, `${check.api}: ${check.result}`)
      break
    }
  }
  job = { ...job, phase: 'success', completedAt: new Date(now()).toISOString() }
  publish(-1, {}, `Demo workspace ${job.values.workspace} is ready. All ${job.steps.length} checks completed. No real account was created or message sent.`)
  return job
}
export const STORAGE_KEY = 'a1-labs-verification-journey-v1'
export function restoreJob(storage) {
  try {
    const job = JSON.parse(storage.getItem(STORAGE_KEY))
    if (!job || !['running', 'error', 'success', 'interrupted'].includes(job.phase) || !job.values ||
      !SECTIONS.flatMap(s => s.fields).every(([id]) => typeof job.values[id] === 'string') ||
      !Array.isArray(job.steps) || job.steps.length !== CHECKS.length || !Array.isArray(job.events) ||
      !job.steps.every((step, i) => step && step.id === CHECKS[i].id && ['pending', 'running', 'retrying', 'done', 'error'].includes(step.status)) || !Number.isFinite(job.elapsed)) return null
    return job.phase === 'running' ? { ...job, phase: 'interrupted', message: 'Restoring your application and automatically continuing the remaining checks.' } : job
  } catch { return null }
}
