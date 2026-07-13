import { json, options, requireUser, signedState, googleRedirectUri } from './_utils.mjs'

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return options()
  try {
    const { user } = await requireUser(event)
    const redirectUri = googleRedirectUri(event)
    const state = signedState({ userId: user.id, ts: Date.now() })
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state,
    })
    return json(200, { authorizationUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params}` })
  } catch (error) {
    return json(400, { error: error.message })
  }
}
