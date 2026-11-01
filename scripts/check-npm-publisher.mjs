// Verify token exchange before the long release gate. Never persist or log tokens.
const requestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL
const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
if (!requestUrl || !requestToken) throw new Error('GitHub id-token: write permission is required')

const url = new URL(requestUrl)
url.searchParams.set('audience', 'npm:registry.npmjs.org')
const identityResponse = await fetch(url, {
  headers: { Authorization: `Bearer ${requestToken}` },
  signal: AbortSignal.timeout(30_000),
})
if (!identityResponse.ok) throw new Error(`GitHub identity request failed: HTTP ${identityResponse.status}`)
const { value: identity } = await identityResponse.json()
if (!identity) throw new Error('GitHub returned no publishing identity')
const claims = JSON.parse(Buffer.from(identity.split('.')[1], 'base64url').toString())
console.log('Publishing identity:', JSON.stringify({
  repository: claims.repository, workflow: claims.job_workflow_ref, environment: claims.environment,
}))

for (const name of ['@gtivr4/a1-design-system-react', '@gtivr4/a1-design-system-react-native']) {
  const response = await fetch(`https://registry.npmjs.org/-/npm/v1/oidc/token/exchange/package/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${identity}` },
    signal: AbortSignal.timeout(30_000),
  })
  const body = await response.json()
  if (!response.ok || !body.token) {
    throw new Error(`${name}: npm identity exchange failed (HTTP ${response.status}): ${body.message || body.error || 'No registry diagnostic'}`)
  }
  console.log(`${name}: trusted publisher verified`)
}
