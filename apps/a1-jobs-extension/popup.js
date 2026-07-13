const tabs = Array.from(document.querySelectorAll('[role="tab"]'))
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'))
const jobButton = document.getElementById('job-button')
const copyJobButton = document.getElementById('copy-job-button')
const sendJobButton = document.getElementById('send-job-button')
const scanButton = document.getElementById('scan-button')
const copyScanButton = document.getElementById('copy-scan-button')
const sendScanButton = document.getElementById('send-scan-button')
const linkedinButton = document.getElementById('linkedin-button')
const linkedinJobButton = document.getElementById('linkedin-job-button')
const copyLinkedInButton = document.getElementById('copy-linkedin-button')
const sendLinkedInButton = document.getElementById('send-linkedin-button')
const fillButton = document.getElementById('fill-button')
const jobOutput = document.getElementById('job-output')
const formScanOutput = document.getElementById('form-scan-output')
const linkedinOutput = document.getElementById('linkedin-output')
const fillInput = document.getElementById('fill-input')
const fieldMappings = document.getElementById('field-mappings')
const commonValues = document.getElementById('common-values')
const resultOutput = document.getElementById('result-output')
const A1_JOBS_URL = 'http://127.0.0.1:5186/'
const A1_JOBS_MATCHES = [
  'http://127.0.0.1:5186/*',
  'http://localhost:5186/*',
]
const DEFAULT_COMMON_VALUES = {
  fullName: 'Nathan Dana',
  email: 'nathan.dana@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/midbrain',
  portfolioUrl: 'https://nathandana.a1design.app',
  a1Credentials: 'https://a1design.app\nuser: test@user.com\npass: TestUser',
}

function isA1JobsUrl(value) {
  return /^http:\/\/(127\.0\.0\.1|localhost):5186\//.test(String(value || ''))
}

function setResult(value) {
  resultOutput.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

function setOutput(output, value, controls = []) {
  output.value = value
  const hasValue = Boolean(value.trim())
  for (const control of controls) {
    control.disabled = !hasValue
  }
}

function setActiveTab(tabName) {
  for (const tab of tabs) {
    const selected = tab.dataset.tab === tabName
    tab.setAttribute('aria-selected', selected ? 'true' : 'false')
    tab.tabIndex = selected ? 0 : -1
  }
  for (const panel of panels) {
    panel.hidden = panel.id !== `panel-${tabName}`
  }
}

function onTabKeyDown(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const currentIndex = tabs.indexOf(event.currentTarget)
  const nextIndex = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? tabs.length - 1
      : event.key === 'ArrowRight'
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length
  tabs[nextIndex].focus()
  setActiveTab(tabs[nextIndex].dataset.tab)
}

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.id) throw new Error('No active tab is available.')
  return tab
}

async function execute(tabId, files, func, args = []) {
  for (const file of files) {
    await chrome.scripting.executeScript({ target: { tabId }, files: [file] })
  }
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func,
    args,
  })
  return result?.result
}

async function a1JobsTab() {
  const tabs = await chrome.tabs.query({ url: A1_JOBS_MATCHES })
  const existing = tabs.find((tab) => tab.id)
  if (existing) return existing
  return chrome.tabs.create({ url: A1_JOBS_URL, active: false })
}

async function waitForTabLoad(tabId) {
  const tab = await chrome.tabs.get(tabId)
  if (tab.status === 'complete') return
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener)
      reject(new Error('A1 Jobs did not finish loading in time. Open the app and try sending again.'))
    }, 15000)
    function listener(nextTabId, info) {
      if (nextTabId !== tabId || info.status !== 'complete') return
      clearTimeout(timer)
      chrome.tabs.onUpdated.removeListener(listener)
      resolve()
    }
    chrome.tabs.onUpdated.addListener(listener)
  })
}

async function sendPayload(payload) {
  const tab = await a1JobsTab()
  await waitForTabLoad(tab.id)
  const envelope = {
    id: crypto.randomUUID(),
    sentAt: new Date().toISOString(),
    ...payload,
  }
  const injection = {
    target: { tabId: tab.id },
    func: (nextPayload) => {
      localStorage.setItem('a1-jobs-extension-payload', JSON.stringify(nextPayload))
      localStorage.setItem('a1-jobs-extension-status', JSON.stringify({
        id: nextPayload.id,
        type: nextPayload.type,
        status: 'delivered',
        deliveredAt: new Date().toISOString(),
      }))
      window.dispatchEvent(new CustomEvent('a1-jobs-extension-payload', { detail: nextPayload }))
    },
    args: [envelope],
  }
  try {
    await chrome.scripting.executeScript({ ...injection, world: 'MAIN' })
  } catch {
    await chrome.scripting.executeScript(injection)
  }
  return { ...envelope, a1JobsTabId: tab.id }
}

function sentMessage(envelope) {
  if (envelope.type === 'job-page') return 'Sent job page to A1 Jobs in the background. Open the A1 Jobs tab to watch import progress.'
  if (envelope.type === 'linkedin-scan') return 'Sent LinkedIn scan to A1 Jobs contacts.'
  return 'Sent form scan to A1 Jobs autofill.'
}

function payloadForScan(scan) {
  if (scan?.source === 'browser-extension-job-page') return { type: 'job-page', jobPage: scan }
  if (scan?.source === 'linkedin-visible-connections') return { type: 'linkedin-scan', scan }
  return { type: 'form-scan', scan }
}

async function sendOutput(output, emptyMessage) {
  if (!output.value.trim()) throw new Error(emptyMessage)
  return sendPayload(payloadForScan(JSON.parse(output.value)))
}

async function autoSend(payload, prefix) {
  setResult(`${prefix} Sending to A1 Jobs...`)
  try {
    const envelope = await sendPayload(payload)
    setResult(`${prefix} ${sentMessage(envelope)}`)
    if (envelope.type === 'job-page') {
      watchA1JobsImport(envelope).catch((error) => {
        setResult(`${prefix} Sent to A1 Jobs, but status polling failed: ${error.message}`)
      })
    }
    return envelope
  } catch (error) {
    setResult(`${prefix} Could not send automatically: ${error.message}`)
    return null
  }
}

async function readA1JobsStatus(tabId, payloadId) {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: (id) => {
      try {
        const raw = localStorage.getItem('a1-jobs-extension-status')
        const status = raw ? JSON.parse(raw) : null
        return status?.id === id ? status : null
      } catch {
        return null
      }
    },
    args: [payloadId],
  })
  return result?.result ?? null
}

async function watchA1JobsImport(envelope) {
  if (!envelope.a1JobsTabId) return
  const started = Date.now()
  while (Date.now() - started < 180000) {
    const status = await readA1JobsStatus(envelope.a1JobsTabId, envelope.id)
    if (status?.status === 'importing') {
      setResult(status.detail || 'A1 Jobs received the scrape and is sending it through the Codex bridge...')
    } else if (status?.status === 'created') {
      setResult(status.detail || 'A1 Jobs created the listing and is generating the package...')
    } else if (status?.status === 'complete') {
      setResult(status.detail || 'A1 Jobs created the listing and generated the package.')
      return
    } else if (status?.status === 'duplicate') {
      setResult(status.detail || 'A1 Jobs found an existing listing and opened that job instead.')
      return
    } else if (status?.status === 'error') {
      setResult(`A1 Jobs could not import the page: ${status.detail || status.error || 'Unknown error'}`)
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }
  setResult('Sent to A1 Jobs. The import is taking longer than expected; open the A1 Jobs tab to check progress.')
}

async function readJobPage() {
  jobButton.disabled = true
  setResult('Scanning current page...')
  try {
    const tab = await activeTab()
    if (isA1JobsUrl(tab.url)) throw new Error('Open an external job posting tab before sending a job page.')
    const jobPage = await execute(tab.id, ['content/job.js'], () => window.a1JobsReadJobPage())
    const text = JSON.stringify(jobPage, null, 2)
    setOutput(jobOutput, text, [copyJobButton])
    await autoSend({ type: 'job-page', jobPage }, `Scanned ${jobPage.text?.length || 0} characters from the page.`)
  } catch (error) {
    setResult(error.message)
  } finally {
    jobButton.disabled = false
  }
}

async function scanForm() {
  scanButton.disabled = true
  setResult('Scanning active form...')
  try {
    const tab = await activeTab()
    const scan = await execute(tab.id, ['content/scan.js'], () => window.a1JobsScanForm())
    const text = JSON.stringify(scan, null, 2)
    setOutput(formScanOutput, text, [copyScanButton])
    await autoSend(
      { type: 'form-scan', scan },
      scan.submissionError
        ? `Detected a rejected submission: ${scan.submissionError.message}`
        : `Scanned ${scan.fields.length} fields.`,
    )
  } catch (error) {
    setResult(error.message)
  } finally {
    scanButton.disabled = false
  }
}

async function scanLinkedIn() {
  linkedinButton.disabled = true
  setResult('Scanning visible LinkedIn cards...')
  try {
    const tab = await activeTab()
    const scan = await execute(tab.id, ['content/linkedin.js'], () => window.a1JobsScanLinkedIn())
    const text = JSON.stringify(scan, null, 2)
    setOutput(linkedinOutput, text, [copyLinkedInButton])
    await autoSend({ type: 'linkedin-scan', scan }, `Scanned ${scan.connections.length} visible LinkedIn contact cards.`)
  } catch (error) {
    setResult(error.message)
  } finally {
    linkedinButton.disabled = false
  }
}

async function addSelectedLinkedInJob() {
  linkedinJobButton.disabled = true
  setResult('Opening the selected job Share menu...')
  try {
    const tab = await activeTab()
    if (!/^https?:\/\/(?:[^/]+\.)?linkedin\.com\//i.test(tab.url || '') || !/\/jobs\//i.test(tab.url || '')) {
      throw new Error('Open a LinkedIn Jobs page and select a job before adding it.')
    }
    const share = await execute(tab.id, ['content/job.js'], () => window.a1JobsGetLinkedInShareLink())
    if (!share?.url) throw new Error(share?.reason || 'Could not copy the selected LinkedIn job link.')
    setResult('Copied the LinkedIn job link. Opening it in a new tab...')
    const jobTab = await chrome.tabs.create({ url: share.url, active: true })
    if (!jobTab?.id) throw new Error('Could not open the copied LinkedIn job link.')
    await waitForTabLoad(jobTab.id)
    let jobPage = null
    for (let attempt = 0; attempt < 4; attempt += 1) {
      jobPage = await execute(jobTab.id, ['content/job.js'], () => window.a1JobsReadJobPage())
      if (jobPage?.title && (jobPage.jobDescription || jobPage.text)) break
      await new Promise((resolve) => setTimeout(resolve, 600))
    }
    if (!jobPage?.title) {
      throw new Error('The selected LinkedIn job detail is not ready. Select the job and wait for its details to load.')
    }
    if (!jobPage.jobDescription && !jobPage.text) {
      jobPage = {
        ...jobPage,
        jobDescription: jobPage.pageDetails?.focusedText || `Selected LinkedIn job: ${jobPage.title}`,
        text: jobPage.pageDetails?.focusedText || `Selected LinkedIn job: ${jobPage.title}`,
      }
    }
    setOutput(jobOutput, JSON.stringify(jobPage, null, 2), [copyJobButton])
    await autoSend({ type: 'job-page', jobPage }, `Selected ${jobPage.title}.`)
  } catch (error) {
    setResult(error.message)
  } finally {
    linkedinJobButton.disabled = false
  }
}

async function sendJobPage() {
  sendJobButton.disabled = true
  setResult('Sending job page to A1 Jobs...')
  try {
    const envelope = await sendOutput(jobOutput, 'Read the current job page first.')
    setResult(sentMessage(envelope))
    watchA1JobsImport(envelope).catch((error) => {
      setResult(`Sent to A1 Jobs, but status polling failed: ${error.message}`)
    })
  } catch (error) {
    setResult(error.message)
  } finally {
    sendJobButton.disabled = false
  }
}

async function sendFormScan() {
  sendScanButton.disabled = true
  setResult('Sending form scan to A1 Jobs...')
  try {
    const envelope = await sendOutput(formScanOutput, 'Scan a form first.')
    setResult(sentMessage(envelope))
  } catch (error) {
    setResult(error.message)
  } finally {
    sendScanButton.disabled = false
  }
}

async function sendLinkedInScan() {
  sendLinkedInButton.disabled = true
  setResult('Sending LinkedIn scan to A1 Jobs...')
  try {
    const envelope = await sendOutput(linkedinOutput, 'Scan LinkedIn first.')
    setResult(sentMessage(envelope))
  } catch (error) {
    setResult(error.message)
  } finally {
    sendLinkedInButton.disabled = false
  }
}

async function resolveAttachments(fillPackage) {
  const attachments = Array.isArray(fillPackage?.attachments) ? fillPackage.attachments : []
  if (!attachments.length) return fillPackage
  setResult(`Preparing ${attachments.length} generated PDF attachment${attachments.length === 1 ? '' : 's'}...`)
  const resolved = []
  for (const attachment of attachments) {
    if (attachment.base64 || !attachment.url) {
      resolved.push(attachment)
      continue
    }
    const response = await fetch(attachment.url)
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || `Could not read ${attachment.filename || attachment.kind}.`)
    resolved.push({
      ...attachment,
      filename: data.result?.filename || attachment.filename,
      mimeType: data.result?.mimeType || attachment.mimeType || 'application/pdf',
      base64: data.result?.base64,
    })
  }
  return { ...fillPackage, attachments: resolved }
}

async function fillForm() {
  fillButton.disabled = true
  setResult('Filling reviewed values...')
  try {
    const fillPackage = await resolveAttachments(JSON.parse(fillInput.value))
    const tab = await activeTab()
    const result = await execute(
      tab.id,
      ['content/scan.js', 'content/fill.js'],
      (payload) => window.a1JobsFillForm(payload),
      [fillPackage],
    )
    setResult(result)
  } catch (error) {
    setResult(error.message)
  } finally {
    fillButton.disabled = false
  }
}

function currentFillPackage() {
  if (!fillInput.value.trim()) throw new Error('Paste a fill package first.')
  return JSON.parse(fillInput.value)
}

function renderFieldMappings() {
  fieldMappings.replaceChildren()
  commonValues.replaceChildren()
  let fillPackage = {}
  try {
    if (fillInput.value.trim()) fillPackage = currentFillPackage()
  } catch {
    fillPackage = {}
  }
  const profile = { ...DEFAULT_COMMON_VALUES, ...(fillPackage.profile || {}) }
  const values = [
    ['LinkedIn URL', profile.linkedinUrl, 'linkedin'],
    ['Portfolio URL', profile.portfolioUrl, 'portfolio'],
    ['A1Design', profile.a1Credentials || profile.a1Url, 'a1'],
    ['Email', profile.email, 'email'],
    ['Full name', profile.fullName, 'name'],
  ].filter(([, value]) => value)
  for (const [labelText, value] of values) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = labelText
    button.title = value
    button.addEventListener('click', () => fillCommonValue(labelText, value))
    commonValues.append(button)
  }
  const mappings = Array.isArray(fillPackage.mappings) ? fillPackage.mappings : []
  for (const [index, mapping] of mappings.entries()) {
    const row = document.createElement('div')
    row.className = 'a1-jobs-extension__field-row'
    const label = document.createElement('span')
    label.textContent = mapping.label || mapping.targetKey || mapping.fieldId || `Field ${index + 1}`
    const value = document.createElement('small')
    value.textContent = mapping.needsReview
      ? 'Needs review'
      : mapping.value == null || String(mapping.value) === ''
        ? 'No value'
        : String(mapping.value).slice(0, 80)
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = mapping.needsReview || mapping.value == null || String(mapping.value) === '' ? 'Review' : 'Fill'
    button.disabled = Boolean(mapping.needsReview || mapping.value == null || String(mapping.value) === '')
    button.addEventListener('click', () => fillSingleField(mapping))
    row.append(label, value, button)
    fieldMappings.append(row)
  }
}

async function fillCommonValue(label, value) {
  setResult(`Filling ${label}...`)
  try {
    const tab = await activeTab()
    const result = await execute(
      tab.id,
      ['content/scan.js', 'content/fill.js'],
      (nextValue) => window.a1JobsFillFocusedValue(nextValue),
      [value],
    )
    setResult(result)
  } catch (error) {
    setResult(error.message)
  }
}

async function fillSingleField(mapping) {
  fillButton.disabled = true
  setResult(`Filling ${mapping.label || mapping.targetKey || 'field'}...`)
  try {
    const fillPackage = await resolveAttachments(currentFillPackage())
    const tab = await activeTab()
    const result = await execute(
      tab.id,
      ['content/scan.js', 'content/fill.js'],
      (nextMapping, nextPackage) => window.a1JobsFillField(nextMapping, nextPackage),
      [mapping, fillPackage],
    )
    setResult(result)
  } catch (error) {
    setResult(error.message)
  } finally {
    fillButton.disabled = false
  }
}

async function copyOutput(output, message) {
  await navigator.clipboard.writeText(output.value)
  setResult(message)
}

for (const tab of tabs) {
  tab.addEventListener('click', () => setActiveTab(tab.dataset.tab))
  tab.addEventListener('keydown', onTabKeyDown)
}
jobButton.addEventListener('click', readJobPage)
copyJobButton.addEventListener('click', () => copyOutput(jobOutput, 'Job page JSON copied.'))
sendJobButton?.addEventListener('click', sendJobPage)
scanButton.addEventListener('click', scanForm)
copyScanButton.addEventListener('click', () => copyOutput(formScanOutput, 'Form scan JSON copied.'))
sendScanButton?.addEventListener('click', sendFormScan)
linkedinButton.addEventListener('click', scanLinkedIn)
linkedinJobButton.addEventListener('click', addSelectedLinkedInJob)
copyLinkedInButton.addEventListener('click', () => copyOutput(linkedinOutput, 'LinkedIn scan JSON copied.'))
sendLinkedInButton?.addEventListener('click', sendLinkedInScan)
fillButton.addEventListener('click', fillForm)
fillInput.addEventListener('input', renderFieldMappings)
renderFieldMappings()
setActiveTab('form')
