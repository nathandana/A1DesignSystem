import { getOne, listRows, updateRow, upsertGmailMessage } from '../localDb.mjs'
import { gmailHeaders, json, options, requireUser, usableGoogleAccessToken } from './_utils.mjs'

function headerValue(message, name) {
  const headers = message.payload?.headers ?? []
  return headers.find((header) => String(header.name).toLowerCase() === name.toLowerCase())?.value ?? ''
}

function matchApplication(message, applications) {
  const haystack = `${message.subject || ''} ${message.from || ''} ${message.snippet || ''}`.toLowerCase()
  let best = null
  for (const app of applications) {
    const company = String(app.company || '').toLowerCase()
    if (company && haystack.includes(company)) {
      best = { id: app.id, confidence: 0.84 }
      break
    }
  }
  return best ?? { id: null, confidence: null }
}

async function gmailJson(path, accessToken) {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`, {
    headers: gmailHeaders(accessToken),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Gmail request failed.')
  return data
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return options()
  try {
    const { user } = await requireUser(event)
    const body = event.body ? JSON.parse(event.body) : {}
    const connection = getOne('gmail_connections', { user_id: user.id })
    if (!connection) return json(409, { error: 'Gmail is not connected.' })

    const accessToken = await usableGoogleAccessToken(connection)
    const query = body.q || 'newer_than:180d (application OR interview OR recruiter OR hiring OR offer OR "thank you for applying")'
    const list = await gmailJson(`messages?${new URLSearchParams({ maxResults: String(body.maxResults || 25), q: query })}`, accessToken)
    const ids = (list.messages ?? []).map((message) => message.id)
    const applications = listRows('job_applications', { user_id: user.id }, 'updated_at desc')

    const rows = []
    for (const id of ids) {
      const message = await gmailJson(`messages/${id}?${new URLSearchParams({
        format: 'metadata',
        metadataHeaders: 'Subject',
      })}&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`, accessToken)
      const subject = headerValue(message, 'Subject')
      const from = headerValue(message, 'From')
      const to = headerValue(message, 'To')
      const received = headerValue(message, 'Date')
      const match = matchApplication({ subject, from, snippet: message.snippet }, applications ?? [])
      rows.push({
        user_id: user.id,
        application_id: match.id,
        provider: 'gmail',
        provider_message_id: message.id,
        thread_id: message.threadId,
        subject,
        from_email: from,
        to_emails: to ? [to] : [],
        snippet: message.snippet ?? '',
        direction: 'inbound',
        matched_confidence: match.confidence,
        received_at: received ? new Date(received).toISOString() : null,
        raw: { labelIds: message.labelIds ?? [] },
      })
    }

    for (const row of rows) upsertGmailMessage(row)

    updateRow('gmail_connections', connection.id, { last_synced_at: new Date().toISOString() })

    return json(200, { count: rows.length })
  } catch (error) {
    return json(400, { error: error.message })
  }
}
