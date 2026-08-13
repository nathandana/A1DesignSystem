import assert from 'node:assert/strict'
import test from 'node:test'
import {
  handleUserAdminRequest,
  lookupIpAddress,
  roleFromUser,
  serializeUser,
} from '../netlify/functions/user-admin.mjs'

function request(method = 'GET', body, query = '') {
  return new Request(`https://a1.example/.netlify/functions/user-admin${query}`, {
    method,
    headers: {
      authorization: 'Bearer valid-token',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

function makeClient({
  actorRole = 'admin',
  users = [],
  target = null,
  audit = [],
  logins = [],
  visits = [],
} = {}) {
  const auditEntries = [...audit]
  const loginEntries = [...logins]
  const updates = []
  const invites = []
  const deleted = []
  const actor = {
    id: 'actor-id',
    email: 'admin@example.com',
    app_metadata: { role: actorRole },
  }

  return {
    auditEntries,
    loginEntries,
    updates,
    invites,
    deleted,
    auth: {
      getUser: async () => ({ data: { user: actor }, error: null }),
      admin: {
        listUsers: async () => ({ data: { users, lastPage: 1 }, error: null }),
        inviteUserByEmail: async (email) => {
          invites.push(email)
          return {
            data: {
              user: {
                id: 'invited-id',
                email,
                app_metadata: {},
                invited_at: '2026-07-29T12:00:00Z',
              },
            },
            error: null,
          }
        },
        getUserById: async () => ({ data: { user: target }, error: target ? null : new Error('Missing') }),
        updateUserById: async (id, attributes) => {
          updates.push({ id, attributes })
          const original = id === 'invited-id'
            ? { id, email: 'new@example.com', app_metadata: {} }
            : target
          return {
            data: { user: { ...original, app_metadata: attributes.app_metadata } },
            error: null,
          }
        },
        deleteUser: async (id) => {
          deleted.push(id)
          return { error: null }
        },
      },
    },
    from: (table) => {
      let filter = null
      const entries = table === 'a1_user_login_audit'
        ? loginEntries
        : table === 'a1_site_visit_audit'
          ? visits
          : auditEntries
      const rows = () => filter
        ? entries.filter((entry) => entry[filter.column] === filter.value)
        : entries
      const builder = {
        select() {
          return builder
        },
        eq(column, value) {
          filter = { column, value }
          return builder
        },
        order() {
          return builder
        },
        limit: async (limit) => ({ data: rows().slice(0, limit), error: null }),
        range: async (from, to) => ({ data: rows().slice(from, to + 1), error: null }),
        insert: async (entry) => {
          entries.push(entry)
          return { error: null }
        },
      }
      return builder
    },
  }
}

function dependencies(client, overrides = {}) {
  return {
    supabaseUrl: 'https://project.supabase.co',
    serviceRoleKey: 'server-secret',
    createClient: () => client,
    ...overrides,
  }
}

test('projects the supported location and network fields from an IP lookup', async () => {
  const result = await lookupIpAddress('8.8.8.8', async (url) => {
    assert.equal(url, 'https://ipapi.co/8.8.8.8/json/')
    return new Response(JSON.stringify({
      network: '8.8.8.0/24',
      version: 'IPv4',
      city: 'Mountain View',
      region: 'California',
      region_code: 'CA',
      country_name: 'United States',
      country_code: 'US',
      postal: '94043',
      latitude: 37.4,
      longitude: -122.1,
      timezone: 'America/Los_Angeles',
      utc_offset: '-0700',
      asn: 'AS15169',
      org: 'Google LLC',
      unused: 'not returned',
    }), { status: 200 })
  })

  assert.deepEqual(result, {
    ip: '8.8.8.8',
    available: true,
    network: '8.8.8.0/24',
    version: 'IPv4',
    city: 'Mountain View',
    region: 'California',
    regionCode: 'CA',
    country: 'United States',
    countryCode: 'US',
    postalCode: '94043',
    latitude: 37.4,
    longitude: -122.1,
    timeZone: 'America/Los_Angeles',
    utcOffset: '-0700',
    asn: 'AS15169',
    organization: 'Google LLC',
  })
})

test('normalizes roles and serializes only administration fields', () => {
  assert.equal(roleFromUser({ app_metadata: { role: 'editor' } }), 'editor')
  assert.equal(roleFromUser({ user_metadata: { role: 'admin' } }), 'user')
  assert.deepEqual(
    serializeUser({
      id: 'user-id',
      email: 'person@example.com',
      app_metadata: { role: 'admin' },
      created_at: 'created',
      private_field: 'not returned',
    }),
    {
      id: 'user-id',
      email: 'person@example.com',
      role: 'admin',
      createdAt: 'created',
      updatedAt: null,
      invitedAt: null,
      confirmationSentAt: null,
      emailConfirmedAt: null,
      lastSignInAt: null,
      phone: '',
      providers: [],
      bannedUntil: null,
      isAnonymous: false,
    },
  )
})

test('rejects callers whose trusted metadata is not administrator', async () => {
  const response = await handleUserAdminRequest(
    request(),
    dependencies(makeClient({ actorRole: 'editor' })),
  )
  assert.equal(response.status, 403)
})

test('requires a bearer session before creating an admin client operation', async () => {
  const client = makeClient()
  const response = await handleUserAdminRequest(
    new Request('https://a1.example/.netlify/functions/user-admin'),
    dependencies(client),
  )
  assert.equal(response.status, 401)
})

test('lists users without loading visit analytics for an administrator', async () => {
  const loginEntry = {
    id: 'login-1',
    user_id: 'a',
    user_email: 'a@example.com',
    signed_in_at: '2026-07-29T13:00:00Z',
  }
  const client = makeClient({
    users: [
      { id: 'b', email: 'z@example.com', app_metadata: { role: 'editor' } },
      { id: 'a', email: 'a@example.com', app_metadata: {} },
    ],
    logins: [loginEntry],
  })
  const response = await handleUserAdminRequest(request(), dependencies(client))
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.deepEqual(body.users.map((user) => user.email), ['a@example.com', 'z@example.com'])
  assert.deepEqual(body.users.map((user) => user.role), ['user', 'editor'])
  assert.deepEqual(body.logins, [loginEntry])
  assert.equal(body.visits, undefined)
})

test('lists visits through the dedicated analytics resource', async () => {
  const visit = {
    session_id: '018f25f4-8c0a-7cd5-b8fa-a64db2912e31',
    ip_addresses: ['203.0.113.10'],
    pages: [{ page: 'home', path: '/', viewed_at: '2026-07-31T12:00:00Z' }],
    started_at: '2026-07-31T12:00:00Z',
    last_seen_at: '2026-07-31T12:02:00Z',
  }
  const response = await handleUserAdminRequest(
    request('GET', undefined, '?resource=visits'),
    dependencies(makeClient({ visits: [visit] })),
  )
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.deepEqual(body.visits, [visit])
})

test('returns a visit session with on-demand details for each IP address', async () => {
  const sessionId = '018f25f4-8c0a-7cd5-b8fa-a64db2912e31'
  const visit = {
    session_id: sessionId,
    user_id: null,
    user_email: null,
    ip_addresses: ['203.0.113.10', '2001:db8::1'],
    pages: [{ page: 'home', path: '/', viewed_at: '2026-07-31T12:00:00Z' }],
    started_at: '2026-07-31T12:00:00Z',
    last_seen_at: '2026-07-31T12:02:00Z',
    ended_at: null,
  }
  const lookedUp = []
  const response = await handleUserAdminRequest(
    request('GET', undefined, `?resource=visits&sessionId=${sessionId}`),
    dependencies(makeClient({ visits: [visit] }), {
      lookupIpAddress: async (ip) => {
        lookedUp.push(ip)
        return { ip, available: true, country: 'Example' }
      },
    }),
  )
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.deepEqual(body.visit, visit)
  assert.deepEqual(lookedUp, visit.ip_addresses)
  assert.deepEqual(body.ipLookups.map((entry) => entry.ip), visit.ip_addresses)
})

test('rejects an invalid visit ID before performing an IP lookup', async () => {
  let lookupCalled = false
  const response = await handleUserAdminRequest(
    request('GET', undefined, '?resource=visits&sessionId=not-a-session'),
    dependencies(makeClient(), {
      lookupIpAddress: async () => {
        lookupCalled = true
      },
    }),
  )

  assert.equal(response.status, 400)
  assert.equal(lookupCalled, false)
})

test('returns a detailed profile with complete account and login history', async () => {
  const historyEntry = {
    id: 'audit-1',
    target_user_id: 'target-id',
    target_email: 'person@example.com',
    action: 'user_invited',
    created_at: '2026-07-29T12:00:00Z',
  }
  const client = makeClient({
    target: {
      id: 'target-id',
      email: 'person@example.com',
      phone: '+12125550123',
      app_metadata: { role: 'editor', providers: ['email'] },
      created_at: '2026-07-29T12:00:00Z',
    },
    audit: [historyEntry],
    logins: [{
      id: 'login-1',
      user_id: 'target-id',
      user_email: 'person@example.com',
      signed_in_at: '2026-07-29T13:00:00Z',
    }],
  })
  const response = await handleUserAdminRequest(
    request('GET', undefined, '?userId=target-id'),
    dependencies(client),
  )
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(body.user.phone, '+12125550123')
  assert.deepEqual(body.user.providers, ['email'])
  assert.deepEqual(body.history, [historyEntry])
  assert.deepEqual(body.logins.map((entry) => entry.id), ['login-1'])
})

test('invites a user, assigns their role and records the action', async () => {
  const client = makeClient()
  const response = await handleUserAdminRequest(
    request('POST', { email: 'NEW@EXAMPLE.COM', role: 'editor' }),
    dependencies(client),
  )

  assert.equal(response.status, 201)
  assert.deepEqual(client.invites, ['new@example.com'])
  assert.equal(client.updates[0].attributes.app_metadata.role, 'editor')
  assert.equal(client.auditEntries[0].action, 'user_invited')
})

test('prevents an administrator from changing their own role', async () => {
  const client = makeClient({
    target: {
      id: 'actor-id',
      email: 'admin@example.com',
      app_metadata: { role: 'admin' },
    },
  })
  const response = await handleUserAdminRequest(
    request('PATCH', { userId: 'actor-id', role: 'user' }),
    dependencies(client),
  )

  assert.equal(response.status, 400)
  assert.equal(client.updates.length, 0)
})

test('changes another account role and records the previous role', async () => {
  const client = makeClient({
    target: {
      id: 'target-id',
      email: 'person@example.com',
      app_metadata: { role: 'user', provider: 'email' },
    },
  })
  const response = await handleUserAdminRequest(
    request('PATCH', { userId: 'target-id', role: 'admin' }),
    dependencies(client),
  )

  assert.equal(response.status, 200)
  assert.deepEqual(client.updates[0].attributes.app_metadata, {
    role: 'admin',
    provider: 'email',
  })
  assert.equal(client.auditEntries[0].previous_role, 'user')
  assert.equal(client.auditEntries[0].new_role, 'admin')
})

test('requires exact email confirmation before deleting another account', async () => {
  const client = makeClient({
    target: {
      id: 'target-id',
      email: 'person@example.com',
      app_metadata: { role: 'user' },
    },
  })
  const response = await handleUserAdminRequest(
    request('DELETE', { userId: 'target-id', confirmEmail: 'wrong@example.com' }),
    dependencies(client),
  )

  assert.equal(response.status, 400)
  assert.deepEqual(client.deleted, [])
})

test('deletes another account and records its final role', async () => {
  const client = makeClient({
    target: {
      id: 'target-id',
      email: 'person@example.com',
      app_metadata: { role: 'editor' },
    },
  })
  const response = await handleUserAdminRequest(
    request('DELETE', { userId: 'target-id', confirmEmail: 'person@example.com' }),
    dependencies(client),
  )

  assert.equal(response.status, 200)
  assert.deepEqual(client.deleted, ['target-id'])
  assert.equal(client.auditEntries[0].action, 'user_deleted')
  assert.equal(client.auditEntries[0].previous_role, 'editor')
  assert.equal(client.auditEntries[0].new_role, null)
})

test('accepts the user ID as deletion confirmation when an account has no email', async () => {
  const client = makeClient({
    target: {
      id: 'phone-account-id',
      phone: '+12125550123',
      app_metadata: { role: 'user' },
    },
  })
  const response = await handleUserAdminRequest(
    request('DELETE', { userId: 'phone-account-id', confirmEmail: 'phone-account-id' }),
    dependencies(client),
  )

  assert.equal(response.status, 200)
  assert.deepEqual(client.deleted, ['phone-account-id'])
})
