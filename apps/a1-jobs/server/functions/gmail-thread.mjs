import { getOne } from '../localDb.mjs'
import { gmailHeaders, json, options, requireUser, usableGoogleAccessToken } from './_utils.mjs'

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return options()
  try {
    const { user } = await requireUser(event)
    const threadId = event.queryStringParameters?.threadId
    if (!threadId) throw new Error('Missing threadId.')
    const connection = getOne('gmail_connections', { user_id: user.id })
    if (!connection) return json(409, { error: 'Gmail is not connected.' })

    const accessToken = await usableGoogleAccessToken(connection)
    const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${encodeURIComponent(threadId)}?format=full`, {
      headers: gmailHeaders(accessToken),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Could not read Gmail thread.')
    return json(200, { thread: data })
  } catch (error) {
    return json(400, { error: error.message })
  }
}
