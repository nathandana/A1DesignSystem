import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildVisitorContext,
  handleVisitAnalyticsRequest,
} from '../netlify/functions/visit-analytics.mjs'

const SESSION_ID = '018f25f4-8c0a-7cd5-b8fa-a64db2912e31'

function request(body, token = '') {
  return new Request('https://a1.example/.netlify/functions/visit-analytics', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
}

function makeClient(user = null) {
  const calls = []
  return {
    calls,
    auth: {
      getUser: async () => ({ data: { user }, error: user ? null : new Error('Invalid session') }),
    },
    rpc: async (name, args) => {
      calls.push({ name, args })
      return { error: null }
    },
  }
}

function dependencies(client, clientIp = '203.0.113.42') {
  return {
    supabaseUrl: 'https://project.supabase.co',
    serviceRoleKey: 'server-secret',
    clientIp,
    createClient: () => client,
  }
}

test('records an anonymous page view with the server-provided IP address', async () => {
  const client = makeClient()
  const response = await handleVisitAnalyticsRequest(request({
    action: 'pageview',
    sessionId: SESSION_ID,
    page: 'component-button',
    path: '/components/button',
    ipAddress: '192.0.2.1',
  }), dependencies(client))

  assert.equal(response.status, 200)
  assert.equal(client.calls[0].name, 'a1_record_site_visit')
  assert.equal(client.calls[0].args.p_ip_address, '203.0.113.42')
  assert.equal(client.calls[0].args.p_page, 'component-button')
  assert.equal(client.calls[0].args.p_user_id, null)
  assert.equal(client.calls[0].args.p_visitor_context.device.type, 'unknown')
})

test('captures whitelisted Netlify, geolocation and browser-reported device context', () => {
  const browserRequest = new Request('https://a1.example/', {
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1',
      'accept-language': 'en-US,en;q=0.9',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"iOS"',
      'netlify-agent-category': 'browser',
    },
  })
  const context = buildVisitorContext(browserRequest, {
    geo: {
      city: 'New York',
      country: { code: 'US', name: 'United States' },
      latitude: 40.7128,
      longitude: -74.006,
      subdivision: { code: 'NY', name: 'New York' },
      timezone: 'America/New_York',
      postalCode: '10001',
    },
    requestId: 'request-id',
    server: { region: 'us-east-1' },
    deploy: { context: 'production', id: 'deploy-id', published: true, skewProtectionToken: 'secret' },
    site: { id: 'site-id', name: 'a1design', url: 'https://a1design.app' },
    account: { id: 'not-stored' },
  })

  assert.deepEqual(context.device, {
    type: 'mobile',
    browser: 'Safari',
    platform: 'iOS',
    reportedMobile: true,
  })
  assert.equal(context.geo.countryCode, 'US')
  assert.equal(context.netlify.agentCategory, 'browser')
  assert.equal(context.netlify.serverRegion, 'us-east-1')
  assert.equal(context.browser.acceptLanguage, 'en-US,en;q=0.9')
  assert.equal('account' in context.netlify, false)
  assert.equal('skewProtectionToken' in context.netlify, false)
})

test('attributes a visit when the bearer session is valid', async () => {
  const client = makeClient({ id: 'user-id', email: 'person@example.com' })
  const response = await handleVisitAnalyticsRequest(request({
    action: 'heartbeat',
    sessionId: SESSION_ID,
  }, 'valid-token'), dependencies(client, '2001:db8::1'))

  assert.equal(response.status, 200)
  assert.equal(client.calls[0].args.p_ip_address, '2001:db8::1')
  assert.equal(client.calls[0].args.p_user_id, 'user-id')
  assert.equal(client.calls[0].args.p_page, null)
})

test('rejects paths containing query strings', async () => {
  const client = makeClient()
  const response = await handleVisitAnalyticsRequest(request({
    action: 'pageview',
    sessionId: SESSION_ID,
    page: 'editor',
    path: '/editor?project=private-id',
  }), dependencies(client))

  assert.equal(response.status, 400)
  assert.equal(client.calls.length, 0)
})

test('refuses to record an IP supplied by an untrusted runtime', async () => {
  const client = makeClient()
  const response = await handleVisitAnalyticsRequest(request({
    action: 'end',
    sessionId: SESSION_ID,
  }), dependencies(client, 'not-an-ip'))

  assert.equal(response.status, 503)
  assert.equal(client.calls.length, 0)
})
