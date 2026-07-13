import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Banner,
  BarChart,
  Button,
  ButtonContainer,
  Card,
  Code,
  DataTable,
  Dialog,
  Divider,
  Grid,
  Heading,
  IconButton,
  Link,
  LineChart,
  MessageBadge,
  MessageEmptyState,
  Menu,
  MenuItem,
  PageLayout,
  PieChart,
  Paragraph,
  Section,
  SelectField,
  SankeyChart,
  Snackbar,
  Stack,
  Stat,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  TextareaField,
  TopHeader,
} from '@gtivr4/a1-design-system-react'
import { useAuth } from './lib/AuthContext.jsx'
import {
  createApplication,
  createContact,
  createEvent,
  createFormFillSession,
  exportDocumentPdf,
  exportResumePdf,
  getProfile,
  listApplications,
  listRelated,
  logAiRun,
  removeApplication,
  removeAccount,
  saveProfile,
  subscribeJobs,
  updateApplication,
  upsertAccount,
  upsertDocument,
} from './lib/jobStore.js'
import {
  checkLocalCodexBridge,
  localCodexBridgeHost,
  runJobsCodexTask,
  setLocalCodexBridgeHost,
} from './lib/localCodex.js'
import { PERSONAL_PROFILE_DEFAULTS } from './lib/personalProfile.js'

const STATUS_OPTIONS = [
  ['lead', 'Lead'],
  ['researching', 'Researching'],
  ['drafting', 'Drafting'],
  ['ready', 'Ready'],
  ['applied', 'Applied'],
  ['not_qualified', 'Do not qualify'],
  ['screen', 'Screen'],
  ['interview', 'Interview'],
  ['offer', 'Offer'],
  ['rejected', 'Rejected'],
  ['archived', 'Archived'],
]

const ROLE_TRACK_OPTIONS = [
  ['unknown', 'Unknown'],
  ['ic', 'IC'],
  ['manager', 'Manager'],
  ['hybrid', 'Hybrid'],
]

const ROLE_LEVEL_OPTIONS = [
  ['unknown', 'Unknown'],
  ['intern', 'Intern'],
  ['associate', 'Associate'],
  ['mid', 'Mid'],
  ['senior', 'Senior'],
  ['staff', 'Staff'],
  ['principal', 'Principal'],
  ['lead', 'Lead'],
  ['director', 'Director'],
  ['vp', 'VP'],
  ['executive', 'Executive'],
]

const A1_FORM_DEFAULTS = {
  sponsorship: 'No',
  workAuthorization: 'Yes',
  gender: 'Male',
  race: 'White',
  veteran: 'No',
  disability: 'No',
}

const EXTENSION_PAYLOAD_KEY = 'a1-jobs-extension-payload'
const EXTENSION_STATUS_KEY = 'a1-jobs-extension-status'
const DASHBOARD_FILTERS_KEY = 'a1-jobs-dashboard-filters'
const DASHBOARD_DEFAULT_FILTERS = { status: ['Ready', 'Researching'] }
const EXTENSION_JOB_TEXT_LIMIT = 45000
const EXTENSION_DETAIL_TEXT_LIMIT = 12000
const EXTENSION_ITEM_TEXT_LIMIT = 800
const EXTENSION_ITEM_LIMIT = 40

function readStoredExtensionPayload() {
  try {
    const raw = window.localStorage.getItem(EXTENSION_PAYLOAD_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeExtensionStatus(status) {
  try {
    window.localStorage.setItem(EXTENSION_STATUS_KEY, JSON.stringify({
      ...status,
      updatedAt: new Date().toISOString(),
    }))
  } catch {
    /* ignore */
  }
}

function clearStoredExtensionPayload() {
  try {
    window.localStorage.removeItem(EXTENSION_PAYLOAD_KEY)
  } catch {
    /* ignore */
  }
}

function clearStoredExtensionImport() {
  try {
    window.localStorage.removeItem(EXTENSION_PAYLOAD_KEY)
    window.localStorage.removeItem(EXTENSION_STATUS_KEY)
  } catch {
    /* ignore */
  }
}

function readDashboardFilters() {
  try {
    const raw = window.sessionStorage.getItem(DASHBOARD_FILTERS_KEY)
    if (!raw) return DASHBOARD_DEFAULT_FILTERS
    const stored = JSON.parse(raw)
    return stored && typeof stored === 'object'
      ? { ...DASHBOARD_DEFAULT_FILTERS, ...stored }
      : DASHBOARD_DEFAULT_FILTERS
  } catch {
    return DASHBOARD_DEFAULT_FILTERS
  }
}

function writeDashboardFilters(filters) {
  try {
    window.sessionStorage.setItem(DASHBOARD_FILTERS_KEY, JSON.stringify(filters))
  } catch {
    /* ignore unavailable session storage */
  }
}

function extensionPayloadIsStale(payload, maxAgeMs = 10 * 60 * 1000) {
  const sentAt = Date.parse(payload?.sentAt || '')
  return Number.isFinite(sentAt) && Date.now() - sentAt > maxAgeMs
}

function clipText(value, maxLength = EXTENSION_ITEM_TEXT_LIMIT) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function compactValue(value) {
  if (typeof value === 'string') return clipText(value)
  if (Array.isArray(value)) return value.slice(0, EXTENSION_ITEM_LIMIT).map(compactValue)
  if (!value || typeof value !== 'object') return value ?? ''
  return Object.fromEntries(Object.entries(value).map(([key, nextValue]) => [key, compactValue(nextValue)]))
}

function compactList(items, maxItems = EXTENSION_ITEM_LIMIT) {
  return Array.isArray(items) ? items.slice(0, maxItems).map(compactValue) : []
}

function compactExtensionJobPage(jobPage = {}) {
  const details = jobPage.pageDetails ?? {}
  const jobDescription = clipText(jobPage.jobDescription || jobPage.text, EXTENSION_JOB_TEXT_LIMIT)
  return {
    schemaVersion: jobPage.schemaVersion ?? 1,
    source: jobPage.source || 'browser-extension-job-page',
    url: jobPage.url || '',
    canonicalUrl: jobPage.canonicalUrl || '',
    pageTitle: clipText(jobPage.pageTitle, 240),
    title: clipText(jobPage.title, 240),
    company: clipText(jobPage.company, 240),
    location: clipText(jobPage.location, 240),
    salaryRange: clipText(jobPage.salaryRange, 240),
    jobDescription,
    text: jobDescription,
    pageDetails: {
      meta: compactList(details.meta),
      headings: compactList(details.headings),
      links: compactList(details.links),
      buttons: compactList(details.buttons),
      formFields: compactList(details.formFields),
      focusedText: clipText(details.focusedText, EXTENSION_DETAIL_TEXT_LIMIT),
      fullText: clipText(details.fullText, EXTENSION_DETAIL_TEXT_LIMIT),
    },
    applyLinks: compactList(jobPage.applyLinks, 8),
    structuredJobPosting: compactValue(jobPage.structuredJobPosting ?? {}),
    scannedAt: jobPage.scannedAt || '',
  }
}

function routeFromLocation() {
  const path = window.location.pathname.replace(/^\/|\/$/g, '')
  if (!path) return { page: 'dashboard' }
  if (path === 'settings') return { page: 'settings' }
  if (path === 'analytics') return { page: 'analytics' }
  if (path === 'intake') return { page: 'intake' }
  if (path.startsWith('applications/')) return { page: 'application', id: path.split('/')[1] }
  return { page: 'dashboard' }
}

function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function statusLabel(status) {
  return STATUS_OPTIONS.find(([value]) => value === status)?.[1] ?? status
}

function statusTone(status) {
  if (status === 'offer' || status === 'applied') return 'success'
  if (status === 'interview' || status === 'screen') return 'warn'
  if (status === 'rejected' || status === 'not_qualified' || status === 'archived') return 'neutral'
  return 'info'
}

function applicationDateTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const datePart = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
  const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(' AM', ' am')
    .replace(' PM', ' pm')
  return `${datePart} ${timePart}`
}

function foldedText(value) {
  return String(value || '').toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function fieldText(field) {
  return foldedText([
    field?.label,
    field?.placeholder,
    field?.name,
    field?.id,
    field?.autocomplete,
  ].filter(Boolean).join(' '))
}

function optionText(option) {
  return foldedText([option?.label, option?.value].filter(Boolean).join(' '))
}

function optionFor(field, candidates) {
  const options = Array.isArray(field?.options) ? field.options : []
  for (const candidate of candidates) {
    const folded = foldedText(candidate)
    const exact = options.find((option) => optionText(option) === folded)
    if (exact) return exact.value || exact.label
  }
  for (const candidate of candidates) {
    const folded = foldedText(candidate)
    const contains = options.find((option) => {
      const text = optionText(option)
      return text.includes(folded) || folded.includes(text)
    })
    if (contains) return contains.value || contains.label
  }
  return candidates[0] || ''
}

function defaultFormAnswer(field) {
  const text = fieldText(field)
  if (/sponsor|visa|h[-\s]?1b|immigration/.test(text)) {
    return { targetKey: 'workAuthorization.sponsorship', value: optionFor(field, ['No', 'No, I do not require sponsorship']), reason: 'A1 Jobs default: no sponsorship required.' }
  }
  if (/authorized|eligible/.test(text) && /work/.test(text)) {
    return { targetKey: 'workAuthorization.authorized', value: optionFor(field, ['Yes', 'Yes, I am authorized to work']), reason: 'A1 Jobs default: authorized to work.' }
  }
  if (/gender|sex/.test(text)) {
    return { targetKey: 'eeo.gender', value: optionFor(field, [A1_FORM_DEFAULTS.gender, 'Man', 'Male']), reason: 'A1 Jobs EEO default.' }
  }
  if (/race|ethnic|hispanic|latino/.test(text)) {
    return { targetKey: 'eeo.race', value: optionFor(field, [A1_FORM_DEFAULTS.race, 'White (Not Hispanic or Latino)', 'White']), reason: 'A1 Jobs EEO default.' }
  }
  if (/veteran|military/.test(text)) {
    return { targetKey: 'eeo.veteran', value: optionFor(field, ['No', 'I am not a protected veteran', 'Not a veteran', 'None']), reason: 'A1 Jobs EEO default.' }
  }
  if (/disabil/.test(text)) {
    return { targetKey: 'eeo.disability', value: optionFor(field, ['No', 'No, I do not have a disability and have not had one in the past', 'I do not have a disability', 'None']), reason: 'A1 Jobs EEO default.' }
  }
  return null
}

function attachmentTargetForField(field) {
  const text = fieldText(field)
  if (field?.type !== 'file') return null
  if (/cover/.test(text)) return 'cover_letter'
  if (/resume|cv|curriculum/.test(text)) return 'resume'
  return null
}

function mergeLocalFormMappings(scan, mappings) {
  const byFieldId = new Map((mappings ?? []).map((mapping) => [mapping.fieldId, mapping]))
  for (const field of scan?.fields ?? []) {
    const fileTarget = attachmentTargetForField(field)
    if (fileTarget) {
      byFieldId.set(field.fieldId, {
        fieldId: field.fieldId,
        selector: field.selector,
        label: field.label,
        targetKey: `attachment.${fileTarget}`,
        value: fileTarget,
        confidence: 1,
        needsReview: false,
        reason: `Attach generated ${fileTarget === 'resume' ? 'resume' : 'cover letter'} PDF.`,
      })
      continue
    }
    const defaultAnswer = defaultFormAnswer(field)
    if (!defaultAnswer) continue
    byFieldId.set(field.fieldId, {
      fieldId: field.fieldId,
      selector: field.selector,
      label: field.label,
      confidence: 1,
      needsReview: false,
      ...defaultAnswer,
    })
  }
  return Array.from(byFieldId.values())
}

function optionLabel(options, value) {
  return options.find(([nextValue]) => nextValue === value)?.[1] ?? value ?? ''
}

function roleMetaFromText(text) {
  const value = String(text || '').toLowerCase()
  let level = 'unknown'
  if (/\b(c[-\s]?suite|chief|executive)\b/.test(value)) level = 'executive'
  else if (/\b(vp|vice president)\b/.test(value)) level = 'vp'
  else if (/\b(director|head of)\b/.test(value)) level = 'director'
  else if (/\blead\b/.test(value)) level = 'lead'
  else if (/\bprincipal\b/.test(value)) level = 'principal'
  else if (/\bstaff\b/.test(value)) level = 'staff'
  else if (/\bsenior|sr\.\b|\bsr\b/.test(value)) level = 'senior'
  else if (/\bassociate|junior|jr\.\b|\bjr\b/.test(value)) level = 'associate'
  else if (/\bintern|internship\b/.test(value)) level = 'intern'
  else if (value.trim()) level = 'mid'

  let track = 'ic'
  if (/\b(manager|director|head of|vp|vice president|chief|people manager|management)\b/.test(value)) track = 'manager'
  if (/\bplayer[-\s]?coach|design lead|team lead|lead designer\b/.test(value)) track = 'hybrid'
  if (!value.trim()) track = 'unknown'

  return { track, level, hiringManager: '' }
}

function normalizeRoleMeta(meta, fallbackText = '') {
  const inferred = roleMetaFromText(fallbackText)
  return {
    track: meta?.track || inferred.track,
    level: meta?.level || inferred.level,
    hiringManager: meta?.hiringManager || meta?.manager || '',
  }
}

function roleMetaForApplication(application) {
  return normalizeRoleMeta(
    application?.summary?.roleMeta,
    [application?.title, application?.jobDescription].filter(Boolean).join(' '),
  )
}

function roleMetaForParsedJob(form, result = {}, fetched = {}) {
  const position = result.position ?? {}
  return normalizeRoleMeta(
    form?.summary?.roleMeta,
    [
      position.title,
      position.seniority,
      form?.title,
      fetched.title,
      form?.jobDescription,
      fetched.text,
    ].filter(Boolean).join(' '),
  )
}

function normalizeProfile(profile) {
  return {
    fullName: profile?.full_name ?? PERSONAL_PROFILE_DEFAULTS.fullName,
    email: profile?.email ?? PERSONAL_PROFILE_DEFAULTS.email,
    phone: profile?.phone ?? '',
    location: profile?.location ?? PERSONAL_PROFILE_DEFAULTS.location,
    linkedinUrl: profile?.linkedin_url ?? PERSONAL_PROFILE_DEFAULTS.linkedinUrl,
    portfolioUrl: profile?.portfolio_url ?? PERSONAL_PROFILE_DEFAULTS.portfolioUrl,
    a1Url: profile?.a1_url ?? PERSONAL_PROFILE_DEFAULTS.a1Url,
    baseResume: profile?.base_resume?.text ? profile.base_resume : PERSONAL_PROFILE_DEFAULTS.baseResume,
    preferences: profile?.preferences ?? PERSONAL_PROFILE_DEFAULTS.preferences,
  }
}

function candidatePayload(profile) {
  const normalized = normalizeProfile(profile)
  return {
    ...normalized,
    baseResumeText: normalized.baseResume?.text ?? '',
  }
}

function applicationPayload(application) {
  if (!application) return null
  return {
    title: application.title,
    company: application.company,
    status: application.status,
    sourceSite: application.sourceSite,
    sourceUrl: application.sourceUrl,
    applicationUrl: application.applicationUrl,
    jobDescription: application.jobDescription,
    location: application.location,
    workMode: application.workMode,
    salaryRange: application.salaryRange,
    summary: application.summary,
    notes: application.notes,
  }
}

function hostFromUrl(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function linkedinCompanySearchUrl(company) {
  return `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(company || '')}`
}

function originalJobUrl(application) {
  return application.sourceUrl || application.applicationUrl || application.summary?.fetched?.finalUrl || application.summary?.fetched?.url || ''
}

function duplicateKeyForUrl(value) {
  try {
    const url = new URL(value)
    const nestedUrl = url.searchParams.get('url')
    if (nestedUrl) return duplicateKeyForUrl(nestedUrl)
    url.hash = ''
    for (const key of Array.from(url.searchParams.keys())) {
      if (key.startsWith('utm_') || ['gh_src', 'source', 'src', 'ref', 'referrer'].includes(key)) {
        url.searchParams.delete(key)
      }
    }
    url.hostname = url.hostname.toLowerCase()
    const text = url.toString()
    return text.endsWith('/') ? text.slice(0, -1) : text
  } catch {
    return String(value || '').trim()
  }
}

function jobIdentifierKeys(value) {
  try {
    const url = new URL(value)
    const keys = []
    const currentJobId = url.searchParams.get('currentJobId')
    const viewId = url.pathname.match(/\/jobs\/view\/([^/]+)/i)?.[1]
    if (currentJobId) keys.push(`linkedin-job:${currentJobId}`)
    if (viewId) keys.push(`linkedin-job:${viewId}`)
    return keys
  } catch {
    return []
  }
}

function normalizedJobIdentity(value) {
  return foldedText(value).replace(/\b(the|a|an)\b/g, ' ').replace(/\s+/g, ' ').trim()
}

function identityDuplicate(application, form) {
  const applicationIds = duplicateKeysForApplication(application).flatMap(jobIdentifierKeys)
  const formIds = [form.sourceUrl, form.applicationUrl, form.source_url, form.application_url]
    .filter(Boolean)
    .flatMap(jobIdentifierKeys)
  if (applicationIds.some((key) => formIds.includes(key))) return true

  const existingCompany = normalizedJobIdentity(application.company)
  const incomingCompany = normalizedJobIdentity(form.company)
  const existingTitle = normalizedJobIdentity(application.title)
  const incomingTitle = normalizedJobIdentity(form.title)
  if (!existingCompany || !incomingCompany || existingCompany !== incomingCompany || !existingTitle || !incomingTitle) return false
  if (existingTitle === incomingTitle) return true
  const existingTokens = new Set(existingTitle.split(' ').filter((token) => token.length > 2))
  const incomingTokens = new Set(incomingTitle.split(' ').filter((token) => token.length > 2))
  const overlap = [...existingTokens].filter((token) => incomingTokens.has(token)).length
  return overlap >= 2 && overlap / Math.min(existingTokens.size, incomingTokens.size) >= 0.75
}

function duplicateKeysForApplication(application) {
  return [
    application.sourceUrl,
    application.applicationUrl,
    application.source_url,
    application.application_url,
  ].filter(Boolean).map(duplicateKeyForUrl)
}

function findDuplicateApplication(applications, form) {
  const keys = [
    form.sourceUrl,
    form.applicationUrl,
    form.source_url,
    form.application_url,
  ].filter(Boolean).map(duplicateKeyForUrl)
  if (!keys.length) return applications.find((application) => identityDuplicate(application, form)) ?? null
  return applications.find((application) => (
    duplicateKeysForApplication(application).some((key) => keys.includes(key))
    || identityDuplicate(application, form)
  )) ?? null
}

function smartJobErrorMessage(error, fallback) {
  const message = error?.message || 'Something went wrong.'
  if (message.startsWith('BODY_TOO_LARGE')) {
    return 'The scraped page was too large to process. Reload the extension, scan the page again, or use advanced intake with the visible job description.'
  }
  if (message.includes('A1 Codex bridge')) return message
  if (message.includes('invalid_json_schema') || message.includes('response_format') || message.includes('CODEX_')) return message
  return `${message}. ${fallback}`
}

function shouldCreateManualExtensionCheck(error) {
  const message = error?.message || ''
  if (/^JOB_URL_/.test(message)) return true
  return /blocked|forbidden|not found|gone|expired|filled|closed|unavailable|no readable/i.test(message)
}

function postingLooksUnavailable(fetched = {}, result = {}) {
  const text = [
    fetched.text,
    fetched.title,
    result.summary,
    ...(result.warnings ?? []),
    ...(result.nextActions ?? []),
  ].filter(Boolean).join(' ')
  return /no longer accepting applications|job (is )?no longer available|position (has been )?filled|job (has been )?filled|role (has been )?filled|this position is closed|this job is closed|posting (has )?expired|job posting (has )?expired|this job (has )?expired|not accepting applications/i.test(text)
}

function manualExtensionCheckContent(url, reason) {
  return [
    '# Manual extension check needed',
    '',
    `Posting: ${url}`,
    `Reason: ${reason}`,
    '',
    '## Next step',
    'Open the posting in Chrome, then use the A1 Jobs extension Job Page tab to send the rendered page into A1 Jobs.',
    '',
    'If the page says the role is filled, closed, or unavailable, archive this lead.',
  ].join('\n')
}

function mergeParsedJob(current, result, fetched = {}) {
  const finalUrl = fetched.finalUrl || fetched.url || current.applicationUrl || current.sourceUrl
  return {
    ...current,
    title: result.position?.title || current.title || fetched.title || '',
    company: result.position?.company || result.company?.name || current.company || fetched.company || '',
    sourceSite: current.sourceSite || hostFromUrl(finalUrl),
    sourceUrl: current.sourceUrl || finalUrl,
    applicationUrl: current.applicationUrl || finalUrl,
    jobDescription: current.jobDescription || fetched.text || '',
    location: result.position?.location || current.location || fetched.location || '',
    workMode: result.position?.workMode || current.workMode || '',
    salaryRange: result.position?.salaryRange || current.salaryRange || fetched.salaryRange || '',
    summary: {
      ...(current.summary ?? {}),
      roleMeta: roleMetaForParsedJob(current, result, fetched),
      importSummary: result.summary,
      warnings: result.warnings,
      nextActions: result.nextActions,
      fetched: {
        url: fetched.url,
        finalUrl: fetched.finalUrl,
        status: fetched.status,
        title: fetched.title,
      },
    },
  }
}

function markdownList(items) {
  return (items ?? []).filter(Boolean).map((item) => `- ${item}`).join('\n')
}

function positionOverviewContent(application, result = {}, fetched = {}) {
  const position = result.position ?? {}
  return [
    `# ${application.title || position.title || fetched.title || 'Position overview'}`,
    application.company || position.company || fetched.company ? `Company: ${application.company || position.company || fetched.company}` : '',
    application.location || position.location || fetched.location ? `Location: ${application.location || position.location || fetched.location}` : '',
    application.salaryRange || position.salaryRange || fetched.salaryRange ? `Salary: ${application.salaryRange || position.salaryRange || fetched.salaryRange}` : '',
    fetched.finalUrl ? `Posting: ${fetched.finalUrl}` : '',
    result.summary ? `## Summary\n${result.summary}` : '',
    position.requirements?.length ? `## Requirements\n${markdownList(position.requirements)}` : '',
    position.responsibilities?.length ? `## Responsibilities\n${markdownList(position.responsibilities)}` : '',
    position.keywords?.length ? `## Keywords\n${markdownList(position.keywords)}` : '',
    result.nextActions?.length ? `## Next actions\n${markdownList(result.nextActions)}` : '',
    result.warnings?.length ? `## Review notes\n${markdownList(result.warnings)}` : '',
  ].filter(Boolean).join('\n\n')
}

async function copyText(text) {
  await navigator.clipboard.writeText(text)
}

function isErrorFeedback(feedback) {
  return feedback?.tone === 'error'
}

function FeedbackSnackbar({ feedback, onClose, persistent = false }) {
  if (!feedback || isErrorFeedback(feedback)) return null
  return (
    <Snackbar
      open
      position="bottom-right"
      onClose={onClose}
      autoHideDuration={persistent ? 0 : 5000}
    >
      {feedback.message}
    </Snackbar>
  )
}

async function functionJson(path, token, body) {
  const res = await fetch(`/api/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

async function createManualCheckApplicationFromUrl({ user, form, reason }) {
  const url = form.applicationUrl || form.sourceUrl
  const host = hostFromUrl(url)
  const existingApplications = await listApplications(user)
  const duplicate = findDuplicateApplication(existingApplications, {
    sourceUrl: url,
    applicationUrl: url,
  })
  if (duplicate) return { application: duplicate, duplicate: true, manualCheck: true }

  const application = await createApplication(user, {
    ...form,
    title: form.title || 'Manual check needed',
    company: form.company || host || 'Unknown company',
    status: 'researching',
    priority: 'medium',
    sourceSite: form.sourceSite || host,
    sourceUrl: url,
    applicationUrl: url,
    nextAction: 'Open the posting and use the extension Job Page tab.',
    notes: `Automatic URL read failed: ${reason}`,
    summary: {
      ...(form.summary ?? {}),
      manualCheck: {
        reason,
        url,
        needsExtension: true,
        createdAt: new Date().toISOString(),
      },
    },
  })
  await createEvent(user, {
    applicationId: application.id,
    kind: 'manual_check',
    label: 'Manual extension check needed',
    notes: `Automatic URL read failed: ${reason}. Open the posting in Chrome and use the extension Job Page tab.`,
    meta: { url, reason, needsExtension: true },
  })
  await upsertDocument(user, {
    applicationId: application.id,
    kind: 'overview',
    title: 'Manual extension check',
    content: manualExtensionCheckContent(url, reason),
  })
  return { application, duplicate: false, manualCheck: true }
}

async function createApplicationFromParsedJob({
  user,
  profile,
  form,
  result,
  fetched,
  createdLabel,
  packageLabel,
  existingApplication,
  onProgress,
  onApplicationCreated,
  onApplicationUpdated,
}) {
  const progress = (message, tone = 'info') => onProgress?.({ tone, message })
  const nextForm = {
    ...mergeParsedJob(form, result, fetched),
    status: 'researching',
  }
  let application = existingApplication
  if (application) {
    progress('Parsed the job. Updating the A1 Jobs listing...')
    application = await updateApplication(user, application.id, nextForm)
    await createEvent(user, {
      applicationId: application.id,
      kind: 'parsed',
      label: 'Job details parsed',
      meta: { sourceUrl: fetched?.finalUrl || fetched?.url || form.sourceUrl || form.applicationUrl },
    })
    onApplicationUpdated?.(application)
  } else {
    progress('Parsed the job. Creating the A1 Jobs listing...')
    application = await createApplication(user, nextForm)
    await createEvent(user, {
      applicationId: application.id,
      kind: 'created',
      label: createdLabel,
      meta: { sourceUrl: fetched?.finalUrl || fetched?.url || form.sourceUrl || form.applicationUrl },
    })
    onApplicationCreated?.(application)
  }

  try {
    progress('Job listing saved. Saving the position overview...')
    await upsertDocument(user, {
      applicationId: application.id,
      kind: 'overview',
      title: 'Position overview',
      content: positionOverviewContent(nextForm, result, fetched),
    })

    progress('Position overview saved. Generating the tailored resume and cover letter...')
    const packageResponse = await runJobsCodexTask('/codex/jobs/draft-application', {
      candidate: candidatePayload(profile),
      application: applicationPayload({ ...application, ...nextForm }),
    })
    const packageResult = packageResponse.result ?? {}
    progress('Codex finished the package. Saving generated documents...')
    const docs = [
      ['resume', 'Tailored resume', packageResult.resume],
      ['cover_letter', 'Cover letter', packageResult.coverLetter],
      ['portfolio_note', 'Portfolio note', packageResult.portfolioNote],
      ['a1_note', 'A1 link note', packageResult.a1Note],
    ].filter(([, , content]) => content)
    for (const [kind, title, content] of docs) {
      progress(`Saving ${title}...`)
      await upsertDocument(user, { applicationId: application.id, kind, title, content })
    }
    progress('Generated documents saved. Marking the application ready...')
    application = await updateApplication(user, application.id, {
      status: 'ready',
      fitScore: packageResult.fitScore,
      summary: {
        ...(nextForm.summary ?? {}),
        packageSummary: packageResult.summary,
        packageWarnings: packageResult.warnings,
        packageNextActions: packageResult.nextActions,
      },
    })
    onApplicationUpdated?.(application)
    await createEvent(user, {
      applicationId: application.id,
      kind: 'package',
      label: packageLabel,
    })
    await logAiRun(user, { applicationId: application.id, task: 'draft-application', result: packageResult, usage: packageResponse.usage })
  } catch (packageError) {
    progress('The job listing was created, but the package needs manual retry.', 'warn')
    application = await updateApplication(user, application.id, {
      status: 'drafting',
      nextAction: 'Generate application package',
      summary: {
        ...(nextForm.summary ?? {}),
        packageError: packageError.message,
      },
    })
    onApplicationUpdated?.(application)
    await createEvent(user, {
      applicationId: application.id,
      kind: 'note',
      label: 'Automatic package generation needs review',
      notes: packageError.message,
    })
  }

  return { application, duplicate: false }
}

async function generateExistingApplicationPackage({ user, profile, application, onProgress }) {
  onProgress?.(`Drafting ${application.title} at ${application.company} with A1 Codex.`)
  const response = await runJobsCodexTask('/codex/jobs/draft-application', {
    candidate: candidatePayload(profile),
    application: applicationPayload(application),
  })
  const result = response.result ?? {}
  const docs = [
    ['overview', 'Position overview', positionOverviewContent(application, result)],
    ['resume', 'Tailored resume', result.resume],
    ['cover_letter', 'Cover letter', result.coverLetter],
    ['portfolio_note', 'Portfolio note', result.portfolioNote],
    ['a1_note', 'A1 link note', result.a1Note],
  ].filter(([, , content]) => content)
  for (const [kind, title, content] of docs) {
    onProgress?.(`Saving ${title} for ${application.company}.`)
    await upsertDocument(user, { applicationId: application.id, kind, title, content })
  }
  const resume = docs.find(([kind]) => kind === 'resume')
  if (resume) await exportResumePdf({ content: resume[2], title: resume[1], company: application.company })
  const coverLetter = docs.find(([kind]) => kind === 'cover_letter')
  if (coverLetter) await exportDocumentPdf({ content: coverLetter[2], title: coverLetter[1], company: application.company, kind: 'cover-letter' })
  const updated = await updateApplication(user, application.id, {
    status: 'ready',
    fitScore: result.fitScore,
    summary: { ...(application.summary ?? {}), packageSummary: result.summary, warnings: result.warnings, nextActions: result.nextActions },
  })
  await createEvent(user, { applicationId: application.id, kind: 'package', label: 'Application package generated' })
  await logAiRun(user, { applicationId: application.id, task: 'draft-application', result, usage: response.usage })
  return updated
}

async function createSmartApplicationFromUrl({ user, profile, form }) {
  const url = form.applicationUrl || form.sourceUrl
  if (!url) throw new Error('Enter a job or application URL first.')

  const existingApplications = await listApplications(user)
  const duplicate = findDuplicateApplication(existingApplications, form)
  if (duplicate) return { application: duplicate, duplicate: true }

  let response
  try {
    response = await runJobsCodexTask('/codex/jobs/import-job-url', {
      url,
      job: form,
      candidate: candidatePayload(profile),
    })
  } catch (error) {
    if (shouldCreateManualExtensionCheck(error)) {
      return createManualCheckApplicationFromUrl({ user, form, reason: error.message })
    }
    throw error
  }
  const result = response.result ?? {}
  const fetched = response.fetched ?? {}
  if (postingLooksUnavailable(fetched, result)) {
    return createManualCheckApplicationFromUrl({
      user,
      form,
      reason: 'The posting appears filled, closed, expired, or unavailable.',
    })
  }
  const fetchedDuplicate = findDuplicateApplication(existingApplications, {
    sourceUrl: fetched.finalUrl || fetched.url,
    applicationUrl: fetched.finalUrl || fetched.url,
    title: result.position?.title || result.title || form.title,
    company: result.position?.company || result.company?.name || form.company,
  })
  if (fetchedDuplicate) return { application: fetchedDuplicate, duplicate: true }

  const created = await createApplicationFromParsedJob({
    user,
    profile,
    form,
    result,
    fetched,
    createdLabel: 'Application lead created from URL',
    packageLabel: 'Application package generated from URL',
  })
  await logAiRun(user, { applicationId: created.application.id, task: 'import-job-url', result, usage: response.usage })
  return created
}

function extensionJobTitle(jobPage = {}) {
  const pageTitle = String(jobPage.pageTitle || '')
    .replace(/\s*\|\s*LinkedIn.*$/i, '')
    .trim()
  const candidates = [
    jobPage.structuredJobPosting?.title,
    jobPage.title,
    pageTitle,
    ...(jobPage.pageDetails?.headings ?? []).filter((heading) => heading.level === 'h1').map((heading) => heading.text),
  ]
  return candidates
    .map((value) => String(value || '').trim())
    .find((value) => value && !/top job picks|search results|^linkedin jobs?$|^jobs?$/i.test(value)) || ''
}

function formFromExtensionJobPage(jobPage = {}) {
  const structured = jobPage.structuredJobPosting ?? {}
  const applyLink = jobPage.applyLinks?.[0] ?? {}
  const applyUrl = applyLink.resolvedHref || applyLink.href || jobPage.url || ''
  const pageUrl = jobPage.canonicalUrl || jobPage.url || applyUrl
  const text = jobPage.jobDescription || jobPage.text || ''
  return {
    title: extensionJobTitle(jobPage),
    company: structured.company || jobPage.company || '',
    sourceSite: hostFromUrl(pageUrl),
    sourceUrl: pageUrl,
    applicationUrl: applyUrl,
    jobDescription: text,
    location: structured.location || jobPage.location || '',
    workMode: '',
    salaryRange: structured.salaryRange || jobPage.salaryRange || '',
    summary: {
      extensionImport: {
        scannedAt: jobPage.scannedAt,
        pageTitle: jobPage.pageTitle || jobPage.title,
        textLength: text.length,
        structuredDataFound: Boolean(Object.keys(structured).length),
        applyLink: {
          sourceUrl: applyLink.originalHref || applyLink.href || '',
          applicationUrl: applyUrl,
        },
      },
      roleMeta: roleMetaFromText([structured.title, jobPage.title, text].filter(Boolean).join(' ')),
    },
  }
}

async function createSmartApplicationFromExtensionJobPage({
  user,
  profile,
  jobPage,
  onProgress,
  onApplicationCreated,
  onApplicationUpdated,
}) {
  onProgress?.({ tone: 'info', message: 'Preparing the scraped page details for Codex...' })
  const compactJobPage = compactExtensionJobPage(jobPage)
  const form = formFromExtensionJobPage(compactJobPage)
  if (!form.sourceUrl && !form.jobDescription) throw new Error('The extension did not send a readable job page.')

  const existingApplications = await listApplications(user)
  let duplicate = findDuplicateApplication(existingApplications, form)
  if (duplicate) {
    onProgress?.({ tone: 'warn', message: 'This job already exists. Opening the existing job page...' })
    return { application: duplicate, duplicate: true }
  }

  try {
    onProgress?.({ tone: 'info', message: 'Checking the parsed LinkedIn role against existing applications...' })
    const duplicateCheck = await runJobsCodexTask('/codex/jobs/parse-job', {
      job: { ...form, browserPage: compactJobPage },
      candidate: candidatePayload(profile),
    })
    const parsedForm = mergeParsedJob(form, duplicateCheck.result ?? {}, {
      url: compactJobPage.url,
      finalUrl: compactJobPage.canonicalUrl || compactJobPage.url,
      title: compactJobPage.title || compactJobPage.pageTitle,
      company: compactJobPage.company,
      location: compactJobPage.location,
      salaryRange: compactJobPage.salaryRange,
    })
    duplicate = findDuplicateApplication(existingApplications, parsedForm)
    if (duplicate) {
      onProgress?.({ tone: 'warn', message: 'Codex matched this role to an existing application. Opening the existing job page...' })
      return { application: duplicate, duplicate: true }
    }
  } catch (error) {
    onProgress?.({ tone: 'warn', message: `Duplicate check needs review; continuing with import. ${error.message}` })
  }

  onProgress?.({ tone: 'info', message: 'Creating a provisional job listing from the scanned page...' })
  let application = await createApplication(user, {
    ...form,
    title: form.title || 'Imported job from extension',
    company: form.company || hostFromUrl(form.sourceUrl) || 'Unknown company',
    status: 'researching',
    nextAction: 'Parsing scanned job page and generating package',
  })
  await createEvent(user, {
    applicationId: application.id,
    kind: 'created',
    label: 'Application lead created from browser page',
    meta: { sourceUrl: form.sourceUrl || form.applicationUrl },
  })
  onApplicationCreated?.(application)

  onProgress?.({ tone: 'info', message: 'Parsing the scraped job page with the A1 Codex bridge...' })
  let response
  try {
    response = await runJobsCodexTask('/codex/jobs/parse-job', {
      job: {
        ...form,
        browserPage: compactJobPage,
      },
      candidate: candidatePayload(profile),
    })
  } catch (error) {
    application = await updateApplication(user, application.id, {
      status: 'drafting',
      nextAction: 'Retry parsing scanned job page',
      summary: {
        ...(form.summary ?? {}),
        extensionImportError: error.message,
      },
    })
    onApplicationUpdated?.(application)
    throw error
  }
  const result = response.result ?? {}
  const fetched = {
    url: compactJobPage.url,
    finalUrl: compactJobPage.canonicalUrl || compactJobPage.url,
    status: 'browser-extension',
    title: form.title || compactJobPage.title || compactJobPage.pageTitle,
    company: compactJobPage.company,
    location: compactJobPage.location,
    salaryRange: compactJobPage.salaryRange,
  }
  const created = await createApplicationFromParsedJob({
    user,
    profile,
    form,
    result,
    fetched,
    createdLabel: 'Application lead created from browser page',
    packageLabel: 'Application package generated from browser page',
    existingApplication: application,
    onProgress,
    onApplicationCreated,
    onApplicationUpdated,
  })
  onProgress?.({ tone: 'info', message: 'Recording the job-page parse run...' })
  await logAiRun(user, { applicationId: created.application.id, task: 'parse-job-from-browser-page', result, usage: response.usage })
  return created
}

function AppHeader({ route, user, onSignOut, onAddJob }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'space_dashboard',
      active: route.page === 'dashboard',
      onClick: (event) => { event.preventDefault(); navigate('/') },
    },
    {
      id: 'add-job',
      label: 'Add job',
      icon: 'add_circle',
      onClick: (event) => { event.preventDefault(); onAddJob() },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      active: route.page === 'settings',
      onClick: (event) => { event.preventDefault(); navigate('/settings') },
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'query_stats',
      active: route.page === 'analytics',
      onClick: (event) => { event.preventDefault(); navigate('/analytics') },
    },
  ]
  const actions = [
    {
      id: 'account',
      label: user.email,
      icon: 'account_circle',
      items: [
        { isHeader: true, label: 'A1 Jobs', description: user.email },
        { id: 'sign-out', label: 'Sign out', icon: 'logout', onClick: onSignOut },
      ],
    },
  ]

  return (
    <TopHeader
      logoText="A1 Jobs"
      logoHref="/"
      navItems={navItems}
      actions={actions}
      navIconPosition={{ xs: 'hidden', sm: 'above', lg: 'start' }}
      onClick={(event) => {
        if (event.target.closest?.('a')?.getAttribute('href') === '/') {
          event.preventDefault()
          navigate('/')
        }
      }}
    />
  )
}

function AppCard({ application }) {
  return (
    <Card variant="navigation" status={statusTone(application.status)} onClick={() => navigate(`/applications/${application.id}`)}>
      <Stack gap="sm">
        <Stack gap="none">
          <Heading as="h3" size="sm">{application.title}</Heading>
          <Paragraph size="sm" color="muted">{application.company}</Paragraph>
        </Stack>
        <Stack direction="row" gap="xs" wrap>
          <MessageBadge status={statusTone(application.status)}>{statusLabel(application.status)}</MessageBadge>
          {application.fitScore != null && <MessageBadge status="info" subtle>{application.fitScore}% fit</MessageBadge>}
        </Stack>
        {application.nextAction && <Paragraph size="sm">{application.nextAction}</Paragraph>}
      </Stack>
    </Card>
  )
}

function AddJobDialog({ open, onClose, user, profile, onCreated, onFeedback }) {
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (!open) {
      setUrl('')
      setBusy(false)
      setStatus(null)
    }
  }, [open])

  async function submit() {
    if (!url.trim()) {
      onFeedback?.({ tone: 'warn', message: 'Enter a job URL.' })
      return
    }
    setBusy(true)
    setStatus(null)
    try {
      const { application, duplicate } = await createSmartApplicationFromUrl({
        user,
        profile,
        form: {
          sourceUrl: url.trim(),
          applicationUrl: url.trim(),
        },
      })
      if (!duplicate) onCreated(application)
      onClose()
    } catch (error) {
      setStatus({ tone: 'error', message: smartJobErrorMessage(error, 'If the site blocks reading, use advanced intake and paste the job description.') })
    } finally {
      setBusy(false)
    }
  }

  function onKeyDown(event) {
    if (event.key === 'Enter') submit()
  }

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      title="Add job"
      size="sm"
      footer={(
        <>
          <Button variant="secondary" onClick={() => { onClose(); navigate('/intake') }}>Advanced intake</Button>
          <Button icon="auto_awesome" loading={busy} onClick={submit}>Start</Button>
        </>
      )}
    >
      <Stack gap="md">
        <Paragraph color="muted">Paste a job or application URL. A1 Jobs will read it, create the job page, and draft the package.</Paragraph>
        <TextField label="Job URL" type="url" autoFocus value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={onKeyDown} />
        {status && isErrorFeedback(status) && <Banner status={status.tone}>{status.message}</Banner>}
      </Stack>
    </Dialog>
  )
}

function Analytics({ applications }) {
  const analytics = useMemo(() => {
    const counts = Object.fromEntries(STATUS_OPTIONS.map(([value]) => [value, 0]))
    const sources = new Map()
    let fitTotal = 0
    let fitCount = 0
    let appliedDurationTotal = 0
    let appliedDurationCount = 0

    applications.forEach((application) => {
      counts[application.status] = (counts[application.status] || 0) + 1
      const source = hostFromUrl(application.sourceSite || application.sourceUrl) || application.sourceSite || 'Unknown'
      sources.set(source, (sources.get(source) || 0) + 1)
      if (application.fitScore != null) {
        fitTotal += application.fitScore
        fitCount += 1
      }
      if (application.appliedAt && application.createdAt) {
        const duration = Date.parse(application.appliedAt) - Date.parse(application.createdAt)
        if (Number.isFinite(duration) && duration >= 0) {
          appliedDurationTotal += duration
          appliedDurationCount += 1
        }
      }
    })

    const monthData = []
    const now = new Date()
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      monthData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        added: applications.filter((application) => {
          const created = new Date(application.createdAt)
          return `${created.getFullYear()}-${created.getMonth()}` === key
        }).length,
      })
    }

    const sourceData = [...sources.entries()]
      .sort(([, first], [, second]) => second - first)
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }))

    return {
      counts,
      statusData: STATUS_OPTIONS
        .map(([value, name]) => ({ name, value: counts[value] || 0 }))
        .filter((item) => item.value > 0),
      sourceData,
      monthData,
      fitAverage: fitCount ? Math.round(fitTotal / fitCount) : null,
      appliedAverageDays: appliedDurationCount
        ? Math.round(appliedDurationTotal / appliedDurationCount / 86400000)
        : null,
    }
  }, [applications])

  const pipelineData = [
    { stage: 'Ready', count: analytics.counts.ready || 0 },
    { stage: 'Applied', count: analytics.counts.applied || 0 },
    { stage: 'Screen', count: analytics.counts.screen || 0 },
    { stage: 'Interview', count: analytics.counts.interview || 0 },
    { stage: 'Offer', count: analytics.counts.offer || 0 },
  ]
  const sankeyData = {
    nodes: [
      { name: 'Added' },
      { name: 'Reviewed' },
      { name: 'Applied' },
      { name: 'Interview' },
      { name: 'Offer' },
      { name: 'Closed out' },
    ],
    links: [
      { source: 0, target: 1, value: applications.length },
      { source: 1, target: 2, value: (analytics.counts.applied || 0) + (analytics.counts.screen || 0) + (analytics.counts.interview || 0) + (analytics.counts.offer || 0) },
      { source: 1, target: 5, value: (analytics.counts.rejected || 0) + (analytics.counts.not_qualified || 0) + (analytics.counts.archived || 0) },
      { source: 2, target: 3, value: (analytics.counts.interview || 0) + (analytics.counts.offer || 0) },
      { source: 2, target: 5, value: (analytics.counts.applied || 0) + (analytics.counts.screen || 0) },
      { source: 3, target: 4, value: analytics.counts.offer || 0 },
    ].filter((link) => link.value > 0),
  }

  return (
    <Section padding="md" surface="raised">
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading as="h1" size="lg">Analytics</Heading>
          <Paragraph color="muted">Understand your application pipeline, sources, and process performance.</Paragraph>
        </Stack>
        <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="md">
          <Card><Stat title="Tracked applications" value={applications.length} icon="work" /></Card>
          <Card><Stat title="Ready to review" value={analytics.counts.ready || 0} icon="task_alt" badgeStatus="success" /></Card>
          <Card><Stat title="Applied" value={analytics.counts.applied || 0} icon="send" badgeStatus="info" /></Card>
          <Card><Stat title="Average fit" value={analytics.fitAverage ?? '—'} suffix={analytics.fitAverage == null ? '' : '%'} icon="target" format="none" /></Card>
        </Grid>
        <Grid columns={{ xs: 1, lg: 2 }} gap="md">
          <Card>
            <BarChart
              data={pipelineData}
              xKey="stage"
              series={[{ key: 'count', label: 'Applications', tone: 'accent' }]}
              title="Pipeline stages"
              description="How applications are moving through the process."
              height="sm"
              aria-label="Application pipeline stages"
            />
          </Card>
          <Card>
            <LineChart
              data={analytics.monthData}
              xKey="month"
              series={[{ key: 'added', label: 'Jobs added', tone: 'info' }]}
              title="Jobs added over time"
              description="New application leads added during the last six months."
              height="sm"
              aria-label="Jobs added over time"
            />
          </Card>
          <Card>
            {analytics.statusData.length ? (
              <PieChart data={analytics.statusData} nameKey="name" valueKey="value" title="Status mix" description="Current distribution across application statuses." height="sm" aria-label="Application status mix" />
            ) : <MessageEmptyState icon="pie_chart" title="No status data yet" description="Add a job to start building pipeline analytics." />}
          </Card>
          <Card>
            {analytics.sourceData.length ? (
              <PieChart data={analytics.sourceData} nameKey="name" valueKey="value" title="Source mix" description="Where tracked application leads came from." height="sm" aria-label="Application source mix" />
            ) : <MessageEmptyState icon="language" title="No source data yet" description="Add a job from a URL or the extension to see source trends." />}
          </Card>
        </Grid>
        <Card>
          {applications.length ? (
            <SankeyChart
              data={sankeyData}
              title="Application flow"
              description="Current movement from added leads through review, applications, interviews, offers, and closed outcomes."
              height="md"
              aria-label="Application process flow"
            />
          ) : <MessageEmptyState icon="account_tree" title="No process flow yet" description="Add applications to see how work moves through the pipeline." />}
        </Card>
        <Grid columns={{ xs: 1, md: 2 }} gap="md">
          <Card><Stat title="Average days to apply" value={analytics.appliedAverageDays ?? '—'} suffix={analytics.appliedAverageDays == null ? '' : ' days'} description="Based on applications with an added and applied timestamp." format="none" /></Card>
          <Card><Stat title="Interview loops" value={(analytics.counts.interview || 0) + (analytics.counts.offer || 0)} description="Applications currently in interview or offer stages." icon="school" /></Card>
        </Grid>
      </Stack>
    </Section>
  )
}

function Dashboard({ applications, onAddJob, onDelete, onFeedback, highlightedApplicationId, onBulkGenerate, bulkBusy }) {
  const [contextMenu, setContextMenu] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [filterValue, setFilterValue] = useState(readDashboardFilters)
  const contextAnchorRef = useRef(null)
  const rows = useMemo(() => applications.map((application) => {
    const roleMeta = roleMetaForApplication(application)
    return {
      id: application.id,
      title: application.title,
      company: application.company,
      status: statusLabel(application.status),
      statusValue: application.status,
      track: optionLabel(ROLE_TRACK_OPTIONS, roleMeta.track),
      level: optionLabel(ROLE_LEVEL_OPTIONS, roleMeta.level),
      fitScore: application.fitScore == null ? '' : application.fitScore,
      location: application.location || '',
      workMode: application.workMode || '',
      addedAt: application.createdAt,
      updatedAt: application.updatedAt,
      application,
    }
  }), [applications])

  const columns = useMemo(() => [
    {
      key: 'title',
      label: 'Role',
      sortable: true,
      searchable: true,
      searchAccessor: (row) => `${row.title} ${row.company}`,
      renderCell: ({ row }) => (
        <Stack gap="none">
          <Link href={`/applications/${row.id}`} onClick={(event) => { event.preventDefault(); navigate(`/applications/${row.id}`) }}>{row.title}</Link>
          <Paragraph size="xs" color="muted">{row.company}</Paragraph>
        </Stack>
      ),
    },
    { key: 'status', label: 'Status', type: 'badge', sortable: true, filterable: true, statusMap: Object.fromEntries(STATUS_OPTIONS.map(([value, label]) => [label, statusTone(value)])) },
    { key: 'track', label: 'Track', sortable: true, filterable: true },
    { key: 'level', label: 'Level', sortable: true, filterable: true },
    { key: 'fitScore', label: 'Fit', type: 'number', align: 'end', sortable: true, renderCell: ({ value }) => (value === '' ? '' : `${value}%`) },
    { key: 'location', label: 'Location', sortable: true, searchable: true },
    { key: 'addedAt', label: 'Added', type: 'date', sortable: true, renderCell: ({ value }) => applicationDateTime(value) },
    { key: 'updatedAt', label: 'Updated', type: 'date', sortable: true, renderCell: ({ value }) => applicationDateTime(value) },
  ], [])

  function handleContextMenu(row, event) {
    setContextMenu({ row, x: event.clientX, y: event.clientY })
  }

  function closeContextMenu() {
    setContextMenu(null)
  }

  function openExternal(url) {
    closeContextMenu()
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function confirmDelete() {
    if (!deleteTarget || !onDelete) return
    setDeleteBusy(true)
    try {
      await onDelete(deleteTarget.application)
      setDeleteTarget(null)
      onFeedback?.({ tone: 'success', message: 'Application deleted.' })
    } catch (error) {
      onFeedback?.({ tone: 'error', message: error.message })
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <Section padding="md" surface="raised">
      <Stack gap="lg">
        <Stack direction="row" justify="between" align="center" wrap>
          <Stack gap="xs">
            <Heading as="h1" size="lg">Applications</Heading>
            <Paragraph color="muted">Search, filter, and track every active job lead.</Paragraph>
          </Stack>
          <ButtonContainer>
            {applications.some((application) => application.status === 'researching') && (
              <Button icon="auto_awesome" loading={bulkBusy} onClick={onBulkGenerate}>Complete researching jobs</Button>
            )}
            <Button icon="add" onClick={onAddJob}>Add job</Button>
          </ButtonContainer>
        </Stack>
        <DataTable
          columns={columns}
          rows={rows}
          caption="Job applications"
          defaultSort={{ key: 'updatedAt', direction: 'desc' }}
          filterValue={filterValue}
          onFilterChange={(nextValue) => {
            setFilterValue(nextValue)
            writeDashboardFilters(nextValue)
          }}
          pageSize={50}
          pageSizeOptions={[25, 50, 100]}
          scrollable
          zebra
          onRowContextMenu={handleContextMenu}
          highlightRowId={highlightedApplicationId}
          getRowId={(row) => row.id}
          emptyTitle="No applications yet"
          emptyDescription="Add a job post or company application URL to start a tailored application package."
        />
        {contextMenu && (
          <>
            <button
              ref={contextAnchorRef}
              className="a1-jobs-context-anchor"
              aria-hidden="true"
              tabIndex={-1}
              style={{ left: contextMenu.x, top: contextMenu.y }}
            />
            <Menu open anchorRef={contextAnchorRef} onClose={closeContextMenu} aria-label="Application actions">
              <MenuItem icon="open_in_new" onClick={() => { closeContextMenu(); navigate(`/applications/${contextMenu.row.id}`) }}>Open application page</MenuItem>
              <MenuItem icon="open_in_new" disabled={!contextMenu.row.application.applicationUrl} onClick={() => openExternal(contextMenu.row.application.applicationUrl)}>Open application URL</MenuItem>
              <MenuItem icon="link" disabled={!originalJobUrl(contextMenu.row.application)} onClick={() => openExternal(originalJobUrl(contextMenu.row.application))}>View original URL</MenuItem>
              <MenuItem icon="delete" variant="destructive" onClick={() => { setDeleteTarget(contextMenu.row); closeContextMenu() }}>Delete application</MenuItem>
            </Menu>
          </>
        )}
        <Dialog
          open={Boolean(deleteTarget)}
          onClose={deleteBusy ? undefined : () => setDeleteTarget(null)}
          title="Delete application?"
          status="warn"
          size="sm"
          footer={(
            <>
              <Button variant="secondary" disabled={deleteBusy} onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button icon="delete" loading={deleteBusy} onClick={confirmDelete}>Delete application</Button>
            </>
          )}
        >
          <Paragraph>This will delete {deleteTarget?.application?.title} at {deleteTarget?.application?.company}, including its documents, contacts, accounts, and activity history. This cannot be undone.</Paragraph>
        </Dialog>
      </Stack>
    </Section>
  )
}

function Intake({ user, profile, onCreated, onFeedback }) {
  const [form, setForm] = useState({
    title: '',
    company: '',
    sourceSite: '',
    sourceUrl: '',
    applicationUrl: '',
    jobDescription: '',
    location: '',
    workMode: '',
    salaryRange: '',
  })
  const [busy, setBusy] = useState(null)
  const [status, setStatus] = useState(null)

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function parseWithCodex() {
    setBusy('parse')
    setStatus(null)
    try {
      const response = await runJobsCodexTask('/codex/jobs/parse-job', {
        job: form,
        candidate: candidatePayload(profile),
      })
      const result = response.result ?? {}
      setForm((current) => mergeParsedJob(current, result))
      onFeedback?.({ tone: 'success', message: 'Codex parsed the role. Review before saving.' })
      await logAiRun(user, { task: 'parse-job', result, usage: response.usage })
    } catch (error) {
      setStatus({ tone: 'error', message: error.message })
    } finally {
      setBusy(null)
    }
  }

  async function startFromUrl() {
    const url = form.applicationUrl || form.sourceUrl
    if (!url) {
      onFeedback?.({ tone: 'warn', message: 'Enter a job or application URL first.' })
      return
    }
    setBusy('url')
    setStatus(null)
    try {
      const { application, duplicate } = await createSmartApplicationFromUrl({ user, profile, form })
      if (!duplicate) onCreated(application)
    } catch (error) {
      setStatus({ tone: 'error', message: smartJobErrorMessage(error, 'If the site blocks reading, paste the job description or scan it with the extension.') })
    } finally {
      setBusy(null)
    }
  }

  async function save() {
    setBusy('save')
    setStatus(null)
    try {
      const application = await createApplication(user, form)
      await createEvent(user, {
        applicationId: application.id,
        kind: 'created',
        label: 'Application lead created',
      })
      onCreated(application)
    } catch (error) {
      setStatus({ tone: 'error', message: error.message })
    } finally {
      setBusy(null)
    }
  }

  return (
    <Section padding="md" surface="raised" contentWidth="lg">
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading as="h1" size="lg">Add a job</Heading>
          <Paragraph color="muted">Paste a posting or add a direct application URL from any company career site or job board.</Paragraph>
        </Stack>
        <Card>
          <Stack gap="md">
            <Grid columns={{ xs: 1, md: 2 }} gap="md">
              <TextField label="Role title" value={form.title} onChange={(event) => set('title', event.target.value)} />
              <TextField label="Company" value={form.company} onChange={(event) => set('company', event.target.value)} />
              <TextField label="Source site" value={form.sourceSite} onChange={(event) => set('sourceSite', event.target.value)} />
              <TextField label="Source URL" type="url" value={form.sourceUrl} onChange={(event) => set('sourceUrl', event.target.value)} />
              <TextField label="Application URL" type="url" value={form.applicationUrl} onChange={(event) => set('applicationUrl', event.target.value)} />
              <TextField label="Location" value={form.location} onChange={(event) => set('location', event.target.value)} />
              <SelectField label="Work mode" value={form.workMode} onChange={(event) => set('workMode', event.target.value)}>
                <option value="">Unknown</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </SelectField>
              <TextField label="Salary range" value={form.salaryRange} onChange={(event) => set('salaryRange', event.target.value)} />
            </Grid>
            <TextareaField label="Job description" value={form.jobDescription} rows={12} onChange={(event) => set('jobDescription', event.target.value)} />
            {status && isErrorFeedback(status) && <Banner status={status.tone}>{status.message}</Banner>}
            <ButtonContainer>
              <Button icon="travel_explore" loading={busy === 'url'} onClick={startFromUrl}>Start from URL</Button>
              <Button variant="secondary" icon="auto_awesome" loading={busy === 'parse'} onClick={parseWithCodex}>Parse with Codex</Button>
              <Button variant="secondary" icon="save" loading={busy === 'save'} onClick={save}>Save job</Button>
            </ButtonContainer>
          </Stack>
        </Card>
      </Stack>
    </Section>
  )
}

function DocumentCard({ doc, application, onFeedback }) {
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(doc.content)
  const [saving, setSaving] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)

  useEffect(() => {
    setContent(doc.content)
  }, [doc.content])

  async function handleCopy() {
    await copyText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  async function handleSave() {
    if (!doc.user || !doc.onSaved) return
    setSaving(true)
    try {
      await upsertDocument(doc.user, {
        ...doc,
        applicationId: doc.application_id,
        content,
      })
      if (doc.kind === 'resume') {
        await exportResumePdf({ content, title: doc.title, company: application?.company })
      } else if (doc.kind === 'cover_letter') {
        await exportDocumentPdf({ content, title: doc.title || 'Cover letter', company: application?.company, kind: 'cover-letter' })
      }
      setEditing(false)
      await doc.onSaved()
    } finally {
      setSaving(false)
    }
  }

  async function handlePdf() {
    setExportingPdf(true)
    try {
      const exported = await exportResumePdf({
        content,
        title: doc.title,
        company: application?.company,
      })
      onFeedback?.({
        tone: 'success',
        message: `Resume PDF saved to ${exported.relativePath}.`,
      })
    } catch (error) {
      onFeedback?.({
        tone: 'error',
        message: error.message || 'Could not generate the resume PDF.',
      })
    } finally {
      setExportingPdf(false)
    }
  }

  return (
    <Card>
      <Stack gap="sm">
        <Stack direction="row" justify="between" align="start" gap="md" wrap>
          <Heading as="h3" size="sm" textWrap="balance">{doc.title}</Heading>
          <Stack direction="row" justify="end" align="center" gap="xs" wrap>
            {doc.user && doc.onSaved && (
              <IconButton icon={editing ? 'close' : 'edit'} label={editing ? 'Cancel editing' : 'Edit document'} onClick={() => setEditing((value) => !value)} />
            )}
            {doc.kind === 'resume' && <IconButton icon="picture_as_pdf" label="Generate resume PDF" disabled={exportingPdf} onClick={handlePdf} />}
            <IconButton icon={copied ? 'check' : 'content_copy'} label="Copy document" onClick={handleCopy} />
          </Stack>
        </Stack>
        {editing ? (
          <>
            <TextareaField label={`${doc.title} content`} rows={16} value={content} onChange={(event) => setContent(event.target.value)} />
            <ButtonContainer>
              <Button icon="save" loading={saving} onClick={handleSave}>Save changes</Button>
              <Button variant="secondary" onClick={() => { setContent(doc.content); setEditing(false) }}>Cancel</Button>
            </ButtonContainer>
          </>
        ) : (
          <Code variant="block" wrapping collapsible collapsedLines={12}>{content}</Code>
        )}
      </Stack>
    </Card>
  )
}

function GenerationProgress({ progress }) {
  if (!progress) return null
  return (
    <Snackbar open position="top-right" autoHideDuration={0}>
      {[progress.title, progress.detail].filter(Boolean).join(': ')}
    </Snackbar>
  )
}

function ApplicationDetail({ user, profile, application, onUpdated, onDeleted, onFeedback }) {
  const [tab, setTab] = useState('overview')
  const [documents, setDocuments] = useState([])
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState([])
  const [events, setEvents] = useState([])
  const [accounts, setAccounts] = useState([])
  const [busy, setBusy] = useState(null)
  const [notice, setNotice] = useState(null)
  const [generationProgress, setGenerationProgress] = useState(null)
  const [extensionPayload, setExtensionPayload] = useState(() => readStoredExtensionPayload())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [accountDialogOpen, setAccountDialogOpen] = useState(false)
  const lastExtensionPayloadId = useRef(null)

  const loadRelated = useCallback(async () => {
    if (!application?.id) return
    const [docs, nextContacts, nextMessages, nextEvents, nextAccounts] = await Promise.all([
      listRelated(user, 'job_documents', application.id),
      listRelated(user, 'job_contacts', application.id),
      listRelated(user, 'job_messages', application.id),
      listRelated(user, 'job_events', application.id),
      listRelated(user, 'job_accounts', application.id),
    ])
    setDocuments(docs)
    setContacts(nextContacts)
    setMessages(nextMessages)
    setEvents(nextEvents)
    setAccounts(nextAccounts)
  }, [application?.id, user])

  const showNotice = useCallback((feedback) => {
    if (isErrorFeedback(feedback)) {
      setNotice(feedback)
      return
    }
    setNotice(null)
    onFeedback?.(feedback)
  }, [onFeedback])

  useEffect(() => {
    loadRelated().catch((error) => showNotice({ tone: 'error', message: error.message }))
  }, [application?.updatedAt, loadRelated, showNotice])

  useEffect(() => {
    function applyExtensionPayload(payload) {
      if (!payload?.id || payload.id === lastExtensionPayloadId.current) return
      lastExtensionPayloadId.current = payload.id
      setExtensionPayload(payload)
      if (payload.type === 'form-scan') {
        setTab('autofill')
        showNotice({ tone: 'success', message: 'Form scan received from the extension.' })
      } else if (payload.type === 'linkedin-scan') {
        setTab('contacts')
        showNotice({ tone: 'success', message: 'LinkedIn scan received from the extension.' })
      }
    }

    function handleExtensionPayload(event) {
      applyExtensionPayload(event.detail)
    }

    function handleStorage(event) {
      if (event.key !== EXTENSION_PAYLOAD_KEY || !event.newValue) return
      try {
        applyExtensionPayload(JSON.parse(event.newValue))
      } catch {
        showNotice({ tone: 'error', message: 'The extension sent payload JSON that could not be read.' })
      }
    }

    applyExtensionPayload(readStoredExtensionPayload())
    window.addEventListener('a1-jobs-extension-payload', handleExtensionPayload)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('a1-jobs-extension-payload', handleExtensionPayload)
      window.removeEventListener('storage', handleStorage)
    }
  }, [showNotice])

  if (!application) {
    return (
      <Section padding="md" surface="raised">
        <MessageEmptyState icon="search_off" title="Application not found" description="Choose another application from the dashboard." />
      </Section>
    )
  }

  async function patchApplication(patch, eventLabel) {
    setBusy('update')
    setNotice(null)
    try {
      const updated = await updateApplication(user, application.id, patch)
      if (eventLabel) {
        await createEvent(user, { applicationId: application.id, kind: 'status', label: eventLabel })
      }
      onUpdated(updated)
    } catch (error) {
      showNotice({ tone: 'error', message: error.message })
    } finally {
      setBusy(null)
    }
  }

  async function generatePackage() {
    setBusy('package')
    setNotice(null)
    setGenerationProgress({
      title: 'Preparing application package',
      detail: 'Reading your saved profile, the job description, and current application context.',
    })
    try {
      setGenerationProgress({
        title: 'Drafting with A1 Codex',
        detail: 'Asking the local Codex bridge to tailor the overview, resume, cover letter, portfolio note, and A1 note.',
      })
      const response = await runJobsCodexTask('/codex/jobs/draft-application', {
        candidate: candidatePayload(profile),
        application: applicationPayload(application),
      })
      const result = response.result ?? {}
      setGenerationProgress({
        title: 'Preparing documents',
        detail: 'Converting Codex output into editable documents for this job page.',
      })
      const docs = [
        ['overview', 'Position overview', positionOverviewContent(application, result)],
        ['resume', 'Tailored resume', result.resume],
        ['cover_letter', 'Cover letter', result.coverLetter],
        ['portfolio_note', 'Portfolio note', result.portfolioNote],
        ['a1_note', 'A1 link note', result.a1Note],
      ].filter(([, , content]) => content)
      for (const [kind, title, content] of docs) {
        setGenerationProgress({
          title: 'Saving generated files',
          detail: `Saving ${title}.`,
        })
        try {
          await upsertDocument(user, { applicationId: application.id, kind, title, content })
        } catch (documentError) {
          if (kind !== 'overview' || !documentError.message?.includes('job_documents_kind_check')) throw documentError
        }
      }
      const resume = docs.find(([kind]) => kind === 'resume')
      if (resume) {
        setGenerationProgress({
          title: 'Generating resume PDF',
          detail: 'Applying the baseline resume layout and saving the tailored PDF to the resumes folder.',
        })
        await exportResumePdf({ content: resume[2], title: resume[1], company: application.company })
      }
      const coverLetter = docs.find(([kind]) => kind === 'cover_letter')
      if (coverLetter) {
        setGenerationProgress({
          title: 'Generating cover letter PDF',
          detail: 'Formatting the tailored cover letter and saving it to the resumes folder.',
        })
        await exportDocumentPdf({ content: coverLetter[2], title: coverLetter[1], company: application.company, kind: 'cover-letter' })
      }
      setGenerationProgress({
        title: 'Updating job status',
        detail: 'Marking the package ready and saving fit, warnings, and next actions.',
      })
      const updated = await updateApplication(user, application.id, {
        status: 'ready',
        fitScore: result.fitScore,
        summary: { ...(application.summary ?? {}), packageSummary: result.summary, warnings: result.warnings, nextActions: result.nextActions },
      })
      await createEvent(user, { applicationId: application.id, kind: 'package', label: 'Application package generated' })
      onUpdated(updated)
      setGenerationProgress({
        title: 'Recording AI run',
        detail: 'Saving the generation result and usage metadata for traceability.',
      })
      await logAiRun(user, { applicationId: application.id, task: 'draft-application', result, usage: response.usage })
      setGenerationProgress({
        title: 'Refreshing job page',
        detail: 'Loading the newly saved documents and timeline events.',
      })
      await loadRelated()
      showNotice({ tone: 'success', message: 'Application package generated. Review before submitting.' })
    } catch (error) {
      showNotice({ tone: 'error', message: error.message })
    } finally {
      setGenerationProgress(null)
      setBusy(null)
    }
  }

  async function generatePrep() {
    setBusy('prep')
    setNotice(null)
    setGenerationProgress({
      title: 'Preparing interview context',
      detail: 'Collecting the role, company, job description, and generated application documents.',
    })
    try {
      setGenerationProgress({
        title: 'Building interview prep with A1 Codex',
        detail: 'Asking the local Codex bridge for likely topics, talking points, questions, and follow-up prep.',
      })
      const response = await runJobsCodexTask('/codex/jobs/interview-prep', {
        candidate: candidatePayload(profile),
        application: applicationPayload(application),
        documents,
      })
      const result = response.result ?? {}
      setGenerationProgress({
        title: 'Saving interview prep',
        detail: 'Writing the interview prep document to this job page.',
      })
      await upsertDocument(user, {
        applicationId: application.id,
        kind: 'interview_prep',
        title: 'Interview prep',
        content: result.interviewPrep || result.summary,
      })
      await createEvent(user, { applicationId: application.id, kind: 'prep', label: 'Interview prep generated' })
      setGenerationProgress({
        title: 'Recording AI run',
        detail: 'Saving the prep result and usage metadata for traceability.',
      })
      await logAiRun(user, { applicationId: application.id, task: 'interview-prep', result, usage: response.usage })
      setGenerationProgress({
        title: 'Refreshing job page',
        detail: 'Loading the new prep document and timeline event.',
      })
      await loadRelated()
      showNotice({ tone: 'success', message: 'Interview prep doc created.' })
    } catch (error) {
      showNotice({ tone: 'error', message: error.message })
    } finally {
      setGenerationProgress(null)
      setBusy(null)
    }
  }

  async function deleteApplication() {
    setBusy('delete')
    try {
      await removeApplication(user, application.id)
      onDeleted(application.id)
      setDeleteDialogOpen(false)
      navigate('/')
    } catch (error) {
      showNotice({ tone: 'error', message: error.message })
    } finally {
      setBusy(null)
    }
  }

  const sourceUrl = originalJobUrl(application)

  return (
    <Section padding="sm" contentWidth='xl' surface="raised">
      <Stack gap="lg">
        <Stack gap="xs">
          <Link href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}>Back to dashboard</Link>
          <div className="a1-jobs-application-titlebar">
            <Heading as="h1" size="lg">{application.title}</Heading>
            <div className="a1-jobs-application-actions">
              {sourceUrl && <Button as="a" href={sourceUrl} target="_blank" rel="noreferrer" icon="open_in_new">Original URL</Button>}
              <Button variant="secondary" icon="edit_square" onClick={() => setTab('autofill')}>Apply</Button>
              <Button variant="secondary" icon="person_add" onClick={() => setContactDialogOpen(true)}>Contact</Button>
              <Button variant="secondary" icon="key" onClick={() => setAccountDialogOpen(true)}>Account</Button>
              <IconButton icon="delete" label="Delete job" onClick={() => setDeleteDialogOpen(true)} />
            </div>
          </div>
          <Stack gap="xs">
            <Paragraph color="muted">{application.company}</Paragraph>
            <Stack direction="row" gap="xs" wrap>
              <MessageBadge status={statusTone(application.status)}>{statusLabel(application.status)}</MessageBadge>
              {application.location && <MessageBadge status="neutral" subtle>{application.location}</MessageBadge>}
              {application.workMode && <MessageBadge status="neutral" subtle>{application.workMode}</MessageBadge>}
            </Stack>
          </Stack>
        </Stack>
        <AddContactDialog
          open={contactDialogOpen}
          onClose={() => setContactDialogOpen(false)}
          user={user}
          application={application}
          onSaved={loadRelated}
          onFeedback={showNotice}
        />
        <AddAccountDialog
          open={accountDialogOpen}
          onClose={() => setAccountDialogOpen(false)}
          user={user}
          application={application}
          onSaved={loadRelated}
          onFeedback={showNotice}
        />
        <Dialog
          open={deleteDialogOpen}
          onClose={busy === 'delete' ? undefined : () => setDeleteDialogOpen(false)}
          title="Delete job?"
          status="warn"
          size="sm"
          footer={(
            <>
              <Button variant="secondary" disabled={busy === 'delete'} onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button icon="delete" loading={busy === 'delete'} onClick={deleteApplication}>Delete job</Button>
            </>
          )}
        >
          <Stack gap="sm">
            <Paragraph>This will delete {application.company ? `${application.title} at ${application.company}` : application.title} and its related documents, contacts, events, messages, accounts, and form-fill sessions.</Paragraph>
            <Paragraph color="muted">This cannot be undone.</Paragraph>
          </Stack>
        </Dialog>
        {notice && isErrorFeedback(notice) && <Banner status={notice.tone}>{notice.message}</Banner>}
        <GenerationProgress progress={generationProgress} />
        <Tabs value={tab} onChange={setTab} variant="line">
          <TabList>
            <Tab value="overview" icon="fact_check">Overview</Tab>
            <Tab value="package" icon="description">Package</Tab>
            {contacts.length > 0 && <Tab value="contacts" icon="groups">Contacts</Tab>}
            {accounts.length > 0 && <Tab value="accounts" icon="key">Accounts</Tab>}
            <Tab value="prep" icon="school">Interview prep</Tab>
            <Tab value="autofill" icon="edit_square">Autofill</Tab>
          </TabList>
          <TabPanel value="overview">
            <OverviewPanel application={application} busy={busy} onPatch={patchApplication} events={events} />
          </TabPanel>
          <TabPanel value="package">
            <Stack gap="md">
              <ButtonContainer>
                <Button icon="auto_awesome" loading={busy === 'package'} onClick={generatePackage}>Generate application package</Button>
              </ButtonContainer>
              <DocumentList user={user} onChange={loadRelated} application={application} onFeedback={showNotice} documents={documents.filter((doc) => ['overview', 'resume', 'cover_letter', 'portfolio_note', 'a1_note'].includes(doc.kind))} />
            </Stack>
          </TabPanel>
          <TabPanel value="contacts">
            <ContactsPanel user={user} application={application} profile={profile} contacts={contacts} onChange={loadRelated} extensionPayload={extensionPayload} onFeedback={showNotice} onAddContact={() => setContactDialogOpen(true)} />
          </TabPanel>
          <TabPanel value="accounts">
            <AccountsPanel user={user} application={application} accounts={accounts} onChange={loadRelated} onFeedback={showNotice} onAddAccount={() => setAccountDialogOpen(true)} />
          </TabPanel>
          <TabPanel value="prep">
            <Stack gap="md">
              <ButtonContainer>
                <Button icon="auto_awesome" loading={busy === 'prep'} onClick={generatePrep}>Generate interview prep</Button>
              </ButtonContainer>
              <DocumentList user={user} onChange={loadRelated} application={application} onFeedback={showNotice} documents={documents.filter((doc) => doc.kind === 'interview_prep')} />
            </Stack>
          </TabPanel>
          <TabPanel value="autofill">
            <AutofillPanel user={user} application={application} profile={profile} documents={documents} setNotice={showNotice} extensionPayload={extensionPayload} onUpdated={onUpdated} />
          </TabPanel>
        </Tabs>
      </Stack>
    </Section>
  )
}

function OverviewPanel({ application, busy, onPatch, events }) {
  const roleMeta = roleMetaForApplication(application)
  function patchRoleMeta(patch) {
    onPatch({
      summary: {
        ...(application.summary ?? {}),
        roleMeta: {
          ...roleMeta,
          ...patch,
        },
      },
    }, 'Role metadata updated')
  }
  return (
    <Grid columns={{ xs: 1, lg: 2 }} gap="md">
      <Card>
        <Stack gap="md">
          <Heading as="h2" size="md">Status</Heading>
          <SelectField label="Status" value={application.status} onChange={(event) => onPatch({ status: event.target.value }, `Status changed to ${statusLabel(event.target.value)}`)}>
            {STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </SelectField>
          <TextField label="Next action" value={application.nextAction} onChange={(event) => onPatch({ nextAction: event.target.value })} />
          <Button variant="secondary" icon="send" loading={busy === 'update'} onClick={() => onPatch({ status: 'applied', appliedAt: new Date().toISOString() }, 'Marked applied')}>Mark applied</Button>
        </Stack>
      </Card>
      <Card>
        <Stack gap="md">
          <Heading as="h2" size="md">Role metadata</Heading>
          <Grid columns={{ xs: 1, md: 2 }} gap="md">
            <SelectField label="Track" value={roleMeta.track} onChange={(event) => patchRoleMeta({ track: event.target.value })}>
              {ROLE_TRACK_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </SelectField>
            <SelectField label="Level" value={roleMeta.level} onChange={(event) => patchRoleMeta({ level: event.target.value })}>
              {ROLE_LEVEL_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </SelectField>
          </Grid>
          <TextField label="Hiring manager" value={roleMeta.hiringManager} onChange={(event) => patchRoleMeta({ hiringManager: event.target.value })} />
        </Stack>
      </Card>
      <Card>
        <Stack gap="md">
          <Heading as="h2" size="md">Role summary</Heading>
          <ButtonContainer>
            {application.applicationUrl && <Button as="a" href={application.applicationUrl} target="_blank" rel="noreferrer" variant="secondary" icon="open_in_new">Application URL</Button>}
            {application.company && <Button as="a" href={linkedinCompanySearchUrl(application.company)} target="_blank" rel="noreferrer" variant="secondary" icon="business">LinkedIn company</Button>}
          </ButtonContainer>
          {application.summary?.manualCheck && (
            <Banner status="warn" title="Manual extension check needed">
              Open the original URL in Chrome and use the A1 Jobs extension Job Page tab. Reason: {application.summary.manualCheck.reason}
            </Banner>
          )}
          {application.summary?.packageSummary && <Paragraph>{application.summary.packageSummary}</Paragraph>}
          {application.jobDescription ? <Code variant="block" wrapping collapsible collapsedLines={12}>{application.jobDescription}</Code> : <Paragraph color="muted">No job description saved.</Paragraph>}
        </Stack>
      </Card>
      <Card>
        <Stack gap="md">
          <Heading as="h2" size="md">Timeline</Heading>
          {events.length ? events.map((event) => (
            <Stack key={event.id} gap="none">
              <Paragraph size="sm">{event.label}</Paragraph>
              <Paragraph size="xs" color="muted">{new Date(event.event_at).toLocaleString()}</Paragraph>
            </Stack>
          )) : <Paragraph color="muted">No events yet.</Paragraph>}
        </Stack>
      </Card>
    </Grid>
  )
}

function DocumentList({ documents, user, onChange, application, onFeedback }) {
  if (!documents.length) {
    return <MessageEmptyState icon="description" title="No documents yet" description="Generate a package or prep doc to create reviewed drafts." />
  }
  return <Stack gap="md">{documents.map((doc) => (
    <DocumentCard
      key={doc.id}
      application={application}
      onFeedback={onFeedback}
      doc={{ ...doc, user, onSaved: onChange }}
    />
  ))}</Stack>
}

function AddContactDialog({ open, onClose, user, application, onSaved, onFeedback }) {
  const [contact, setContact] = useState({ name: '', role: '', email: '', sourceUrl: '', notes: '' })
  const [busy, setBusy] = useState(false)

  function set(key, value) {
    setContact((current) => ({ ...current, [key]: value }))
  }

  async function saveContact() {
    setBusy(true)
    try {
      await createContact(user, { ...contact, applicationId: application.id, company: application.company })
      setContact({ name: '', role: '', email: '', sourceUrl: '', notes: '' })
      await onSaved()
      onFeedback?.({ tone: 'success', message: 'Contact saved.' })
      onClose()
    } catch (error) {
      onFeedback?.({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      title="Add contact"
      size="md"
      footer={(
        <>
          <Button variant="secondary" disabled={busy} onClick={onClose}>Cancel</Button>
          <Button icon="person_add" loading={busy} onClick={saveContact}>Save contact</Button>
        </>
      )}
    >
      <Stack gap="md">
        <TextField label="Name" value={contact.name} onChange={(event) => set('name', event.target.value)} />
        <TextField label="Role" value={contact.role} onChange={(event) => set('role', event.target.value)} />
        <TextField label="Email" type="email" value={contact.email} onChange={(event) => set('email', event.target.value)} />
        <TextField label="Profile or source URL" type="url" value={contact.sourceUrl} onChange={(event) => set('sourceUrl', event.target.value)} />
        <TextareaField label="Notes" value={contact.notes} onChange={(event) => set('notes', event.target.value)} />
      </Stack>
    </Dialog>
  )
}

function ContactsPanel({ user, application, profile, contacts, onChange, extensionPayload, onFeedback, onAddContact }) {
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState('')
  const [linkedinScan, setLinkedinScan] = useState('')
  const [contactNotice, setContactNotice] = useState(null)
  const loadedLinkedInPayloadId = useRef(null)

  function showContactNotice(feedback) {
    if (isErrorFeedback(feedback)) {
      setContactNotice(feedback)
      return
    }
    setContactNotice(null)
    onFeedback?.(feedback)
  }

  useEffect(() => {
    if (extensionPayload?.type !== 'linkedin-scan' || extensionPayload.id === loadedLinkedInPayloadId.current) return
    loadedLinkedInPayloadId.current = extensionPayload.id
    setLinkedinScan(JSON.stringify(extensionPayload.scan, null, 2))
    showContactNotice({ tone: 'info', message: 'LinkedIn scan received. Review it, then import visible contacts.' })
  }, [extensionPayload])

  async function draftOutreach(nextContact) {
    setBusy(true)
    setContactNotice(null)
    try {
      const response = await runJobsCodexTask('/codex/jobs/draft-outreach', {
        candidate: candidatePayload(profile),
        application: applicationPayload(application),
        contact: nextContact,
      })
      const result = response.result ?? {}
      setDraft(result.outreach || result.summary)
      await upsertDocument(user, {
        applicationId: application.id,
        kind: 'outreach',
        title: `Outreach to ${nextContact.name}`,
        content: result.outreach || result.summary,
      })
      await logAiRun(user, { applicationId: application.id, task: 'draft-outreach', result, usage: response.usage })
      await onChange()
    } catch (error) {
      showContactNotice({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function importLinkedInScan() {
    setBusy(true)
    setContactNotice(null)
    try {
      const scan = JSON.parse(linkedinScan)
      const connections = Array.isArray(scan.connections) ? scan.connections : []
      const existingKeys = new Set(contacts.map((item) => `${item.source_url || ''}|${item.name}`))
      let imported = 0
      for (const connection of connections) {
        const name = String(connection.name || '').trim()
        if (!name) continue
        const sourceUrl = connection.profileUrl || connection.url || ''
        const key = `${sourceUrl}|${name}`
        if (existingKeys.has(key)) continue
        await createContact(user, {
          applicationId: application.id,
          company: application.company,
          name,
          role: connection.headline || connection.role || '',
          relationship: connection.degree || connection.mutualText || '',
          sourceUrl,
          status: 'identified',
          notes: [
            connection.mutualText,
            scan.url ? `Visible LinkedIn scan: ${scan.url}` : '',
          ].filter(Boolean).join('\n'),
        })
        existingKeys.add(key)
        imported += 1
      }
      await onChange()
      setLinkedinScan('')
      showContactNotice({ tone: imported ? 'success' : 'warn', message: imported ? `Imported ${imported} LinkedIn contact${imported === 1 ? '' : 's'}.` : 'No new LinkedIn contacts found in that scan.' })
    } catch (error) {
      showContactNotice({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Grid columns={{ xs: 1, lg: 2 }} gap="md">
      <Card>
        <Stack gap="md">
          <Heading as="h2" size="md">Contacts</Heading>
          {contactNotice && isErrorFeedback(contactNotice) && <Banner status={contactNotice.tone}>{contactNotice.message}</Banner>}
          <ButtonContainer>
            <Button icon="person_add" onClick={onAddContact}>Add contact</Button>
            {application.company && <Button as="a" href={linkedinCompanySearchUrl(application.company)} target="_blank" rel="noreferrer" variant="secondary" icon="business">LinkedIn company</Button>}
          </ButtonContainer>
          <Divider />
          <Heading as="h2" size="md">Import LinkedIn scan</Heading>
          <Paragraph color="muted">Use the companion extension on LinkedIn to scan visible profile cards. The extension can send the scan here automatically, or you can paste JSON manually.</Paragraph>
          <TextareaField label="LinkedIn scan JSON" rows={8} value={linkedinScan} onChange={(event) => setLinkedinScan(event.target.value)} />
          <Button variant="secondary" icon="upload_file" loading={busy} onClick={importLinkedInScan}>Import visible contacts</Button>
        </Stack>
      </Card>
      <Stack gap="md">
        {contacts.map((nextContact) => (
          <Card key={nextContact.id}>
            <Stack gap="sm">
              <Heading as="h3" size="sm">{nextContact.name}</Heading>
              <Paragraph color="muted">{nextContact.role || nextContact.email || application.company}</Paragraph>
              <ButtonContainer>
                {nextContact.source_url && <Button as="a" href={nextContact.source_url} target="_blank" rel="noreferrer" variant="secondary" icon="open_in_new">Open source</Button>}
                <Button variant="secondary" icon="auto_awesome" loading={busy} onClick={() => draftOutreach(nextContact)}>Draft outreach</Button>
              </ButtonContainer>
            </Stack>
          </Card>
        ))}
        {draft && <DocumentCard doc={{ id: 'draft', title: 'Latest outreach draft', content: draft }} />}
      </Stack>
    </Grid>
  )
}

function MessagesPanel({ user, application, profile, messages, onChange, setNotice }) {
  const { accessToken } = useAuth()
  const [busy, setBusy] = useState(false)
  const [triage, setTriage] = useState('')

  async function connectGmail() {
    setBusy(true)
    try {
      const token = await accessToken()
      const data = await functionJson('google-oauth-start', token)
      window.location.href = data.authorizationUrl
    } catch (error) {
      setNotice({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function syncGmail() {
    setBusy(true)
    try {
      const token = await accessToken()
      const query = `${application.company} newer_than:365d`
      const data = await functionJson('gmail-sync', token, { q: query, maxResults: 25 })
      await onChange()
      setNotice({ tone: 'success', message: `Synced ${data.count} Gmail messages.` })
    } catch (error) {
      setNotice({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function triageMessage(message) {
    setBusy(true)
    try {
      const response = await runJobsCodexTask('/codex/jobs/triage-message', {
        candidate: candidatePayload(profile),
        application: applicationPayload(application),
        message,
      })
      const result = response.result ?? {}
      setTriage(result.messageSummary || result.summary)
      await logAiRun(user, { applicationId: application.id, task: 'triage-message', result, usage: response.usage })
    } catch (error) {
      setNotice({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Stack gap="md">
      <ButtonContainer>
        <Button variant="secondary" icon="mail" loading={busy} onClick={connectGmail}>Connect Gmail</Button>
        <Button icon="sync" loading={busy} onClick={syncGmail}>Sync Gmail for this company</Button>
      </ButtonContainer>
      {triage && <Banner status="info">{triage}</Banner>}
      {messages.length ? messages.map((message) => (
        <Card key={message.id}>
          <Stack gap="sm">
            <Stack direction="row" justify="between" gap="sm" wrap>
              <Heading as="h3" size="sm">{message.subject || 'Message'}</Heading>
              <Button variant="secondary" icon="auto_awesome" loading={busy} onClick={() => triageMessage(message)}>Triage</Button>
            </Stack>
            <Paragraph size="sm" color="muted">{message.from_email}</Paragraph>
            <Paragraph>{message.snippet}</Paragraph>
          </Stack>
        </Card>
      )) : <MessageEmptyState icon="mail" title="No messages matched yet" description="Connect Gmail and sync messages for this company." />}
    </Stack>
  )
}

function emptyAccount(application) {
  return {
    siteName: application?.company || '',
    loginUrl: application?.applicationUrl || application?.sourceUrl || '',
    username: '',
    email: '',
    password: '',
    notes: '',
  }
}

function AddAccountDialog({ open, onClose, user, application, onSaved, onFeedback }) {
  const [form, setForm] = useState(() => emptyAccount(application))
  const [busy, setBusy] = useState(false)

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function resetForm() {
    setForm(emptyAccount(application))
  }

  async function saveAccount() {
    setBusy(true)
    try {
      await upsertAccount(user, {
        applicationId: application.id,
        ...form,
      })
      await onSaved()
      resetForm()
      onFeedback?.({ tone: 'success', message: 'Application account saved.' })
      onClose()
    } catch (error) {
      onFeedback?.({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      title="Add account"
      size="md"
      footer={(
        <>
          <Button variant="secondary" disabled={busy} onClick={onClose}>Cancel</Button>
          <Button icon="save" loading={busy} onClick={saveAccount}>Save account</Button>
        </>
      )}
    >
      <Stack gap="md">
        <TextField label="Site or ATS" value={form.siteName} onChange={(event) => setField('siteName', event.target.value)} />
        <TextField label="Login URL" value={form.loginUrl} onChange={(event) => setField('loginUrl', event.target.value)} />
        <TextField label="Username" value={form.username} onChange={(event) => setField('username', event.target.value)} />
        <TextField label="Email" value={form.email} onChange={(event) => setField('email', event.target.value)} />
        <TextField label="Password" type="password" value={form.password} onChange={(event) => setField('password', event.target.value)} />
        <TextareaField label="Notes" rows={4} value={form.notes} onChange={(event) => setField('notes', event.target.value)} />
      </Stack>
    </Dialog>
  )
}

function AccountsPanel({ user, application, accounts, onChange, onFeedback, onAddAccount }) {
  const [busy, setBusy] = useState(false)
  const [visiblePasswords, setVisiblePasswords] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function deleteAccount() {
    if (!deleteTarget) return
    setBusy(true)
    try {
      await removeAccount(user, deleteTarget.id)
      await onChange()
      setDeleteTarget(null)
      onFeedback?.({ tone: 'success', message: 'Application account deleted.' })
    } catch (error) {
      onFeedback?.({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function copyCredential(value, label) {
    await copyText(value || '')
    onFeedback?.({ tone: 'success', message: `${label} copied.` })
  }

  return (
    <Stack gap="md">
      <Stack direction="row" justify="between" align="center" gap="sm" wrap>
        <Heading as="h2" size="md">Saved accounts</Heading>
        <Button icon="key" onClick={onAddAccount}>Add account</Button>
      </Stack>
      <Stack gap="md">
        {accounts.length ? accounts.map((account) => {
            const passwordVisible = Boolean(visiblePasswords[account.id])
            return (
              <Card key={account.id}>
                <Stack gap="sm">
                  <Stack direction="row" justify="between" gap="sm" wrap>
                    <Stack gap="none">
                      <Heading as="h3" size="sm">{account.site_name || application.company}</Heading>
                      {account.login_url && <Link href={account.login_url} target="_blank" rel="noreferrer">{account.login_url}</Link>}
                    </Stack>
                    <ButtonContainer>
                      <IconButton icon="delete" label="Delete account" onClick={() => setDeleteTarget(account)} />
                    </ButtonContainer>
                  </Stack>
                  {account.username && (
                    <Stack direction="row" justify="between" align="center" gap="sm" wrap>
                      <Paragraph><strong>Username:</strong> {account.username}</Paragraph>
                      <Button variant="tertiary" size="sm" icon="content_copy" onClick={() => copyCredential(account.username, 'Username')}>Copy</Button>
                    </Stack>
                  )}
                  {account.email && (
                    <Stack direction="row" justify="between" align="center" gap="sm" wrap>
                      <Paragraph><strong>Email:</strong> {account.email}</Paragraph>
                      <Button variant="tertiary" size="sm" icon="content_copy" onClick={() => copyCredential(account.email, 'Email')}>Copy</Button>
                    </Stack>
                  )}
                  {account.password && (
                    <Stack direction="row" justify="between" align="center" gap="sm" wrap>
                      <Paragraph><strong>Password:</strong> {passwordVisible ? account.password : '************'}</Paragraph>
                      <ButtonContainer>
                        <Button variant="tertiary" size="sm" icon={passwordVisible ? 'visibility_off' : 'visibility'} onClick={() => setVisiblePasswords((current) => ({ ...current, [account.id]: !passwordVisible }))}>{passwordVisible ? 'Hide' : 'Show'}</Button>
                        <Button variant="tertiary" size="sm" icon="content_copy" onClick={() => copyCredential(account.password, 'Password')}>Copy</Button>
                      </ButtonContainer>
                    </Stack>
                  )}
                  {account.notes && <Paragraph color="muted">{account.notes}</Paragraph>}
                </Stack>
              </Card>
            )
          }) : <MessageEmptyState icon="key" title="No accounts saved" description="Add login credentials when an application portal requires account creation." />}
      </Stack>
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={busy ? undefined : () => setDeleteTarget(null)}
        title="Delete saved account?"
        status="warn"
        size="sm"
        footer={(
          <>
            <Button variant="secondary" disabled={busy} onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button icon="delete" loading={busy} onClick={deleteAccount}>Delete account</Button>
          </>
        )}
      >
        <Paragraph>This will delete the saved username and password for {deleteTarget?.site_name || application.company}. This cannot be undone.</Paragraph>
      </Dialog>
    </Stack>
  )
}

function AutofillPanel({ user, application, profile, documents, setNotice, extensionPayload, onUpdated }) {
  const [scanText, setScanText] = useState('')
  const [mapping, setMapping] = useState(null)
  const [busy, setBusy] = useState(false)
  const [activity, setActivity] = useState([])
  const loadedFormPayloadId = useRef(null)

  useEffect(() => {
    if (extensionPayload?.type !== 'form-scan' || extensionPayload.id === loadedFormPayloadId.current) return
    loadedFormPayloadId.current = extensionPayload.id
    setScanText(JSON.stringify(extensionPayload.scan, null, 2))
    setMapping(null)
    setActivity([{ id: 'scan-received', label: 'Form scan received from the extension.', status: 'success' }])
    mapFields(extensionPayload.scan)
  }, [extensionPayload])

  function startActivity(label) {
    const id = `${Date.now()}-${Math.random()}`
    setActivity((current) => [...current, { id, label, status: 'info' }])
    return id
  }

  function finishActivity(id, status = 'success', label) {
    setActivity((current) => current.map((item) => item.id === id
      ? { ...item, status, ...(label ? { label } : {}) }
      : item))
  }

  async function markApplied() {
    setBusy('applied')
    try {
      const updated = await updateApplication(user, application.id, {
        status: 'applied',
        appliedAt: new Date().toISOString(),
        nextAction: 'Track incoming communication',
      })
      await createEvent(user, { applicationId: application.id, kind: 'status', label: 'Application marked as applied' })
      onUpdated(updated)
      setNotice({ tone: 'success', message: 'Application marked as applied.' })
    } catch (error) {
      setNotice({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function buildAttachments() {
    const resume = documents.find((doc) => doc.kind === 'resume')
    const coverLetter = documents.find((doc) => doc.kind === 'cover_letter')
    const attachments = []
    if (resume?.content) {
      const exported = await exportResumePdf({
        content: resume.content,
        title: resume.title,
        company: application.company,
      })
      attachments.push({
        kind: 'resume',
        filename: exported.filename,
        mimeType: 'application/pdf',
        url: `${window.location.origin}/api/local-file?name=${encodeURIComponent(exported.filename)}`,
      })
    }
    if (coverLetter?.content) {
      const exported = await exportDocumentPdf({
        content: coverLetter.content,
        title: coverLetter.title || 'Cover letter',
        company: application.company,
        kind: 'cover-letter',
      })
      attachments.push({
        kind: 'cover_letter',
        filename: exported.filename,
        mimeType: 'application/pdf',
        url: `${window.location.origin}/api/local-file?name=${encodeURIComponent(exported.filename)}`,
      })
    }
    return attachments
  }

  async function mapFields(scanInput = null) {
    setBusy(true)
    setActivity([])
    const readStep = startActivity('Reading the form scan and checking the page details.')
    try {
      const scan = scanInput || JSON.parse(scanText)
      if (scan.submissionError?.kind === 'submission-rejected') {
        finishActivity(readStep, 'error', 'The application site rejected the submission as possible spam.')
        const saveStep = startActivity('Recording the rejected submission for manual review.')
        await createFormFillSession(user, {
          applicationId: application.id,
          pageUrl: scan.url || application.applicationUrl || 'unknown',
          scan,
          mapping: {},
          result: { submissionError: scan.submissionError },
          status: 'failed',
        })
        finishActivity(saveStep, 'success', 'Submission issue recorded. Retry manually on the application site.')
        setNotice({ tone: 'error', message: scan.submissionError.message || 'The application site rejected the submission as possible spam.' })
        return
      }
      finishActivity(readStep, 'success', `Read ${Array.isArray(scan.fields) ? scan.fields.length : 'the'} scanned form fields.`)
      const bridgeStep = startActivity('Sending the scanned fields to the Codex bridge for mapping.')
      const response = await runJobsCodexTask('/codex/jobs/map-application-form', {
        candidate: candidatePayload(profile),
        application: applicationPayload(application),
        scan,
      })
      const result = response.result ?? {}
      finishActivity(bridgeStep, 'success', 'Codex returned a field mapping.')
      const attachmentStep = startActivity('Preparing the tailored resume and cover letter PDFs.')
      const attachments = await buildAttachments()
      finishActivity(attachmentStep, 'success', attachments.length
        ? `Prepared ${attachments.length} application ${attachments.length === 1 ? 'file' : 'files'} for upload.`
        : 'No generated documents were available to attach.')
      const fillPackage = {
        applicationId: application.id,
        pageUrl: scan.url || application.applicationUrl,
        profile: candidatePayload(profile),
        attachments,
        defaults: A1_FORM_DEFAULTS,
        mappings: mergeLocalFormMappings(scan, result.fieldMappings ?? []),
      }
      setMapping(fillPackage)
      const saveStep = startActivity('Saving the reviewed fill package to this application.')
      await createFormFillSession(user, {
        applicationId: application.id,
        pageUrl: fillPackage.pageUrl || 'unknown',
        scan,
        mapping: fillPackage,
        status: 'mapped',
      })
      finishActivity(saveStep, 'success', 'Fill package saved and ready to review.')
      await logAiRun(user, { applicationId: application.id, task: 'map-application-form', result, usage: response.usage })
    } catch (error) {
      setActivity((current) => [...current, { id: `${Date.now()}-error`, label: error.message || 'The fill package could not be created.', status: 'error' }])
      setNotice({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Grid columns={{ xs: 1, lg: 2 }} gap="md">
      <Card>
        <Stack gap="md">
          <Heading as="h2" size="md">Map an external form</Heading>
          <Paragraph color="muted">Use the companion extension to scan the company or ATS form. The extension can send the scan here automatically, then you can copy the reviewed fill package back into the extension.</Paragraph>
          <Button icon="check_circle" loading={busy === 'applied'} onClick={markApplied}>Mark as applied</Button>
          <TextareaField label="Form scan JSON" rows={14} value={scanText} onChange={(event) => setScanText(event.target.value)} />
          <Button icon="auto_awesome" loading={busy} onClick={mapFields}>Map fields with Codex</Button>
        </Stack>
      </Card>
      <Card>
        <Stack gap="md">
          <Heading as="h2" size="md">Fill package</Heading>
          {activity.length > 0 && (
            <Stack gap="xs">
              <Paragraph size="sm" color="muted">Activity</Paragraph>
              {activity.map((item) => (
                <Stack key={item.id} direction="row" align="center" gap="sm">
                  <MessageBadge status={item.status} size="sm">
                    {item.status === 'info' ? 'In progress' : item.status === 'success' ? 'Complete' : 'Failed'}
                  </MessageBadge>
                  <Paragraph size="sm">{item.label}</Paragraph>
                </Stack>
              ))}
            </Stack>
          )}
          {mapping ? (
            <>
              <Code variant="block" wrapping collapsible collapsedLines={12}>{JSON.stringify(mapping, null, 2)}</Code>
              <Button
                icon="content_copy"
                onClick={async () => {
                  await copyText(JSON.stringify(mapping, null, 2))
                  setActivity((current) => [...current, { id: `${Date.now()}-copied`, label: 'Fill package copied to the clipboard.', status: 'success' }])
                }}
              >Copy fill package</Button>
            </>
          ) : (
            <Paragraph color="muted">No mapping yet.</Paragraph>
          )}
        </Stack>
      </Card>
    </Grid>
  )
}

function Settings({ user, profile, onProfile, onFeedback }) {
  const [form, setForm] = useState(() => normalizeProfile(profile))
  const [bridgeHost, setBridgeHost] = useState(() => localCodexBridgeHost())
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => setForm(normalizeProfile(profile)), [profile])

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function save() {
    setBusy(true)
    try {
      const saved = await saveProfile(user, {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        location: form.location,
        linkedinUrl: form.linkedinUrl,
        portfolioUrl: form.portfolioUrl,
        a1Url: form.a1Url,
        baseResume: { text: form.baseResume?.text ?? '' },
        preferences: form.preferences ?? {},
      })
      onProfile(saved)
      setStatus(null)
      onFeedback?.({ tone: 'success', message: 'Profile saved.' })
    } catch (error) {
      setStatus({ tone: 'error', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  async function checkBridge() {
    setLocalCodexBridgeHost(bridgeHost)
    setBusy(true)
    const ready = await checkLocalCodexBridge()
    setBusy(false)
    const feedback = ready
      ? { tone: 'success', message: 'Codex bridge is reachable.' }
      : { tone: 'warn', message: 'Codex bridge is not reachable. Run npm run codex:bridge:jobs.' }
    setStatus(null)
    onFeedback?.(feedback)
  }

  return (
    <Section padding="md" surface="raised" contentWidth="lg">
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading as="h1" size="lg">Settings</Heading>
          <Paragraph color="muted">Profile data is used to draft truthful packages and fill external forms.</Paragraph>
        </Stack>
        {status && isErrorFeedback(status) && <Banner status={status.tone}>{status.message}</Banner>}
        <Grid columns={{ xs: 1, lg: 2 }} gap="md">
          <Card>
            <Stack gap="md">
              <Heading as="h2" size="md">Candidate profile</Heading>
              <TextField label="Full name" value={form.fullName} onChange={(event) => set('fullName', event.target.value)} />
              <TextField label="Email" type="email" value={form.email} onChange={(event) => set('email', event.target.value)} />
              <TextField label="Phone" value={form.phone} onChange={(event) => set('phone', event.target.value)} />
              <TextField label="Location" value={form.location} onChange={(event) => set('location', event.target.value)} />
              <TextField label="LinkedIn URL" type="url" value={form.linkedinUrl} onChange={(event) => set('linkedinUrl', event.target.value)} />
              <TextField label="Portfolio URL" type="url" value={form.portfolioUrl} onChange={(event) => set('portfolioUrl', event.target.value)} />
              <TextField label="A1 URL" type="url" value={form.a1Url} onChange={(event) => set('a1Url', event.target.value)} />
              <TextareaField label="Base resume and experience notes" rows={12} value={form.baseResume?.text ?? ''} onChange={(event) => set('baseResume', { text: event.target.value })} />
              <Button icon="save" loading={busy} onClick={save}>Save profile</Button>
            </Stack>
          </Card>
          <Card>
            <Stack gap="md">
              <Heading as="h2" size="md">Codex bridge</Heading>
              <TextField label="Bridge host" value={bridgeHost} onChange={(event) => setBridgeHost(event.target.value)} />
              <Button variant="secondary" icon="hub" loading={busy} onClick={checkBridge}>Check bridge</Button>
              <Divider />
              <Heading as="h2" size="md">Autofill extension</Heading>
              <Paragraph color="muted">Install the companion extension from <Code variant="inline">apps/a1-jobs-extension</Code>. It imports visible job pages, scans forms, and fills fields only when you click it.</Paragraph>
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Section>
  )
}

export function App() {
  const { user, signOut } = useAuth()
  const [route, setRoute] = useState(() => routeFromLocation())
  const [applications, setApplications] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState(null)
  const [extensionImportStatus, setExtensionImportStatus] = useState(null)
  const [failedExtensionPayload, setFailedExtensionPayload] = useState(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [highlightedApplicationId, setHighlightedApplicationId] = useState(null)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(null)
  const importedExtensionJobId = useRef(null)

  const refresh = useCallback(async () => {
    setError(null)
    const [apps, nextProfile] = await Promise.all([
      listApplications(user),
      getProfile(user),
    ])
    setApplications(apps)
    setProfile(nextProfile)
    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh().catch((err) => {
      setError(err.message)
      setLoading(false)
    })
    return subscribeJobs(user, () => {
      refresh().catch((err) => setError(err.message))
    })
  }, [refresh, user])

  useEffect(() => {
    const onPop = () => setRoute(routeFromLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const selectedApplication = applications.find((application) => application.id === route.id)

  function upsertApplication(application) {
    setApplications((current) => current.map((item) => (item.id === application.id ? application : item)))
  }

  function addApplication(application) {
    setApplications((current) => [
      application,
      ...current.filter((item) => item.id !== application.id),
    ])
    setHighlightedApplicationId(application.id)
    window.setTimeout(() => setHighlightedApplicationId((current) => current === application.id ? null : current), 5000)
  }

  function removeLocalApplication(id) {
    setApplications((current) => current.filter((item) => item.id !== id))
  }

  async function deleteDashboardApplication(application) {
    await removeApplication(user, application.id)
    removeLocalApplication(application.id)
  }

  async function bulkGeneratePackages() {
    if (bulkBusy) return
    const queue = applications.filter((application) => application.status === 'researching')
    if (!queue.length) {
      showFeedback({ tone: 'warn', message: 'There are no researching jobs to complete.' })
      return
    }
    setBulkBusy(true)
    let completed = 0
    let failed = 0
    for (const [index, application] of queue.entries()) {
      setBulkProgress({
        title: 'Completing researching jobs',
        detail: `${index + 1} of ${queue.length}: ${application.title} at ${application.company}.`,
      })
      try {
        const updated = await generateExistingApplicationPackage({
          user,
          profile,
          application,
          onProgress: (message) => setBulkProgress({
            title: 'Completing researching jobs',
            detail: `${index + 1} of ${queue.length}: ${message}`,
          }),
        })
        upsertApplication(updated)
        completed += 1
      } catch (error) {
        failed += 1
        try {
          const updated = await updateApplication(user, application.id, {
            status: 'drafting',
            nextAction: 'Retry application package generation',
            summary: { ...(application.summary ?? {}), packageError: error.message },
          })
          upsertApplication(updated)
          await createEvent(user, { applicationId: application.id, kind: 'note', label: 'Bulk package generation needs review', notes: error.message })
        } catch {
          // Preserve the original failure count if the status update also fails.
        }
      }
    }
    setBulkProgress(null)
    setBulkBusy(false)
    showFeedback({
      tone: failed ? 'warn' : 'success',
      message: `Bulk package generation finished: ${completed} completed${failed ? `, ${failed} need review` : ''}.`,
    })
  }

  const showFeedback = useCallback((feedback) => {
    if (!feedback || isErrorFeedback(feedback)) return
    setSnackbar({ ...feedback, id: Date.now() })
  }, [])

  const clearExtensionImportBanner = useCallback(() => {
    clearStoredExtensionImport()
    importedExtensionJobId.current = null
    setFailedExtensionPayload(null)
    setExtensionImportStatus(null)
  }, [])

  const importExtensionJobPage = useCallback(async (payload, { force = false } = {}) => {
    if (loading || !profile) return
    if (payload?.type !== 'job-page' || !payload.jobPage?.url) return
    if (!force && payload.id === importedExtensionJobId.current) return
    if (!force && extensionPayloadIsStale(payload)) {
      clearStoredExtensionPayload()
      return
    }

    importedExtensionJobId.current = payload.id
    setFailedExtensionPayload(null)
    const setImportProgress = ({ tone = 'info', message, status = 'importing' }) => {
      writeExtensionStatus({ id: payload.id, type: payload.type, status, detail: message })
      setExtensionImportStatus({ tone, message })
      if (tone !== 'error') showFeedback({ tone, message })
    }
    setImportProgress({ message: 'Scraped page received. Preparing the job page import...' })
    try {
      const { application, duplicate } = await createSmartApplicationFromExtensionJobPage({
        user,
        profile,
        jobPage: payload.jobPage,
        onProgress: setImportProgress,
        onApplicationCreated: (createdApplication) => {
          addApplication(createdApplication)
          setImportProgress({
            status: 'created',
            message: `Job listing created for ${createdApplication.title} at ${createdApplication.company}. Parsing job details...`,
          })
        },
        onApplicationUpdated: (updatedApplication) => {
          addApplication(updatedApplication)
        },
      })
      addApplication(application)
      const completeMessage = duplicate
        ? 'That job is already in A1 Jobs. Opening the existing job page.'
        : application.status === 'ready'
          ? 'Job page imported and the application package is ready to review.'
          : 'Job page imported. The listing exists, but the package needs a manual retry from the job page.'
      const completeTone = duplicate ? 'warn' : application.status === 'ready' ? 'success' : 'warn'
      setExtensionImportStatus({
        tone: completeTone,
        message: completeMessage,
      })
      writeExtensionStatus({
        id: payload.id,
        type: payload.type,
        status: duplicate ? 'duplicate' : 'complete',
        detail: completeMessage,
        applicationId: application.id,
      })
      clearStoredExtensionPayload()
    } catch (importError) {
      clearStoredExtensionPayload()
      setFailedExtensionPayload(payload)
      setExtensionImportStatus({
        tone: 'error',
        message: smartJobErrorMessage(importError, 'Try advanced intake or copy the visible job text manually.'),
      })
      const detail = smartJobErrorMessage(importError, 'Try advanced intake or copy the visible job text manually.')
      writeExtensionStatus({
        id: payload.id,
        type: payload.type,
        status: 'error',
        error: importError.message,
        detail,
      })
    }
  }, [loading, profile, user])

  function retryExtensionImport() {
    const payload = failedExtensionPayload || readStoredExtensionPayload()
    if (!payload) {
      showFeedback({ tone: 'warn', message: 'There is no extension scrape to retry. Scan the job page again from the extension.' })
      return
    }
    importedExtensionJobId.current = null
    importExtensionJobPage(payload, { force: true })
  }

  useEffect(() => {
    if (loading) return undefined

    function handleExtensionPayload(event) {
      importExtensionJobPage(event.detail)
    }

    function handleStorage(event) {
      if (event.key !== EXTENSION_PAYLOAD_KEY || !event.newValue) return
      try {
        importExtensionJobPage(JSON.parse(event.newValue))
      } catch {
        setExtensionImportStatus({ tone: 'error', message: 'The extension sent payload JSON that could not be read.' })
      }
    }

    importExtensionJobPage(readStoredExtensionPayload())
    window.addEventListener('a1-jobs-extension-payload', handleExtensionPayload)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('a1-jobs-extension-payload', handleExtensionPayload)
      window.removeEventListener('storage', handleStorage)
    }
	  }, [importExtensionJobPage, loading])

  const header = <AppHeader route={route} user={user} onSignOut={signOut} onAddJob={() => setAddDialogOpen(true)} />

  return (
    <PageLayout header={header} stickyHeader>
      {!loading && (
        <AddJobDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
	          user={user}
	          profile={profile}
	          onCreated={addApplication}
	          onFeedback={showFeedback}
	        />
	      )}
      {error && (
        <Section padding="sm" surface="panel">
          <Banner status="error">{error}</Banner>
        </Section>
      )}
	      {extensionImportStatus && isErrorFeedback(extensionImportStatus) && (
	        <Section padding="sm" surface="panel">
          <Banner status={extensionImportStatus.tone}>
            <Stack direction="row" justify="between" align="center" gap="sm" wrap>
              <span>{extensionImportStatus.message}</span>
              <ButtonContainer>
                {extensionImportStatus.tone === 'error' && (
                  <Button variant="secondary" size="sm" icon="refresh" onClick={retryExtensionImport}>Retry</Button>
                )}
                <Button variant="secondary" size="sm" icon="close" onClick={clearExtensionImportBanner}>Dismiss</Button>
              </ButtonContainer>
            </Stack>
	          </Banner>
	        </Section>
	      )}
      <FeedbackSnackbar
	        feedback={snackbar || (!isErrorFeedback(extensionImportStatus) ? extensionImportStatus : null)}
	        onClose={() => {
	          setSnackbar(null)
	          if (!isErrorFeedback(extensionImportStatus)) setExtensionImportStatus(null)
	        }}
	        persistent={!snackbar && Boolean(extensionImportStatus)}
      />
      <GenerationProgress progress={bulkProgress} />
      {loading && (
        <Section padding="md" surface="raised">
          <Paragraph>Loading applications...</Paragraph>
        </Section>
      )}
      {!loading && route.page === 'dashboard' && (
        <Dashboard
          applications={applications}
          onAddJob={() => setAddDialogOpen(true)}
          onDelete={deleteDashboardApplication}
          onFeedback={showFeedback}
          highlightedApplicationId={highlightedApplicationId}
          onBulkGenerate={bulkGeneratePackages}
          bulkBusy={bulkBusy}
        />
      )}
      {!loading && route.page === 'analytics' && <Analytics applications={applications} />}
      {!loading && route.page === 'intake' && <Intake user={user} profile={profile} onCreated={(application) => { addApplication(application); navigate('/') }} onFeedback={showFeedback} />}
      {!loading && route.page === 'application' && (
        <ApplicationDetail
          user={user}
          profile={profile}
          application={selectedApplication}
	          onUpdated={upsertApplication}
	          onDeleted={removeLocalApplication}
	          onFeedback={showFeedback}
	        />
	      )}
	      {!loading && route.page === 'settings' && <Settings user={user} profile={profile} onProfile={setProfile} onFeedback={showFeedback} />}
    </PageLayout>
  )
}
