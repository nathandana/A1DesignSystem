import { supabase } from '../lib/supabase.js'

const USER_ADMIN_ENDPOINT = '/.netlify/functions/user-admin'

async function userAdminRequest(method, body, userId) {
  const { data, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !data?.session?.access_token) {
    throw new Error('Your session is no longer valid. Sign in again.')
  }

  const endpoint = userId
    ? `${USER_ADMIN_ENDPOINT}?userId=${encodeURIComponent(userId)}`
    : USER_ADMIN_ENDPOINT
  const response = await fetch(endpoint, {
    method,
    headers: {
      authorization: `Bearer ${data.session.access_token}`,
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(result.error ?? 'User administration failed.')
  }
  return result
}

export function listManagedUsers() {
  return userAdminRequest('GET')
}

export function getManagedUserProfile(userId) {
  return userAdminRequest('GET', undefined, userId)
}

export function inviteManagedUser(email, role) {
  return userAdminRequest('POST', { email, role })
}

export function updateManagedUserRole(userId, role) {
  return userAdminRequest('PATCH', { userId, role })
}

export function deleteManagedUser(userId, confirmEmail) {
  return userAdminRequest('DELETE', { userId, confirmEmail })
}
