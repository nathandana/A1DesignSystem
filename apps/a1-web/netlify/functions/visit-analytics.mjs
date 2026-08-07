import { isIP } from 'node:net'
import { createClient } from '@supabase/supabase-js'

const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const VALID_ACTIONS = new Set(['pageview', 'heartbeat', 'end'])
const AUTOMATED_AGENT_CATEGORIES = new Set(['ai-agent', 'crawler', 'page-preview', 'tooling'])

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

function optionalText(value, maximumLength = 500) {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text ? text.slice(0, maximumLength) : null
}

function optionalNumber(value) {
  return Number.isFinite(value) ? value : null
}

function requestHeader(request, name, maximumLength = 500) {
  return optionalText(request.headers.get(name), maximumLength)
}

function browserName(userAgent, brands) {
  const value = `${brands ?? ''} ${userAgent ?? ''}`
  if (/Edg\//i.test(value)) return 'Microsoft Edge'
  if (/OPR\//i.test(value)) return 'Opera'
  if (/SamsungBrowser/i.test(value)) return 'Samsung Internet'
  if (/Firefox|FxiOS/i.test(value)) return 'Firefox'
  if (/Chrome|Chromium|CriOS/i.test(value)) return 'Chrome'
  if (/Safari/i.test(value) && !/Chrome|Chromium|CriOS|Android/i.test(value)) return 'Safari'
  return optionalText(userAgent) ? 'Other' : null
}

function platformName(userAgent, clientHintPlatform) {
  if (clientHintPlatform) return clientHintPlatform.replaceAll('"', '')
  if (/iPhone|iPad|iPod/i.test(userAgent ?? '')) return 'iOS'
  if (/Android/i.test(userAgent ?? '')) return 'Android'
  if (/Windows/i.test(userAgent ?? '')) return 'Windows'
  if (/Macintosh|Mac OS X/i.test(userAgent ?? '')) return 'macOS'
  if (/Linux/i.test(userAgent ?? '')) return 'Linux'
  return null
}

function deviceType(userAgent, mobileHint, agentCategory) {
  const category = optionalText(agentCategory)?.split(';')[0]
  if (AUTOMATED_AGENT_CATEGORIES.has(category) || /bot|crawler|spider|slurp|headless/i.test(userAgent ?? '')) {
    return 'automated'
  }
  if (/iPad|Tablet|Kindle|Silk/i.test(userAgent ?? '')) return 'tablet'
  if (mobileHint === '?1' || /Mobi|iPhone|iPod|Android.*Mobile/i.test(userAgent ?? '')) return 'mobile'
  return optionalText(userAgent) ? 'desktop' : 'unknown'
}

function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => (
    entry !== null && entry !== undefined && entry !== ''
  )))
}

export function buildVisitorContext(request, context = {}) {
  const userAgent = requestHeader(request, 'user-agent', 1000)
  const brands = requestHeader(request, 'sec-ch-ua')
  const mobileHint = requestHeader(request, 'sec-ch-ua-mobile', 10)
  const platform = requestHeader(request, 'sec-ch-ua-platform', 100)
  const agentCategory = requestHeader(request, 'netlify-agent-category', 100)
  const geo = context?.geo ?? {}

  return {
    device: compactObject({
      type: deviceType(userAgent, mobileHint, agentCategory),
      browser: browserName(userAgent, brands),
      platform: platformName(userAgent, platform),
      reportedMobile: mobileHint === '?1' ? true : mobileHint === '?0' ? false : null,
    }),
    browser: compactObject({
      userAgent,
      acceptLanguage: requestHeader(request, 'accept-language', 300),
      brands,
      mobile: mobileHint,
      platform,
      platformVersion: requestHeader(request, 'sec-ch-ua-platform-version', 100),
      model: requestHeader(request, 'sec-ch-ua-model', 200),
      architecture: requestHeader(request, 'sec-ch-ua-arch', 100),
      bitness: requestHeader(request, 'sec-ch-ua-bitness', 20),
      fullVersionList: requestHeader(request, 'sec-ch-ua-full-version-list', 500),
    }),
    geo: compactObject({
      city: optionalText(geo.city, 200),
      countryCode: optionalText(geo.country?.code, 10),
      countryName: optionalText(geo.country?.name, 200),
      latitude: optionalNumber(geo.latitude),
      longitude: optionalNumber(geo.longitude),
      postalCode: optionalText(geo.postalCode, 40),
      subdivisionCode: optionalText(geo.subdivision?.code, 20),
      subdivisionName: optionalText(geo.subdivision?.name, 200),
      timezone: optionalText(geo.timezone, 100),
    }),
    netlify: compactObject({
      requestId: optionalText(context?.requestId, 100),
      agentCategory,
      serverRegion: optionalText(context?.server?.region, 100),
      deployContext: optionalText(context?.deploy?.context, 100),
      deployId: optionalText(context?.deploy?.id, 100),
      deployPublished: typeof context?.deploy?.published === 'boolean' ? context.deploy.published : null,
      siteId: optionalText(context?.site?.id, 100),
      siteName: optionalText(context?.site?.name, 200),
      siteUrl: optionalText(context?.site?.url, 500),
    }),
  }
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
    const visitorContext = dependencies.visitorContext
      ?? buildVisitorContext(request, dependencies.netlifyContext)

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
      p_visitor_context: visitorContext,
    })
    if (error) {
      throw new HttpError(503, 'Visit analytics is not ready. Apply the latest site-visit analytics migrations.')
    }
    return json({ ok: true })
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500
    return json({ error: error?.message ?? 'Visit analytics failed.' }, status)
  }
}

export default (request, context) => handleVisitAnalyticsRequest(request, {
  clientIp: context?.ip,
  netlifyContext: context,
})
