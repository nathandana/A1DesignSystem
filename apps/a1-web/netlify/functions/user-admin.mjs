import { isIP } from 'node:net'
import { createClient } from '@supabase/supabase-js'

const VALID_ROLES = new Set(['user', 'editor', 'admin'])
const AUDIT_TABLE = 'a1_user_admin_audit'
const LOGIN_AUDIT_TABLE = 'a1_user_login_audit'
const VISIT_AUDIT_TABLE = 'a1_site_visit_audit'
const USER_PAGE_SIZE = 1000
const AUDIT_LIMIT = 50
const AUDIT_PAGE_SIZE = 1000
const AUDIT_COLUMNS = 'id,actor_user_id,actor_email,target_user_id,target_email,action,previous_role,new_role,created_at'
const LOGIN_AUDIT_COLUMNS = 'id,user_id,user_email,signed_in_at'
const VISIT_AUDIT_COLUMNS = 'session_id,user_id,user_email,ip_addresses,pages,visitor_context,started_at,last_seen_at,ended_at'
const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const IP_LOOKUP_BASE_URL = 'https://ipapi.co'

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
      'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    },
  })
}

export function roleFromUser(user) {
  const role = user?.app_metadata?.role
  return VALID_ROLES.has(role) ? role : 'user'
}

export function serializeUser(user) {
  return {
    id: user.id,
    email: user.email ?? '',
    role: roleFromUser(user),
    createdAt: user.created_at ?? null,
    updatedAt: user.updated_at ?? null,
    invitedAt: user.invited_at ?? null,
    confirmationSentAt: user.confirmation_sent_at ?? null,
    emailConfirmedAt: user.email_confirmed_at ?? null,
    lastSignInAt: user.last_sign_in_at ?? null,
    phone: user.phone ?? '',
    providers: Array.isArray(user.app_metadata?.providers)
      ? user.app_metadata.providers.filter((provider) => typeof provider === 'string')
      : [],
    bannedUntil: user.banned_until ?? null,
    isAnonymous: Boolean(user.is_anonymous),
  }
}

function bearerToken(request) {
  const header = request.headers.get('authorization') ?? ''
  return header.replace(/^Bearer\s+/i, '').trim()
}

function requiredRole(value) {
  if (!VALID_ROLES.has(value)) {
    throw new HttpError(400, 'Role must be user, editor or admin.')
  }
  return value
}

function requiredEmail(value) {
  const email = String(value ?? '').trim().toLowerCase()
  if (!email || !email.includes('@')) {
    throw new HttpError(400, 'Enter a valid email address.')
  }
  return email
}

function requiredUserId(value) {
  const userId = String(value ?? '').trim()
  if (!userId) throw new HttpError(400, 'User id is required.')
  return userId
}

function requiredSessionId(value) {
  const sessionId = String(value ?? '').trim()
  if (!SESSION_ID_PATTERN.test(sessionId)) throw new HttpError(400, 'A valid visit ID is required.')
  return sessionId
}

function optionalText(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

export async function lookupIpAddress(ipAddress, fetchImpl = fetch) {
  const ip = String(ipAddress ?? '').trim()
  if (!isIP(ip)) return { ip, available: false }

  try {
    const response = await fetchImpl(`${IP_LOOKUP_BASE_URL}/${encodeURIComponent(ip)}/json/`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    })
    const data = await response.json()
    if (!response.ok || data?.error) return { ip, available: false }

    return {
      ip,
      available: true,
      network: optionalText(data.network),
      version: optionalText(data.version),
      city: optionalText(data.city),
      region: optionalText(data.region),
      regionCode: optionalText(data.region_code),
      country: optionalText(data.country_name),
      countryCode: optionalText(data.country_code),
      postalCode: optionalText(data.postal),
      latitude: Number.isFinite(data.latitude) ? data.latitude : null,
      longitude: Number.isFinite(data.longitude) ? data.longitude : null,
      timeZone: optionalText(data.timezone),
      utcOffset: optionalText(data.utc_offset),
      asn: optionalText(data.asn),
      organization: optionalText(data.org),
    }
  } catch {
    return { ip, available: false }
  }
}

async function requireAdministrator(client, request) {
  const token = bearerToken(request)
  if (!token) throw new HttpError(401, 'Sign in to manage users.')

  const { data, error } = await client.auth.getUser(token)
  if (error || !data?.user) throw new HttpError(401, 'Your session is no longer valid. Sign in again.')
  if (roleFromUser(data.user) !== 'admin') {
    throw new HttpError(403, 'Administrator access is required.')
  }
  return data.user
}

async function listAllUsers(client) {
  const users = []
  let page = 1

  while (true) {
    const { data, error } = await client.auth.admin.listUsers({
      page,
      perPage: USER_PAGE_SIZE,
    })
    if (error) throw new HttpError(502, error.message)

    const batch = data?.users ?? []
    users.push(...batch)
    if (batch.length < USER_PAGE_SIZE || (data?.lastPage && page >= data.lastPage)) break
    page += 1
  }

  return users
    .map(serializeUser)
    .sort((a, b) => a.email.localeCompare(b.email))
}

async function listAudit(client) {
  const { data, error } = await client
    .from(AUDIT_TABLE)
    .select(AUDIT_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(AUDIT_LIMIT)

  if (error) {
    throw new HttpError(503, 'User administration is not ready. Apply the A1-405 user-management migration.')
  }
  return data ?? []
}

async function listAuditBy(client, column, value) {
  const entries = []
  let from = 0

  while (true) {
    const { data, error } = await client
      .from(AUDIT_TABLE)
      .select(AUDIT_COLUMNS)
      .eq(column, value)
      .order('created_at', { ascending: false })
      .range(from, from + AUDIT_PAGE_SIZE - 1)

    if (error) {
      throw new HttpError(503, 'User administration is not ready. Apply the A1-405 profile-management migration.')
    }
    const batch = data ?? []
    entries.push(...batch)
    if (batch.length < AUDIT_PAGE_SIZE) break
    from += AUDIT_PAGE_SIZE
  }

  return entries
}

async function listLoginAudit(client) {
  const entries = []
  let from = 0

  while (true) {
    const { data, error } = await client
      .from(LOGIN_AUDIT_TABLE)
      .select(LOGIN_AUDIT_COLUMNS)
      .order('signed_in_at', { ascending: false })
      .range(from, from + AUDIT_PAGE_SIZE - 1)

    if (error) {
      throw new HttpError(503, 'Login history is not ready. Apply the A1-405 profile-management migration.')
    }
    const batch = data ?? []
    entries.push(...batch)
    if (batch.length < AUDIT_PAGE_SIZE) break
    from += AUDIT_PAGE_SIZE
  }

  return entries
}

async function listVisitAudit(client) {
  // ponytail: the current admin dataset is small; add server pagination when volume warrants it.
  const entries = []
  let from = 0

  while (true) {
    const { data, error } = await client
      .from(VISIT_AUDIT_TABLE)
      .select(VISIT_AUDIT_COLUMNS)
      .order('started_at', { ascending: false })
      .range(from, from + AUDIT_PAGE_SIZE - 1)

    if (error) {
      throw new HttpError(503, 'Visit analytics is not ready. Apply the latest site-visit analytics migrations.')
    }
    const batch = data ?? []
    entries.push(...batch)
    if (batch.length < AUDIT_PAGE_SIZE) break
    from += AUDIT_PAGE_SIZE
  }

  return entries
}

async function getVisitDetails(client, sessionId, dependencies) {
  const { data, error } = await client
    .from(VISIT_AUDIT_TABLE)
    .select(VISIT_AUDIT_COLUMNS)
    .eq('session_id', sessionId)
    .limit(1)

  if (error) {
    throw new HttpError(503, 'Visit analytics is not ready. Apply the latest site-visit analytics migrations.')
  }
  const visit = data?.[0]
  if (!visit) throw new HttpError(404, 'Visit not found.')

  const lookup = dependencies.lookupIpAddress
    ?? ((ip) => lookupIpAddress(ip, dependencies.fetch ?? fetch))
  const ipAddresses = [...new Set(Array.isArray(visit.ip_addresses) ? visit.ip_addresses : [])]
  const ipLookups = await Promise.all(ipAddresses.map((ip) => lookup(ip)))
  return json({ visit, ipLookups })
}

async function listLoginAuditBy(client, column, value) {
  const entries = []
  let from = 0

  while (true) {
    const { data, error } = await client
      .from(LOGIN_AUDIT_TABLE)
      .select(LOGIN_AUDIT_COLUMNS)
      .eq(column, value)
      .order('signed_in_at', { ascending: false })
      .range(from, from + AUDIT_PAGE_SIZE - 1)

    if (error) {
      throw new HttpError(503, 'Login history is not ready. Apply the A1-405 profile-management migration.')
    }
    const batch = data ?? []
    entries.push(...batch)
    if (batch.length < AUDIT_PAGE_SIZE) break
    from += AUDIT_PAGE_SIZE
  }

  return entries
}

async function getUserProfile(client, userId) {
  const { data, error } = await client.auth.admin.getUserById(userId)
  if (error || !data?.user) throw new HttpError(404, error?.message ?? 'Account not found.')

  const user = serializeUser(data.user)
  const [history, logins] = await Promise.all([
    listAuditBy(client, 'target_user_id', user.id),
    listLoginAuditBy(client, 'user_id', user.id),
  ])

  return json({ user, history, logins })
}

async function ensureAuditReady(client) {
  const { error } = await client.from(AUDIT_TABLE).select('id').limit(1)
  if (error) {
    throw new HttpError(503, 'User administration is not ready. Apply the A1-405 user-management migration.')
  }
}

async function recordAudit(client, entry) {
  const { error } = await client.from(AUDIT_TABLE).insert(entry)
  if (error) throw new HttpError(502, 'The account changed, but the audit entry could not be recorded.')
}

async function inviteUser(client, actor, request) {
  const body = await request.json()
  const email = requiredEmail(body?.email)
  const role = requiredRole(body?.role)
  await ensureAuditReady(client)

  const redirectTo = new URL('/', request.url).toString()
  const { data, error } = await client.auth.admin.inviteUserByEmail(email, { redirectTo })
  if (error) throw new HttpError(400, error.message)

  const invitedUser = data?.user
  if (!invitedUser?.id) throw new HttpError(502, 'Supabase did not return the invited account.')

  const { data: updated, error: updateError } = await client.auth.admin.updateUserById(
    invitedUser.id,
    { app_metadata: { ...(invitedUser.app_metadata ?? {}), role } },
  )
  if (updateError) {
    await client.auth.admin.deleteUser(invitedUser.id)
    throw new HttpError(502, updateError.message)
  }

  await recordAudit(client, {
    actor_user_id: actor.id,
    actor_email: actor.email ?? null,
    target_user_id: invitedUser.id,
    target_email: email,
    action: 'user_invited',
    previous_role: null,
    new_role: role,
  })

  return json({ user: serializeUser(updated?.user ?? invitedUser) }, 201)
}

async function updateRole(client, actor, request) {
  const body = await request.json()
  const userId = requiredUserId(body?.userId)
  const role = requiredRole(body?.role)
  if (userId === actor.id) {
    throw new HttpError(400, 'Change your own role through a separate trusted administrator.')
  }
  await ensureAuditReady(client)

  const { data: current, error: getError } = await client.auth.admin.getUserById(userId)
  if (getError || !current?.user) throw new HttpError(404, getError?.message ?? 'Account not found.')

  const previousRole = roleFromUser(current.user)
  if (previousRole === role) return json({ user: serializeUser(current.user) })

  const { data: updated, error } = await client.auth.admin.updateUserById(userId, {
    app_metadata: { ...(current.user.app_metadata ?? {}), role },
  })
  if (error) throw new HttpError(400, error.message)

  await recordAudit(client, {
    actor_user_id: actor.id,
    actor_email: actor.email ?? null,
    target_user_id: userId,
    target_email: current.user.email ?? null,
    action: 'role_changed',
    previous_role: previousRole,
    new_role: role,
  })

  return json({ user: serializeUser(updated?.user ?? current.user) })
}

async function deleteUser(client, actor, request) {
  const body = await request.json()
  const userId = requiredUserId(body?.userId)
  if (userId === actor.id) {
    throw new HttpError(400, 'You cannot delete your own administrator account.')
  }
  await ensureAuditReady(client)

  const { data: current, error: getError } = await client.auth.admin.getUserById(userId)
  if (getError || !current?.user) throw new HttpError(404, getError?.message ?? 'Account not found.')

  const identifier = String(current.user.email || current.user.id).trim()
  const confirmation = String(body?.confirmEmail ?? '').trim()
  if (!identifier || confirmation.toLowerCase() !== identifier.toLowerCase()) {
    throw new HttpError(400, 'Enter the account email or user ID exactly to confirm deletion.')
  }

  const previousRole = roleFromUser(current.user)
  const { error } = await client.auth.admin.deleteUser(userId)
  if (error) throw new HttpError(400, error.message)

  await recordAudit(client, {
    actor_user_id: actor.id,
    actor_email: actor.email ?? null,
    target_user_id: null,
    target_email: current.user.email ?? null,
    action: 'user_deleted',
    previous_role: previousRole,
    new_role: null,
  })

  return json({ deletedUserId: userId })
}

export async function handleUserAdminRequest(request, dependencies = {}) {
  if (request.method === 'OPTIONS') return json({}, 204)

  try {
    const supabaseUrl = dependencies.supabaseUrl
      ?? process.env.SUPABASE_URL
      ?? process.env.VITE_SUPABASE_URL
    const serviceRoleKey = dependencies.serviceRoleKey
      ?? process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      throw new HttpError(503, 'User administration is not configured on the server.')
    }

    const makeClient = dependencies.createClient ?? createClient
    const client = makeClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const actor = await requireAdministrator(client, request)

    if (request.method === 'GET') {
      const searchParams = new URL(request.url).searchParams
      const resource = searchParams.get('resource')
      if (resource === 'visits') {
        const sessionId = searchParams.get('sessionId')
        if (sessionId) {
          return await getVisitDetails(client, requiredSessionId(sessionId), dependencies)
        }
        return json({ visits: await listVisitAudit(client) })
      }
      if (resource) throw new HttpError(400, 'Unknown administration resource.')

      const userId = searchParams.get('userId')
      if (userId) return await getUserProfile(client, requiredUserId(userId))
      const [users, audit, logins] = await Promise.all([
        listAllUsers(client),
        listAudit(client),
        listLoginAudit(client),
      ])
      return json({ users, audit, logins })
    }
    if (request.method === 'POST') return await inviteUser(client, actor, request)
    if (request.method === 'PATCH') return await updateRole(client, actor, request)
    if (request.method === 'DELETE') return await deleteUser(client, actor, request)
    throw new HttpError(405, 'Method not allowed.')
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500
    return json({ error: error?.message ?? 'User administration failed.' }, status)
  }
}

export default (request) => handleUserAdminRequest(request)
