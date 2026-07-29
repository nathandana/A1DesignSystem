import { createClient } from '@supabase/supabase-js'

const VALID_ROLES = new Set(['user', 'editor', 'admin'])
const AUDIT_TABLE = 'a1_user_admin_audit'
const USER_PAGE_SIZE = 1000
const AUDIT_LIMIT = 50

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
      'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS',
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
    invitedAt: user.invited_at ?? null,
    emailConfirmedAt: user.email_confirmed_at ?? null,
    lastSignInAt: user.last_sign_in_at ?? null,
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
    .select('id,actor_user_id,actor_email,target_user_id,target_email,action,previous_role,new_role,created_at')
    .order('created_at', { ascending: false })
    .limit(AUDIT_LIMIT)

  if (error) {
    throw new HttpError(503, 'User administration is not ready. Apply the A1-405 user-management migration.')
  }
  return data ?? []
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
      const [users, audit] = await Promise.all([listAllUsers(client), listAudit(client)])
      return json({ users, audit })
    }
    if (request.method === 'POST') return await inviteUser(client, actor, request)
    if (request.method === 'PATCH') return await updateRole(client, actor, request)
    throw new HttpError(405, 'Method not allowed.')
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500
    return json({ error: error?.message ?? 'User administration failed.' }, status)
  }
}

export default (request) => handleUserAdminRequest(request)
