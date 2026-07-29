import assert from 'node:assert/strict'
import test from 'node:test'
import {
  handleUserAdminRequest,
  roleFromUser,
  serializeUser,
} from '../netlify/functions/user-admin.mjs'

function request(method = 'GET', body) {
  return new Request('https://a1.example/.netlify/functions/user-admin', {
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
} = {}) {
  const auditEntries = []
  const updates = []
  const invites = []
  const actor = {
    id: 'actor-id',
    email: 'admin@example.com',
    app_metadata: { role: actorRole },
  }

  return {
    auditEntries,
    updates,
    invites,
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
        deleteUser: async () => ({ error: null }),
      },
    },
    from: () => ({
      select() {
        return {
          order() {
            return { limit: async () => ({ data: auditEntries, error: null }) }
          },
          limit: async () => ({ data: [], error: null }),
        }
      },
      insert: async (entry) => {
        auditEntries.push(entry)
        return { error: null }
      },
    }),
  }
}

function dependencies(client) {
  return {
    supabaseUrl: 'https://project.supabase.co',
    serviceRoleKey: 'server-secret',
    createClient: () => client,
  }
}

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
      invitedAt: null,
      emailConfirmedAt: null,
      lastSignInAt: null,
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

test('lists users for an administrator', async () => {
  const client = makeClient({
    users: [
      { id: 'b', email: 'z@example.com', app_metadata: { role: 'editor' } },
      { id: 'a', email: 'a@example.com', app_metadata: {} },
    ],
  })
  const response = await handleUserAdminRequest(request(), dependencies(client))
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.deepEqual(body.users.map((user) => user.email), ['a@example.com', 'z@example.com'])
  assert.deepEqual(body.users.map((user) => user.role), ['user', 'editor'])
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
