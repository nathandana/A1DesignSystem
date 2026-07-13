import { createCipheriv, createDecipheriv, createHmac, createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { localUser, updateRow } from '../localDb.mjs'

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Headers': 'authorization,content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
}

export function json(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body),
  }
}

export function options() {
  return { statusCode: 204, headers: jsonHeaders, body: '' }
}

export async function requireUser(event) {
  const token = String(event.headers.authorization || event.headers.Authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) throw new Error('Missing authorization token.')
  return { user: localUser(), token }
}

function secret(name) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not configured.`)
  return value
}

function base64url(value) {
  return Buffer.from(value).toString('base64url')
}

export function signedState(payload) {
  const body = base64url(JSON.stringify(payload))
  const sig = createHmac('sha256', secret('GOOGLE_OAUTH_STATE_SECRET')).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifyState(state) {
  const [body, sig] = String(state || '').split('.')
  if (!body || !sig) throw new Error('Invalid OAuth state.')
  const expected = createHmac('sha256', secret('GOOGLE_OAUTH_STATE_SECRET')).update(body).digest('base64url')
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error('Invalid OAuth state signature.')
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  if (!payload?.userId || !payload?.ts || Date.now() - payload.ts > 10 * 60 * 1000) {
    throw new Error('OAuth state expired.')
  }
  return payload
}

function encryptionKey() {
  return createHash('sha256').update(secret('TOKEN_ENCRYPTION_KEY')).digest()
}

export function encryptText(text) {
  if (!text) return null
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv, tag, encrypted].map((part) => part.toString('base64url')).join('.')
}

export function decryptText(value) {
  if (!value) return null
  const [ivText, tagText, encryptedText] = String(value).split('.')
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(ivText, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagText, 'base64url'))
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, 'base64url')),
    decipher.final(),
  ]).toString('utf8')
}

export async function refreshGoogleToken(connection) {
  const refreshToken = decryptText(connection.refresh_token_ciphertext)
  if (!refreshToken) throw new Error('No Gmail refresh token is stored.')
  const body = new URLSearchParams({
    client_id: secret('GOOGLE_CLIENT_ID'),
    client_secret: secret('GOOGLE_CLIENT_SECRET'),
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  })
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description || data.error || 'Could not refresh Gmail token.')
  return {
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + Number(data.expires_in || 3600) * 1000).toISOString(),
  }
}

export async function usableGoogleAccessToken(connection) {
  const expiresAt = connection.token_expires_at ? new Date(connection.token_expires_at).getTime() : 0
  const current = decryptText(connection.access_token_ciphertext)
  if (current && expiresAt - Date.now() > 60_000) return current
  const refreshed = await refreshGoogleToken(connection)
  updateRow('gmail_connections', connection.id, {
    access_token_ciphertext: encryptText(refreshed.accessToken),
    token_expires_at: refreshed.expiresAt,
  })
  return refreshed.accessToken
}

export function googleRedirectUri(event) {
  return process.env.GOOGLE_OAUTH_REDIRECT_URI
    || `${event.headers['x-forwarded-proto'] || 'http'}://${event.headers.host}/api/google-oauth-callback`
}

export function gmailHeaders(accessToken) {
  return { Authorization: `Bearer ${accessToken}` }
}
