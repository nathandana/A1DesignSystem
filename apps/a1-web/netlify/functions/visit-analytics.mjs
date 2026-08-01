import { isIP } from 'node:net'
import { createClient } from '@supabase/supabase-js'

const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const VALID_ACTIONS = new Set(['pageview', 'heartbeat', 'end'])

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function json(data, status = 200) {
  return new Response(status === 204 ? null : JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-headers': 'authorization,content-type',
      'access-control-allow-methods': 'POST,OPTIONS',
    },
  })
}

function bearerToken(request) {
  const header = request.headers.get('authorization') ?? ''
  return header.replace(/^Bearer\s+/i, '').trim()
}

function requiredClientIp(value) {
  const ip = String(value ?? '').trim()
  if (!isIP(ip)) throw new HttpError(503, 'Visit analytics could not resolve the client IP address.')
  return ip
}

function requiredSessionId(value) {
  const sessionId = String(value ?? '').trim()
  if (!SESSION_ID_PATTERN.test(sessionId)) throw new HttpError(400, 'A valid visit ID is required.')
  return sessionId
}

function requiredAction(value) {
  const action = String(value ?? '').trim()
  if (!VALID_ACTIONS.has(action)) throw new HttpError(400, 'Visit action must be pageview, heartbeat or end.')
  return action
}

function pageDetails(body, action) {
  if (action !== 'pageview') return { page: null, path: null }
  const page = String(body?.page ?? '').trim()
  const path = String(body?.path ?? '').trim()
  if (!page || page.length > 100 || !/^[a-z0-9:_-]+$/i.test(page)) {
    throw new HttpError(400, 'A valid page identifier is required.')
  }
  if (!path.startsWith('/') || path.length > 300 || path.includes('?') || path.includes('#')) {
    throw new HttpError(400, 'A valid page path is required.')
  }
  return { page, path }
}

async function optionalUser(client, request) {
  const token = bearerToken(request)
  if (!token) return null
  const { data, error } = await client.auth.getUser(token)
  return error ? null : data?.user ?? null
}

export async function handleVisitAnalyticsRequest(request, dependencies = {}) {
  if (request.method === 'OPTIONS') return json({}, 204)

  try {
    if (request.method !== 'POST') throw new HttpError(405, 'Method not allowed.')

    const supabaseUrl = dependencies.supabaseUrl
      ?? process.env.SUPABASE_URL
      ?? process.env.VITE_SUPABASE_URL
    const serviceRoleKey = dependencies.serviceRoleKey
      ?? process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      throw new HttpError(503, 'Visit analytics is not configured on the server.')
    }

    const body = await request.json()
    const action = requiredAction(body?.action)
    const sessionId = requiredSessionId(body?.sessionId)
    const { page, path } = pageDetails(body, action)
    const clientIp = requiredClientIp(dependencies.clientIp)

    const makeClient = dependencies.createClient ?? createClient
    const client = makeClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const user = await optionalUser(client, request)
    const { error } = await client.rpc('a1_record_site_visit', {
      p_session_id: sessionId,
      p_ip_address: clientIp,
      p_page: page,
      p_path: path,
      p_user_id: user?.id ?? null,
      p_user_email: user?.email ?? null,
      p_end: action === 'end',
    })
    if (error) {
      throw new HttpError(503, 'Visit analytics is not ready. Apply the site-visit analytics migration.')
    }
    return json({ ok: true })
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500
    return json({ error: error?.message ?? 'Visit analytics failed.' }, status)
  }
}

export default (request, context) => handleVisitAnalyticsRequest(request, {
  clientIp: context?.ip,
})
