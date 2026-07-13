import { upsertGmailConnection } from '../localDb.mjs'
import { encryptText, googleRedirectUri, json, options, verifyState } from './_utils.mjs'

async function exchangeCode(code, redirectUri) {
  const body = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description || data.error || 'Could not connect Gmail.')
  return data
}

async function userInfo(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description || data.error || 'Could not read Google profile.')
  return data
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return options()
  try {
    const code = event.queryStringParameters?.code
    const state = event.queryStringParameters?.state
    if (!code) throw new Error('Missing OAuth code.')
    const payload = verifyState(state)
    const redirectUri = googleRedirectUri(event)
    const token = await exchangeCode(code, redirectUri)
    const profile = await userInfo(token.access_token)
    const payloadForUpsert = {
      user_id: payload.userId,
      google_email: profile.email,
      access_token_ciphertext: encryptText(token.access_token),
      token_expires_at: new Date(Date.now() + Number(token.expires_in || 3600) * 1000).toISOString(),
      scopes: String(token.scope || '').split(/\s+/).filter(Boolean),
    }
    if (token.refresh_token) {
      payloadForUpsert.refresh_token_ciphertext = encryptText(token.refresh_token)
    }
    upsertGmailConnection(payloadForUpsert)
    return {
      statusCode: 302,
      headers: { Location: '/settings?gmail=connected' },
      body: '',
    }
  } catch (error) {
    return json(400, { error: error.message })
  }
}
